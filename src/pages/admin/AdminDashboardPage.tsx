import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  LogOut, 
  Calendar, 
  Users, 
  FolderGit2, 
  Image, 
  QrCode, 
  ShieldCheck, 
  ExternalLink, 
  Sparkles, 
  Layers, 
  ArrowUpRight,
  Plus,
  Ticket,
  ChevronRight
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const AdminDashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login', { replace: true });
  };

  const adminModules = [
    {
      title: 'Events Management',
      desc: 'Create hackathons, workshops, dynamic forms, update schedules & cover images.',
      icon: <Calendar className="w-6 h-6 text-[#121316]" />,
      badge: 'EVENTS',
      color: 'bg-[#FFF9DB]',
      linkText: 'Manage Events ↗',
      path: '/admin/events',
      isInternal: true,
    },
    {
      title: 'Participant Registrations & Passes',
      desc: 'Live registrations, dynamic form responses, CSV export, digital passes & QR check-in station.',
      icon: <QrCode className="w-6 h-6 text-[#121316]" />,
      badge: 'REGISTRATIONS',
      color: 'bg-[#FFEBF2]',
      linkText: 'Open Registrations ↗',
      path: '/admin/events',
      isInternal: true,
    },
    {
      title: 'Team & Leadership',
      desc: 'Manage President, Vice President & Core Department Heads with image upload & reordering.',
      icon: <Users className="w-6 h-6 text-[#121316]" />,
      badge: 'TEAM',
      color: 'bg-[#F0EBFF]',
      linkText: 'Manage Team ↗',
      path: '/admin/team',
      isInternal: true,
    },
    {
      title: 'Student Projects Showcase',
      desc: 'Showcase student hardware builds, software apps, AI experiments & lab incubations.',
      icon: <FolderGit2 className="w-6 h-6 text-[#121316]" />,
      badge: 'PROJECTS',
      color: 'bg-[#E1F5FE]',
      linkText: 'Explore Projects ↗',
      path: '/projects',
      isInternal: true,
    },
    {
      title: 'Memory Wall & Gallery',
      desc: 'Browse polaroids, hackathon moments, conference tickets and community photo archives.',
      icon: <Image className="w-6 h-6 text-[#121316]" />,
      badge: 'GALLERY',
      color: 'bg-[#E8F5E9]',
      linkText: 'View Gallery ↗',
      path: '/gallery',
      isInternal: true,
    },
    {
      title: 'Appwrite Cloud Console',
      desc: 'Inspect backend database collections, storage buckets, API keys & serverless functions.',
      icon: <Layers className="w-6 h-6 text-[#121316]" />,
      badge: 'BACKEND',
      color: 'bg-[#FFF3E0]',
      linkText: 'Open Console ↗',
      href: 'https://cloud.appwrite.io',
      isInternal: false,
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F0] py-10 px-4 sm:px-6 lg:px-8 paper-pattern select-none">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Top Header Bar */}
        <div className="p-6 sm:p-8 rounded-[36px] bg-white border-4 border-[#121316] shadow-pop-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#FFE600] border-3 border-[#121316] shadow-pop flex items-center justify-center p-1.5 flex-shrink-0">
              <img
                src="/atc-shield-logo.png"
                alt="ATC Logo"
                className="w-full h-full object-contain"
              />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-0.5 rounded-full bg-[#E1DCFF] text-[#6C5CE7] border border-[#121316] font-mono text-[11px] font-black uppercase">
                  ● ACTIVE ADMIN SESSION
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#121316] tracking-tight">
                ATC Admin Dashboard
              </h1>
              <p className="text-xs sm:text-sm font-mono font-bold text-gray-600">
                Logged in as: <span className="text-[#121316] font-black">{user?.name || user?.email || 'Admin'}</span> ({user?.email})
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/"
              className="px-5 py-2.5 rounded-full bg-white hover:bg-gray-100 text-[#121316] font-mono text-xs font-black border-2 border-[#121316] shadow-pop-sm flex items-center gap-1.5 transition-all"
            >
              <span>View Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={handleLogout}
              className="px-6 py-2.5 rounded-full bg-[#FF4757] hover:bg-[#FF3838] text-white font-mono text-xs font-black border-2 border-[#121316] shadow-pop hover:shadow-pop-lg active:translate-x-[1px] active:translate-y-[1px] flex items-center gap-2 cursor-pointer transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </div>

        </div>

        {/* Welcome Callout Banner & Quick Shortcuts */}
        <div className="p-8 sm:p-10 rounded-[36px] bg-[#121316] text-white shadow-pop-xl border-4 border-[#121316] relative overflow-hidden space-y-6">
          <div className="relative z-10 space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFE600] text-[#121316] font-mono font-black text-xs uppercase shadow-pop-sm">
              <ShieldCheck className="w-4 h-4" />
              AUTHENTICATED WITH APPWRITE
            </div>

            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              Welcome back, {user?.name || 'Administrator'} 👋
            </h2>

            <p className="text-sm sm:text-base font-bold text-gray-300 leading-relaxed">
              Manage live club operations, dynamic event builder, student registrations, check-in stations, and team directory directly synced with Appwrite Cloud.
            </p>
          </div>

          {/* Quick Action Shortcuts */}
          <div className="relative z-10 flex flex-wrap items-center gap-3 pt-2">
            <Link
              to="/admin/events/create"
              className="px-5 py-2.5 rounded-full bg-[#FFE600] hover:bg-[#FFD32A] text-[#121316] font-mono text-xs font-black border-2 border-[#121316] shadow-pop-sm flex items-center gap-2 transition-all hover:scale-105"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Create New Event</span>
            </Link>

            <Link
              to="/admin/events"
              className="px-5 py-2.5 rounded-full bg-white hover:bg-gray-100 text-[#121316] font-mono text-xs font-black border-2 border-[#121316] shadow-pop-sm flex items-center gap-1.5 transition-all hover:scale-105"
            >
              <Calendar className="w-3.5 h-3.5 text-[#6C5CE7]" />
              <span>Manage Events</span>
            </Link>

            <Link
              to="/admin/team"
              className="px-5 py-2.5 rounded-full bg-[#F0EBFF] hover:bg-[#E1DCFF] text-[#6C5CE7] font-mono text-xs font-black border-2 border-[#121316] shadow-pop-sm flex items-center gap-1.5 transition-all hover:scale-105"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Manage Team</span>
            </Link>
          </div>

          {/* Decorative Sparkle */}
          <Sparkles className="w-32 h-32 text-white/5 absolute -right-6 -bottom-6 pointer-events-none" />
        </div>

        {/* Management Modules Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-[#121316] tracking-tight">
                Admin Control Modules
              </h3>
              <p className="text-xs sm:text-sm font-bold text-gray-600">
                Click any module card to navigate directly to its management interface:
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {adminModules.map((mod) => {
              const CardContent = (
                <div
                  className={`p-6 sm:p-7 rounded-[32px] border-4 border-[#121316] shadow-pop hover:shadow-pop-lg transition-all duration-200 flex flex-col justify-between h-full ${mod.color} hover:-translate-y-1 select-none cursor-pointer group`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-white border-2 border-[#121316] shadow-pop-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                        {mod.icon}
                      </div>
                      <span className="px-3 py-0.5 rounded-full bg-white border border-[#121316] font-mono text-[10px] font-black text-[#121316]">
                        {mod.badge}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-black text-xl text-[#121316] tracking-tight group-hover:text-[#6C5CE7] transition-colors">
                        {mod.title}
                      </h4>
                      <p className="text-xs sm:text-sm font-bold text-gray-700 mt-1.5 leading-snug">
                        {mod.desc}
                      </p>
                    </div>
                  </div>

                  <div className="pt-6 mt-4 border-t-2 border-[#121316]/10 flex items-center justify-between font-mono text-xs font-black text-[#121316] group-hover:text-[#6C5CE7]">
                    <span>{mod.linkText}</span>
                    <ArrowUpRight className="w-4 h-4 stroke-[3] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>
              );

              return mod.isInternal && mod.path ? (
                <Link key={mod.title} to={mod.path} className="block h-full">
                  {CardContent}
                </Link>
              ) : (
                <a
                  key={mod.title}
                  href={mod.href}
                  target="_blank"
                  rel="noreferrer"
                  className="block h-full"
                >
                  {CardContent}
                </a>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboardPage;
