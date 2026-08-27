import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Html5Qrcode, Html5QrcodeCameraScanConfig } from 'html5-qrcode';
import { EventService } from '../../services/eventService';
import { RegistrationService } from '../../services/registrationService';
import { ATCEvent } from '../../types/event.types';
import {
  EventRegistration,
  PassCheckInValidationResult,
  RegistrationStats,
  CheckInValidationCode,
} from '../../types/form.types';
import {
  QrCode,
  Keyboard,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Users,
  Camera,
  RefreshCw,
  Loader2,
  Clock,
  MapPin,
  Sparkles,
  ShieldCheck,
  Check,
  UserCheck,
  Search,
  Volume2,
  VolumeX,
  Smartphone,
  ExternalLink,
  ChevronRight,
  Maximize2
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const AdminEventCheckInPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();

  // Event & Stats State
  const [event, setEvent] = useState<ATCEvent | null>(null);
  const [stats, setStats] = useState<RegistrationStats>({
    total: 0,
    registered: 0,
    cancelled: 0,
    checkedIn: 0,
    activeCount: 0,
    capacityLimit: null,
    remainingSeats: null,
    isCapacityReached: false,
  });
  const [loadingEvent, setLoadingEvent] = useState<boolean>(true);
  const [eventError, setEventError] = useState<string | null>(null);

  // Scanner Mode: 'camera' | 'manual'
  const [scanMode, setScanMode] = useState<'camera' | 'manual'>('camera');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Manual Input State
  const [manualInput, setManualInput] = useState<string>('');

  // Camera State
  const [cameraPermissionError, setCameraPermissionError] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameras, setCameras] = useState<Array<{ id: string; label: string }>>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string>('');
  const qrScannerRef = useRef<Html5Qrcode | null>(null);
  const isScanningRef = useRef<boolean>(false);

  // Validation & Check-in Flow State
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [isExecutingCheckIn, setIsExecutingCheckIn] = useState<boolean>(false);
  const [validationResult, setValidationResult] = useState<PassCheckInValidationResult | null>(null);
  const [checkInSuccessMessage, setCheckInSuccessMessage] = useState<string | null>(null);
  const [checkedInParticipant, setCheckedInParticipant] = useState<EventRegistration | null>(null);

  // Sound & Vibration Feedback
  const playFeedback = useCallback((type: 'success' | 'warning' | 'error') => {
    if ('vibrate' in navigator) {
      if (type === 'success') navigator.vibrate([80, 40, 80]);
      else if (type === 'warning') navigator.vibrate([150, 80, 150]);
      else navigator.vibrate([200, 100, 200]);
    }

    if (!soundEnabled) return;

    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();

      if (type === 'success') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1); // A5
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      } else if (type === 'warning') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.setValueAtTime(330, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      } else {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, ctx.currentTime);
        osc.frequency.setValueAtTime(160, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      }
    } catch {}
  }, [soundEnabled]);

  // Load Event and Statistics
  const loadEventAndStats = useCallback(async () => {
    if (!eventId?.trim()) {
      setEventError('Event ID is missing.');
      setLoadingEvent(false);
      return;
    }

    try {
      const eventRes = await EventService.getEventById(eventId.trim());
      if (eventRes.success && eventRes.data) {
        setEvent(eventRes.data);
        const computedStats = await RegistrationService.getRegistrationStats(
          eventId.trim(),
          eventRes.data.registrationLimit
        );
        setStats(computedStats);
      } else {
        setEventError(eventRes.error || 'Event could not be found.');
      }
    } catch (err: any) {
      setEventError(err?.message || 'Error loading event.');
    } finally {
      setLoadingEvent(false);
    }
  }, [eventId]);

  useEffect(() => {
    loadEventAndStats();
  }, [loadEventAndStats]);

  // Stop Camera Scanner Safely
  const stopCamera = async () => {
    if (qrScannerRef.current && isScanningRef.current) {
      try {
        await qrScannerRef.current.stop();
        isScanningRef.current = false;
        setIsCameraActive(false);
      } catch (err) {
        console.warn('Error stopping QR scanner:', err);
      }
    }
  };

  // Start Camera Scanner
  const startCamera = async (cameraId?: string) => {
    setCameraPermissionError(null);

    // If already open, stop first
    await stopCamera();

    try {
      // Find available cameras
      const availableCameras = await Html5Qrcode.getCameras();
      if (!availableCameras || availableCameras.length === 0) {
        setCameraPermissionError('No camera found on this device. Please use manual pass entry.');
        setScanMode('manual');
        return;
      }

      setCameras(availableCameras.map((c) => ({ id: c.id, label: c.label || `Camera ${c.id.slice(0, 4)}` })));

      // Select back camera or given ID
      const targetCamId =
        cameraId ||
        selectedCameraId ||
        availableCameras.find((c) => /back|rear|environment/i.test(c.label))?.id ||
        availableCameras[0].id;

      setSelectedCameraId(targetCamId);

      const scanner = new Html5Qrcode('atc-qr-reader');
      qrScannerRef.current = scanner;

      const scanConfig: Html5QrcodeCameraScanConfig = {
        fps: 10,
        qrbox: { width: 260, height: 260 },
        aspectRatio: 1.0,
      };

      await scanner.start(
        targetCamId,
        scanConfig,
        (decodedText) => {
          handleQrCodeScanned(decodedText);
        },
        () => {
          // Frame-by-frame ignore
        }
      );

      isScanningRef.current = true;
      setIsCameraActive(true);
    } catch (err: any) {
      console.warn('Camera start error:', err);
      const errMsg = err?.message || String(err);
      if (/permission|denied|not allowed/i.test(errMsg)) {
        setCameraPermissionError('Camera permission was denied. Please allow camera access in browser settings or enter Pass ID manually.');
      } else {
        setCameraPermissionError('Unable to start camera. Switching to manual pass entry.');
      }
      setScanMode('manual');
      setIsCameraActive(false);
    }
  };

  // Lifecycle: Cleanup camera on unmount or tab switch
  useEffect(() => {
    if (scanMode === 'camera' && !validationResult && !checkedInParticipant && event) {
      // Short delay for DOM container #atc-qr-reader to be ready
      const timer = setTimeout(() => {
        startCamera();
      }, 150);
      return () => {
        clearTimeout(timer);
        stopCamera();
      };
    } else {
      stopCamera();
    }
  }, [scanMode, validationResult, checkedInParticipant, event]);

  // Handle Pass Verification (Shared between QR and Manual Entry)
  const processPassVerification = async (rawInput: string) => {
    if (!event || !rawInput.trim() || isValidating) return;

    setIsValidating(true);
    setCheckInSuccessMessage(null);
    setCheckedInParticipant(null);

    // Stop scanner while evaluating
    await stopCamera();

    try {
      const result = await RegistrationService.validatePassForCheckIn(rawInput.trim(), event.$id);
      setValidationResult(result);

      if (result.code === 'VALID') {
        playFeedback('success');
      } else if (result.code === 'ALREADY_CHECKED_IN') {
        playFeedback('warning');
      } else {
        playFeedback('error');
      }
    } catch (err: any) {
      setValidationResult({
        code: 'INVALID_PASS',
        isValid: false,
        message: err?.message || 'Error occurred while verifying pass.',
      });
      playFeedback('error');
    } finally {
      setIsValidating(false);
    }
  };

  // QR Code Detected Callback
  const handleQrCodeScanned = (decodedText: string) => {
    if (isScanningRef.current && !isValidating && !validationResult) {
      processPassVerification(decodedText);
    }
  };

  // Manual Form Submit
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualInput.trim()) {
      processPassVerification(manualInput.trim());
    }
  };

  // Execute Confirmed Check-In
  const handleConfirmCheckIn = async () => {
    if (!event || !validationResult?.registration?.$id || isExecutingCheckIn) return;

    setIsExecutingCheckIn(true);
    try {
      const execResult = await RegistrationService.performCheckIn(
        validationResult.registration.$id,
        event.$id
      );

      if (execResult.success && execResult.registration) {
        setCheckedInParticipant(execResult.registration);
        setCheckInSuccessMessage(execResult.message);
        setValidationResult(null);
        setManualInput('');

        // Trigger celebratory confetti
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#2ED573', '#FFE600', '#6C5CE7'],
        });
        playFeedback('success');

        // Refresh stats
        const updatedStats = await RegistrationService.getRegistrationStats(
          event.$id,
          event.registrationLimit
        );
        setStats(updatedStats);
      } else if (execResult.isDuplicateCheckIn) {
        setValidationResult({
          code: 'ALREADY_CHECKED_IN',
          isValid: false,
          message: execResult.message,
          registration: validationResult.registration,
          checkedInAt: execResult.checkedInAt,
        });
        playFeedback('warning');
      } else {
        alert(execResult.message || 'Failed to complete check-in.');
      }
    } catch (err: any) {
      alert(err?.message || 'Unexpected error during check-in.');
    } finally {
      setIsExecutingCheckIn(false);
    }
  };

  // Reset Scanner for Next Attendee
  const handleResetForNext = () => {
    setValidationResult(null);
    setCheckedInParticipant(null);
    setCheckInSuccessMessage(null);
    setManualInput('');

    if (scanMode === 'camera') {
      setTimeout(() => {
        startCamera(selectedCameraId);
      }, 100);
    }
  };

  const formatDate = (isoString?: string | null) => {
    if (!isoString) return 'TBA';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  if (loadingEvent) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 text-center bg-[#FAF7F0] paper-pattern select-none">
        <div className="p-8 rounded-[36px] bg-white border-4 border-[#121316] shadow-pop-lg flex flex-col items-center gap-4 max-w-sm">
          <div className="w-14 h-14 rounded-2xl bg-[#FFE600] border-3 border-[#121316] shadow-pop-sm flex items-center justify-center animate-bounce">
            <QrCode className="w-8 h-8 text-[#121316]" />
          </div>
          <div>
            <h3 className="font-black text-xl text-[#121316]">Loading Check-In Station</h3>
            <p className="font-mono text-xs font-bold text-gray-600 mt-1">Connecting to Appwrite...</p>
          </div>
          <Loader2 className="w-6 h-6 text-[#6C5CE7] animate-spin mt-2" />
        </div>
      </div>
    );
  }

  if (eventError || !event) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center bg-[#FAF7F0] paper-pattern select-none">
        <div className="max-w-md w-full p-8 sm:p-10 rounded-[36px] bg-[#FFE5E5] border-4 border-[#FF4757] shadow-pop-xl space-y-4">
          <AlertTriangle className="w-12 h-12 text-[#FF4757] mx-auto" />
          <h3 className="text-xl font-black text-[#121316]">Check-in Station Unavailable</h3>
          <p className="text-xs sm:text-sm font-bold text-gray-700">{eventError || 'Event record not found.'}</p>
          <div className="pt-2">
            <Link
              to="/admin/events"
              className="px-6 py-2.5 rounded-full bg-white border-2 border-[#121316] font-mono text-xs font-black shadow-pop-sm inline-flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Events</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F0] py-8 px-4 sm:px-6 lg:px-8 paper-pattern select-none">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              to={`/admin/events/${event.$id}/registrations`}
              className="w-10 h-10 rounded-2xl bg-white border-2 border-[#121316] shadow-pop-sm flex items-center justify-center hover:bg-[#FFE600] transition-colors"
              title="Back to Registrations Dashboard"
            >
              <ArrowLeft className="w-5 h-5 text-[#121316]" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#2ED573] text-[#121316] border border-[#121316] font-mono text-[9px] font-black uppercase flex items-center gap-1">
                  ● LIVE CHECK-IN STATION
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-[#121316] tracking-tight truncate max-w-md mt-0.5">
                {event.title}
              </h1>
            </div>
          </div>

          {/* Sound & Controls */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => setSoundEnabled((prev) => !prev)}
              className="p-2.5 rounded-2xl bg-white hover:bg-gray-100 border-2 border-[#121316] shadow-pop-sm transition-all text-[#121316] cursor-pointer"
              title={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-[#2ED573]" /> : <VolumeX className="w-4 h-4 text-gray-400" />}
            </button>

            <Link
              to={`/admin/events/${event.$id}/registrations`}
              className="px-4 py-2 rounded-2xl bg-white hover:bg-gray-100 border-2 border-[#121316] shadow-pop-sm font-mono text-xs font-black text-[#121316] flex items-center gap-1.5 transition-all"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Attendees List</span>
            </Link>
          </div>
        </div>

        {/* LIVE ATTENDANCE METRICS BANNER */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          <div className="p-4 sm:p-5 rounded-3xl bg-white border-3 border-[#121316] shadow-pop-sm space-y-1">
            <span className="font-mono text-[10px] font-black uppercase text-gray-500">
              REGISTERED
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-[#121316]">
              {stats.activeCount}
            </h3>
            <p className="font-mono text-[10px] text-gray-400 font-bold hidden sm:block">Active confirmed seats</p>
          </div>

          <div className="p-4 sm:p-5 rounded-3xl bg-[#E8F8F0] border-3 border-[#2ED573] shadow-pop-sm space-y-1">
            <span className="font-mono text-[10px] font-black uppercase text-[#2ED573]">
              CHECKED IN
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-[#2ED573]">
              {stats.checkedIn}
            </h3>
            <p className="font-mono text-[10px] text-gray-500 font-bold hidden sm:block">Admitted at venue</p>
          </div>

          <div className="p-4 sm:p-5 rounded-3xl bg-white border-3 border-[#121316] shadow-pop-sm space-y-1">
            <span className="font-mono text-[10px] font-black uppercase text-[#6C5CE7]">
              REMAINING
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-[#6C5CE7]">
              {Math.max(0, stats.activeCount - stats.checkedIn)}
            </h3>
            <p className="font-mono text-[10px] text-gray-400 font-bold hidden sm:block">Expected to arrive</p>
          </div>
        </div>

        {/* ================================================================= */}
        {/* CHECK-IN SUCCESS CELEBRATION CARD                                */}
        {/* ================================================================= */}
        {checkedInParticipant && (
          <div className="p-6 sm:p-10 rounded-[36px] bg-[#E8F8F0] border-4 border-[#2ED573] shadow-pop-xl text-center space-y-5 animate-fadeIn">
            <div className="w-16 h-16 rounded-3xl bg-[#2ED573] border-3 border-[#121316] shadow-pop flex items-center justify-center mx-auto text-[#121316]">
              <Check className="w-10 h-10 stroke-[4]" />
            </div>

            <div className="space-y-1.5">
              <span className="px-3.5 py-0.5 rounded-full bg-white border-2 border-[#121316] font-mono text-[11px] font-black uppercase text-[#2ED573] shadow-pop-sm">
                ✓ CHECK-IN COMPLETED
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#121316]">
                {checkedInParticipant.name}
              </h2>
              <p className="font-mono text-xs font-bold text-gray-600">
                Pass ID: <span className="text-[#6C5CE7] font-black">{checkedInParticipant.passId}</span> • Time: {formatDate(checkedInParticipant.checkedInAt || new Date().toISOString())}
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleResetForNext}
                className="px-8 py-3.5 rounded-full bg-[#121316] hover:bg-[#6C5CE7] text-white font-mono text-xs font-black border-2 border-[#121316] shadow-pop-sm flex items-center justify-center gap-2 mx-auto transition-all cursor-pointer"
              >
                <span>SCAN NEXT PARTICIPANT</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* VALIDATION RESULT CARD (Before Confirmation)                     */}
        {/* ================================================================= */}
        {!checkedInParticipant && validationResult && (
          <div
            className={`p-6 sm:p-8 rounded-[36px] bg-white border-4 shadow-pop-xl space-y-6 animate-fadeIn ${
              validationResult.code === 'VALID'
                ? 'border-[#2ED573]'
                : validationResult.code === 'ALREADY_CHECKED_IN'
                ? 'border-[#6C5CE7]'
                : validationResult.code === 'WRONG_EVENT'
                ? 'border-[#FFA502]'
                : 'border-[#FF4757]'
            }`}
          >
            {/* Header Badge */}
            <div className="flex items-center justify-between">
              {validationResult.code === 'VALID' && (
                <span className="px-3 py-1 rounded-full bg-[#E8F8F0] border-2 border-[#2ED573] font-mono text-xs font-black uppercase text-[#2ED573] flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  VALID PASS • READY TO CHECK IN
                </span>
              )}
              {validationResult.code === 'ALREADY_CHECKED_IN' && (
                <span className="px-3 py-1 rounded-full bg-[#E1DCFF] border-2 border-[#6C5CE7] font-mono text-xs font-black uppercase text-[#6C5CE7] flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5" />
                  ALREADY CHECKED IN
                </span>
              )}
              {validationResult.code === 'WRONG_EVENT' && (
                <span className="px-3 py-1 rounded-full bg-[#FFF4E0] border-2 border-[#FFA502] font-mono text-xs font-black uppercase text-[#FFA502] flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  WRONG EVENT
                </span>
              )}
              {(validationResult.code === 'CANCELLED' || validationResult.code === 'INVALID_PASS') && (
                <span className="px-3 py-1 rounded-full bg-[#FFE5E5] border-2 border-[#FF4757] font-mono text-xs font-black uppercase text-[#FF4757] flex items-center gap-1.5">
                  <XCircle className="w-3.5 h-3.5" />
                  {validationResult.code === 'CANCELLED' ? 'PASS CANCELLED' : 'INVALID PASS'}
                </span>
              )}

              <button
                type="button"
                onClick={handleResetForNext}
                className="font-mono text-xs font-bold text-gray-500 hover:text-[#121316] underline cursor-pointer"
              >
                Dismiss
              </button>
            </div>

            {/* Main Participant & Event Details */}
            {validationResult.registration ? (
              <div className="p-5 rounded-3xl bg-[#FAF7F0] border-3 border-[#121316] space-y-4 shadow-pop-sm">
                <div>
                  <span className="font-mono text-[10px] font-bold text-gray-400 uppercase">PARTICIPANT NAME</span>
                  <h3 className="text-2xl font-black text-[#121316]">
                    {validationResult.registration.name}
                  </h3>
                  <p className="font-mono text-xs font-bold text-gray-600">
                    Email: {validationResult.registration.email} {validationResult.registration.phone && `• Phone: ${validationResult.registration.phone}`}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#121316]/10 font-mono text-xs">
                  <div>
                    <span className="text-gray-400 font-bold block text-[10px]">PASS ID</span>
                    <span className="font-black text-[#6C5CE7]">{validationResult.registration.passId}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 font-bold block text-[10px]">
                      {validationResult.code === 'ALREADY_CHECKED_IN' ? 'CHECKED IN AT' : 'REGISTERED AT'}
                    </span>
                    <span className="font-bold text-gray-800">
                      {formatDate(validationResult.checkedInAt || validationResult.registration.registeredAt)}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-[#FFE5E5] border-2 border-[#FF4757] text-center space-y-1 font-mono text-xs font-bold text-gray-800">
                <p>{validationResult.message}</p>
              </div>
            )}

            {/* Actions Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={handleResetForNext}
                className="px-5 py-3 rounded-full bg-[#FAF7F0] hover:bg-gray-200 text-[#121316] font-mono text-xs font-black border-2 border-[#121316] cursor-pointer"
              >
                Scan Another
              </button>

              {validationResult.code === 'VALID' && (
                <button
                  type="button"
                  disabled={isExecutingCheckIn}
                  onClick={handleConfirmCheckIn}
                  className="px-8 py-3.5 rounded-full bg-[#2ED573] hover:bg-[#26af5f] text-[#121316] font-mono text-xs font-black border-3 border-[#121316] shadow-pop hover:shadow-pop-lg flex items-center gap-2 transition-all cursor-pointer"
                >
                  {isExecutingCheckIn ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Checking In...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>CONFIRM CHECK IN</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* SCANNER STATION (Camera & Manual Entry)                           */}
        {/* ================================================================= */}
        {!checkedInParticipant && !validationResult && (
          <div className="rounded-[36px] bg-white border-4 border-[#121316] shadow-pop-xl overflow-hidden">
            
            {/* Mode Switcher Tabs */}
            <div className="grid grid-cols-2 border-b-3 border-[#121316] bg-[#FAF7F0] font-mono text-xs font-black">
              <button
                type="button"
                onClick={() => {
                  setScanMode('camera');
                }}
                className={`py-4 px-6 flex items-center justify-center gap-2 border-r-3 border-[#121316] transition-colors cursor-pointer ${
                  scanMode === 'camera' ? 'bg-white text-[#121316]' : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                <Camera className="w-4 h-4" />
                <span>Camera QR Scanner</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setScanMode('manual');
                  stopCamera();
                }}
                className={`py-4 px-6 flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                  scanMode === 'manual' ? 'bg-white text-[#121316]' : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                <Keyboard className="w-4 h-4" />
                <span>Manual Pass ID</span>
              </button>
            </div>

            {/* SCANNER VIEW BODY */}
            <div className="p-6 sm:p-10 space-y-6">
              
              {scanMode === 'camera' ? (
                /* CAMERA SCANNER */
                <div className="space-y-4">
                  {cameraPermissionError ? (
                    <div className="p-6 rounded-3xl bg-[#FFE5E5] border-3 border-[#FF4757] text-center space-y-3">
                      <AlertTriangle className="w-8 h-8 text-[#FF4757] mx-auto" />
                      <p className="text-xs font-bold text-gray-800">{cameraPermissionError}</p>
                      <button
                        type="button"
                        onClick={() => startCamera()}
                        className="px-5 py-2 rounded-full bg-white border-2 border-[#121316] font-mono text-xs font-black cursor-pointer shadow-pop-sm"
                      >
                        Retry Camera
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center space-y-4">
                      {/* Video Scan Box */}
                      <div className="w-full max-w-sm aspect-square bg-black rounded-3xl border-4 border-[#121316] overflow-hidden shadow-pop relative flex items-center justify-center">
                        <div id="atc-qr-reader" className="w-full h-full" />
                        
                        {isValidating && (
                          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white space-y-2 z-20">
                            <Loader2 className="w-8 h-8 animate-spin text-[#FFE600]" />
                            <span className="font-mono text-xs font-black">Validating Pass...</span>
                          </div>
                        )}
                      </div>

                      {/* Camera Selector & Helper */}
                      <div className="flex flex-wrap items-center justify-center gap-3 w-full max-w-sm">
                        {cameras.length > 1 && (
                          <select
                            value={selectedCameraId}
                            onChange={(e) => {
                              setSelectedCameraId(e.target.value);
                              startCamera(e.target.value);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-[#FAF7F0] border-2 border-[#121316] font-mono text-xs font-bold text-[#121316] cursor-pointer"
                          >
                            {cameras.map((c) => (
                              <option key={c.id} value={c.id}>
                                📷 {c.label}
                              </option>
                            ))}
                          </select>
                        )}

                        <span className="font-mono text-[11px] text-gray-500 font-bold text-center block w-full">
                          ⚡ Point camera at student's digital event pass QR code.
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* MANUAL PASS ENTRY */
                <form onSubmit={handleManualSubmit} className="max-w-md mx-auto space-y-4">
                  <div className="space-y-1.5 text-center sm:text-left">
                    <label className="font-mono text-xs font-black uppercase text-gray-600 block">
                      Enter Pass ID or Code
                    </label>
                    <div className="relative">
                      <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={manualInput}
                        onChange={(e) => setManualInput(e.target.value.toUpperCase())}
                        placeholder="e.g. ATC-2026-A7X9K2"
                        autoFocus
                        className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-[#FAF7F0] border-3 border-[#121316] font-mono text-base font-black text-[#121316] placeholder-gray-400 focus:outline-none focus:bg-white shadow-pop-sm uppercase"
                      />
                    </div>
                    <span className="font-mono text-[10px] text-gray-400 block mt-1">
                      You can paste the full pass URL or type the 6-character pass code.
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={!manualInput.trim() || isValidating}
                    className="w-full py-3.5 rounded-2xl bg-[#FFE600] hover:bg-[#FFD32A] text-[#121316] font-mono text-xs font-black border-3 border-[#121316] shadow-pop hover:shadow-pop-md flex items-center justify-center gap-2 disabled:opacity-50 transition-all cursor-pointer"
                  >
                    {isValidating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>VERIFY PASS CODE</span>
                      </>
                    )}
                  </button>
                </form>
              )}

            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default AdminEventCheckInPage;
