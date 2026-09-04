import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Sparkles,
  Calendar,
  FlaskConical,
  Package,
  User as UserIcon,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Layers,
  ShieldCheck,
  Compass
} from 'lucide-react';

export const StudentDashboardPage: React.FC = () => {
  const { user } = useAuth();

  // Derive first name safely from user.name
  const firstName =
    user?.name && user.name.trim()
      ? user.name.trim().split(/\s+/)[0].toUpperCase()
      : 'STUDENT';

  const fullName = user?.name?.trim() || 'Student Builder';
  const email = user?.email || 'No email attached';

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-[#121316] paper-pattern pb-20 select-none">
      {/* Dashboard Hero / Welcome Section */}
      <section className="relative pt-10 pb-12 sm:pt-14 sm:pb-16 border-b-3 border-[#121316] bg-white overflow-hidden">
        {/* Subtle Decorative Background Blurs */}
        <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-[#FFE600]/30 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-44 h-44 rounded-full bg-[#6C5CE7]/20 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            
            {/* Left: Greeting & Taglines */}
            <div className="space-y-3 max-w-2xl">
              {/* Authenticated Status Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF7F0] border-2 border-[#121316] shadow-pop-sm font-mono text-xs font-black uppercase text-[#121316]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2ED573] animate-pulse" />
                <span>SIGNED IN</span>
                <span className="text-gray-400">•</span>
                <span className="text-[#6C5CE7]">STUDENT MEMBER</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#121316] tracking-tight leading-none">
                HEY, {firstName}! 👋
              </h1>

              <p className="text-base sm:text-lg font-bold text-gray-700 leading-relaxed">
                Welcome back to your ATC Space. Everything you need for your tech club journey, workshops, and lab bookings—all in one place.
              </p>
            </div>

            {/* Right: Quick Badge Banner */}
            <div className="flex-shrink-0">
              <div className="p-5 rounded-3xl bg-[#FFE600] border-3 border-[#121316] shadow-pop space-y-2 text-center sm:text-left max-w-xs">
                <div className="flex items-center justify-center sm:justify-start gap-2 font-mono text-xs font-black text-[#121316]">
                  <Sparkles className="w-4 h-4 text-[#121316]" />
                  <span>ATC NIAT PUNE</span>
                </div>
                <div className="text-xl font-black text-[#121316] leading-snug">
                  Build • Hack • Innovate
                </div>
                <p className="text-xs font-bold text-gray-800 leading-normal">
                  Stay active in workshops and collaborate on robotics, IoT, and AI projects.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Main Dashboard Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-10">
        
        {/* ============================================================= */}
        {/* 1. QUICK ACTIONS SECTION                                      */}
        {/* ============================================================= */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-black text-[#121316] tracking-tight flex items-center gap-2">
              <Compass className="w-6 h-6 text-[#6C5CE7]" />
              <span>Quick Actions</span>
            </h2>
            <span className="font-mono text-xs font-bold text-gray-500">
              EXPLORE ATC TOOLS
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            
            {/* Card 1: My Events */}
            <Link
              to="/events"
              className="bg-white rounded-3xl border-3 border-[#121316] p-5 shadow-pop hover:shadow-pop-lg hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between group cursor-pointer"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#FFE600] border-2 border-[#121316] shadow-pop-sm flex items-center justify-center mb-4 group-hover:rotate-6 transition-transform">
                  <Calendar className="w-6 h-6 text-[#121316] stroke-[2.5]" />
                </div>
                <h3 className="font-black text-lg text-[#121316] group-hover:text-[#6C5CE7] transition-colors">
                  My Events
                </h3>
                <p className="text-xs font-bold text-gray-600 mt-1.5 leading-relaxed">
                  Browse upcoming hackathons, bootcamps, and technical workshops.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t-2 border-[#121316]/10 flex items-center justify-between text-xs font-mono font-black text-[#121316]">
                <span>View Events</span>
                <ArrowRight className="w-4 h-4 stroke-[3] group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Card 2: Lab Access */}
            <Link
              to="/lab-access"
              className="bg-white rounded-3xl border-3 border-[#121316] p-5 shadow-pop hover:shadow-pop-lg hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between group cursor-pointer"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#2ED573] border-2 border-[#121316] shadow-pop-sm flex items-center justify-center mb-4 group-hover:rotate-6 transition-transform">
                  <FlaskConical className="w-6 h-6 text-[#121316] stroke-[2.5]" />
                </div>
                <h3 className="font-black text-lg text-[#121316] group-hover:text-[#6C5CE7] transition-colors">
                  Lab Access
                </h3>
                <p className="text-xs font-bold text-gray-600 mt-1.5 leading-relaxed">
                  Reserve workbench slots and request access to Lab 5.0 robotics stations.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t-2 border-[#121316]/10 flex items-center justify-between text-xs font-mono font-black text-[#121316]">
                <span>Book Slots</span>
                <ArrowRight className="w-4 h-4 stroke-[3] group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Card 3: Inventory */}
            <Link
              to="/inventory"
              className="bg-white rounded-3xl border-3 border-[#121316] p-5 shadow-pop hover:shadow-pop-lg hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between group cursor-pointer"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#E1DCFF] border-2 border-[#121316] shadow-pop-sm flex items-center justify-center mb-4 group-hover:rotate-6 transition-transform">
                  <Package className="w-6 h-6 text-[#6C5CE7] stroke-[2.5]" />
                </div>
                <h3 className="font-black text-lg text-[#121316] group-hover:text-[#6C5CE7] transition-colors">
                  Inventory
                </h3>
                <p className="text-xs font-bold text-gray-600 mt-1.5 leading-relaxed">
                  Explore microcontrollers, sensor modules, and equipment in stock.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t-2 border-[#121316]/10 flex items-center justify-between text-xs font-mono font-black text-[#121316]">
                <span>Explore Catalog</span>
                <ArrowRight className="w-4 h-4 stroke-[3] group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Card 4: My Profile */}
            <div className="bg-white rounded-3xl border-3 border-[#121316] p-5 shadow-pop flex flex-col justify-between relative group select-none">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#FAF7F0] border-2 border-[#121316] shadow-pop-sm flex items-center justify-center mb-4">
                  <UserIcon className="w-6 h-6 text-[#121316] stroke-[2.5]" />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-black text-lg text-[#121316]">
                    My Profile
                  </h3>
                  <span className="px-2 py-0.5 rounded bg-gray-200 text-gray-600 font-mono text-[9px] font-bold">
                    Coming Soon
                  </span>
                </div>
                <p className="text-xs font-bold text-gray-600 mt-1.5 leading-relaxed">
                  Manage your student credentials, club badges, and project contributions.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t-2 border-[#121316]/10 flex items-center justify-between text-xs font-mono font-bold text-gray-400">
                <span>Profile Management</span>
                <Clock className="w-4 h-4 text-gray-400" />
              </div>
            </div>

          </div>
        </section>

        {/* ============================================================= */}
        {/* 2. PROFILE SUMMARY & INVENTORY HIGHLIGHT GRID                 */}
        {/* ============================================================= */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left: Profile Summary Card (5 Cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl border-3 border-[#121316] p-6 sm:p-7 shadow-pop flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF7F0] border-2 border-[#121316] font-mono text-xs font-black uppercase text-[#121316]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#2ED573]" />
                  <span>STUDENT PROFILE</span>
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-[#2ED573]" title="Session Verified" />
              </div>

              <div className="space-y-4">
                {/* Name */}
                <div className="space-y-1">
                  <span className="font-mono text-[10px] font-black uppercase text-gray-400">
                    Full Name
                  </span>
                  <div className="text-lg font-black text-[#121316] break-words">
                    {fullName}
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <span className="font-mono text-[10px] font-black uppercase text-gray-400">
                    Email Address
                  </span>
                  <div className="text-sm font-mono font-bold text-[#6C5CE7] break-all">
                    {email}
                  </div>
                </div>

                {/* Account Type */}
                <div className="space-y-1">
                  <span className="font-mono text-[10px] font-black uppercase text-gray-400">
                    Account Classification
                  </span>
                  <div>
                    <span className="px-2.5 py-1 rounded-full bg-[#E1DCFF] border border-[#121316] font-mono text-xs font-black text-[#6C5CE7]">
                      STUDENT MEMBER
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Action Note */}
            <div className="pt-4 border-t-2 border-[#121316]/10 flex items-center justify-between text-xs font-mono font-bold text-gray-500">
              <span>Appwrite Session Active</span>
              <span className="px-2 py-0.5 bg-gray-100 rounded text-[10px]">v1.0</span>
            </div>
          </div>

          {/* Right: Lab Inventory Callout Highlight (7 Cols) */}
          <div className="lg:col-span-7 bg-[#FFE600] rounded-3xl border-3 border-[#121316] p-6 sm:p-8 shadow-pop flex flex-col justify-between space-y-6 relative overflow-hidden group">
            <div className="space-y-3 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border-2 border-[#121316] font-mono text-xs font-black uppercase text-[#121316] shadow-pop-sm">
                <Package className="w-3.5 h-3.5 text-[#121316]" />
                <span>LAB INVENTORY SPOTLIGHT</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-[#121316] tracking-tight leading-snug">
                Need Hardware for Your Next Big Project?
              </h3>

              <p className="text-sm sm:text-base font-bold text-gray-900 leading-relaxed max-w-xl">
                Explore the live inventory catalog of microcontrollers, IoT sensors, cameras, and robotics components available in Lab 5.0.
              </p>
            </div>

            <div className="pt-2 relative z-10">
              <Link
                to="/inventory"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#121316] text-[#FFE600] hover:bg-[#121316]/90 font-mono text-xs sm:text-sm font-black uppercase border-3 border-[#121316] shadow-pop hover:shadow-pop-lg active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer"
              >
                <span>EXPLORE INVENTORY</span>
                <ArrowUpRight className="w-4 h-4 stroke-[3]" />
              </Link>
            </div>
          </div>

        </section>

        {/* ============================================================= */}
        {/* 3. PLACEHOLDER DASHBOARD ACTIVITY SECTIONS                   */}
        {/* ============================================================= */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Section A: Event Activity */}
          <div className="bg-white rounded-3xl border-3 border-[#121316] p-6 sm:p-7 shadow-pop space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-[#121316] flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#6C5CE7]" />
                <span>My Event Activity</span>
              </h3>
              <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-500 font-mono text-[10px] font-bold">
                PREVIEW
              </span>
            </div>

            <div className="p-6 rounded-2xl bg-[#FAF7F0] border-2 border-dashed border-[#121316]/30 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-white border-2 border-[#121316] shadow-pop-sm mx-auto flex items-center justify-center">
                <Calendar className="w-6 h-6 text-[#6C5CE7]" />
              </div>
              <div className="space-y-1">
                <h4 className="font-black text-sm text-[#121316]">
                  Event Registrations Coming Soon
                </h4>
                <p className="text-xs text-gray-600 font-bold max-w-xs mx-auto leading-relaxed">
                  Your registered workshop passes, check-in history, and certificates will be organized right here.
                </p>
              </div>

              <div className="pt-2">
                <Link
                  to="/events"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#FFE600] text-[#121316] font-mono text-xs font-black border-2 border-[#121316] shadow-pop-sm hover:shadow-pop transition-all cursor-pointer"
                >
                  <span>Browse Upcoming Events</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
                </Link>
              </div>
            </div>
          </div>

          {/* Section B: Lab Activity */}
          <div className="bg-white rounded-3xl border-3 border-[#121316] p-6 sm:p-7 shadow-pop space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-[#121316] flex items-center gap-2">
                <FlaskConical className="w-5 h-5 text-[#2ED573]" />
                <span>Lab Activity</span>
              </h3>
              <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-500 font-mono text-[10px] font-bold">
                PREVIEW
              </span>
            </div>

            <div className="p-6 rounded-2xl bg-[#FAF7F0] border-2 border-dashed border-[#121316]/30 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-white border-2 border-[#121316] shadow-pop-sm mx-auto flex items-center justify-center">
                <FlaskConical className="w-6 h-6 text-[#2ED573]" />
              </div>
              <div className="space-y-1">
                <h4 className="font-black text-sm text-[#121316]">
                  Lab Bookings Coming Soon
                </h4>
                <p className="text-xs text-gray-600 font-bold max-w-xs mx-auto leading-relaxed">
                  Your workstation reservations, component issue requests, and access logs will synchronize here.
                </p>
              </div>

              <div className="pt-2">
                <Link
                  to="/lab-access"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#2ED573] text-[#121316] font-mono text-xs font-black border-2 border-[#121316] shadow-pop-sm hover:shadow-pop transition-all cursor-pointer"
                >
                  <span>Book a Lab Slot</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
                </Link>
              </div>
            </div>
          </div>

        </section>

      </main>
    </div>
  );
};

export default StudentDashboardPage;
