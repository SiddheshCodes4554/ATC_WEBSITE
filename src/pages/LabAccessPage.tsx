import React, { useState, useEffect, useRef } from 'react';
import { LabAccessHero } from '../components/lab-access/LabAccessHero';
import { LabDateSelector } from '../components/lab-access/LabDateSelector';
import { LabSlotCard } from '../components/lab-access/LabSlotCard';
import { LabRequestDrawer } from '../components/lab-access/LabRequestDrawer';
import { LabRequestService } from '../services/labRequestService';
import { PublicLabSlotWithDetails } from '../types/labBooking.types';
import {
  Calendar,
  Clock,
  Loader2,
  AlertCircle,
  Sparkles,
  Inbox,
  PlusCircle,
  HelpCircle,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { SparkleDoodle, SpiralScribble } from '../components/doodles/DoodleSvgs';

export const LabAccessPage: React.FC = () => {
  const scheduleSectionRef = useRef<HTMLDivElement>(null);

  // Default to today's date in local YYYY-MM-DD
  const getTodayStr = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [selectedDate, setSelectedDate] = useState<string>(getTodayStr());
  const [slots, setSlots] = useState<PublicLabSlotWithDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Selected slot for request drawer
  const [activeSlotForDrawer, setActiveSlotForDrawer] = useState<PublicLabSlotWithDetails | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  // Stats for Hero
  const [todayTotalSlots, setTodayTotalSlots] = useState<number>(0);
  const [todayAvailableSlots, setTodayAvailableSlots] = useState<number>(0);

  const fetchSchedule = async (date: string) => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await LabRequestService.getPublicSlotsWithDetails(date);
      if (res.success && res.data) {
        setSlots(res.data);

        // If checking today, update hero stats
        if (date === getTodayStr()) {
          setTodayTotalSlots(res.data.length);
          const avail = res.data.filter(
            (s) => s.displayState === 'AVAILABLE' || s.displayState === 'OCCUPIED' || s.displayState === 'REQUESTED'
          ).reduce((sum, s) => sum + s.availableCapacity, 0);
          setTodayAvailableSlots(avail);
        }
      } else {
        setErrorMessage(res.error || 'Could not fetch schedule.');
      }
    } catch (err: any) {
      console.error('Error loading lab slots:', err);
      setErrorMessage('Failed to load lab schedule. Please try refreshing.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedule(selectedDate);
  }, [selectedDate]);

  // Initial load to also compute today's stats if selectedDate wasn't today
  useEffect(() => {
    const todayStr = getTodayStr();
    if (selectedDate !== todayStr) {
      LabRequestService.getPublicSlotsWithDetails(todayStr).then((res) => {
        if (res.success && res.data) {
          setTodayTotalSlots(res.data.length);
          const avail = res.data.filter(
            (s) => s.displayState === 'AVAILABLE' || s.displayState === 'OCCUPIED' || s.displayState === 'REQUESTED'
          ).reduce((sum, s) => sum + s.availableCapacity, 0);
          setTodayAvailableSlots(avail);
        }
      });
    }
  }, []);

  const handleOpenDrawer = (slotDetails: PublicLabSlotWithDetails) => {
    setActiveSlotForDrawer(slotDetails);
    setIsDrawerOpen(true);
  };

  const handleRequestSubmitted = () => {
    // Refresh schedule immediately so the user sees their new request / waitlist update live
    fetchSchedule(selectedDate);
  };

  const handleScrollToSchedule = () => {
    scheduleSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formattedSelectedDate = new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. HERO SECTION */}
      <LabAccessHero
        totalSlotsToday={todayTotalSlots}
        availableSlotsToday={todayAvailableSlots}
        onScrollToSchedule={handleScrollToSchedule}
      />

      {/* 2. SCHEDULE & BOOKING MAIN SECTION */}
      <section
        ref={scheduleSectionRef}
        className="relative bg-[#FAF7F0] py-16 sm:py-20 paper-pattern border-b-4 border-[#121316] flex-1 overflow-hidden"
      >
        {/* Background Doodles */}
        <div className="absolute top-20 right-8 opacity-25 pointer-events-none hidden lg:block">
          <SparkleDoodle className="w-12 h-12" color="#6C5CE7" />
        </div>
        <div className="absolute bottom-16 left-10 opacity-25 pointer-events-none hidden lg:block">
          <SpiralScribble className="w-14 h-14" color="#2ED573" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
          
          {/* Date Selector Ribbon */}
          <div className="p-6 sm:p-8 rounded-[36px] bg-white border-4 border-[#121316] shadow-pop-xl space-y-6">
            <LabDateSelector
              selectedDate={selectedDate}
              onSelectDate={(newDate) => setSelectedDate(newDate)}
            />
          </div>

          {/* Schedule Stage */}
          <div className="space-y-6">
            
            {/* Header / Current View Title */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b-3 border-[#121316]/10">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121316] text-white font-mono text-xs font-black shadow-pop-sm">
                  <Calendar className="w-3.5 h-3.5 text-[#FFE600]" />
                  <span>{formattedSelectedDate}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-[#121316] tracking-tight">
                  Available Lab Slots ({slots.length})
                </h2>
              </div>

              <div className="flex items-center gap-3 text-xs font-mono font-bold text-gray-600">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#2ED573]" /> Open
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FFE600]" /> Occupied
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF793F]" /> Waitlist
                </span>
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-4 rounded-2xl bg-[#FFE5E5] border-2 border-[#FF4757] text-[#D63031] text-xs font-bold flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errorMessage}</span>
                </div>
                <button
                  type="button"
                  onClick={() => fetchSchedule(selectedDate)}
                  className="px-3 py-1 rounded-xl bg-white border border-[#FF4757] text-xs font-bold hover:bg-red-50"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Loading State */}
            {loading ? (
              <div className="p-16 rounded-[36px] bg-white border-4 border-[#121316] shadow-pop-lg flex flex-col items-center justify-center gap-4 text-center max-w-md mx-auto my-8">
                <Loader2 className="w-8 h-8 text-[#6C5CE7] animate-spin" />
                <p className="font-mono text-xs font-black text-[#121316]">
                  Fetching live lab schedule for {selectedDate}...
                </p>
              </div>
            ) : slots.length === 0 ? (
              /* Empty State */
              <div className="p-12 sm:p-16 rounded-[36px] bg-white border-4 border-[#121316] shadow-pop-xl text-center space-y-5 max-w-lg mx-auto my-8">
                <div className="w-16 h-16 rounded-3xl bg-[#FFF9DB] border-3 border-[#121316] shadow-pop-sm flex items-center justify-center mx-auto text-[#121316]">
                  <Inbox className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-[#121316]">No Slots for this Day</h3>
                  <p className="text-xs sm:text-sm font-bold text-gray-600 leading-relaxed">
                    No lab time blocks have been scheduled for {formattedSelectedDate}. Please select another day above or check our upcoming days!
                  </p>
                </div>
                <div className="pt-2 flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedDate(getTodayStr())}
                    className="px-5 py-2.5 rounded-full bg-[#FFE600] text-[#121316] font-mono text-xs font-black border-2 border-[#121316] shadow-pop hover:bg-[#FFD32A]"
                  >
                    View Today
                  </button>
                </div>
              </div>
            ) : (
              /* Slots Grid */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
                {slots.map((slotItem) => (
                  <LabSlotCard
                    key={slotItem.slot.$id}
                    slotDetails={slotItem}
                    onRequestSlot={handleOpenDrawer}
                    isSelected={activeSlotForDrawer?.slot.$id === slotItem.slot.$id && isDrawerOpen}
                  />
                ))}
              </div>
            )}

          </div>

          {/* 3. LAB ACCESS GUIDELINES & FAQ BENTO */}
          <div className="p-8 rounded-[36px] bg-[#121316] text-white border-4 border-[#121316] shadow-pop-2xl space-y-6">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-xl bg-[#FFE600] text-[#121316] font-mono font-black flex items-center justify-center text-sm shadow-pop-sm">
                !
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Lab Access Rules & Maker Etiquette
              </h3>
            </div>

            <div className="grid sm:grid-cols-3 gap-6 text-xs font-mono">
              <div className="p-4 rounded-2xl bg-white/10 border border-white/15 space-y-2">
                <span className="text-[#FFE600] font-black uppercase text-sm block">
                  01. Punctuality & Check-in
                </span>
                <p className="text-gray-300 font-bold leading-relaxed">
                  Please arrive within 15 minutes of your slot start time. Unclaimed slots may be offered to waitlisted makers.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/10 border border-white/15 space-y-2">
                <span className="text-[#00D2D3] font-black uppercase text-sm block">
                  02. Clean Space & Reset
                </span>
                <p className="text-gray-300 font-bold leading-relaxed">
                  Clean space. Clear mind. Better builds. Return all soldering irons, tools, and components to their labeled bins.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/10 border border-white/15 space-y-2">
                <span className="text-[#2ED573] font-black uppercase text-sm block">
                  03. Smart Waitlist
                </span>
                <p className="text-gray-300 font-bold leading-relaxed">
                  If your slot is full, joining the waitlist guarantees priority queueing if an earlier booking is cancelled.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 4. REQUEST DRAWER / SLIDING PANEL */}
      <LabRequestDrawer
        slotDetails={activeSlotForDrawer}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onRequestSubmitted={handleRequestSubmitted}
      />
    </div>
  );
};

export default LabAccessPage;
