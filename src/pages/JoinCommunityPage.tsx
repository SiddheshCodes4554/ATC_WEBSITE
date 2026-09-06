import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  User,
  Mail,
  Phone,
  GraduationCap,
  Layers,
  Link as LinkIcon,
  Code,
  FileText,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  HeartHandshake,
  Compass,
  ArrowLeft,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';
import { MembershipApplicationService } from '../services/membershipApplicationService';
import {
  MEMBERSHIP_YEARS,
  MEMBERSHIP_SECTIONS,
  MEMBERSHIP_AVAILABILITY_OPTIONS,
  CreateMembershipApplicationInput,
} from '../types/membershipApplication.types';
import { SparkleDoodle, RetroRobotMascot } from '../components/doodles/DoodleSvgs';

export const JoinCommunityPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  // Form State
  const [formData, setFormData] = useState<CreateMembershipApplicationInput>({
    name: '',
    email: '',
    phone: '',
    year: '',
    section: '',
    resumeLink: '',
    skills: '',
    experience: '',
    availability: '',
  });

  // Validation & UI State
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  // Auto-fill for authenticated students
  useEffect(() => {
    if (isAuthenticated && user) {
      setFormData((prev) => ({
        ...prev,
        name: prev.name || user.name || '',
        email: prev.email || user.email || '',
      }));
    }
  }, [isAuthenticated, user]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // 1. Full Name
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required.';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Full name must be at least 2 characters.';
    }

    // 2. Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    // 3. Phone
    const phoneRegex = /^[0-9+\s\-()]{7,16}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required.';
    } else if (!phoneRegex.test(formData.phone.trim())) {
      newErrors.phone = 'Please enter a valid phone number (e.g. +91 9876543210).';
    }

    // 4. Year
    if (!formData.year.trim()) {
      newErrors.year = 'Please select your academic year.';
    } else if (!MEMBERSHIP_YEARS.includes(formData.year as any)) {
      newErrors.year = 'Only 1st Year and 2nd Year students are eligible for this recruitment.';
    }

    // 5. Section
    if (!formData.section.trim()) {
      newErrors.section = 'Please select your section.';
    } else if (!MEMBERSHIP_SECTIONS.includes(formData.section as any)) {
      newErrors.section = 'Please choose a valid section (S01 to S07).';
    }

    // 6. Resume Link (Optional, but validate if entered)
    if (formData.resumeLink && formData.resumeLink.trim()) {
      const trimmedUrl = formData.resumeLink.trim();
      let valid = false;
      try {
        const formatted = trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://')
          ? trimmedUrl
          : `https://${trimmedUrl}`;
        const parsed = new URL(formatted);
        valid = Boolean(parsed.hostname && parsed.hostname.includes('.'));
      } catch {
        valid = false;
      }

      if (!valid) {
        newErrors.resumeLink = 'Please enter a valid URL (e.g. https://github.com/yourname or Google Drive link).';
      }
    }

    // 7. Availability
    if (!formData.availability.trim()) {
      newErrors.availability = 'Please select your weekly time commitment.';
    } else if (!MEMBERSHIP_AVAILABILITY_OPTIONS.includes(formData.availability as any)) {
      newErrors.availability = 'Please select a valid availability option.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    field: keyof CreateMembershipApplicationInput,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear inline error on change
    if (errors[field]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
    if (submitError) {
      setSubmitError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validateForm()) {
      // Scroll to the first error
      const firstErrorKey = Object.keys(errors)[0];
      const errorElement = document.querySelector(`[name="${firstErrorKey}"]`);
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await MembershipApplicationService.createApplication(formData);

      if (res.success) {
        setIsSuccess(true);
        try {
          confetti({
            particleCount: 100,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#FFE600', '#FF6B6B', '#6C5CE7', '#2ED573', '#00D2D3'],
          });
        } catch {
          // ignore any canvas confetti issues
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setSubmitError(res.error || 'Failed to submit application. Please try again.');
      }
    } catch (err: any) {
      console.error('Submission error:', err);
      setSubmitError(err?.message || 'A network error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-[#121316] paper-pattern pb-24 select-none">
      {/* ============================================================= */}
      {/* 1. HERO HEADER SECTION                                        */}
      {/* ============================================================= */}
      <section className="relative pt-12 pb-16 sm:pt-16 sm:pb-20 border-b-4 border-[#121316] bg-[#FFE600] overflow-hidden">
        {/* Background Sparkles */}
        <div className="absolute top-6 left-10 opacity-50 pointer-events-none hidden md:block animate-wiggle">
          <SparkleDoodle className="w-12 h-12" color="#FF6B6B" />
        </div>
        <div className="absolute bottom-6 right-12 opacity-60 pointer-events-none hidden md:block animate-float-slow">
          <SparkleDoodle className="w-14 h-14" color="#6C5CE7" />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border-2 border-[#121316] shadow-pop-sm font-mono text-xs font-black uppercase text-[#121316]">
            <Sparkles className="w-4 h-4 text-[#FF793F]" />
            <span>ATC NIAT PUNE • COHORT 2026</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-[#121316] tracking-tight leading-tight uppercase">
            JOIN THE ATC COMMUNITY
          </h1>

          <p className="text-lg sm:text-2xl font-bold text-[#121316] max-w-2xl mx-auto leading-relaxed">
            "Learn. Build. Collaborate. Be part of something bigger."
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs font-mono font-bold text-gray-800">
            <span className="px-3 py-1 bg-white/90 rounded-full border border-[#121316]">
              ⚡ Robotics & IoT
            </span>
            <span className="px-3 py-1 bg-white/90 rounded-full border border-[#121316]">
              💻 Web & AI Builds
            </span>
            <span className="px-3 py-1 bg-white/90 rounded-full border border-[#121316]">
              🚀 Hackathons & Lab 5.0
            </span>
          </div>
        </div>
      </section>

      {/* ============================================================= */}
      {/* 2. MAIN FORM / SUCCESS CONTAINER                              */}
      {/* ============================================================= */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        {isSuccess ? (
          /* SUCCESS STATE */
          <div className="p-8 sm:p-12 rounded-[40px] bg-white border-4 border-[#121316] shadow-pop-xl text-center space-y-6 animate-fadeIn paper-pattern">
            <div className="w-20 h-20 rounded-3xl bg-[#D4F8E8] border-3 border-[#121316] shadow-pop flex items-center justify-center mx-auto text-4xl animate-bounce">
              🎉
            </div>

            <div className="space-y-2">
              <span className="px-4 py-1 bg-[#2ED573] text-[#121316] rounded-full text-xs font-mono font-black uppercase inline-block border-2 border-[#121316] shadow-pop-xs">
                STATUS: PENDING REVIEW
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#121316] tracking-tight">
                APPLICATION SUBMITTED!
              </h2>
              <p className="text-base sm:text-lg font-bold text-gray-700 max-w-lg mx-auto leading-relaxed">
                Your application has been received! The ATC team will review it soon.
              </p>
            </div>

            {/* Information Card */}
            <div className="p-5 rounded-2xl bg-[#FAF7F0] border-2 border-[#121316] text-left space-y-3 font-mono text-xs max-w-md mx-auto">
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span className="text-gray-500">Applicant:</span>
                <span className="font-bold text-[#121316]">{formData.name}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span className="text-gray-500">Email:</span>
                <span className="font-bold text-[#121316]">{formData.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Academic:</span>
                <span className="font-bold text-[#121316]">{formData.year} • Section {formData.section}</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/"
                className="px-6 py-3 rounded-full bg-[#FAF7F0] hover:bg-gray-100 text-[#121316] font-mono text-xs sm:text-sm font-black uppercase border-3 border-[#121316] shadow-pop hover:shadow-pop-lg transition-all"
              >
                BACK TO HOME
              </Link>

              {isAuthenticated && (
                <Link
                  to="/student/dashboard"
                  className="px-6 py-3 rounded-full bg-[#FFE600] hover:bg-[#FFD32A] text-[#121316] font-mono text-xs sm:text-sm font-black uppercase border-3 border-[#121316] shadow-pop hover:shadow-pop-lg transition-all flex items-center gap-2"
                >
                  <span>GO TO DASHBOARD</span>
                  <ArrowRight className="w-4 h-4 stroke-[3]" />
                </Link>
              )}
            </div>
          </div>
        ) : (
          /* APPLICATION FORM */
          <form
            onSubmit={handleSubmit}
            noValidate
            className="p-6 sm:p-10 rounded-[40px] bg-white border-4 border-[#121316] shadow-pop-xl space-y-10"
          >
            {/* Top Info Callout */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#F0EBFF] border-2 border-[#121316] flex items-start gap-3">
              <Compass className="w-5 h-5 text-[#6C5CE7] flex-shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm font-bold text-[#121316]">
                {isAuthenticated ? (
                  <span>
                    Signed in as <strong className="text-[#6C5CE7]">{user?.email}</strong>. Your account details have been prefilled below.
                  </span>
                ) : (
                  <span>
                    Open to 1st & 2nd year students of NIAT Pune. Fill out this simple application to join our workshops, hack teams, and maker benches!
                  </span>
                )}
              </div>
            </div>

            {/* Error Banner */}
            {submitError && (
              <div className="p-4 sm:p-5 rounded-2xl bg-[#FFE5E5] border-3 border-[#FF4757] shadow-pop-sm flex items-start gap-3 animate-fadeIn">
                <AlertCircle className="w-6 h-6 text-[#FF4757] flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-black text-sm text-[#121316]">Application Notice</h4>
                  <p className="text-xs sm:text-sm font-bold text-gray-800">{submitError}</p>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* SECTION 1: ABOUT YOU                                      */}
            {/* ========================================================= */}
            <section className="space-y-5">
              <div className="flex items-center gap-2 pb-2 border-b-3 border-[#121316]">
                <div className="w-8 h-8 rounded-xl bg-[#FFE600] border-2 border-[#121316] shadow-pop-xs flex items-center justify-center font-black text-xs">
                  1
                </div>
                <h3 className="text-xl font-black text-[#121316] tracking-tight uppercase">
                  ABOUT YOU
                </h3>
              </div>

              <div className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block font-mono text-xs font-black uppercase text-[#121316] mb-1.5">
                    FULL NAME <span className="text-[#FF4757]">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-gray-400 absolute left-4 top-3.5" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="e.g. Yeswin Sri Datta"
                      className={`w-full pl-11 pr-4 py-3 rounded-2xl bg-[#FAF7F0] border-2 text-sm font-bold text-[#121316] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FFE600] transition-all ${
                        errors.name ? 'border-[#FF4757] ring-2 ring-[#FF4757]/30' : 'border-[#121316] shadow-pop-xs'
                      }`}
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-1 text-xs font-mono font-bold text-[#FF4757] flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.name}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Email Address */}
                  <div>
                    <label className="block font-mono text-xs font-black uppercase text-[#121316] mb-1.5">
                      EMAIL ADDRESS <span className="text-[#FF4757]">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-gray-400 absolute left-4 top-3.5" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="yourname@niat.edu.in"
                        className={`w-full pl-11 pr-4 py-3 rounded-2xl bg-[#FAF7F0] border-2 text-sm font-bold text-[#121316] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FFE600] transition-all ${
                          errors.email ? 'border-[#FF4757] ring-2 ring-[#FF4757]/30' : 'border-[#121316] shadow-pop-xs'
                        }`}
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-xs font-mono font-bold text-[#FF4757] flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block font-mono text-xs font-black uppercase text-[#121316] mb-1.5">
                      PHONE NUMBER <span className="text-[#FF4757]">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-gray-400 absolute left-4 top-3.5" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="+91 98765 43210"
                        className={`w-full pl-11 pr-4 py-3 rounded-2xl bg-[#FAF7F0] border-2 text-sm font-bold text-[#121316] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FFE600] transition-all ${
                          errors.phone ? 'border-[#FF4757] ring-2 ring-[#FF4757]/30' : 'border-[#121316] shadow-pop-xs'
                        }`}
                      />
                    </div>
                    {errors.phone && (
                      <p className="mt-1 text-xs font-mono font-bold text-[#FF4757] flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* ========================================================= */}
            {/* SECTION 2: ACADEMIC DETAILS                               */}
            {/* ========================================================= */}
            <section className="space-y-5">
              <div className="flex items-center gap-2 pb-2 border-b-3 border-[#121316]">
                <div className="w-8 h-8 rounded-xl bg-[#6C5CE7] text-white border-2 border-[#121316] shadow-pop-xs flex items-center justify-center font-black text-xs">
                  2
                </div>
                <h3 className="text-xl font-black text-[#121316] tracking-tight uppercase">
                  ACADEMIC DETAILS
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Year Selection */}
                <div>
                  <label className="block font-mono text-xs font-black uppercase text-[#121316] mb-1.5">
                    YEAR OF STUDY <span className="text-[#FF4757]">*</span>
                  </label>
                  <div className="relative">
                    <GraduationCap className="w-4 h-4 text-gray-400 absolute left-4 top-3.5 pointer-events-none" />
                    <select
                      name="year"
                      value={formData.year}
                      onChange={(e) => handleInputChange('year', e.target.value)}
                      className={`w-full pl-11 pr-8 py-3 rounded-2xl bg-[#FAF7F0] border-2 text-sm font-bold text-[#121316] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FFE600] transition-all appearance-none cursor-pointer ${
                        errors.year ? 'border-[#FF4757] ring-2 ring-[#FF4757]/30' : 'border-[#121316] shadow-pop-xs'
                      }`}
                    >
                      <option value="">Select Academic Year</option>
                      {MEMBERSHIP_YEARS.map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.year && (
                    <p className="mt-1 text-xs font-mono font-bold text-[#FF4757] flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.year}
                    </p>
                  )}
                </div>

                {/* Section Selection */}
                <div>
                  <label className="block font-mono text-xs font-black uppercase text-[#121316] mb-1.5">
                    SECTION <span className="text-[#FF4757]">*</span>
                  </label>
                  <div className="relative">
                    <Layers className="w-4 h-4 text-gray-400 absolute left-4 top-3.5 pointer-events-none" />
                    <select
                      name="section"
                      value={formData.section}
                      onChange={(e) => handleInputChange('section', e.target.value)}
                      className={`w-full pl-11 pr-8 py-3 rounded-2xl bg-[#FAF7F0] border-2 text-sm font-bold text-[#121316] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FFE600] transition-all appearance-none cursor-pointer ${
                        errors.section ? 'border-[#FF4757] ring-2 ring-[#FF4757]/30' : 'border-[#121316] shadow-pop-xs'
                      }`}
                    >
                      <option value="">Select Section (S01 - S07)</option>
                      {MEMBERSHIP_SECTIONS.map((sec) => (
                        <option key={sec} value={sec}>
                          Section {sec}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.section && (
                    <p className="mt-1 text-xs font-mono font-bold text-[#FF4757] flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.section}
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* ========================================================= */}
            {/* SECTION 3: YOUR WORK                                      */}
            {/* ========================================================= */}
            <section className="space-y-5">
              <div className="flex items-center gap-2 pb-2 border-b-3 border-[#121316]">
                <div className="w-8 h-8 rounded-xl bg-[#2ED573] border-2 border-[#121316] shadow-pop-xs flex items-center justify-center font-black text-xs">
                  3
                </div>
                <h3 className="text-xl font-black text-[#121316] tracking-tight uppercase">
                  YOUR WORK & INTERESTS
                </h3>
              </div>

              <div className="space-y-4">
                {/* Resume / Work Link */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="font-mono text-xs font-black uppercase text-[#121316]">
                      RESUME / PORTFOLIO / WORK LINK
                    </label>
                    <span className="font-mono text-[10px] font-bold text-gray-500 uppercase">
                      OPTIONAL
                    </span>
                  </div>
                  <div className="relative">
                    <LinkIcon className="w-4 h-4 text-gray-400 absolute left-4 top-3.5" />
                    <input
                      type="url"
                      name="resumeLink"
                      value={formData.resumeLink}
                      onChange={(e) => handleInputChange('resumeLink', e.target.value)}
                      placeholder="https://drive.google.com/... or https://github.com/username"
                      className={`w-full pl-11 pr-4 py-3 rounded-2xl bg-[#FAF7F0] border-2 text-sm font-bold text-[#121316] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FFE600] transition-all ${
                        errors.resumeLink ? 'border-[#FF4757] ring-2 ring-[#FF4757]/30' : 'border-[#121316] shadow-pop-xs'
                      }`}
                    />
                  </div>
                  {errors.resumeLink ? (
                    <p className="mt-1 text-xs font-mono font-bold text-[#FF4757] flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.resumeLink}
                    </p>
                  ) : (
                    <p className="mt-1 text-[11px] font-mono text-gray-500">
                      Share your Google Drive resume, GitHub, LinkedIn, or personal portfolio.
                    </p>
                  )}
                </div>

                {/* Skills & Interests */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="font-mono text-xs font-black uppercase text-[#121316]">
                      SKILLS & INTERESTS
                    </label>
                    <span className="font-mono text-[10px] font-bold text-gray-500 uppercase">
                      OPTIONAL
                    </span>
                  </div>
                  <div className="relative">
                    <Code className="w-4 h-4 text-gray-400 absolute left-4 top-3.5" />
                    <input
                      type="text"
                      name="skills"
                      value={formData.skills}
                      onChange={(e) => handleInputChange('skills', e.target.value)}
                      placeholder="Robotics, AI, Web Development, Design, Video Editing..."
                      className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#FAF7F0] border-2 border-[#121316] shadow-pop-xs text-sm font-bold text-[#121316] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FFE600] transition-all"
                    />
                  </div>
                </div>

                {/* Previous Experience */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="font-mono text-xs font-black uppercase text-[#121316]">
                      PREVIOUS EXPERIENCE / PROJECTS
                    </label>
                    <span className="font-mono text-[10px] font-bold text-gray-500 uppercase">
                      OPTIONAL
                    </span>
                  </div>
                  <textarea
                    name="experience"
                    rows={4}
                    value={formData.experience}
                    onChange={(e) => handleInputChange('experience', e.target.value)}
                    placeholder="Tell us about previous robotics projects, hackathons attended, tools you love (Arduino, Python, Blender, React), or event management experiences..."
                    className="w-full px-4 py-3 rounded-2xl bg-[#FAF7F0] border-2 border-[#121316] shadow-pop-xs text-sm font-bold text-[#121316] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FFE600] transition-all leading-relaxed"
                  />
                </div>
              </div>
            </section>

            {/* ========================================================= */}
            {/* SECTION 4: YOUR AVAILABILITY                              */}
            {/* ========================================================= */}
            <section className="space-y-5">
              <div className="flex items-center gap-2 pb-2 border-b-3 border-[#121316]">
                <div className="w-8 h-8 rounded-xl bg-[#FF4757] text-white border-2 border-[#121316] shadow-pop-xs flex items-center justify-center font-black text-xs">
                  4
                </div>
                <h3 className="text-xl font-black text-[#121316] tracking-tight uppercase">
                  YOUR AVAILABILITY
                </h3>
              </div>

              <div>
                <label className="block font-mono text-xs font-black uppercase text-[#121316] mb-1.5">
                  HOURS AVAILABLE PER WEEK <span className="text-[#FF4757]">*</span>
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-gray-400 absolute left-4 top-3.5 pointer-events-none" />
                  <select
                    name="availability"
                    value={formData.availability}
                    onChange={(e) => handleInputChange('availability', e.target.value)}
                    className={`w-full pl-11 pr-8 py-3 rounded-2xl bg-[#FAF7F0] border-2 text-sm font-bold text-[#121316] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FFE600] transition-all appearance-none cursor-pointer ${
                      errors.availability ? 'border-[#FF4757] ring-2 ring-[#FF4757]/30' : 'border-[#121316] shadow-pop-xs'
                    }`}
                  >
                    <option value="">Select Weekly Commitment</option>
                    {MEMBERSHIP_AVAILABILITY_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.availability && (
                  <p className="mt-1 text-xs font-mono font-bold text-[#FF4757] flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.availability}
                  </p>
                )}
              </div>
            </section>

            {/* ========================================================= */}
            {/* SUBMIT BUTTON & DISCLAIMER                                */}
            {/* ========================================================= */}
            <div className="pt-4 border-t-3 border-[#121316] space-y-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-2xl bg-[#FFE600] hover:bg-[#FFD32A] disabled:bg-gray-300 text-[#121316] font-mono text-sm sm:text-base font-black uppercase border-3 border-[#121316] shadow-pop hover:shadow-pop-lg active:translate-x-[1px] active:translate-y-[1px] flex items-center justify-center gap-2 cursor-pointer transition-all disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>SUBMITTING APPLICATION...</span>
                  </>
                ) : (
                  <>
                    <span>SUBMIT MEMBERSHIP APPLICATION</span>
                    <ArrowRight className="w-5 h-5 stroke-[3]" />
                  </>
                )}
              </button>

              <div className="text-center">
                <span className="font-mono text-[11px] font-bold text-gray-500">
                  🔒 Your application data will only be visible to verified ATC club administrators.
                </span>
              </div>
            </div>
          </form>
        )}
      </main>
    </div>
  );
};

export default JoinCommunityPage;
