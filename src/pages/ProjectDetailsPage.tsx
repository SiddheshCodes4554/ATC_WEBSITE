import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ProjectService } from '../services/projectService';
import { StorageService } from '../services/storage.service';
import { ATCProject } from '../types/project.types';
import {
  ArrowLeft,
  Globe,
  Star,
  Share2,
  Check,
  Calendar,
  Layers,
  Sparkles,
  AlertCircle,
  Loader2,
  FolderGit2,
  ExternalLink,
  ArrowUpRight,
  Image as ImageIcon,
  X,
  Maximize2,
} from 'lucide-react';
import { PlayfulButton } from '../components/ui/PlayfulButton';

const GithubIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export const ProjectDetailsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const [project, setProject] = useState<ATCProject | null>(null);
  const [otherProjects, setOtherProjects] = useState<ATCProject[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadProject = async () => {
      if (!slug) {
        setError('Missing project slug.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const result = await ProjectService.getProjectBySlug(slug);

        if (!isMounted) return;

        if (result.success && result.data) {
          // Check if published or admin view
          setProject(result.data);

          // Fetch other published projects for recommendations
          const othersRes = await ProjectService.getPublishedProjects({ limit: 4 });
          if (isMounted && othersRes.success && othersRes.data) {
            setOtherProjects(othersRes.data.filter((p) => p.slug !== slug).slice(0, 3));
          }
        } else {
          setError(result.error || 'Project not found.');
          setProject(null);
        }
      } catch (err: any) {
        console.error('Error fetching project details:', err);
        if (isMounted) {
          setError(err?.message || 'Failed to load project.');
          setProject(null);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadProject();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center p-8 text-center bg-[#FAF7F0] paper-pattern select-none">
        <div className="p-8 rounded-[36px] bg-white border-4 border-[#121316] shadow-pop-lg flex flex-col items-center gap-4 max-w-sm">
          <div className="w-14 h-14 rounded-2xl bg-[#FFE600] border-3 border-[#121316] shadow-pop-sm flex items-center justify-center animate-bounce">
            <FolderGit2 className="w-8 h-8 text-[#121316]" />
          </div>
          <div>
            <h3 className="font-black text-xl text-[#121316] tracking-tight">Loading Project</h3>
            <p className="font-mono text-xs font-bold text-gray-600 mt-1">
              Retrieving build details from Appwrite...
            </p>
          </div>
          <Loader2 className="w-6 h-6 text-[#FF793F] animate-spin mt-2" />
        </div>
      </div>
    );
  }

  // Not Found State
  if (!project || error) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center p-6 text-center bg-[#FAF7F0] paper-pattern select-none">
        <div className="max-w-md w-full p-8 sm:p-10 rounded-[36px] bg-white border-4 border-[#121316] shadow-pop-xl space-y-5">
          <div className="w-16 h-16 rounded-3xl bg-[#FFE5E5] border-3 border-[#121316] shadow-pop flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8 text-[#FF4757]" />
          </div>

          <div className="space-y-2">
            <span className="px-3 py-0.5 rounded-full bg-[#FAF7F0] border border-[#121316] font-mono text-[10px] font-black uppercase text-gray-600">
              404 • NOT FOUND
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#121316] tracking-tight">
              Project Not Found
            </h2>
            <p className="text-xs sm:text-sm font-bold text-gray-600 leading-relaxed">
              We couldn't find any published project matching <span className="text-[#FF793F] font-mono font-black">"{slug}"</span>.
            </p>
          </div>

          <div className="pt-3">
            <PlayfulButton to="/projects" variant="primary" size="md">
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Browse All Projects
            </PlayfulButton>
          </div>
        </div>
      </div>
    );
  }

  const coverUrl = project.coverImageId
    ? StorageService.getProjectImageUrl(project.coverImageId, 1200)
    : '';

  return (
    <div className="min-h-screen bg-[#FAF7F0] py-12 sm:py-16 paper-pattern">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Navigation & Breadcrumbs */}
        <div className="flex items-center justify-between gap-4">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border-2 border-[#121316] shadow-pop-sm font-mono text-xs font-black text-[#121316] hover:bg-[#FFE600] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>All Projects</span>
          </Link>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-white border-2 border-[#121316] shadow-pop-sm font-mono text-xs font-black text-[#121316] hover:bg-gray-100 transition-all cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-[#2ED573]" />
                <span className="text-[#2ED573]">Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </>
            )}
          </button>
        </div>

        {/* HERO SECTION */}
        <div className="p-8 sm:p-12 rounded-[44px] bg-white border-4 border-[#121316] shadow-pop-xl relative overflow-hidden space-y-8">
          {/* Tape Accent */}
          <div className="tape-strip pointer-events-none" />

          {/* Top Badges */}
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-3.5 py-1 rounded-full bg-[#FFE8D6] text-[#FF793F] font-mono text-xs font-black uppercase border-2 border-[#121316] shadow-pop-sm">
              🛠️ ATC LAB 5.0 BUILD
            </span>

            {project.featured && (
              <span className="px-3 py-1 rounded-full bg-[#FFE600] text-[#121316] font-mono text-xs font-black uppercase border-2 border-[#121316] shadow-pop-sm flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-[#121316]" /> FEATURED PROJECT
              </span>
            )}
          </div>

          {/* Title & Short Description */}
          <div className="space-y-4 max-w-3xl">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#121316] tracking-tight leading-tight">
              {project.title}
            </h1>
            <p className="text-base sm:text-xl font-bold text-gray-700 leading-relaxed">
              {project.shortDescription}
            </p>
          </div>

          {/* Action Links Bar */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3 rounded-2xl bg-[#121316] text-white hover:bg-gray-800 font-mono text-xs font-black border-2 border-[#121316] shadow-pop hover:shadow-pop-lg active:translate-x-[1px] active:translate-y-[1px] flex items-center gap-2 transition-all"
              >
                <GithubIcon className="w-4 h-4" />
                <span>View Source Code</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            )}

            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3 rounded-2xl bg-[#FFE600] text-[#121316] hover:bg-[#FFD32A] font-mono text-xs font-black border-2 border-[#121316] shadow-pop hover:shadow-pop-lg active:translate-x-[1px] active:translate-y-[1px] flex items-center gap-2 transition-all"
              >
                <Globe className="w-4 h-4" />
                <span>Open Live Demo</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

          {/* Cover Image Frame */}
          {coverUrl && (
            <div className="pt-4">
              <div className="w-full max-h-[500px] rounded-[32px] border-4 border-[#121316] overflow-hidden bg-gray-100 shadow-pop-lg">
                <img
                  src={coverUrl}
                  alt={project.title}
                  className="w-full h-full object-cover max-h-[500px]"
                />
              </div>
            </div>
          )}
        </div>

        {/* TECH STACK & SPECIFICATIONS */}
        {project.techStack.length > 0 && (
          <div className="p-8 sm:p-10 rounded-[36px] bg-white border-4 border-[#121316] shadow-pop space-y-6">
            <div className="flex items-center gap-2.5 pb-4 border-b-2 border-[#121316]/10">
              <div className="w-8 h-8 rounded-xl bg-[#6C5CE7] text-white border-2 border-[#121316] flex items-center justify-center font-mono text-xs font-black">
                ⚡
              </div>
              <div>
                <h3 className="font-black text-xl text-[#121316]">Technology Stack</h3>
                <p className="font-mono text-xs text-gray-500 font-bold">
                  Frameworks, languages, firmware and hardware tools used
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-4 py-2 rounded-2xl bg-[#FAF7F0] border-2 border-[#121316] shadow-pop-sm font-mono text-xs font-black text-[#121316] hover:bg-[#FFE600] transition-colors"
                >
                  #{tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* PROJECT STORY & ARCHITECTURE */}
        {project.description && (
          <div className="p-8 sm:p-12 rounded-[44px] bg-white border-4 border-[#121316] shadow-pop-lg space-y-6">
            <div className="flex items-center gap-2.5 pb-4 border-b-2 border-[#121316]/10">
              <div className="w-8 h-8 rounded-xl bg-[#2ED573] text-[#121316] border-2 border-[#121316] flex items-center justify-center font-mono text-xs font-black">
                📖
              </div>
              <div>
                <h3 className="font-black text-xl text-[#121316]">Architecture & Build Story</h3>
                <p className="font-mono text-xs text-gray-500 font-bold">
                  Design rationale, engineering hurdles and key takeaways
                </p>
              </div>
            </div>

            <div className="space-y-4 text-gray-800 text-sm sm:text-base font-medium leading-relaxed">
              {project.description.split('\n\n').map((paragraph, idx) => (
                <p key={idx} className="whitespace-pre-line leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* BUILD PHOTO GALLERY & PROTOTYPE SCRAPBOOK */}
        {project.galleryImageIds && project.galleryImageIds.length > 0 && (
          <div className="p-8 sm:p-12 rounded-[44px] bg-white border-4 border-[#121316] shadow-pop-lg space-y-6">
            <div className="flex items-center justify-between pb-4 border-b-2 border-[#121316]/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#FFE600] text-[#121316] border-2 border-[#121316] flex items-center justify-center font-mono text-xs font-black">
                  📸
                </div>
                <div>
                  <h3 className="font-black text-xl text-[#121316]">
                    Prototype Photos & Build Scrapbook ({project.galleryImageIds.length})
                  </h3>
                  <p className="font-mono text-xs text-gray-500 font-bold">
                    Lab snapshots, hardware soldering, telemetry tests and schematics
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
              {project.galleryImageIds.map((imgId, idx) => {
                const imgUrl = StorageService.getProjectImageUrl(imgId, 800);
                const rotations = ['rotate-[-1.5deg]', 'rotate-[1.5deg]', 'rotate-[-0.5deg]', 'rotate-[2deg]'];
                const cardRotate = rotations[idx % rotations.length];

                return (
                  <div
                    key={imgId}
                    onClick={() => setLightboxImg(StorageService.getProjectImageUrl(imgId, 1600))}
                    className={`p-3.5 rounded-[28px] bg-[#FAF7F0] border-3 border-[#121316] shadow-pop hover:shadow-pop-lg transition-all duration-200 cursor-pointer group hover:scale-[1.02] ${cardRotate}`}
                  >
                    <div className="w-full h-52 rounded-2xl border-2 border-[#121316] overflow-hidden bg-gray-100 relative">
                      <img
                        src={imgUrl}
                        alt={`Build snapshot ${idx + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="px-3.5 py-1.5 rounded-full bg-white border border-[#121316] font-mono text-xs font-black text-[#121316] shadow-pop-sm flex items-center gap-1.5">
                          <Maximize2 className="w-3.5 h-3.5" />
                          <span>View Full Size</span>
                        </span>
                      </div>
                    </div>
                    <div className="pt-2 px-1 flex items-center justify-between text-[11px] font-mono font-bold text-gray-500">
                      <span>BUILD SNAPSHOT #{idx + 1}</span>
                      <span>LAB 5.0</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* MORE STUDENT BUILDS */}
        {otherProjects.length > 0 && (
          <div className="space-y-6 pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-black text-[#121316] tracking-tight">
                  Explore More Projects
                </h3>
                <p className="text-xs sm:text-sm font-bold text-gray-600">
                  Other inventions incubated in ATC Lab 5.0:
                </p>
              </div>

              <Link
                to="/projects"
                className="font-mono text-xs font-black text-[#6C5CE7] hover:underline flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherProjects.map((p) => (
                <Link
                  key={p.$id}
                  to={`/projects/${p.slug}`}
                  className="p-6 rounded-[32px] bg-white border-4 border-[#121316] shadow-pop hover:shadow-pop-lg hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    {p.coverImageId && (
                      <div className="w-full h-32 rounded-2xl border-2 border-[#121316] overflow-hidden bg-gray-100">
                        <img
                          src={StorageService.getProjectImageUrl(p.coverImageId, 400)}
                          alt={p.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                    )}
                    <h4 className="text-lg font-black text-[#121316] group-hover:text-[#FF793F] transition-colors line-clamp-1">
                      {p.title}
                    </h4>
                    <p className="text-xs font-bold text-gray-600 line-clamp-2">
                      {p.shortDescription}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-[#121316]/10 flex items-center justify-between font-mono text-xs font-black text-[#121316]">
                    <span>Read Details</span>
                    <ArrowUpRight className="w-4 h-4 text-[#FF793F]" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* LIGHTBOX MODAL FOR FULL-SIZE IMAGE PREVIEW */}
      {lightboxImg && (
        <div
          onClick={() => setLightboxImg(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8 animate-fadeIn cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-5xl max-h-[90vh] bg-white p-3 rounded-[36px] border-4 border-[#121316] shadow-pop-2xl overflow-hidden cursor-default"
          >
            <button
              onClick={() => setLightboxImg(null)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-white border-2 border-[#121316] shadow-pop-sm text-[#FF4757] hover:bg-[#FFE5E5] transition-all cursor-pointer z-10"
              title="Close Preview"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={lightboxImg}
              alt="Full Preview"
              className="max-h-[80vh] w-auto object-contain rounded-2xl border-2 border-[#121316]"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetailsPage;
