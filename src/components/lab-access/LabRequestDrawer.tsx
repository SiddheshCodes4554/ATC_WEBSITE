import React, { useState, useEffect } from 'react';
import {
  X,
  Clock,
  Calendar,
  Users,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  Zap,
  UserCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext';
import { PublicLabSlotWithDetails, LabBookingResult, LabRequest } from '../../types/labBooking.types';
import { LabRequestService } from '../../services/labRequestService';

interface LabRequestDrawerProps {
  slotDetails: PublicLabSlotWithDetails | null;
  isOpen: boolean;
  onClose: () => void;
  onRequestSubmitted: () => void;
}

export const LabRequestDrawer: React.FC<LabRequestDrawerProps> = ({
  slotDetails,
  isOpen,
  onClose,
  onRequestSubmitted,
}) => {
  const { user, isAuthenticated } = useAuth();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [purpose, setPurpose] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successResult, setSuccessResult] = useState<LabBookingResult<LabRequest> | null>(null);

  // Auto-fill student name once when drawer opens if authenticated
  useEffect(() => {
    if (isOpen && user?.name && !name) {
      setName(user.name);
    }
  }, [isOpen, user?.name]);

  if (!isOpen || !slotDetails) return null;

  const { slot, displayState, availableCapacity, waitlistedRequests } = slotDetails;
  const isWaitlist = availableCapacity <= 0;
  const nextQueueNum = waitlistedRequests.length + 1;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!name.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!phone.trim() || phone.trim().length < 7) {
      setErrorMessage('Please enter a valid phone number so admins can coordinate access.');
      return;
    }
    if (!purpose.trim()) {
      setErrorMessage('Please describe what project or hardware you will be working on.');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await LabRequestService.submitPublicRequest({
        slotId: slot.$id,
        requesterName: name.trim(),
        requesterPhone: phone.trim(),
        purpose: purpose.trim(),
        userId: user?.$id || null,
      });

      if (result.success && result.data) {
        // Trigger celebratory confetti
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch {}

        setSuccessResult(result);
        onRequestSubmitted();
      } else {
        setErrorMessage(result.error || 'Failed to submit request. Please try again.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setName('');
    setPhone('');
    setPurpose('');
    setErrorMessage(null);
    setSuccessResult(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      
      {/* Background dismissal */}
      <div className="fixed inset-0" onClick={handleResetAndClose} />

      {/* Main Neo-brutalist Request Card Modal */}
      <div className="relative w-full max-w-lg rounded-[36px] bg-[#FAF7F0] border-4 border-[#121316] shadow-pop-2xl overflow-hidden z-10 flex flex-col my-8">
        
        {/* Top Header */}
        <div className="p-6 sm:p-7 bg-[#121316] text-white flex items-center justify-between border-b-4 border-[#121316]">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-[#FFE600] text-[#121316] font-mono text-[10px] font-black uppercase">
              <Zap className="w-3 h-3 fill-[#121316]" />
              <span>{isWaitlist ? 'JOIN WAITLIST QUEUE' : 'REQUEST LAB ACCESS'}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {isWaitlist ? 'Join Slot Waitlist' : 'Reserve Lab Slot'}
            </h3>
          </div>

          <button
            type="button"
            onClick={handleResetAndClose}
            className="w-10 h-10 rounded-2xl bg-white/10 hover:bg-white text-white hover:text-[#121316] border-2 border-white/20 hover:border-[#121316] flex items-center justify-center transition-all cursor-pointer shadow-pop-sm"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Selected Slot Summary Strip */}
        <div className="px-6 py-4 bg-[#FFF9DB] border-b-3 border-[#121316] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#FF793F]" />
            <span className="font-bold text-[#121316]">{slot.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#6C5CE7]" />
            <span className="font-bold text-[#121316]">
              {slot.startTime} — {slot.endTime}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-gray-600" />
            <span className="font-bold text-gray-700">
              Cap: {slot.capacity} {slot.capacity === 1 ? 'maker' : 'makers'}
            </span>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 sm:p-7 space-y-6">
          
          {/* SUCCESS VIEW */}
          {successResult ? (
            <div className="text-center space-y-5 py-4">
              <div className="w-16 h-16 rounded-3xl bg-[#E8F5E9] border-3 border-[#121316] shadow-pop flex items-center justify-center mx-auto text-[#2E7D32]">
                <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
              </div>

              <div className="space-y-2">
                <h4 className="text-2xl font-black text-[#121316]">
                  {successResult.assignedStatus === 'waitlisted'
                    ? `You're on the Waitlist (#${successResult.queuePosition})!`
                    : 'Request Submitted!'}
                </h4>
                <p className="text-sm font-bold text-gray-700 max-w-sm mx-auto leading-relaxed">
                  {successResult.message}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border-2 border-[#121316] shadow-pop-sm text-left space-y-1.5 font-mono text-xs">
                <div>
                  <span className="text-gray-500 font-bold">Maker:</span>{' '}
                  <span className="text-[#121316] font-black">{name}</span>
                </div>
                <div>
                  <span className="text-gray-500 font-bold">Slot Time:</span>{' '}
                  <span className="text-[#121316] font-bold">
                    {slot.date} ({slot.startTime} - {slot.endTime})
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 font-bold">Status:</span>{' '}
                  <span className="text-[#6C5CE7] font-black uppercase">
                    {successResult.assignedStatus === 'waitlisted' ? `Waitlisted #${successResult.queuePosition}` : 'Pending Admin Review'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleResetAndClose}
                className="w-full py-3.5 rounded-2xl bg-[#FFE600] text-[#121316] font-mono text-sm font-black border-3 border-[#121316] shadow-pop hover:bg-[#FFD32A] transition-all cursor-pointer"
              >
                Done / Return to Schedule
              </button>
            </div>
          ) : (
            /* REQUEST FORM */
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {errorMessage && (
                <div className="p-4 rounded-2xl bg-[#FFE5E5] border-2 border-[#FF4757] text-[#D63031] text-xs font-bold flex items-center gap-2 animate-shake">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Notice Banner */}
              {isWaitlist ? (
                <div className="p-3.5 rounded-2xl bg-[#FFF3E0] border-2 border-[#FF793F] text-xs font-bold text-[#E65100] flex items-start gap-2">
                  <Sparkles className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <div>
                    This slot has reached capacity. Submitting will place you on the queue at{' '}
                    <span className="font-mono font-black underline">Position #{nextQueueNum}</span>. If an approved booking is cancelled, you will automatically be promoted!
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-2xl bg-[#E8F5E9] border-2 border-[#2ED573] text-xs font-bold text-[#2E7D32] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>Spot available! Admins review and approve requests quickly.</span>
                </div>
              )}

              {isAuthenticated && user && (
                <div className="p-2.5 rounded-xl bg-[#E1DCFF] border border-[#121316] text-[11px] font-mono font-bold text-[#6C5CE7] flex items-center gap-2">
                  <UserCheck className="w-3.5 h-3.5 text-[#6C5CE7] flex-shrink-0" />
                  <span>
                    Signed in as <strong className="text-[#121316] font-black">{user.name}</strong> • Linked to your Student Dashboard
                  </span>
                </div>
              )}

              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="block font-mono text-xs font-black uppercase text-[#121316]">
                  Your Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Siddhesh Kulkarni"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-white border-2 border-[#121316] font-bold text-sm text-[#121316] focus:outline-none focus:ring-2 focus:ring-[#FFE600] placeholder:text-gray-400"
                />
              </div>

              {/* Phone Number */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block font-mono text-xs font-black uppercase text-[#121316]">
                    Phone Number (WhatsApp) <span className="text-red-500">*</span>
                  </label>
                  <span className="font-mono text-[10px] text-gray-500 flex items-center gap-1 font-bold">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" /> Never shown publicly
                  </span>
                </div>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-white border-2 border-[#121316] font-mono text-sm text-[#121316] focus:outline-none focus:ring-2 focus:ring-[#FFE600] placeholder:text-gray-400"
                />
              </div>

              {/* Purpose / What will you build? */}
              <div className="space-y-1.5">
                <label className="block font-mono text-xs font-black uppercase text-[#121316]">
                  Project / Purpose in Lab <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g. Soldering custom ESP32 board & testing ROS 2 navigation lidar..."
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-white border-2 border-[#121316] font-bold text-sm text-[#121316] focus:outline-none focus:ring-2 focus:ring-[#FFE600] placeholder:text-gray-400 resize-none"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3.5 sm:py-4 rounded-2xl font-mono text-sm font-black border-3 border-[#121316] shadow-pop hover:shadow-pop-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    isWaitlist
                      ? 'bg-[#FF793F] text-white hover:bg-[#FF6326]'
                      : 'bg-[#FFE600] text-[#121316] hover:bg-[#FFD32A]'
                  } disabled:opacity-60 disabled:cursor-not-allowed`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Submitting Request...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>{isWaitlist ? `Join Waitlist Queue (#${nextQueueNum})` : 'Submit Slot Request'}</span>
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

export default LabRequestDrawer;
