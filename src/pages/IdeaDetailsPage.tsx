import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Layers,
  Code2,
  ExternalLink,
  Globe,
  Link2,
  Loader2,
  AlertCircle,
  Sparkles,
  Edit3,
} from 'lucide-react';
import { ProjectIdeaService } from '../services/projectIdeaService';
import { ProjectIdea, parseLinks } from '../types/projectIdea.types';
import { IdeaStatusBadge } from '../components/ideas/IdeaStatusBadge';
import { SafeHtmlRenderer } from '../components/common/SafeHtmlRenderer';
import { useAuth } from '../context/AuthContext';

// Simple Inline Icons for GitHub & Figma
const GithubIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const FigmaIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5z" />
    <path d="M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2z" />
    <path d="M12 12.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 1 1-7 0z" />
    <path d="M5 19.5A3.5 3.5 0 0 1 8.5 16H12v3.5a3.5 3.5 0 1 1-7 0z" />
    <path d="M5 12.5A3.5 3.5 0 0 1 8.5 9H12v7H8.5A3.5 3.5 0 0 1 5 12.5z" />
  </svg>
);

export const IdeaDetailsPage: React.FC = () => {
  const { ideaId } = useParams<{ ideaId: string }>();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

  const [idea, setIdea] = useState<ProjectIdea | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ideaId) {
      setError('Idea ID is missing.');
      setLoading(false);
      return;
    }

    const fetchIdea = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await ProjectIdeaService.getIdeaById(ideaId, user?.$id, isAdmin);
        if (!res.success || !res.data) {
          setError(res.error || 'This project idea could not be found or is not available publicly.');
        } else {
          setIdea(res.data);
        }
      } catch (err: any) {
        console.error('Error fetching idea details:', err);
        setError(err?.message || 'Failed to load project idea.');
      } finally {
        setLoading(false);
      }
    };

    fetchIdea();
  }, [ideaId, user?.$id, isAdmin]);

  const isOwner = user?.$id && idea?.userId === user.$id;
  const techList = idea?.technologies
    ? idea.technologies.split(',').map((t) => t.trim()).filter(Boolean)
    : [];
  const links = idea ? parseLinks(idea.links) : {};

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-[#121316] paper-pattern pb-20 select-none">
      {/* Header Back Navigation */}
      <div className="bg-white border-b-3 border-[#121316] py-4">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link
            to="/ideas"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF7F0] hover:bg-[#FFE600] border-2 border-[#121316] font-mono text-xs font-black uppercase text-[#121316] shadow-pop-xs transition-all"
          >
            <ArrowLeft className="w-4 h-4 stroke-[3]" />
            <span>Back to Idea Hub</span>
          </Link>

          {isOwner && idea && (
            <Link
              to={`/student/ideas/${idea.$id}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FFE600] border-2 border-[#121316] font-mono text-xs font-black uppercase text-[#121316] shadow-pop-xs hover:shadow-pop transition-all"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Manage in My Dashboard</span>
            </Link>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {loading ? (
          <div className="py-24 text-center space-y-4">
            <Loader2 className="w-12 h-12 text-[#6C5CE7] animate-spin mx-auto" />
            <p className="font-mono text-sm font-black text-[#121316]">
              Loading Project Idea Details...
            </p>
          </div>
        ) : error || !idea ? (
          <div className="p-8 rounded-3xl bg-white border-3 border-[#121316] shadow-pop max-w-lg mx-auto text-center space-y-4">
            <AlertCircle className="w-12 h-12 text-[#FF4757] mx-auto" />
            <div className="space-y-1">
              <h2 className="text-xl font-black text-[#121316]">
                Idea Not Found
              </h2>
              <p className="text-xs font-bold text-gray-600">
                {error || 'This project idea does not exist or has been made private.'}
              </p>
            </div>
            <Link
              to="/ideas"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FFE600] border-2 border-[#121316] font-mono text-xs font-black uppercase shadow-pop-sm hover:shadow-pop transition-all"
            >
              <ArrowLeft className="w-4 h-4 stroke-[3]" />
              <span>Return to Idea Hub</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Top Info Banner Card */}
            <div className="bg-white rounded-3xl border-3 border-[#121316] p-6 sm:p-8 shadow-pop space-y-6">
              {/* Category & Status */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-[#121316]/10 pb-4">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-[#FAF7F0] border-2 border-[#121316] font-mono text-xs font-black uppercase text-[#6C5CE7] flex items-center gap-1.5 shadow-pop-xs">
                    <Layers className="w-3.5 h-3.5" />
                    {idea.category || 'General Innovation'}
                  </span>
                  {idea.status === 'approved' && (
                    <span className="px-3 py-1 rounded-full bg-[#2ED573] border-2 border-[#121316] font-mono text-xs font-black uppercase text-[#121316] flex items-center gap-1 shadow-pop-xs">
                      <Sparkles className="w-3.5 h-3.5" />
                      OFFICIAL ATC PROJECT CANDIDATE
                    </span>
                  )}
                </div>

                <IdeaStatusBadge status={idea.status} size="md" />
              </div>

              {/* Title & Short Description */}
              <div className="space-y-3">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#121316] tracking-tight leading-tight">
                  {idea.title}
                </h1>
                <p className="text-base sm:text-lg font-bold text-gray-700 leading-relaxed">
                  {idea.shortDescription}
                </p>
              </div>

              {/* Metadata Ribbons: Technologies & Links */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {/* Tech Stack */}
                <div className="p-4 rounded-2xl bg-[#FAF7F0] border-2 border-[#121316] space-y-2">
                  <span className="font-mono text-[11px] font-black uppercase text-gray-500 flex items-center gap-1.5">
                    <Code2 className="w-3.5 h-3.5 text-[#6C5CE7]" />
                    Target Technologies / Tools
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {techList.length > 0 ? (
                      techList.map((tech, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-white border border-[#121316] font-mono text-xs font-bold text-[#121316] shadow-pop-xs"
                        >
                          #{tech}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-gray-400 font-bold">No specific tech specified</span>
                    )}
                  </div>
                </div>

                {/* Project Links */}
                <div className="p-4 rounded-2xl bg-[#FAF7F0] border-2 border-[#121316] space-y-2">
                  <span className="font-mono text-[11px] font-black uppercase text-gray-500 flex items-center gap-1.5">
                    <Link2 className="w-3.5 h-3.5 text-[#2ED573]" />
                    Resources & Links
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    {links.github && (
                      <a
                        href={links.github}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-gray-100 border-2 border-[#121316] font-mono text-xs font-black text-[#121316] shadow-pop-xs"
                      >
                        <GithubIcon className="w-3.5 h-3.5" />
                        <span>GitHub</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    {links.demo && (
                      <a
                        href={links.demo}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FFE600] hover:bg-[#FFD32A] border-2 border-[#121316] font-mono text-xs font-black text-[#121316] shadow-pop-xs"
                      >
                        <Globe className="w-3.5 h-3.5" />
                        <span>Live Demo</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    {links.figma && (
                      <a
                        href={links.figma}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#E1DCFF] hover:bg-[#d0c7ff] border-2 border-[#121316] font-mono text-xs font-black text-[#6C5CE7] shadow-pop-xs"
                      >
                        <FigmaIcon className="w-3.5 h-3.5" />
                        <span>Design / Figma</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    {links.other && (
                      <a
                        href={links.other}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-gray-100 border-2 border-[#121316] font-mono text-xs font-black text-[#121316] shadow-pop-xs"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>External Link</span>
                      </a>
                    )}
                    {!links.github && !links.demo && !links.figma && !links.other && (
                      <span className="text-xs text-gray-400 font-bold">No external links attached yet</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Timestamp Footer */}
              <div className="flex items-center justify-between text-xs font-mono font-bold text-gray-500 pt-2 border-t border-[#121316]/10">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  Proposed on {new Date(idea.$createdAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
                <span>ATC Project Hub</span>
              </div>
            </div>

            {/* Main Proposal Content / Longtext Documentation */}
            <div className="bg-white rounded-3xl border-3 border-[#121316] p-6 sm:p-8 shadow-pop space-y-4">
              <div className="flex items-center gap-2 border-b-2 border-[#121316]/10 pb-3">
                <div className="w-8 h-8 rounded-xl bg-[#FFE600] border-2 border-[#121316] flex items-center justify-center font-black text-sm">
                  📝
                </div>
                <h2 className="text-xl font-black text-[#121316]">
                  Detailed Proposal & Implementation Plan
                </h2>
              </div>

              <div className="pt-2">
                <SafeHtmlRenderer html={idea.content} />
              </div>
            </div>

            {/* Bottom Callout / Discussion CTA */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#6C5CE7] text-white border-3 border-[#121316] shadow-pop flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1 max-w-xl">
                <h3 className="text-xl font-black">
                  Interested in Collaborating on This Idea?
                </h3>
                <p className="text-xs sm:text-sm font-bold text-[#E1DCFF] leading-relaxed">
                  Join ATC Lab 5.0 sessions to meet the creators, brainstorm architecture, and request club hardware components!
                </p>
              </div>

              <Link
                to="/lab-access"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#FFE600] hover:bg-[#FFD32A] text-[#121316] font-mono text-xs font-black uppercase border-2 border-[#121316] shadow-pop-sm flex-shrink-0 transition-all"
              >
                <span>Book Lab Workbench</span>
                <ArrowLeft className="w-4 h-4 rotate-180 stroke-[3]" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IdeaDetailsPage;
