import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { RegistrationService } from '../services/registrationService';
import { StorageService } from '../services/storage.service';
import { PublicEventPass, PassStatus } from '../types/form.types';
import {
  Calendar,
  MapPin,
  Clock,
  ArrowLeft,
  Share2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  Ticket,
  Copy,
  User,
  XCircle,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const EventPassPage: React.FC = () => {
  const { passId } = useParams<{ passId: string }>();

  const [pass, setPass] = useState<PublicEventPass | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [imageError, setImageError] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    const loadPass = async () => {
      if (!passId?.trim()) {
        setError('No pass ID provided.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      setImageError(false);

      try {
        const result = await RegistrationService.getPublicPassByPassId(passId.trim());
        if (!isMounted) return;

        if (result.success && result.data) {
          setPass(result.data);
        } else {
          setError(result.error || 'This event pass is invalid or could not be located.');
        }
      } catch (err: any) {
        console.error('Error fetching event pass:', err);
        if (isMounted) setError(err?.message || 'Failed to load pass.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadPass();

    return () => {
      isMounted = false;
    };
  }, [passId]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const formatDate = (isoString?: string | null) => {
    if (!isoString) return 'TBA';
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  const getPassStatusDisplay = (status: PassStatus) => {
    switch (status) {
      case 'active':
        return {
          label: '● VALID PASS',
          badgeClass: 'bg-[#2ED573] text-[#121316] border-[#121316]',
          icon: <Check className="w-3.5 h-3.5 stroke-[3]" />,
          desc: 'Ready for admission at venue check-in.',
        };
      case 'used':
        return {
          label: '✓ ALREADY USED',
          badgeClass: 'bg-[#E1DCFF] text-[#6C5CE7] border-[#6C5CE7]',
          icon: <CheckCircle2 className="w-3.5 h-3.5" />,
          desc: 'This pass has already been scanned and checked in.',
        };
      case 'cancelled':
        return {
          label: '✕ PASS CANCELLED',
          badgeClass: 'bg-[#FFE5E5] text-[#FF4757] border-[#FF4757]',
          icon: <XCircle className="w-3.5 h-3.5" />,
          desc: 'This registration has been cancelled. Entry is void.',
        };
      default:
        return {
          label: 'VALID PASS',
          badgeClass: 'bg-[#2ED573] text-[#121316] border-[#121316]',
          icon: <Check className="w-3.5 h-3.5 stroke-[3]" />,
          desc: 'Ready for admission.',
        };
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 text-center bg-[#FAF7F0] paper-pattern select-none">
        <div className="p-8 rounded-[36px] bg-white border-4 border-[#121316] shadow-pop-lg flex flex-col items-center gap-4 max-w-sm">
          <div className="w-14 h-14 rounded-2xl bg-[#FFE600] border-3 border-[#121316] shadow-pop-sm flex items-center justify-center animate-bounce">
            <Ticket className="w-8 h-8 text-[#121316]" />
          </div>
          <div>
            <h3 className="font-black text-xl text-[#121316]">Retrieving Event Pass</h3>
            <p className="font-mono text-xs font-bold text-gray-600 mt-1">Verifying pass ID in Appwrite...</p>
          </div>
          <Loader2 className="w-6 h-6 text-[#6C5CE7] animate-spin mt-2" />
        </div>
      </div>
    );
  }

  if (error || !pass) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center bg-[#FAF7F0] paper-pattern select-none">
        <div className="max-w-md w-full p-8 sm:p-10 rounded-[36px] bg-white border-4 border-[#121316] shadow-pop-xl space-y-5">
          <div className="w-16 h-16 rounded-3xl bg-[#FFE5E5] border-3 border-[#FF4757] shadow-pop flex items-center justify-center mx-auto text-[#FF4757]">
            <AlertCircle className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="px-3 py-0.5 rounded-full bg-[#FFE5E5] text-[#FF4757] border border-[#FF4757] font-mono text-[10px] font-black uppercase">
              INVALID PASS
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#121316] tracking-tight">
              Pass Not Found
            </h2>
            <p className="text-xs sm:text-sm font-bold text-gray-600 leading-relaxed">
              We could not find any active event pass matching <span className="text-[#6C5CE7] font-mono font-black">"{passId}"</span>.
            </p>
          </div>

          <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/events"
              className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#121316] text-white font-mono text-xs font-black border-2 border-[#121316] shadow-pop-sm inline-flex items-center justify-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Browse Events</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const passStatusInfo = getPassStatusDisplay(pass.passStatus);
  const coverUrl = pass.coverImageId ? StorageService.getEventImageUrl(pass.coverImageId, 800) : '';
  const qrPassUrl = typeof window !== 'undefined' ? `${window.location.origin}/pass/${pass.passId}` : `https://atc-niat.edu/pass/${pass.passId}`;

  return (
    <div className="min-h-screen bg-[#FAF7F0] py-10 px-4 sm:px-6 lg:px-8 paper-pattern select-none">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Navigation & Action Bar */}
        <div className="flex items-center justify-between gap-4">
          <Link
            to={pass.eventSlug ? `/events/${pass.eventSlug}` : '/events'}
            className="inline-flex items-center gap-1.5 font-mono text-xs font-black text-[#121316] hover:text-[#6C5CE7] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← Back to Event</span>
          </Link>

          <button
            onClick={handleCopyLink}
            className="px-4 py-1.5 rounded-full bg-white hover:bg-[#FFE600] border-2 border-[#121316] font-mono text-xs font-black text-[#121316] flex items-center gap-1.5 shadow-pop-sm transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-[#2ED573]" />
                <span>Pass Link Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Pass Link</span>
              </>
            )}
          </button>
        </div>

        {/* ================================================================= */}
        {/* DIGITAL PASS / TICKET CARD                                        */}
        {/* ================================================================= */}
        <div 
          className="rounded-[40px] bg-white border-4 border-[#121316] shadow-pop-xl overflow-hidden relative"
          style={{ borderTopColor: pass.accentColor || '#FFE600', borderTopWidth: '10px' }}
        >
          
          {/* TICKET TOP HEADER */}
          <div className="p-6 sm:p-8 bg-[#FAF7F0] border-b-4 border-[#121316] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#FFE600] border-3 border-[#121316] shadow-pop-sm flex items-center justify-center font-mono font-black text-[#121316]">
                <Ticket className="w-6 h-6" />
              </div>
              <div>
                <span className="font-mono text-[10px] font-black uppercase text-[#6C5CE7]">
                  ADVANCED TECH CLUB • OFFICIAL EVENT PASS
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-[#121316] tracking-tight">
                  NIAT Pune Campus
                </h2>
              </div>
            </div>

            {/* Pass Status Badge */}
            <div className="flex items-center gap-2">
              <span className={`px-3.5 py-1.5 rounded-full font-mono text-xs font-black uppercase border-2 shadow-pop-sm flex items-center gap-1.5 ${passStatusInfo.badgeClass}`}>
                {passStatusInfo.icon}
                <span>{passStatusInfo.label}</span>
              </span>
            </div>
          </div>

          {/* MAIN PASS BODY */}
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y-4 md:divide-y-0 md:divide-x-4 divide-[#121316]">
            
            {/* LEFT 2 COLUMNS: EVENT & PARTICIPANT INFO */}
            <div className="md:col-span-2 p-6 sm:p-8 space-y-6">
              
              {/* Event Cover or Graphic Hero */}
              {coverUrl && !imageError ? (
                <div className="w-full h-40 rounded-2xl border-3 border-[#121316] overflow-hidden bg-gray-100 shadow-pop-sm">
                  <img
                    src={coverUrl}
                    alt={pass.eventTitle}
                    className="w-full h-full object-cover"
                    onError={() => setImageError(true)}
                  />
                </div>
              ) : null}

              {/* Event Title */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#FAF7F0] border border-[#121316] font-mono text-[10px] font-black uppercase">
                    {pass.eventType}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-[#121316] tracking-tight">
                  {pass.eventTitle}
                </h1>
              </div>

              {/* Participant Name Highlight */}
              <div className="p-4 rounded-2xl bg-[#FFF9DB] border-2 border-[#121316] space-y-0.5 shadow-pop-sm">
                <span className="font-mono text-[10px] font-black uppercase text-gray-500">
                  ATTENDEE NAME
                </span>
                <p className="text-xl sm:text-2xl font-black text-[#121316]">
                  {pass.name}
                </p>
              </div>

              {/* Event Time & Venue Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 font-mono text-xs">
                <div className="p-3.5 rounded-2xl bg-[#FAF7F0] border-2 border-[#121316] space-y-1">
                  <div className="flex items-center gap-1.5 text-gray-500 font-bold">
                    <Clock className="w-3.5 h-3.5 text-[#6C5CE7]" />
                    <span>START TIME</span>
                  </div>
                  <p className="font-black text-[#121316] text-xs sm:text-sm">
                    {formatDate(pass.startDate)}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#FAF7F0] border-2 border-[#121316] space-y-1">
                  <div className="flex items-center gap-1.5 text-gray-500 font-bold">
                    <MapPin className="w-3.5 h-3.5 text-[#FF6B6B]" />
                    <span>VENUE</span>
                  </div>
                  <p className="font-black text-[#121316] text-xs sm:text-sm truncate">
                    {pass.venue}
                  </p>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: SCANNABLE QR TICKET STUB */}
            <div className="p-6 sm:p-8 bg-[#FAF7F0] flex flex-col items-center justify-between text-center space-y-6">
              
              <div className="space-y-1">
                <span className="font-mono text-[10px] font-black uppercase text-gray-500">
                  ENTRY PASS CODE
                </span>
                <div className="px-3.5 py-1.5 rounded-xl bg-white border-2 border-[#121316] shadow-pop-sm font-mono text-xs font-black text-[#6C5CE7] select-all">
                  {pass.passId}
                </div>
              </div>

              {/* Dynamic QR Code */}
              <div className="p-4 rounded-3xl bg-white border-3 border-[#121316] shadow-pop flex flex-col items-center justify-center">
                <QRCodeSVG
                  value={qrPassUrl}
                  size={160}
                  level="H"
                  includeMargin={false}
                  bgColor="#FFFFFF"
                  fgColor="#121316"
                />
              </div>

              <div className="space-y-1 text-center">
                <p className="font-mono text-[11px] font-bold text-gray-600">
                  ⚡ Present this QR at the venue entrance desk.
                </p>
                <span className="font-mono text-[10px] text-gray-400 block">
                  Registered: {formatDate(pass.registeredAt)}
                </span>
              </div>

            </div>

          </div>

          {/* TICKET FOOTER BAR */}
          <div className="p-4 sm:p-5 bg-[#121316] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#2ED573]" />
              <span className="font-bold text-gray-300">
                Official Digital Event Pass • ATC NIAT Pune
              </span>
            </div>

            <div className="text-gray-400 text-[11px]">
              Pass ID: <span className="text-[#FFE600] font-black">{pass.passId}</span>
            </div>
          </div>

        </div>

        {/* BOTTOM HELPFUL ACTIONS */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            to="/events"
            className="px-6 py-3 rounded-full bg-white hover:bg-gray-100 text-[#121316] font-mono text-xs font-black border-2 border-[#121316] shadow-pop-sm transition-all"
          >
            ← Browse More Events
          </Link>

          <button
            onClick={() => window.print()}
            className="px-6 py-3 rounded-full bg-[#FFE600] hover:bg-[#FFD32A] text-[#121316] font-mono text-xs font-black border-2 border-[#121316] shadow-pop hover:shadow-pop-lg transition-all cursor-pointer"
          >
            🖨️ Print / Save Pass
          </button>
        </div>

      </div>
    </div>
  );
};

export default EventPassPage;
