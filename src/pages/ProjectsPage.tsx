import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ProjectsHero } from '../components/projects/ProjectsHero';
import { SubmitProjectModal } from '../components/projects/SubmitProjectModal';
import { ProjectService } from '../services/projectService';
import { StorageService } from '../services/storage.service';
import { ATCProject } from '../types/project.types';
import {
  Sparkles,
  Plus,
  Rocket,
  Search,
  ExternalLink,
  Globe,
  Star,
  Layers,
  ArrowUpRight,
  Loader2,
  FolderGit2,
} from 'lucide-react';
import { SparkleDoodle, RetroRobotMascot } from '../components/doodles/DoodleSvgs';
import { PlayfulButton } from '../components/ui/PlayfulButton';

const GithubIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export const ProjectsPage: React.FC = () => {
  const [currentStage, setCurrentStage] = useState<string>('idea');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  // Appwrite Dynamic Projects State
  const [projects, setProjects] = useState<ATCProject[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTech, setSelectedTech] = useState<string>('All');

  useEffect(() => {
    const fetchPublishedProjects = async () => {
      try {
        setLoading(true);
        const result = await ProjectService.getPublishedProjects({ limit: 50, order: 'asc' });
        if (result.success && result.data) {
          setProjects(result.data);
        }
      } catch (err) {
        console.error('Error fetching published projects from Appwrite:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPublishedProjects();
  }, []);

  // Compute unique tech stack tags across all published projects
  const allTechTags = Array.from(
    new Set(projects.flatMap((p) => p.techStack))
  ).slice(0, 10);

  // Filter projects by search and tech tag
  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.techStack.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesTech =
      selectedTech === 'All' || p.techStack.includes(selectedTech);

    return matchesSearch && matchesTech;
  });

  const featuredProjects = filteredProjects.filter((p) => p.featured);
  const regularProjects = filteredProjects.filter((p) => !p.featured);

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF7F0]">
      {/* 1. HERO SECTION WITH PROCESS TRACKER */}
      <ProjectsHero
        currentStage={currentStage}
        onStageChange={(stage) => setCurrentStage(stage)}
        onSubmitClick={() => setIsSubmitModalOpen(true)}
      />

      {/* 2. DYNAMIC PROJECTS DIRECTORY OR EMPTY STATE */}
      <section className="relative py-16 paper-pattern border-b-4 border-[#121316] overflow-hidden">
        {/* Background Doodles */}
        <div className="absolute top-10 left-10 opacity-40 pointer-events-none hidden md:block">
          <SparkleDoodle className="w-12 h-12" color="#FF793F" />
        </div>
        <div className="absolute bottom-10 right-10 opacity-40 pointer-events-none hidden md:block">
          <SparkleDoodle className="w-14 h-14" color="#6C5CE7" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
          {loading ? (
            <div className="p-16 rounded-[44px] bg-white border-4 border-[#121316] shadow-pop-xl text-center flex flex-col items-center justify-center gap-4 max-w-2xl mx-auto">
              <Loader2 className="w-10 h-10 text-[#FF793F] animate-spin" />
              <p className="font-mono text-sm font-black text-[#121316]">
                Loading student projects from Appwrite...
              </p>
            </div>
          ) : projects.length === 0 ? (
            /* EMPTY STATE: "NO PROJECTS YET / INVENTIONS UNDER COOKING" */
            <div className="max-w-5xl mx-auto">
              <div className="p-8 sm:p-14 rounded-[44px] bg-white border-4 border-[#121316] shadow-pop-xl text-center flex flex-col items-center justify-center space-y-6 relative overflow-hidden">
                {/* Top Classified / Under Cooking Stamp */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFF9DB] text-[#121316] font-mono font-black text-xs uppercase border-2 border-[#121316] shadow-pop-sm rotate-[-2deg]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF4757] animate-ping" />
                  ⚡ INVENTIONS IN THE OVEN • COHORT 2026
                </div>

                {/* Mascot & Illustrated Blueprint */}
                <div className="relative my-4">
                  <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-[#FFE600] border-4 border-[#121316] shadow-pop-lg flex items-center justify-center animate-wiggle">
                    <RetroRobotMascot className="w-20 sm:w-24 h-auto" />
                  </div>

                  <div className="absolute -top-3 -right-8 sm:-right-12 px-3 py-1.5 bg-[#FFD9E8] rounded-xl border-2 border-[#121316] shadow-pop-sm text-xs font-hand font-bold text-[#121316] rotate-6 hidden sm:block">
                    "Soldering in progress! 🛠️"
                  </div>
                </div>

                {/* Heading & Subtitle */}
                <div className="space-y-3 max-w-2xl">
                  <h2 className="text-3xl sm:text-5xl font-black text-[#121316] tracking-tight leading-tight">
                    NO PROJECTS YET.<br />
                    <span className="text-[#FF793F]">SOMETHING BIG</span> IS BEING BUILT.
                  </h2>

                  <p className="text-base sm:text-lg font-bold text-gray-700 leading-relaxed">
                    ATC Lab 5.0 student builders are currently engineering our first batch of autonomous rovers, edge AI vision models, and IoT telemetry stations.
                  </p>
                </div>

                {/* 3 Steps */}
                <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-left">
                  <div className="p-5 rounded-3xl bg-[#FAF7F0] border-3 border-[#121316] shadow-pop-sm space-y-1">
                    <span className="w-7 h-7 rounded-xl bg-[#FFE600] border border-[#121316] font-mono text-xs font-black flex items-center justify-center">
                      01
                    </span>
                    <h4 className="font-black text-sm text-[#121316]">Got a Hardware Idea?</h4>
                    <p className="text-xs font-bold text-gray-600">
                      From PCB prototypes to autonomous drone software.
                    </p>
                  </div>

                  <div className="p-5 rounded-3xl bg-[#FAF7F0] border-3 border-[#121316] shadow-pop-sm space-y-1">
                    <span className="w-7 h-7 rounded-xl bg-[#6C5CE7] text-white border border-[#121316] font-mono text-xs font-black flex items-center justify-center">
                      02
                    </span>
                    <h4 className="font-black text-sm text-[#121316]">Get Lab 5.0 Grants</h4>
                    <p className="text-xs font-bold text-gray-600">
                      Access compute, 3D printing & component funding.
                    </p>
                  </div>

                  <div className="p-5 rounded-3xl bg-[#FAF7F0] border-3 border-[#121316] shadow-pop-sm space-y-1">
                    <span className="w-7 h-7 rounded-xl bg-[#2ED573] border border-[#121316] font-mono text-xs font-black flex items-center justify-center">
                      03
                    </span>
                    <h4 className="font-black text-sm text-[#121316]">Be Featured #01</h4>
                    <p className="text-xs font-bold text-gray-600">
                      Your build will be the inaugural project on this wall!
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-6 flex flex-wrap items-center justify-center gap-4">
                  <PlayfulButton
                    onClick={() => setIsSubmitModalOpen(true)}
                    variant="primary"
                    size="lg"
                    withConfetti
                    icon={<Plus className="w-5 h-5 stroke-[3]" />}
                  >
                    Submit Your Project
                  </PlayfulButton>

                  <PlayfulButton
                    to="/lab"
                    variant="secondary"
                    size="lg"
                    icon={<ArrowUpRight className="w-5 h-5 stroke-[3]" />}
                  >
                    Explore ATC Lab 5.0
                  </PlayfulButton>
                </div>
              </div>
            </div>
          ) : (
            /* DYNAMIC SHOWCASE OF PUBLISHED APPRWRITE PROJECTS */
            <div className="space-y-14">
              {/* Search & Filter Bar */}
              <div className="p-4 rounded-3xl bg-white border-3 border-[#121316] shadow-pop flex flex-col md:flex-row items-center justify-between gap-4">
                {/* Tech Chips */}
                <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
                  <button
                    onClick={() => setSelectedTech('All')}
                    className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-black border-2 border-[#121316] transition-all cursor-pointer whitespace-nowrap ${
                      selectedTech === 'All'
                        ? 'bg-[#121316] text-white shadow-pop-sm'
                        : 'bg-[#FAF7F0] text-[#121316] hover:bg-[#FFE8D6]'
                    }`}
                  >
                    All ({projects.length})
                  </button>
                  {allTechTags.map((tech) => (
                    <button
                      key={tech}
                      onClick={() => setSelectedTech(tech)}
                      className={`px-3 py-1.5 rounded-xl font-mono text-xs font-black border-2 border-[#121316] transition-all cursor-pointer whitespace-nowrap ${
                        selectedTech === tech
                          ? 'bg-[#121316] text-white shadow-pop-sm'
                          : 'bg-[#FAF7F0] text-[#121316] hover:bg-[#FFE8D6]'
                      }`}
                    >
                      #{tech}
                    </button>
                  ))}
                </div>

                {/* Search */}
                <div className="relative w-full md:w-72">
                  <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search projects or stack..."
                    className="w-full pl-10 pr-4 py-2 rounded-2xl bg-[#FAF7F0] border-2 border-[#121316] text-xs font-bold text-[#121316] placeholder-gray-400 focus:outline-none focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* FEATURED PROJECTS SHOWCASE (IF ANY) */}
              {featuredProjects.length > 0 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-xl bg-[#FFE600] border-2 border-[#121316] shadow-pop-sm flex items-center justify-center">
                      <Star className="w-4 h-4 fill-[#121316]" />
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-black text-[#121316] tracking-tight">
                      Featured Flagship Builds
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {featuredProjects.map((proj) => {
                      const coverUrl = proj.coverImageId
                        ? StorageService.getProjectImageUrl(proj.coverImageId, 800)
                        : '';
                      return (
                        <div
                          key={proj.$id}
                          className="p-8 sm:p-10 rounded-[40px] bg-white border-4 border-[#121316] shadow-pop-xl hover:shadow-pop-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between relative group"
                        >
                          <div className="tape-strip pointer-events-none" />

                          <div className="space-y-5">
                            {/* Top Badge */}
                            <div className="flex items-center justify-between">
                              <span className="px-3 py-1 rounded-full bg-[#FFE600] border-2 border-[#121316] font-mono text-xs font-black uppercase text-[#121316] flex items-center gap-1 shadow-pop-sm">
                                <Star className="w-3 h-3 fill-[#121316]" /> FEATURED
                              </span>
                              <span className="font-mono text-xs font-bold text-gray-500 bg-[#FAF7F0] px-2.5 py-0.5 rounded-lg border border-[#121316]/20">
                                #{proj.displayOrder}
                              </span>
                            </div>

                            {/* Cover Image */}
                            {coverUrl && (
                              <Link
                                to={`/projects/${proj.slug}`}
                                className="block w-full h-56 sm:h-64 rounded-[28px] border-3 border-[#121316] overflow-hidden bg-gray-100 shadow-pop-sm group-hover:scale-[1.01] transition-transform"
                              >
                                <img
                                  src={coverUrl}
                                  alt={proj.title}
                                  className="w-full h-full object-cover"
                                />
                              </Link>
                            )}

                            {/* Title & Description */}
                            <div className="space-y-2">
                              <Link
                                to={`/projects/${proj.slug}`}
                                className="text-2xl sm:text-3xl font-black text-[#121316] tracking-tight hover:text-[#FF793F] transition-colors line-clamp-2"
                              >
                                {proj.title}
                              </Link>
                              <p className="text-sm sm:text-base font-bold text-gray-700 leading-relaxed line-clamp-3">
                                {proj.shortDescription}
                              </p>
                            </div>

                            {/* Tech Stack */}
                            {proj.techStack.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 pt-1">
                                {proj.techStack.map((t) => (
                                  <span
                                    key={t}
                                    className="px-2.5 py-1 rounded-xl bg-[#FAF7F0] border border-[#121316] font-mono text-xs font-bold text-[#121316] shadow-pop-sm"
                                  >
                                    #{t}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Footer Action Links */}
                          <div className="pt-6 mt-6 border-t-2 border-[#121316]/10 flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              {proj.githubUrl && (
                                <a
                                  href={proj.githubUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 border border-[#121316] text-[#121316] transition-colors"
                                  title="GitHub Source"
                                >
                                  <GithubIcon className="w-4 h-4" />
                                </a>
                              )}
                              {proj.liveUrl && (
                                <a
                                  href={proj.liveUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="p-2 rounded-xl bg-[#E8F8F0] hover:bg-[#2ED573] border border-[#121316] text-[#121316] transition-colors"
                                  title="Live Demo"
                                >
                                  <Globe className="w-4 h-4" />
                                </a>
                              )}
                            </div>

                            <Link
                              to={`/projects/${proj.slug}`}
                              className="px-5 py-2.5 rounded-full bg-[#FFE600] hover:bg-[#FFD32A] border-2 border-[#121316] shadow-pop font-mono text-xs font-black text-[#121316] flex items-center gap-1.5 transition-all"
                            >
                              <span>Explore Project</span>
                              <ArrowUpRight className="w-4 h-4 stroke-[3]" />
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ALL PROJECTS GRID */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl sm:text-3xl font-black text-[#121316] tracking-tight">
                    All Inventions ({filteredProjects.length})
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
                  {filteredProjects.map((proj, idx) => {
                    const coverUrl = proj.coverImageId
                      ? StorageService.getProjectImageUrl(proj.coverImageId, 600)
                      : '';
                    return (
                      <div
                        key={proj.$id}
                        className="p-6 sm:p-7 rounded-[36px] bg-white border-4 border-[#121316] shadow-pop hover:shadow-pop-lg hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group"
                      >
                        <div className="space-y-4">
                          {/* Cover Image */}
                          {coverUrl ? (
                            <Link
                              to={`/projects/${proj.slug}`}
                              className="block w-full h-44 rounded-2xl border-2 border-[#121316] overflow-hidden bg-gray-100"
                            >
                              <img
                                src={coverUrl}
                                alt={proj.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </Link>
                          ) : (
                            <div className="w-full h-32 rounded-2xl border-2 border-[#121316]/20 bg-[#FAF7F0] flex items-center justify-center">
                              <FolderGit2 className="w-8 h-8 text-gray-400" />
                            </div>
                          )}

                          {/* Title & Short Description */}
                          <div className="space-y-1.5">
                            <Link
                              to={`/projects/${proj.slug}`}
                              className="text-xl font-black text-[#121316] tracking-tight hover:text-[#FF793F] transition-colors line-clamp-1 block"
                            >
                              {proj.title}
                            </Link>
                            <p className="text-xs font-bold text-gray-600 line-clamp-2 leading-relaxed">
                              {proj.shortDescription}
                            </p>
                          </div>

                          {/* Tech Stack Chips */}
                          {proj.techStack.length > 0 && (
                            <div className="flex flex-wrap gap-1 pt-1">
                              {proj.techStack.slice(0, 3).map((t) => (
                                <span
                                  key={t}
                                  className="px-2 py-0.5 rounded-lg bg-[#FAF7F0] border border-[#121316]/20 font-mono text-[10px] font-bold text-gray-700"
                                >
                                  #{t}
                                </span>
                              ))}
                              {proj.techStack.length > 3 && (
                                <span className="px-1.5 py-0.5 rounded-lg bg-gray-100 font-mono text-[10px] font-bold text-gray-500">
                                  +{proj.techStack.length - 3}
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Footer Link */}
                        <div className="pt-4 mt-4 border-t border-[#121316]/10 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {proj.githubUrl && (
                              <a
                                href={proj.githubUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-gray-500 hover:text-[#121316] transition-colors"
                                title="Source code"
                              >
                                <GithubIcon className="w-4 h-4" />
                              </a>
                            )}
                            {proj.liveUrl && (
                              <a
                                href={proj.liveUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-gray-500 hover:text-[#2ED573] transition-colors"
                                title="Live Demo"
                              >
                                <Globe className="w-4 h-4" />
                              </a>
                            )}
                          </div>

                          <Link
                            to={`/projects/${proj.slug}`}
                            className="font-mono text-xs font-black text-[#121316] group-hover:text-[#FF793F] flex items-center gap-1 transition-colors"
                          >
                            <span>Details</span>
                            <ArrowUpRight className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* SUBMIT PROJECT PITCH MODAL */}
      <SubmitProjectModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
      />
    </div>
  );
};

export default ProjectsPage;
