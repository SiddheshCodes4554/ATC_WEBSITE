import React from 'react';
import { THEME_PRESETS } from '../../types/experience.types';
import { EventVisualTheme } from '../../types/event.types';
import { 
  Smile, 
  Terminal, 
  Cpu, 
  Zap, 
  BookOpen, 
  Flame, 
  Layers, 
  Check, 
  Sparkles 
} from 'lucide-react';

interface EventExperienceSelectorProps {
  selectedTheme: EventVisualTheme;
  onThemeSelect: (theme: EventVisualTheme) => void;
}

const THEME_ICONS: Record<string, React.ReactNode> = {
  Smile: <Smile className="w-5 h-5" />,
  Terminal: <Terminal className="w-5 h-5" />,
  Cpu: <Cpu className="w-5 h-5" />,
  Zap: <Zap className="w-5 h-5" />,
  BookOpen: <BookOpen className="w-5 h-5" />,
  Flame: <Flame className="w-5 h-5" />,
  Layers: <Layers className="w-5 h-5" />,
};

export const EventExperienceSelector: React.FC<EventExperienceSelectorProps> = ({
  selectedTheme,
  onThemeSelect,
}) => {
  const themes = Object.values(THEME_PRESETS);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <label className="block text-xs font-mono font-black uppercase text-[#121316] tracking-wider">
            EVENT EXPERIENCE STYLE <span className="text-[#6C5CE7]">★ Creative Identity</span>
          </label>
          <p className="text-xs font-bold text-gray-500 mt-0.5">
            Select how this event will visually present on its public landing page:
          </p>
        </div>

        <span className="text-[11px] font-mono font-bold bg-[#FFE600] text-[#121316] px-3 py-1 rounded-full border border-[#121316] shadow-pop-sm inline-flex items-center gap-1">
          <span>Active:</span>
          <span className="uppercase font-black">{THEME_PRESETS[selectedTheme]?.name || selectedTheme}</span>
        </span>
      </div>

      {/* Grid of 7 Creative Theme Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 pt-1">
        {themes.map((t) => {
          const isSelected = selectedTheme === t.id;
          const icon = THEME_ICONS[t.iconName] || <Sparkles className="w-5 h-5" />;

          return (
            <div
              key={t.id}
              onClick={() => onThemeSelect(t.id)}
              className={`p-4 rounded-2xl border-3 transition-all cursor-pointer select-none relative flex flex-col justify-between ${
                isSelected
                  ? 'border-[#121316] shadow-pop bg-white ring-4 ring-[#6C5CE7]/30 -translate-y-1'
                  : 'border-[#121316]/20 bg-white/70 hover:bg-white hover:border-[#121316] hover:shadow-pop-sm hover:-translate-y-0.5'
              }`}
            >
              {/* Selected Check Pill */}
              {isSelected && (
                <div className="absolute -top-2.5 -right-2.5 w-6 h-6 rounded-full bg-[#2ED573] text-white border-2 border-[#121316] flex items-center justify-center shadow-sm">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              )}

              <div className="space-y-2.5">
                {/* Header Row */}
                <div className="flex items-center justify-between">
                  <div
                    className="w-9 h-9 rounded-xl border-2 border-[#121316] shadow-pop-sm flex items-center justify-center"
                    style={{ backgroundColor: t.accentColor }}
                  >
                    <span className="text-[#121316]">{icon}</span>
                  </div>

                  <span className="text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded border border-[#121316]/20 bg-gray-100 text-gray-700">
                    {t.badge}
                  </span>
                </div>

                {/* Theme Title & Tagline */}
                <div>
                  <h4 className="font-black text-sm text-[#121316]">{t.name}</h4>
                  <p className="text-[11px] font-bold text-[#6C5CE7] leading-tight mt-0.5">
                    {t.tagline}
                  </p>
                </div>

                {/* Description */}
                <p className="text-[11px] text-gray-600 font-medium leading-snug">
                  {t.description}
                </p>
              </div>

              {/* Ideal For Footer */}
              <div className="mt-3 pt-2.5 border-t border-gray-100 text-[10px] font-mono text-gray-500">
                <span className="font-bold text-gray-700">Ideal for: </span>
                <span>{t.idealFor}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
