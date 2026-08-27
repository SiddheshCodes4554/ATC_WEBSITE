import React, { useMemo } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

interface LabDateSelectorProps {
  selectedDate: string; // YYYY-MM-DD
  onSelectDate: (date: string) => void;
}

export const LabDateSelector: React.FC<LabDateSelectorProps> = ({
  selectedDate,
  onSelectDate,
}) => {
  // Generate 14 selectable days starting from today
  const days = useMemo(() => {
    const list: { dateStr: string; dayName: string; dayNumber: number; monthName: string; isToday: boolean }[] = [];
    const now = new Date();

    for (let i = 0; i < 14; i++) {
      const d = new Date();
      d.setDate(now.getDate() + i);

      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;

      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      const monthName = d.toLocaleDateString('en-US', { month: 'short' });
      const dayNumber = d.getDate();

      list.push({
        dateStr,
        dayName,
        dayNumber,
        monthName,
        isToday: i === 0,
      });
    }
    return list;
  }, []);

  const handleNativeDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      onSelectDate(e.target.value);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header with Title & Custom Date Picker */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#FFE600] border-2 border-[#121316]" />
            <h3 className="text-xl sm:text-2xl font-black text-[#121316] tracking-tight">
              Select a Lab Day
            </h3>
          </div>
          <p className="text-xs sm:text-sm font-bold text-gray-600">
            Click any date below to inspect available times and active maker bookings
          </p>
        </div>

        {/* Custom Date Input Picker */}
        <div className="flex items-center gap-2">
          <label className="relative inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border-2 border-[#121316] shadow-pop-sm font-mono text-xs font-black text-[#121316] cursor-pointer hover:bg-gray-50 transition-colors">
            <CalendarIcon className="w-4 h-4 text-[#6C5CE7]" />
            <span>Pick Any Date:</span>
            <input
              type="date"
              value={selectedDate}
              onChange={handleNativeDateChange}
              className="font-mono text-xs font-bold text-[#121316] bg-transparent outline-none cursor-pointer"
            />
          </label>
        </div>
      </div>

      {/* Horizontal Interactive Date Ribbon */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-3 pt-1 scrollbar-thin">
        {days.map((item) => {
          const isSelected = selectedDate === item.dateStr;

          return (
            <button
              key={item.dateStr}
              type="button"
              onClick={() => onSelectDate(item.dateStr)}
              className={`flex-shrink-0 flex flex-col items-center justify-center p-3 min-w-[80px] sm:min-w-[92px] rounded-3xl border-3 border-[#121316] transition-all cursor-pointer select-none ${
                isSelected
                  ? 'bg-[#FFE600] text-[#121316] shadow-pop-md scale-105 rotate-[-1deg]'
                  : 'bg-white text-gray-700 shadow-pop-sm hover:bg-[#FFF9DB] hover:text-[#121316]'
              }`}
            >
              {/* Today Pill */}
              {item.isToday && (
                <span
                  className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-black uppercase mb-1 border ${
                    isSelected
                      ? 'bg-[#121316] text-white border-[#121316]'
                      : 'bg-[#FF6B6B] text-white border-[#121316]'
                  }`}
                >
                  TODAY
                </span>
              )}

              {/* Day Name */}
              <span className="text-[11px] font-mono font-black uppercase tracking-wider">
                {item.dayName}
              </span>

              {/* Day Number */}
              <span className="text-xl sm:text-2xl font-black leading-none my-1">
                {item.dayNumber}
              </span>

              {/* Month */}
              <span className="text-[10px] font-mono font-bold uppercase opacity-80">
                {item.monthName}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default LabDateSelector;
