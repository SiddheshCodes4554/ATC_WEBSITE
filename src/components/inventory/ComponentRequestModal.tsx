import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  X,
  Package,
  Layers,
  Send,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  ArrowRight,
  ShieldAlert,
  Info,
  LogIn,
  Minus,
  Plus,
} from 'lucide-react';
import { InventoryItem } from '../../types/inventory.types';
import { useAuth } from '../../context/AuthContext';
import { componentRequestService } from '../../services/componentRequestService';
import { ATCStatusBadge } from '../visual';

interface ComponentRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: InventoryItem | null;
  onSuccess?: (requestId: string) => void;
}

export const ComponentRequestModal: React.FC<ComponentRequestModalProps> = ({
  isOpen,
  onClose,
  item,
  onSuccess,
}) => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const modalRef = useRef<HTMLDivElement>(null);

  const [quantity, setQuantity] = useState<number>(1);
  const [reason, setReason] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeRequestWarning, setActiveRequestWarning] = useState<string | null>(null);
  const [isCheckingActive, setIsCheckingActive] = useState<boolean>(false);
  const [submittedRequestId, setSubmittedRequestId] = useState<string | null>(null);

  const maxAvailable = item ? Math.max(1, item.quantity) : 1;

  // Reset state when modal opens with a new item
  useEffect(() => {
    if (isOpen && item) {
      setQuantity(1);
      setReason('');
      setError(null);
      setActiveRequestWarning(null);
      setSubmittedRequestId(null);

      if (user?.$id) {
        checkExistingRequest(user.$id, item.title);
      }
    }
  }, [isOpen, item, user?.$id]);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isSubmitting) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, isSubmitting, onClose]);

  const checkExistingRequest = async (userId: string, componentName: string) => {
    setIsCheckingActive(true);
    try {
      const res = await componentRequestService.checkActiveRequest(userId, componentName);
      if (res.success && res.data) {
        const statusLabel =
          res.data.status === 'approved'
            ? 'APPROVED (Ready for Lab Collection)'
            : 'PENDING REVIEW';
        setActiveRequestWarning(
          `You already have an active request (#${res.data.$id.slice(-6)}) for this component that is currently ${statusLabel}.`
        );
      } else {
        setActiveRequestWarning(null);
      }
    } catch {
      setActiveRequestWarning(null);
    } finally {
      setIsCheckingActive(false);
    }
  };

  if (!isOpen || !item) return null;

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => {
      const next = prev + delta;
      if (next < 1) return 1;
      if (next > maxAvailable) return maxAvailable;
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isAuthenticated || !user) {
      navigate('/login', { state: { from: window.location.pathname } });
      return;
    }

    if (!reason || reason.trim().length < 10) {
      setError('Please provide a detailed reason or project description (at least 10 characters).');
      return;
    }

    if (quantity < 1 || quantity > maxAvailable) {
      setError(`Quantity must be between 1 and ${maxAvailable}.`);
      return;
    }

    setIsSubmitting(true);

    try {
      const studentName = user.name || user.email.split('@')[0];
      const studentEmail = user.email;

      const res = await componentRequestService.createRequest({
        userId: user.$id,
        studentName,
        studentEmail,
        componentName: item.title,
        requestedQuantity: quantity,
        reason: reason.trim(),
        category: item.location || 'Lab 5.0',
      });

      if (res.success && res.data) {
        setSubmittedRequestId(res.data.$id);
        if (onSuccess) {
          onSuccess(res.data.$id);
        }
      } else {
        setError(res.error || 'Failed to submit request. Please try again.');
      }
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fadeIn select-none"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) onClose();
      }}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="request-modal-title"
        className="relative w-full max-w-lg bg-white rounded-[36px] border-4 border-[#121316] shadow-pop-xl p-6 sm:p-8 animate-scaleUp overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* Playful Top Tape Accent */}
        <div className="tape-strip pointer-events-none bg-[#FFE600]" />

        {/* Modal Header */}
        <div className="flex items-start justify-between gap-3 mb-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E1DCFF] border-2 border-[#121316] font-mono font-black text-xs uppercase text-[#6C5CE7] shadow-pop-sm">
            <Package className="w-3.5 h-3.5" />
            HARDWARE REQUISITION
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close modal"
            className="p-2 rounded-2xl bg-[#FAF7F0] hover:bg-[#FFE5E5] text-[#121316] hover:text-[#FF4757] border-2 border-[#121316] shadow-pop-sm active:scale-95 transition-all cursor-pointer disabled:opacity-50"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="overflow-y-auto space-y-5 pr-1 scrollbar-thin flex-grow">
          {/* Unauthenticated Prompt */}
          {!isAuthenticated ? (
            <div className="space-y-6 text-center py-4">
              <div className="w-16 h-16 rounded-3xl bg-[#FFE600] border-3 border-[#121316] mx-auto flex items-center justify-center shadow-pop">
                <LogIn className="w-8 h-8 text-[#121316]" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-[#121316]">SIGN IN REQUIRED</h3>
                <p className="text-xs sm:text-sm font-bold text-gray-600 max-w-sm mx-auto">
                  You need an active ATC student account to request hardware components from Lab 5.0.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-[#FAF7F0] border-2 border-[#121316] text-left">
                <div className="font-mono text-[10px] font-black uppercase text-gray-500">Component:</div>
                <div className="text-base font-black text-[#121316] mt-0.5">{item.title}</div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <button
                  type="button"
                  onClick={() => navigate('/login', { state: { from: window.location.pathname } })}
                  className="px-6 py-3 rounded-full bg-[#FFE600] hover:bg-[#FFD32A] text-[#121316] font-mono text-xs font-black uppercase border-2 border-[#121316] shadow-pop hover:shadow-pop-lg active:translate-x-[1px] active:translate-y-[1px] transition-all flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In to Request</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-3 rounded-full bg-white hover:bg-gray-100 text-[#121316] font-mono text-xs font-black uppercase border-2 border-[#121316] shadow-pop-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : submittedRequestId ? (
            /* Success State */
            <div className="space-y-6 text-center py-4">
              <div className="w-16 h-16 rounded-3xl bg-[#D4F8E8] border-3 border-[#121316] mx-auto flex items-center justify-center shadow-pop animate-bounce">
                <CheckCircle2 className="w-8 h-8 text-emerald-700" />
              </div>
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4F8E8] border-2 border-[#121316] font-mono text-xs font-black text-emerald-800">
                  <span>REQUEST SUBMITTED</span>
                </div>
                <h3 className="text-2xl font-black text-[#121316]">
                  WE RECEIVED YOUR REQUEST!
                </h3>
                <p className="text-xs sm:text-sm font-bold text-gray-600 max-w-sm mx-auto">
                  Your hardware requisition is now queued for admin review. Once approved, you can collect it from Lab 5.0.
                </p>
              </div>

              {/* Request Summary Card */}
              <div className="p-4 rounded-2xl bg-[#FAF7F0] border-2 border-[#121316] text-left space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-black uppercase text-gray-500">
                    Component:
                  </span>
                  <ATCStatusBadge status="pending" size="xs" />
                </div>
                <div className="text-base font-black text-[#121316]">{item.title}</div>
                <div className="flex items-center justify-between pt-2 border-t border-[#121316]/10 text-xs font-mono">
                  <span className="text-gray-500 font-bold">Requested Units:</span>
                  <span className="font-black text-[#121316]">{quantity}</span>
                </div>
              </div>

              {/* Navigation Options */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <Link
                  to="/student/component-requests"
                  onClick={onClose}
                  className="px-6 py-3 rounded-full bg-[#6C5CE7] hover:bg-[#5B4BC4] text-white font-mono text-xs font-black uppercase border-2 border-[#121316] shadow-pop hover:shadow-pop-lg active:translate-x-[1px] active:translate-y-[1px] transition-all flex items-center justify-center gap-2"
                >
                  <span>View My Requests</span>
                  <ArrowRight className="w-4 h-4 stroke-[3]" />
                </Link>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-3 rounded-full bg-white hover:bg-gray-100 text-[#121316] font-mono text-xs font-black uppercase border-2 border-[#121316] shadow-pop-sm"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            /* Request Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Component Info Card */}
              <div className="p-4 rounded-2xl bg-[#FAF7F0] border-2 border-[#121316] shadow-pop-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-black uppercase text-gray-500">
                    Selected Component
                  </span>
                  <span className="font-mono text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-white border border-[#121316] text-gray-600">
                    {item.location || 'Lab 5.0'}
                  </span>
                </div>
                <h3 className="text-lg font-black text-[#121316] tracking-tight leading-snug">
                  {item.title}
                </h3>
                <div className="flex items-center gap-2 font-mono text-xs font-bold text-gray-600">
                  <Layers className="w-3.5 h-3.5 text-[#6C5CE7]" />
                  <span>Available in Lab: {item.quantity.toLocaleString()} units</span>
                </div>
              </div>

              {/* Active Request Warning Banner */}
              {activeRequestWarning && (
                <div className="p-3.5 rounded-2xl bg-[#FFF3E0] border-2 border-[#E65100] text-[#E65100] text-xs font-bold flex items-start gap-2.5 shadow-pop-xs">
                  <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-black uppercase">Active Request Exists</p>
                    <p className="text-[11px] leading-relaxed text-gray-800">{activeRequestWarning}</p>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="p-3.5 rounded-2xl bg-[#FFE5E5] border-2 border-[#FF4757] text-[#FF4757] text-xs font-bold flex items-start gap-2.5 shadow-pop-xs">
                  <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <p className="leading-relaxed">{error}</p>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="space-y-1.5">
                <label className="block font-mono text-xs font-black uppercase text-[#121316]">
                  Quantity Needed <span className="text-[#FF4757]">*</span>
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1 || Boolean(activeRequestWarning) || isSubmitting}
                    className="w-11 h-11 rounded-2xl bg-[#FAF7F0] hover:bg-gray-200 border-2 border-[#121316] flex items-center justify-center text-[#121316] shadow-pop-xs active:translate-x-[1px] active:translate-y-[1px] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Minus className="w-4 h-4 stroke-[3]" />
                  </button>

                  <div className="flex-1 px-4 py-2 rounded-2xl bg-white border-2 border-[#121316] text-center shadow-pop-xs">
                    <input
                      type="number"
                      min={1}
                      max={maxAvailable}
                      value={quantity}
                      disabled={Boolean(activeRequestWarning) || isSubmitting}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        if (!isNaN(val)) {
                          if (val < 1) setQuantity(1);
                          else if (val > maxAvailable) setQuantity(maxAvailable);
                          else setQuantity(val);
                        }
                      }}
                      className="w-full text-center font-mono text-lg font-black text-[#121316] focus:outline-none bg-transparent"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= maxAvailable || Boolean(activeRequestWarning) || isSubmitting}
                    className="w-11 h-11 rounded-2xl bg-[#FFE600] hover:bg-[#FFD32A] border-2 border-[#121316] flex items-center justify-center text-[#121316] shadow-pop-xs active:translate-x-[1px] active:translate-y-[1px] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                  </button>
                </div>
                <div className="flex justify-between font-mono text-[10px] text-gray-500 font-bold px-1">
                  <span>Minimum: 1 unit</span>
                  <span>Maximum available: {maxAvailable} units</span>
                </div>
              </div>

              {/* Purpose / Project Reason */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block font-mono text-xs font-black uppercase text-[#121316]">
                    Reason / Project Purpose <span className="text-[#FF4757]">*</span>
                  </label>
                  <span className="font-mono text-[10px] text-gray-400 font-bold">
                    {reason.length} chars (min 10)
                  </span>
                </div>
                <textarea
                  required
                  rows={3}
                  disabled={Boolean(activeRequestWarning) || isSubmitting}
                  placeholder="Explain why you need this component and which project or workshop it is for..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full p-3.5 rounded-2xl bg-white border-2 border-[#121316] text-xs font-bold text-[#121316] placeholder:text-gray-400 shadow-pop-xs focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] transition-all resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>

              {/* Applicant Info Preview */}
              <div className="p-3 rounded-2xl bg-[#FAF7F0] border-2 border-[#121316]/20 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#2ED573]" />
                  <span className="font-mono text-[11px] font-bold text-gray-600 truncate max-w-[200px]">
                    Submitting as <strong className="text-[#121316]">{user?.name || user?.email}</strong>
                  </span>
                </div>
                <span className="font-mono text-[10px] font-black text-[#6C5CE7] uppercase">STUDENT</span>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-full bg-white hover:bg-gray-100 text-[#121316] font-mono text-xs font-black uppercase border-2 border-[#121316] shadow-pop-sm active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    isSubmitting ||
                    Boolean(activeRequestWarning) ||
                    isCheckingActive ||
                    reason.trim().length < 10
                  }
                  className="px-6 py-2.5 rounded-full bg-[#FFE600] hover:bg-[#FFD32A] text-[#121316] font-mono text-xs font-black uppercase border-2 border-[#121316] shadow-pop hover:shadow-pop-lg active:translate-x-[1px] active:translate-y-[1px] transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Request</span>
                      <Send className="w-3.5 h-3.5 stroke-[2.5]" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComponentRequestModal;
