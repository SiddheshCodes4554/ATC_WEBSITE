import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowUpRight, FolderGit2, Star, Layers, Loader2 } from 'lucide-react';
import { SparkleDoodle } from '../doodles/DoodleSvgs';
import { PlayfulButton } from '../ui/PlayfulButton';
import { ProjectService } from '../../services/projectService';
import { StorageService } from '../../services/storage.service';
import { ATCProject } from '../../types/project.types';
import { Link } from 'react-router-dom';

export const ProjectsSection: React.FC = () => {
  const [projects, setProjects] = useState<ATCProject[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        const result = await ProjectService.getPublishedProjects({ limit: 4, order: 'asc' });
        if (result.success && result.data) {
          setProjects(result.data);
        }
      } catch (err) {
        console.error('Error fetching home projects:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  return (
    <section className="relative bg-[#FAF7F0] py-20 paper-pattern border-b-4 border-[#121316] overflow-hidden">
      {/* Background Doodles */}
      <div className="absolute top-10 right-10 opacity-40 pointer-events-none hidden md:block">
        <SparkleDoodle className="w-10 h-10" color="#6C5CE7" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="relative inline-block">
            <div className="inline-flex items-center gap-2 px-7 py-2.5 rounded-full bg-white border-3 border-[#121316] shadow-pop font-black text-base sm:text-lg tracking-wider uppercase text-[#121316]">
              <Sparkles className="w-5 h-5 text-[#2E86DE]" />
              FEATURED PROJECTS
            </div>

            <div className="absolute -right-10 -bottom-4 hidden sm:block">
              <SparkleDoodle className="w-8 h-8" color="#FFD32A" />
            </div>
          </div>

          <p className="mt-4 text-base sm:text-xl text-gray-700 max-w-xl font-medium">
            Ideas turned into code, hardware prototypes, and real-world impact:
          </p>
        </div>

        {/* Dynamic Invention Board Grid or Empty State */}
        {loading ? (
          <div className="p-12 rounded-[36px] bg-white border-4 border-[#121316] shadow-pop flex flex-col items-center justify-center gap-3 text-center">
            <Loader2 className="w-8 h-8 text-[#FF793F] animate-spin" />
            <p className="font-mono text-xs font-bold text-gray-500">Loading student builds...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="max-w-3xl mx-auto p-8 sm:p-12 rounded-[40px] bg-white border-4 border-[#121316] shadow-pop-lg text-center space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-[#FFE600] border-3 border-[#121316] shadow-pop flex items-center justify-center mx-auto">
              <FolderGit2 className="w-7 h-7 text-[#121316]" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-[#121316]">
                First Cohort Builds Under Incubation
              </h3>
              <p className="text-sm font-bold text-gray-600 max-w-lg mx-auto">
                ATC Lab 5.0 members are currently prototyping autonomous rovers and AI vision systems. Be the first build on this wall!
              </p>
            </div>
            <div className="pt-2 flex justify-center gap-3">
              <PlayfulButton to="/projects" variant="primary" size="md">
                <span>Submit Your Build</span>
                <ArrowUpRight className="w-4 h-4 stroke-[3]" />
              </PlayfulButton>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {projects.map((project, idx) => {
              const coverUrl = project.coverImageId
                ? StorageService.getProjectImageUrl(project.coverImageId, 600)
                : '';
              const bgColors = ['bg-[#FFF9DB]', 'bg-[#F0EBFF]', 'bg-[#E3FAEE]', 'bg-[#FFEBF2]'];
              const cardBg = bgColors[idx % bgColors.length];

              return (
                <div
                  key={project.$id}
                  className={`group relative p-6 sm:p-8 rounded-[36px] border-4 border-[#121316] shadow-pop-lg hover:shadow-pop-xl transition-all duration-200 flex flex-col justify-between ${cardBg}`}
                >
                  <div>
                    {/* Top Meta: Badge */}
                    <div className="flex items-center justify-between mb-4">
                      {project.featured ? (
                        <span className="text-[10px] font-mono font-black px-3 py-1 rounded-full border-2 border-[#121316] shadow-pop-sm uppercase bg-[#FFE600] text-[#121316] flex items-center gap-1">
                          <Star className="w-3 h-3 fill-[#121316]" /> FEATURED
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono font-black px-3 py-1 rounded-full border-2 border-[#121316] shadow-pop-sm uppercase bg-[#2ED573] text-[#121316]">
                          ● ATC BUILD #{project.displayOrder}
                        </span>
                      )}
                      <span className="text-xs font-mono font-bold text-gray-500">
                        LAB 5.0
                      </span>
                    </div>

                    {/* Cover Image */}
                    {coverUrl && (
                      <Link
                        to={`/projects/${project.slug}`}
                        className="block w-full h-48 rounded-2xl border-2 border-[#121316] overflow-hidden bg-white/70 shadow-inner mb-5 group-hover:scale-[1.01] transition-transform"
                      >
                        <img
                          src={coverUrl}
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                      </Link>
                    )}

                    {/* Content */}
                    <div className="space-y-2 mb-4">
                      <Link
                        to={`/projects/${project.slug}`}
                        className="text-2xl sm:text-3xl font-black text-[#121316] tracking-tight hover:text-[#FF793F] transition-colors line-clamp-1 block"
                      >
                        {project.title}
                      </Link>
                      <p className="text-sm font-bold text-gray-700 leading-relaxed line-clamp-2">
                        {project.shortDescription}
                      </p>

                      {/* Tech Tags */}
                      {project.techStack.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-2">
                          {project.techStack.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="px-2.5 py-0.5 rounded-lg bg-white border border-[#121316] font-mono text-xs font-bold text-[#121316] shadow-pop-sm"
                            >
                              #{tag}
                            </span>
                          ))}
                          {project.techStack.length > 3 && (
                            <span className="px-2 py-0.5 rounded-lg bg-white/70 font-mono text-xs font-bold text-gray-500">
                              +{project.techStack.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bottom Action CTA */}
                  <div className="pt-4 border-t-2 border-[#121316]/20 flex items-center justify-between">
                    <PlayfulButton
                      to={`/projects/${project.slug}`}
                      variant="primary"
                      size="sm"
                      icon={<ArrowUpRight className="w-4 h-4 text-[#121316] stroke-[3]" />}
                    >
                      View Details
                    </PlayfulButton>

                    <span className="text-xs font-hand font-bold text-gray-600">
                      Student build ⚡
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* View All Projects Button */}
        <div className="mt-14 flex justify-center">
          <PlayfulButton
            to="/projects"
            variant="dark"
            size="lg"
            icon={<ArrowUpRight className="w-5 h-5 text-yellow-300 stroke-[3]" />}
          >
            Explore All Projects ↗
          </PlayfulButton>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
