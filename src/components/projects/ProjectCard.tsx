import React from 'react';
import { ArrowUpRight, Cpu, ExternalLink, Sparkles, Pin } from 'lucide-react';
import { PlayfulButton } from '../ui/PlayfulButton';

export interface StudentProject {
  id: string;
  title: string;
  category: string;
  tags: string[];
  desc: string;
  specs: { label: string; value: string }[];
  builders: string[];
  repoUrl?: string;
  status: string;
  statusColor: string;
  cardColor: string;
  illustration: React.ReactNode;
}

interface ProjectCardProps {
  project: StudentProject;
  idx: number;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, idx }) => {
  return (
    <div className={`group relative p-6 sm:p-8 rounded-[36px] border-4 border-[#121316] shadow-pop-lg hover:shadow-pop-xl transition-all duration-300 flex flex-col justify-between ${project.cardColor} hover:-translate-y-2`}>
      
      {/* Tape Strip Accent */}
      <div className="tape-strip pointer-events-none" />

      <div>
        {/* Top Meta: Status & Category */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <span className={`px-3 py-1 rounded-full text-xs font-mono font-black uppercase text-[#121316] border-2 border-[#121316] shadow-pop-sm ${project.statusColor}`}>
            ● {project.status}
          </span>
          <span className="font-mono text-xs font-bold text-gray-600 bg-white/70 px-2.5 py-0.5 rounded-md border border-[#121316]/20">
            INVENTION #{idx + 1}
          </span>
        </div>

        {/* Project Vector Illustration Sandbox */}
        <div className="p-4 bg-white/80 rounded-2xl border-3 border-[#121316] shadow-inner mb-6 flex items-center justify-center group-hover:scale-[1.03] transition-transform duration-300">
          <div className="w-full max-w-[260px]">
            {project.illustration}
          </div>
        </div>

        {/* Title & Category */}
        <div className="space-y-1.5 mb-3">
          <span className="text-xs font-mono font-extrabold uppercase text-[#6C5CE7]">
            {project.category}
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-[#121316] tracking-tight leading-tight">
            {project.title}
          </h3>
        </div>

        {/* Description */}
        <p className="text-sm sm:text-base font-bold text-gray-700 leading-relaxed mb-4">
          {project.desc}
        </p>

        {/* Technical Specs Grid */}
        <div className="grid grid-cols-2 gap-2 p-3 bg-white/70 rounded-xl border border-[#121316]/20 mb-4 font-mono text-xs">
          {project.specs.map((sp) => (
            <div key={sp.label}>
              <span className="text-[10px] text-gray-500 block uppercase">{sp.label}</span>
              <span className="font-black text-[#121316]">{sp.value}</span>
            </div>
          ))}
        </div>

        {/* Tech Stack Tags */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          {project.tags.map((t) => (
            <span
              key={t}
              className="px-2.5 py-0.5 rounded-lg bg-white border border-[#121316] font-mono text-[11px] font-bold text-[#121316] shadow-pop-sm"
            >
              #{t}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom Builder Credits & Action Button */}
      <div className="pt-4 border-t-2 border-[#121316]/20 flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs font-mono font-bold text-gray-600">
          <span>By: {project.builders.join(', ')}</span>
        </div>

        <PlayfulButton
          href={project.repoUrl || 'https://github.com/SiddheshCodes4554/ATC_WEBSITE'}
          variant="primary"
          size="sm"
          icon={<ArrowUpRight className="w-4 h-4 text-[#121316] stroke-[3]" />}
        >
          View Repo ↗
        </PlayfulButton>
      </div>

    </div>
  );
};
