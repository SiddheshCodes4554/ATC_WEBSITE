import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Search,
  RotateCw,
  ArrowLeft,
  X,
  Calendar,
  Phone,
  Mail,
  GraduationCap,
  Layers,
  Hash,
  User,
  ShieldCheck,
  AlertTriangle,
  ArrowUpDown,
  Filter,
  Eye,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { studentProfileService } from '../../services/studentProfileService';
import {
  StudentProfile,
  StudentYear,
  StudentSection,
  StudentSortOption,
} from '../../types/studentProfile.types';
import { IconModule, ATCStatusBadge, ATCEmptyState, ScrewHead } from '../../components/visual';

export const AdminUsersPage: React.FC = () => {
  const { user } = useAuth();

  const [profiles, setProfiles] = useState<StudentProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Search, Filter & Sort State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [yearFilter, setYearFilter] = useState<StudentYear | 'all'>('all');
  const [sectionFilter, setSectionFilter] = useState<StudentSection | 'all'>('all');
  const [sortBy, setSortBy] = useState<StudentSortOption>('newest');

  // Selected student for detail inspection modal
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(null);

  const fetchProfiles = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await studentProfileService.getAllProfiles({
        year: yearFilter,
        section: sectionFilter,
        sortBy,
        limit: 100,
      });

      if (res.success && res.data) {
        setProfiles(res.data.profiles);
      } else {
        setError(res.error || 'Failed to load registered student profiles.');
      }
    } catch (err: any) {
      setError(err?.message || 'An error occurred while loading students.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, [yearFilter, sectionFilter, sortBy]);

  // Client-side text search
  const filteredProfiles = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return profiles;

    return profiles.filter((p) => {
      return (
        p.name.toLowerCase().includes(query) ||
        p.niatId.toLowerCase().includes(query) ||
        p.email.toLowerCase().includes(query) ||
        p.phone.toLowerCase().includes(query) ||
        (p.section && p.section.toLowerCase().includes(query))
      );
    });
  }, [profiles, searchQuery]);

  // Aggregate Metrics
  const stats = useMemo(() => {
    return {
      total: profiles.length,
      firstYear: profiles.filter((p) => p.year === '1st Year').length,
      secondYear: profiles.filter((p) => p.year === '2nd Year').length,
    };
  }, [profiles]);

  const formatDate = (isoString?: string) => {
    if (!isoString) return 'Date TBA';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return isoString;
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setYearFilter('all');
    setSectionFilter('all');
    setSortBy('newest');
  };

  return (
    <div className="min-h-screen bg-[#FAF7F0] py-10 px-4 sm:px-6 lg:px-8 paper-pattern select-none">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Header Card */}
        <div className="p-6 sm:p-8 rounded-[36px] bg-white border-4 border-[#121316] shadow-pop-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#FFE600] border-3 border-[#121316] shadow-pop flex items-center justify-center p-1.5 flex-shrink-0">
              <Users className="w-8 h-8 text-[#121316] stroke-[2.5]" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-0.5 rounded-full bg-[#E1DCFF] text-[#6C5CE7] border border-[#121316] font-mono text-[11px] font-black uppercase">
                  ● USER DIRECTORY
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#121316] tracking-tight">
                REGISTERED USERS
              </h1>
              <p className="text-xs sm:text-sm font-mono font-bold text-gray-600">
                View students registered with the ATC Robotics Lab.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/admin/dashboard"
              className="px-5 py-2.5 rounded-full bg-white hover:bg-gray-100 text-[#121316] font-mono text-xs font-black border-2 border-[#121316] shadow-pop-sm flex items-center gap-2 transition-all"
            >
              <ArrowLeft className="w-4 h-4 stroke-[3]" />
              <span>Admin Dashboard</span>
            </Link>

            <button
              type="button"
              onClick={fetchProfiles}
              className="p-2.5 rounded-xl bg-[#FAF7F0] hover:bg-gray-200 border-2 border-[#121316] shadow-pop-xs transition-all cursor-pointer"
              title="Refresh directory"
            >
              <RotateCw className={`w-4 h-4 text-[#121316] ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Instant Access Banner */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#E1DCFF]/50 border-3 border-[#6C5CE7] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-bold text-[#121316]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#6C5CE7] text-white flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <span className="font-black text-[#6C5CE7] font-mono text-[11px] uppercase block">
                INSTANT REGISTRATION DIRECTORY (NO APPROVAL REQUIRED)
              </span>
              <span>
                All registered student accounts are instantly active upon signup with immediate access to booking lab slots, reserving components, and submitting project ideas. Admin approval is reserved strictly for candidates applying for core club cohort membership via the Join ATC form.
              </span>
            </div>
          </div>
          <Link
            to="/admin/membership-applications"
            className="px-4 py-2 rounded-xl bg-white hover:bg-gray-100 border-2 border-[#121316] font-mono text-[11px] font-black uppercase text-[#121316] shadow-pop-xs transition-all flex-shrink-0 text-center"
          >
            Go to Member Applications →
          </Link>
        </div>

        {/* Stats Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-3xl bg-white border-3 border-[#121316] shadow-pop space-y-1">
            <span className="font-mono text-xs font-black uppercase text-gray-500">
              Total Registered Students
            </span>
            <div className="text-3xl font-black text-[#121316]">{stats.total}</div>
          </div>

          <div className="p-5 rounded-3xl bg-[#FFF9DB] border-3 border-[#121316] shadow-pop space-y-1">
            <span className="font-mono text-xs font-black uppercase text-amber-800">
              1st Year Students
            </span>
            <div className="text-3xl font-black text-amber-900">{stats.firstYear}</div>
          </div>

          <div className="p-5 rounded-3xl bg-[#E8F5E9] border-3 border-[#121316] shadow-pop space-y-1">
            <span className="font-mono text-xs font-black uppercase text-emerald-800">
              2nd Year Students
            </span>
            <div className="text-3xl font-black text-emerald-900">{stats.secondYear}</div>
          </div>
        </div>

        {/* Search, Filter & Sort Controls */}
        <div className="p-5 rounded-3xl bg-white border-3 border-[#121316] shadow-pop space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3.5 items-center">
            
            {/* Search Input (5 Cols) */}
            <div className="lg:col-span-5 relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Name, NIAT ID, Email, Phone..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#FAF7F0] border-2 border-[#121316] text-xs font-bold text-[#121316] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]"
              />
            </div>

            {/* Year Filter (2 Cols) */}
            <div className="lg:col-span-2 relative">
              <select
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value as StudentYear | 'all')}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FAF7F0] border-2 border-[#121316] text-xs font-bold text-[#121316] focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] appearance-none cursor-pointer"
              >
                <option value="all">Year: All</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-gray-500 font-mono text-xs font-black">
                ▼
              </div>
            </div>

            {/* Section Filter (2 Cols) */}
            <div className="lg:col-span-2 relative">
              <select
                value={sectionFilter}
                onChange={(e) => setSectionFilter(e.target.value as StudentSection | 'all')}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FAF7F0] border-2 border-[#121316] text-xs font-bold text-[#121316] focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] appearance-none cursor-pointer"
              >
                <option value="all">Section: All</option>
                <option value="S01">S01</option>
                <option value="S02">S02</option>
                <option value="S03">S03</option>
                <option value="S04">S04</option>
                <option value="S05">S05</option>
                <option value="S06">S06</option>
                <option value="S07">S07</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-gray-500 font-mono text-xs font-black">
                ▼
              </div>
            </div>

            {/* Sort Dropdown (3 Cols) */}
            <div className="lg:col-span-3 relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as StudentSortOption)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FAF7F0] border-2 border-[#121316] text-xs font-bold text-[#121316] focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] appearance-none cursor-pointer"
              >
                <option value="newest">Sort: Newest First</option>
                <option value="oldest">Sort: Oldest First</option>
                <option value="name-asc">Sort: Name A–Z</option>
                <option value="name-desc">Sort: Name Z–A</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-gray-500 font-mono text-xs font-black">
                ▼
              </div>
            </div>

          </div>

          <div className="flex items-center justify-between text-xs font-mono font-bold text-gray-500 pt-1">
            <span>
              Showing {filteredProfiles.length} of {profiles.length} registered students
            </span>
            {(searchQuery || yearFilter !== 'all' || sectionFilter !== 'all') && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="text-[#6C5CE7] hover:underline font-black cursor-pointer"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>

        {/* Students Table / Directory View */}
        {loading ? (
          <div className="space-y-4 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-6 rounded-3xl bg-white border-3 border-gray-200 h-24" />
            ))}
          </div>
        ) : error ? (
          <div className="p-8 rounded-3xl bg-[#FFE5E5] border-3 border-[#FF4757] text-center space-y-4 max-w-lg mx-auto shadow-pop">
            <AlertTriangle className="w-10 h-10 text-[#FF4757] mx-auto" />
            <div className="space-y-1">
              <h3 className="font-black text-lg text-[#121316]">FAILED TO LOAD STUDENTS</h3>
              <p className="text-xs font-bold text-gray-700">{error}</p>
            </div>
            <button
              type="button"
              onClick={fetchProfiles}
              className="px-5 py-2.5 rounded-full bg-white border-2 border-[#121316] font-mono text-xs font-black uppercase text-[#121316] shadow-pop-sm hover:shadow-pop transition-all"
            >
              Try Again
            </button>
          </div>
        ) : filteredProfiles.length > 0 ? (
          <div className="bg-white rounded-[32px] border-4 border-[#121316] shadow-pop-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#FAF7F0] border-b-3 border-[#121316] font-mono text-xs font-black uppercase text-[#121316]">
                    <th className="p-4 sm:p-5">Student / Name</th>
                    <th className="p-4 sm:p-5">NIAT ID</th>
                    <th className="p-4 sm:p-5">Email Address</th>
                    <th className="p-4 sm:p-5">Phone Number</th>
                    <th className="p-4 sm:p-5">Academic Info</th>
                    <th className="p-4 sm:p-5">Registered On</th>
                    <th className="p-4 sm:p-5 text-right">Inspect</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-[#121316]/10 text-xs sm:text-sm font-bold text-[#121316]">
                  {filteredProfiles.map((p) => (
                    <tr
                      key={p.$id}
                      onClick={() => setSelectedStudent(p)}
                      className="hover:bg-[#FAF7F0] transition-colors cursor-pointer group"
                    >
                      {/* Name */}
                      <td className="p-4 sm:p-5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-xl bg-[#E1DCFF] border-2 border-[#121316] flex items-center justify-center font-mono font-black text-xs text-[#6C5CE7] flex-shrink-0">
                            {p.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-black text-[#121316] group-hover:text-[#6C5CE7] transition-colors">
                              {p.name}
                            </div>
                            <div className="text-[11px] font-mono text-gray-500">
                              ID: #{p.$id.slice(-6)}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* NIAT ID */}
                      <td className="p-4 sm:p-5 font-mono font-black">
                        <span className="px-2.5 py-1 rounded-full bg-[#FFE600] border border-[#121316] text-[#121316]">
                          {p.niatId || '—'}
                        </span>
                      </td>

                      {/* Email */}
                      <td className="p-4 sm:p-5 font-mono text-xs text-gray-700">
                        {p.email}
                      </td>

                      {/* Phone */}
                      <td className="p-4 sm:p-5 font-mono text-xs text-gray-700">
                        {p.phone || '—'}
                      </td>

                      {/* Year & Section */}
                      <td className="p-4 sm:p-5 font-mono text-xs">
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded-full bg-[#FAF7F0] border border-[#121316] text-[#121316] text-[11px]">
                            {p.year || '1st Year'}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-[#E1DCFF] border border-[#121316] text-[#6C5CE7] font-black text-[11px]">
                            {p.section || 'S01'}
                          </span>
                        </div>
                      </td>

                      {/* Registration Date */}
                      <td className="p-4 sm:p-5 font-mono text-xs text-gray-500">
                        {formatDate(p.$createdAt)}
                      </td>

                      {/* Action */}
                      <td className="p-4 sm:p-5 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedStudent(p);
                          }}
                          className="px-3 py-1.5 rounded-full bg-white hover:bg-[#FFE600] border-2 border-[#121316] font-mono text-xs font-black uppercase text-[#121316] shadow-pop-xs transition-all cursor-pointer"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="max-w-lg mx-auto py-8">
            <ATCEmptyState
              type="storage"
              title="NO STUDENTS FOUND"
              description={
                searchQuery
                  ? `No registered students matching "${searchQuery}".`
                  : 'No student registrations found for the selected filters.'
              }
              actionLabel="Clear Filters"
              onAction={handleClearFilters}
            />
          </div>
        )}
      </div>

      {/* Student Detail Modal */}
      {selectedStudent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fadeIn select-none"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedStudent(null);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="relative w-full max-w-lg bg-white rounded-[36px] border-4 border-[#121316] shadow-pop-xl p-6 sm:p-8 animate-scaleUp overflow-hidden max-h-[90vh] flex flex-col"
          >
            <div className="tape-strip pointer-events-none bg-[#FFE600]" />

            <div className="flex items-start justify-between gap-3 mb-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E1DCFF] border-2 border-[#121316] font-mono font-black text-xs uppercase text-[#6C5CE7] shadow-pop-sm">
                <User className="w-3.5 h-3.5" />
                STUDENT PROFILE RECORD
              </div>

              <button
                type="button"
                onClick={() => setSelectedStudent(null)}
                aria-label="Close modal"
                className="p-2 rounded-2xl bg-[#FAF7F0] hover:bg-[#FFE5E5] text-[#121316] hover:text-[#FF4757] border-2 border-[#121316] shadow-pop-sm active:scale-95 transition-all cursor-pointer"
              >
                <X className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>

            <div className="overflow-y-auto space-y-4 pr-1 scrollbar-thin flex-grow">
              <div className="p-4 rounded-2xl bg-[#FAF7F0] border-2 border-[#121316] space-y-1">
                <span className="font-mono text-[10px] font-black uppercase text-gray-500">
                  Full Name
                </span>
                <div className="text-xl font-black text-[#121316]">{selectedStudent.name}</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-[#FFF9DB] border-2 border-[#121316] space-y-1">
                  <span className="font-mono text-[10px] font-black uppercase text-amber-800">
                    NIAT ID
                  </span>
                  <div className="text-lg font-black text-amber-900 font-mono">
                    {selectedStudent.niatId}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#E1DCFF] border-2 border-[#121316] space-y-1">
                  <span className="font-mono text-[10px] font-black uppercase text-[#6C5CE7]">
                    Section
                  </span>
                  <div className="text-lg font-black text-[#6C5CE7] font-mono">
                    {selectedStudent.section}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-[#FAF7F0] border-2 border-[#121316] space-y-1">
                  <span className="font-mono text-[10px] font-black uppercase text-gray-500">
                    Academic Year
                  </span>
                  <div className="text-sm font-black text-[#121316] font-mono">
                    {selectedStudent.year}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF7F0] border-2 border-[#121316] space-y-1">
                  <span className="font-mono text-[10px] font-black uppercase text-gray-500">
                    Contact Phone
                  </span>
                  <div className="text-sm font-black text-[#121316] font-mono">
                    {selectedStudent.phone || '—'}
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF7F0] border-2 border-[#121316] space-y-1">
                <span className="font-mono text-[10px] font-black uppercase text-gray-500">
                  Email Address
                </span>
                <div className="text-sm font-bold text-[#6C5CE7] font-mono break-all">
                  {selectedStudent.email}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF7F0] border-2 border-[#121316] space-y-1">
                <span className="font-mono text-[10px] font-black uppercase text-gray-500">
                  Registration Date
                </span>
                <div className="text-xs font-bold text-gray-800 font-mono">
                  {formatDate(selectedStudent.$createdAt)}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t-2 border-[#121316]/10 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedStudent(null)}
                className="px-6 py-2.5 rounded-full bg-[#FFE600] hover:bg-[#FFD32A] text-[#121316] font-mono text-xs font-black uppercase border-2 border-[#121316] shadow-pop-sm hover:shadow-pop transition-all cursor-pointer"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;
