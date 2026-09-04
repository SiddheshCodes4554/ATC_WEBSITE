import React from 'react';
import {
  Clock,
  Users,
  CheckCircle2,
  AlertCircle,
  Hourglass,
  Lock,
  ArrowUpRight,
  ListOrdered,
  Sparkles,
  Info,
} from 'lucide-react';
import { PublicLabSlotWithDetails, LabSlotDisplayState } from '../../types/labBooking.types';
import { getSlotTimeRemaining } from '../../utils/labTimeUtils';

interface LabSlotCardProps {
  slotDetails: PublicLabSlotWithDetails;
  onRequestSlot: (slotDetails: PublicLabSlotWithDetails) => void;
  isSelected?: boolean;
}

export const LabSlotCard: React.FC<LabSlotCardProps> = ({
  slotDetails,
  onRequestSlot,
  isSelected = false,
}) => {
  const {
    slot,
    displayState,
    approvedRequests,
    pendingRequests,
    waitlistedRequests,
    approvedCount,
    totalCapacity,
    availableCapacity,
  } = slotDetails;

  const timeRemaining = getSlotTimeRemaining(slot.date, slot.endTime);

  // Visual Theme Mapping based on calculated dynamic state
  const stateConfigs: Record<
    LabSlotDisplayState,
    {
      label: string;
      pillBg: string;
      cardBorder: string;
      buttonText: string;
      buttonVariant: 'primary' | 'secondary' | 'waitlist' | 'disabled';
      icon: React.ReactNode;
    }
  > = {
    AVAILABLE: {
      label: 'AVAILABLE',
      pillBg: 'bg-[#E8F5E9] text-[#2E7D32]',
      cardBorder: 'border-[#121316]',
      buttonText: 'Request Slot',
      buttonVariant: 'primary',
      icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    },
    REQUESTED: {
      label: 'REQUESTED',
      pillBg: 'bg-[#F0EBFF] text-[#6C5CE7]',
      cardBorder: 'border-[#121316]',
      buttonText: availableCapacity > 0 ? 'Request Slot' : 'Join Waitlist',
      buttonVariant: availableCapacity > 0 ? 'primary' : 'waitlist',
      icon: <Hourglass className="w-3.5 h-3.5" />,
    },
    OCCUPIED: {
      label: 'OCCUPIED',
      pillBg: 'bg-[#E1F5FE] text-[#0288D1]',
      cardBorder: 'border-[#121316]',
      buttonText: 'Request Remaining Spot',
      buttonVariant: 'primary',
      icon: <Users className="w-3.5 h-3.5" />,
    },
    FULL: {
      label: 'SLOT FULL',
      pillBg: 'bg-[#FFE5E5] text-[#D63031]',
      cardBorder: 'border-[#121316]',
      buttonText: 'Join Waitlist #1',
      buttonVariant: 'waitlist',
      icon: <AlertCircle className="w-3.5 h-3.5" />,
    },
    WAITLIST_ACTIVE: {
      label: `WAITLIST ACTIVE (${waitlistedRequests.length})`,
      pillBg: 'bg-[#FFF3E0] text-[#E65100]',
      cardBorder: 'border-[#121316]',
      buttonText: `Join Waitlist #${waitlistedRequests.length + 1}`,
      buttonVariant: 'waitlist',
      icon: <ListOrdered className="w-3.5 h-3.5" />,
    },
    BLOCKED: {
      label: 'BLOCKED',
      pillBg: 'bg-gray-200 text-gray-700',
      cardBorder: 'border-gray-400 opacity-75',
      buttonText: 'Slot Blocked',
      buttonVariant: 'disabled',
      icon: <Lock className="w-3.5 h-3.5" />,
    },
    CLOSED: {
      label: 'CLOSED',
      pillBg: 'bg-gray-200 text-gray-700',
      cardBorder: 'border-gray-400 opacity-75',
      buttonText: 'Slot Closed',
      buttonVariant: 'disabled',
      icon: <Lock className="w-3.5 h-3.5" />,
    },
  };

  const currentConfig = stateConfigs[displayState];
  const isActionable = displayState !== 'BLOCKED' && displayState !== 'CLOSED';
  const capacityPercent = Math.min(100, Math.round((approvedCount / totalCapacity) * 100));

  return (
    <div
      className={`p-6 sm:p-7 rounded-[36px] bg-white border-4 ${currentConfig.cardBorder} shadow-pop hover:shadow-pop-lg transition-all duration-300 flex flex-col justify-between space-y-5 relative group ${
        isSelected ? 'ring-4 ring-[#6C5CE7] -translate-y-1' : ''
      }`}
    >
      {/* Top Row: Time Block & State Badge */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Time Badge */}
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-[#121316] text-white font-mono text-xs sm:text-sm font-black shadow-pop-sm">
              <Clock className="w-4 h-4 text-[#FFE600]" />
              <span>
                {slot.startTime} — {slot.endTime}
              </span>
            </div>
            {!timeRemaining.isExpired && (
              <span className="hidden sm:inline-block px-2.5 py-1 rounded-xl bg-blue-50 text-[#2E86DE] font-mono text-[11px] font-black border border-blue-200 shadow-pop-xs">
                {timeRemaining.label}
              </span>
            )}
          </div>

          {/* Dynamic Status Pill */}
          <span
            className={`px-3 py-1 rounded-full font-mono text-xs font-black uppercase border-2 border-[#121316] shadow-pop-sm flex items-center gap-1.5 ${currentConfig.pillBg}`}
          >
            {currentConfig.icon}
            <span>{currentConfig.label}</span>
          </span>
        </div>

        {/* Capacity Meter Bar */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-xs font-mono font-bold text-gray-600">
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-gray-500" />
              <span>
                Capacity: {approvedCount} / {totalCapacity} {totalCapacity === 1 ? 'maker' : 'makers'}
              </span>
            </span>
            <span>
              {availableCapacity > 0 ? (
                <span className="text-[#2E7D32] font-black">{availableCapacity} Spot(s) Open</span>
              ) : (
                <span className="text-[#E65100] font-black">Full</span>
              )}
            </span>
          </div>

          <div className="w-full h-2.5 bg-gray-100 rounded-full border-2 border-[#121316] overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                capacityPercent >= 100
                  ? 'bg-[#FF4757]'
                  : capacityPercent > 0
                  ? 'bg-[#FFE600]'
                  : 'bg-emerald-400'
              }`}
              style={{ width: `${Math.max(8, capacityPercent)}%` }}
            />
          </div>
        </div>

        {/* Admin Notes if provided */}
        {slot.notes && (
          <div className="p-3 rounded-2xl bg-[#FFF9DB] border-2 border-[#121316] text-xs font-bold text-gray-800 flex items-start gap-2">
            <Info className="w-4 h-4 text-[#121316] flex-shrink-0 mt-0.5" />
            <span className="font-mono text-[11px] leading-tight">{slot.notes}</span>
          </div>
        )}
      </div>

      {/* Middle Content: Approved Makers, Pending & Waitlist */}
      <div className="space-y-3 pt-1 border-t-2 border-[#121316]/10">
        
        {/* 1. Approved Makers */}
        {approvedRequests.length > 0 && (
          <div className="space-y-2">
            <span className="text-[10px] font-mono font-black uppercase text-gray-500 tracking-wider">
              Approved Makers:
            </span>
            <div className="space-y-1.5">
              {approvedRequests.map((req) => (
                <div
                  key={req.$id}
                  className="p-2.5 rounded-2xl bg-[#E8F5E9] border-2 border-[#121316] flex items-center justify-between gap-2"
                >
                  <div className="space-y-0.5 truncate">
                    <span className="font-black text-xs text-[#121316] block truncate">
                      {req.requesterName}
                    </span>
                    <span className="font-mono text-[11px] text-gray-600 truncate block">
                      {req.purpose}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-lg bg-emerald-600 text-white font-mono text-[9px] font-black uppercase flex-shrink-0">
                    APPROVED
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. Pending Requests Awaiting Review */}
        {pendingRequests.length > 0 && (
          <div className="space-y-2">
            <span className="text-[10px] font-mono font-black uppercase text-gray-500 tracking-wider">
              Awaiting Approval ({pendingRequests.length}):
            </span>
            <div className="space-y-1.5">
              {pendingRequests.map((req) => (
                <div
                  key={req.$id}
                  className="p-2 rounded-xl bg-[#F0EBFF] border border-[#121316]/30 flex items-center justify-between text-xs"
                >
                  <span className="font-bold text-gray-800 truncate">
                    {req.requesterName} • <span className="text-gray-500 font-normal">{req.purpose}</span>
                  </span>
                  <span className="text-[10px] font-mono text-[#6C5CE7] font-bold flex-shrink-0 ml-2">
                    In Review ⏳
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. Waitlist Queue Visualizer */}
        {waitlistedRequests.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-black uppercase text-[#E65100] tracking-wider flex items-center gap-1">
                <ListOrdered className="w-3 h-3" />
                <span>Waitlist Queue:</span>
              </span>
              <span className="text-[10px] font-mono font-bold text-gray-500">
                {waitlistedRequests.length} in queue
              </span>
            </div>

            <div className="space-y-1.5">
              {waitlistedRequests.slice(0, 3).map((w, idx) => (
                <div
                  key={w.$id}
                  className="p-2 rounded-xl bg-[#FFF3E0] border border-[#121316]/20 flex items-center justify-between text-xs"
                >
                  <span className="font-bold text-gray-800 truncate">
                    <span className="text-[#E65100] font-mono font-black">#{idx + 1}</span> {w.requesterName}
                    <span className="text-gray-500 font-normal ml-1 truncate">({w.purpose})</span>
                  </span>
                  <span className="text-[10px] font-mono text-[#E65100] font-bold flex-shrink-0 ml-2">
                    Queued
                  </span>
                </div>
              ))}
              {waitlistedRequests.length > 3 && (
                <div className="text-[10px] font-mono text-center text-gray-500">
                  +{waitlistedRequests.length - 3} more waiting
                </div>
              )}
            </div>
          </div>
        )}

        {/* When completely empty */}
        {approvedRequests.length === 0 && pendingRequests.length === 0 && (
          <div className="py-3 text-center text-xs font-mono font-bold text-gray-500 bg-[#FAF7F0] rounded-2xl border border-dashed border-[#121316]/20">
            ✨ No current bookings for this slot.
          </div>
        )}
      </div>

      {/* Action Button: [ Request Slot ] or [ Join Waitlist ] */}
      <div className="pt-2">
        {isActionable ? (
          <button
            type="button"
            onClick={() => onRequestSlot(slotDetails)}
            className={`w-full py-3 sm:py-3.5 rounded-2xl font-mono text-xs sm:text-sm font-black border-3 border-[#121316] shadow-pop hover:shadow-pop-md flex items-center justify-center gap-2 transition-all hover:scale-[1.02] cursor-pointer select-none ${
              currentConfig.buttonVariant === 'waitlist'
                ? 'bg-[#FF793F] text-white hover:bg-[#FF6326]'
                : 'bg-[#FFE600] text-[#121316] hover:bg-[#FFD32A]'
            }`}
          >
            <span>{currentConfig.buttonText}</span>
            <ArrowUpRight className="w-4 h-4 stroke-[3]" />
          </button>
        ) : (
          <button
            type="button"
            disabled
            className="w-full py-3 rounded-2xl font-mono text-xs font-black bg-gray-200 text-gray-500 border-2 border-gray-300 cursor-not-allowed text-center"
          >
            {currentConfig.buttonText}
          </button>
        )}
      </div>
    </div>
  );
};

export default LabSlotCard;
