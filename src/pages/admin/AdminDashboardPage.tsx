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
  ArrowUpRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminDashboardPage: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  const adminModules = [
    {
      title: 'Events Management',
      desc: 'Create hackathons, workshops, update schedules & manage venues.',
      icon: <Calendar className="w-6 h-6 text-[#121316]" />,
      badge: 'EVENTS',
      color: 'bg-[#FFF9DB]',
      linkText: 'Events Module ↗',
    },
    {
      title: 'Participant Registrations',
      desc: 'Live registrations, ticket generation, attendance lists & export.',
      icon: <QrCode className="w-6 h-6 text-[#121316]" />,
      badge: 'REGISTRATIONS',
      color: 'bg-[#FFEBF2]',
      linkText: 'Registrations Module ↗',
    },
    {
      title: 'Team & Leadership',
      desc: 'Update executive leads, specialist wings & member profiles.',
      icon: <Users className="w-6 h-6 text-[#121316]" />,
      badge: 'TEAM',
      color: 'bg-[#F0EBFF]',
      linkText: 'Team Module ↗',
    },
    {
      title: 'Student Projects',
      desc: 'Showcase student hardware, software builds & lab incubations.',
      icon: <FolderGit2 className="w-6 h-6 text-[#121316]" />,
      badge: 'PROJECTS',
      color: 'bg-[#E1F5FE]',
      linkText: 'Projects Module ↗',
    },
    {
      title: 'Memory Wall & Gallery',
      desc: 'Upload polaroids, hackathon moments, tickets and clippings.',
      icon: <Image className="w-6 h-6 text-[#121316]" />,
      badge: 'GALLERY',
      color: 'bg-[#E8F5E9]',
      linkText: 'Gallery Module ↗',
    },
    {
      title: 'Appwrite Server Overview',
      desc: 'Database collections, storage buckets & serverless functions.',
      icon: <Layers className="w-6 h-6 text-[#121316]" />,
      badge: 'BACKEND',
      color: 'bg-[#FFF3E0]',
      linkText: 'Appwrite Console ↗',
      external: true,
      href: 'https://cloud.appwrite.io',
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
              <span>View Public Website</span>
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

        {/* Welcome Callout Banner */}
        <div className="p-8 sm:p-10 rounded-[36px] bg-[#121316] text-white shadow-pop-xl border-4 border-[#121316] relative overflow-hidden">
          <div className="relative z-10 space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFE600] text-[#121316] font-mono font-black text-xs uppercase shadow-pop-sm">
              <ShieldCheck className="w-4 h-4" />
              AUTHENTICATED WITH APPWRITE
            </div>

            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              Welcome back, {user?.name || 'Administrator'} 👋
            </h2>

            <p className="text-sm sm:text-base font-bold text-gray-300 leading-relaxed">
              You are authenticated to the official ATC NIAT Pune administrative control panel. Future database and registration services will connect directly through your active Appwrite session.
            </p>
          </div>

          {/* Decorative Sparkle */}
          <Sparkles className="w-32 h-32 text-white/5 absolute -right-6 -bottom-6 pointer-events-none" />
        </div>

        {/* Management Modules Grid */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-[#121316] tracking-tight">
                Admin Control Modules
              </h3>
              <p className="text-xs sm:text-sm font-bold text-gray-600">
                Connected to Appwrite Database collections and Storage buckets:
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {adminModules.map((mod) => (
              <div
                key={mod.title}
                className={`p-6 rounded-[32px] border-4 border-[#121316] shadow-pop hover:shadow-pop-lg transition-all duration-200 flex flex-col justify-between ${mod.color}`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-white border-2 border-[#121316] shadow-pop-sm flex items-center justify-center">
                      {mod.icon}
                    </div>
                    <span className="px-3 py-0.5 rounded-full bg-white border border-[#121316] font-mono text-[10px] font-black text-[#121316]">
                      {mod.badge}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-black text-xl text-[#121316] tracking-tight">
                      {mod.title}
                    </h4>
                    <p className="text-xs sm:text-sm font-bold text-gray-700 mt-1 leading-snug">
                      {mod.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-6 mt-4 border-t-2 border-[#121316]/10 flex items-center justify-between">
                  {mod.external ? (
                    <a
                      href={mod.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 font-mono text-xs font-black text-[#121316] hover:text-[#6C5CE7]"
                    >
                      <span>{mod.linkText}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 stroke-[3]" />
                    </a>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 font-mono text-xs font-black text-gray-500">
                      <span>Ready for Backend Sync</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboardPage;
