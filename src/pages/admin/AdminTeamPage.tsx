import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { TeamService } from '../../services/teamService';
import { StorageService } from '../../services/storage.service';
import { TeamMember, TeamMemberRole, TeamMemberStatus } from '../../types/team.types';
import {
  Users,
  Plus,
  ArrowLeft,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Loader2,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  Upload,
  X,
  ExternalLink,
  ShieldCheck,
  Crown,
  Sparkles,
  Camera,
  Image as ImageIcon,
  UserCheck
} from 'lucide-react';
import { LinkedinIcon, GithubIcon } from '../../components/common/SocialIcons';
import confetti from 'canvas-confetti';

export const AdminTeamPage: React.FC = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Modal State: Add or Edit
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  // Form Fields State
  const [formName, setFormName] = useState<string>('');
  const [formRole, setFormRole] = useState<TeamMemberRole>('Core Member');
  const [formLinkedinUrl, setFormLinkedinUrl] = useState<string>('');
  const [formGithubUrl, setFormGithubUrl] = useState<string>('');
  const [formStatus, setFormStatus] = useState<TeamMemberStatus>('active');
  const [formDisplayOrder, setFormDisplayOrder] = useState<number>(1);

  // Image Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [existingImageId, setExistingImageId] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState<boolean>(false);

  // Validation State
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Delete Confirmation State
  const [memberToDelete, setMemberToDelete] = useState<TeamMember | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Quick Status Update Loading ID
  const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(null);
  const [isReordering, setIsReordering] = useState<boolean>(false);

  // Load all team members
  const loadMembers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await TeamService.getAllMembers();
      if (res.success && res.data) {
        setMembers(res.data);
      } else {
        setError(res.error || 'Failed to load team members.');
      }
    } catch (err: any) {
      setError(err?.message || 'Unexpected error fetching team members.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  // Separate Leadership from Core Members
  const leadershipMembers = useMemo(() => {
    const president = members.find((m) => m.role === 'President');
    const vp = members.find((m) => m.role === 'Vice President');
    const result: TeamMember[] = [];
    if (president) result.push(president);
    if (vp) result.push(vp);
    return result;
  }, [members]);

  const coreMembers = useMemo(() => {
    return members
      .filter((m) => m.role !== 'President' && m.role !== 'Vice President')
      .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  }, [members]);

  // Open Add Modal
  const handleOpenAddModal = () => {
    setEditingMember(null);
    setFormName('');
    setFormRole('Core Member');
    setFormLinkedinUrl('');
    setFormGithubUrl('');
    setFormStatus('active');
    setFormDisplayOrder(coreMembers.length + 1);
    setSelectedFile(null);
    setImagePreview(null);
    setExistingImageId(null);
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (member: TeamMember) => {
    setEditingMember(member);
    setFormName(member.name);
    setFormRole(member.role);
    setFormLinkedinUrl(member.linkedinUrl || '');
    setFormGithubUrl(member.githubUrl || '');
    setFormStatus(member.status);
    setFormDisplayOrder(member.displayOrder || 1);
    setSelectedFile(null);
    setExistingImageId(member.imageId || null);
    setImagePreview(member.imageId ? StorageService.getTeamMemberAvatarUrl(member.imageId, 400) : null);
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Handle Image File Selection
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = StorageService.validateImageFile(file);
    if (!validation.valid) {
      setFormErrors((prev) => ({ ...prev, image: validation.error || 'Invalid image file.' }));
      return;
    }

    setFormErrors((prev) => {
      const next = { ...prev };
      delete next.image;
      return next;
    });

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setImagePreview(objectUrl);
  };

  // Remove Selected Image
  const handleRemoveImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
    setExistingImageId(null);
  };

  // Validate and Submit Form (Add or Edit)
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!formName.trim()) {
      errors.name = 'Full Name is required.';
    }

    if (!formRole.trim()) {
      errors.role = 'Role is required.';
    }

    // Validate URL formats if provided
    if (formLinkedinUrl.trim()) {
      try {
        const u = formLinkedinUrl.trim().startsWith('http') ? formLinkedinUrl.trim() : `https://${formLinkedinUrl.trim()}`;
        new URL(u);
      } catch {
        errors.linkedinUrl = 'Please enter a valid LinkedIn URL.';
      }
    }

    if (formGithubUrl.trim()) {
      try {
        const u = formGithubUrl.trim().startsWith('http') ? formGithubUrl.trim() : `https://${formGithubUrl.trim()}`;
        new URL(u);
      } catch {
        errors.githubUrl = 'Please enter a valid GitHub URL.';
      }
    }

    // Check duplicate leadership rules
    if (formStatus === 'active' && (formRole === 'President' || formRole === 'Vice President')) {
      const check = await TeamService.checkLeadershipAvailability(
        formRole,
        editingMember?.$id
      );
      if (!check.available) {
        errors.role = check.error || `An active ${formRole} already exists.`;
      }
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);

    try {
      let finalImageId: string | null = existingImageId;

      // 1. Upload new image if selected
      if (selectedFile) {
        setUploadingImage(true);
        const uploadRes = await StorageService.uploadTeamImage(selectedFile);
        setUploadingImage(false);

        if (!uploadRes.success || !uploadRes.data?.file_id) {
          setFormErrors({ image: uploadRes.error || 'Failed to upload profile image.' });
          setIsSubmitting(false);
          return;
        }
        finalImageId = uploadRes.data.file_id;
      }

      const formattedLinkedin = formLinkedinUrl.trim()
        ? formLinkedinUrl.trim().startsWith('http')
          ? formLinkedinUrl.trim()
          : `https://${formLinkedinUrl.trim()}`
        : null;

      const formattedGithub = formGithubUrl.trim()
        ? formGithubUrl.trim().startsWith('http')
          ? formGithubUrl.trim()
          : `https://${formGithubUrl.trim()}`
        : null;

      if (editingMember?.$id) {
        // Edit Member
        const updateRes = await TeamService.updateMember(
          editingMember.$id,
          {
            name: formName.trim(),
            role: formRole.trim(),
            imageId: finalImageId,
            linkedinUrl: formattedLinkedin,
            githubUrl: formattedGithub,
            status: formStatus,
            displayOrder: formRole === 'President' || formRole === 'Vice President' ? 0 : Number(formDisplayOrder),
          },
          editingMember.imageId
        );

        if (updateRes.success && updateRes.data) {
          setMembers((prev) =>
            prev.map((m) => (m.$id === editingMember.$id ? updateRes.data! : m))
          );
          setIsModalOpen(false);
        } else {
          setFormErrors({ submit: updateRes.error || 'Failed to update member.' });
        }
      } else {
        // Add Member
        const createRes = await TeamService.createMember({
          name: formName.trim(),
          role: formRole.trim(),
          imageId: finalImageId,
          linkedinUrl: formattedLinkedin,
          githubUrl: formattedGithub,
          status: formStatus,
          displayOrder: formRole === 'President' || formRole === 'Vice President' ? 0 : Number(formDisplayOrder),
        });

        if (createRes.success && createRes.data) {
          setMembers((prev) => [...prev, createRes.data!]);
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#FFE600', '#6C5CE7', '#2ED573'],
          });
          setIsModalOpen(false);
        } else {
          setFormErrors({ submit: createRes.error || 'Failed to create member.' });
        }
      }
    } catch (err: any) {
      setFormErrors({ submit: err?.message || 'An unexpected error occurred.' });
    } finally {
      setIsSubmitting(false);
      setUploadingImage(false);
    }
  };

  // Delete Member
  const handleConfirmDelete = async () => {
    if (!memberToDelete?.$id || isDeleting) return;

    setIsDeleting(true);
    try {
      const res = await TeamService.deleteMember(memberToDelete.$id, memberToDelete.imageId);
      if (res.success) {
        setMembers((prev) => prev.filter((m) => m.$id !== memberToDelete.$id));
        setMemberToDelete(null);
      } else {
        alert(res.error || 'Failed to delete team member.');
      }
    } catch (err: any) {
      alert(err?.message || 'Error deleting member.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Quick Status Switcher
  const handleQuickStatusChange = async (member: TeamMember, newStatus: TeamMemberStatus) => {
    if (!member.$id || statusUpdatingId) return;

    setStatusUpdatingId(member.$id);
    try {
      const res = await TeamService.updateMemberStatus(member.$id, newStatus, member.role);
      if (res.success) {
        setMembers((prev) =>
          prev.map((m) => (m.$id === member.$id ? { ...m, status: newStatus } : m))
        );
      } else {
        alert(res.error || 'Failed to update status.');
      }
    } catch (err: any) {
      alert(err?.message || 'Error updating status.');
    } finally {
      setStatusUpdatingId(null);
    }
  };

  // Reorder Core Members (Move Up / Down)
  const handleMoveCoreMember = async (index: number, direction: 'up' | 'down') => {
    if (isReordering) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= coreMembers.length) return;

    setIsReordering(true);
    const newCoreList = [...coreMembers];
    const temp = newCoreList[index];
    newCoreList[index] = newCoreList[targetIndex];
    newCoreList[targetIndex] = temp;

    // Assign sequential displayOrder
    const updatedOrders = newCoreList.map((m, idx) => ({
      id: m.$id!,
      displayOrder: idx + 1,
    }));

    // Optimistically update UI
    setMembers((prev) => {
      const leadership = prev.filter((m) => m.role === 'President' || m.role === 'Vice President');
      const updatedCore = newCoreList.map((m, idx) => ({ ...m, displayOrder: idx + 1 }));
      return [...leadership, ...updatedCore];
    });

    try {
      await TeamService.updateDisplayOrders(updatedOrders);
    } catch (err) {
      console.error('Failed to save display orders:', err);
      loadMembers();
    } finally {
      setIsReordering(false);
    }
  };

  const getStatusBadge = (status: TeamMemberStatus) => {
    switch (status) {
      case 'active':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-[#E8F8F0] border border-[#2ED573] font-mono text-[10px] font-black uppercase text-[#2ED573]">
            ● Active
          </span>
        );
      case 'inactive':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-gray-100 border border-gray-400 font-mono text-[10px] font-bold uppercase text-gray-600">
            Inactive
          </span>
        );
      case 'alumni':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-[#E1DCFF] border border-[#6C5CE7] font-mono text-[10px] font-black uppercase text-[#6C5CE7]">
            ★ Alumni
          </span>
        );
      default:
        return null;
    }
  };

  const getRoleBadge = (role: string) => {
    if (role === 'President') {
      return (
        <span className="px-3 py-1 rounded-full bg-[#FFE600] border-2 border-[#121316] font-mono text-xs font-black uppercase text-[#121316] shadow-pop-sm flex items-center gap-1">
          <Crown className="w-3.5 h-3.5 fill-[#121316]" />
          President
        </span>
      );
    }
    if (role === 'Vice President') {
      return (
        <span className="px-3 py-1 rounded-full bg-[#E1DCFF] border-2 border-[#6C5CE7] font-mono text-xs font-black uppercase text-[#6C5CE7] shadow-pop-sm flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" />
          Vice President
        </span>
      );
    }
    return (
      <span className="px-3 py-0.5 rounded-full bg-[#FAF7F0] border border-[#121316] font-mono text-[11px] font-bold text-[#121316]">
        {role}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#FAF7F0] py-10 px-4 sm:px-6 lg:px-8 paper-pattern select-none">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              to="/admin/dashboard"
              className="w-10 h-10 rounded-2xl bg-white border-2 border-[#121316] shadow-pop-sm flex items-center justify-center hover:bg-[#FFE600] transition-colors"
              title="Back to Dashboard"
            >
              <ArrowLeft className="w-5 h-5 text-[#121316]" />
            </Link>
            <div>
              <span className="font-mono text-xs font-black uppercase text-[#6C5CE7]">
                ADMIN MANAGEMENT PORTAL
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-[#121316] tracking-tight">
                Team Management
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            <button
              onClick={loadMembers}
              disabled={loading}
              className="p-2.5 rounded-2xl bg-white hover:bg-gray-100 border-2 border-[#121316] shadow-pop-sm transition-all text-[#121316] cursor-pointer"
              title="Refresh team members"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            <Link
              to="/team"
              target="_blank"
              className="px-4 py-2 rounded-2xl bg-white hover:bg-gray-100 border-2 border-[#121316] shadow-pop-sm font-mono text-xs font-black text-[#121316] flex items-center gap-1.5 transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Public Page</span>
            </Link>

            <button
              onClick={handleOpenAddModal}
              className="px-5 py-2.5 rounded-full bg-[#FFE600] hover:bg-[#FFD32A] font-mono text-xs font-black border-2 border-[#121316] shadow-pop hover:shadow-pop-lg active:translate-x-[1px] active:translate-y-[1px] flex items-center gap-2 text-[#121316] cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>ADD MEMBER</span>
            </button>
          </div>
        </div>

        {/* METRICS BANNER */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-white border-3 border-[#121316] shadow-pop-sm space-y-1">
            <span className="font-mono text-[10px] font-black uppercase text-gray-500">TOTAL MEMBERS</span>
            <h3 className="text-3xl font-black text-[#121316]">{members.length}</h3>
          </div>
          <div className="p-5 rounded-3xl bg-white border-3 border-[#121316] shadow-pop-sm space-y-1">
            <span className="font-mono text-[10px] font-black uppercase text-[#2ED573]">ACTIVE MEMBERS</span>
            <h3 className="text-3xl font-black text-[#2ED573]">
              {members.filter((m) => m.status === 'active').length}
            </h3>
          </div>
          <div className="p-5 rounded-3xl bg-white border-3 border-[#121316] shadow-pop-sm space-y-1">
            <span className="font-mono text-[10px] font-black uppercase text-[#6C5CE7]">LEADERSHIP</span>
            <h3 className="text-3xl font-black text-[#6C5CE7]">{leadershipMembers.length} / 2</h3>
          </div>
          <div className="p-5 rounded-3xl bg-white border-3 border-[#121316] shadow-pop-sm space-y-1">
            <span className="font-mono text-[10px] font-black uppercase text-[#FF6B6B]">CORE HEADS</span>
            <h3 className="text-3xl font-black text-[#FF6B6B]">{coreMembers.length}</h3>
          </div>
        </div>

        {loading ? (
          <div className="p-16 text-center space-y-3 bg-white rounded-[36px] border-4 border-[#121316] shadow-pop">
            <Loader2 className="w-8 h-8 text-[#6C5CE7] animate-spin mx-auto" />
            <h3 className="font-black text-lg text-[#121316]">Loading Team Directory...</h3>
          </div>
        ) : error ? (
          <div className="p-8 text-center space-y-3 bg-[#FFE5E5] rounded-[36px] border-4 border-[#FF4757] shadow-pop text-[#FF4757]">
            <AlertTriangle className="w-8 h-8 mx-auto" />
            <p className="font-bold text-sm">{error}</p>
          </div>
        ) : (
          <div className="space-y-10">
            
            {/* ============================================================= */}
            {/* 1. CLUB LEADERSHIP SECTION                                    */}
            {/* ============================================================= */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b-3 border-[#121316]">
                <div className="flex items-center gap-2">
                  <Crown className="w-5 h-5 text-[#FFE600] fill-[#121316]" />
                  <h2 className="text-xl font-black text-[#121316] uppercase tracking-wide">
                    Club Leadership (President & VP)
                  </h2>
                </div>
                <span className="font-mono text-xs font-bold text-gray-500">
                  Fixed Top Hierarchy
                </span>
              </div>

              {leadershipMembers.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-3xl border-3 border-dashed border-[#121316]/30 text-gray-500 font-bold text-xs space-y-2">
                  <p>No active President or Vice President appointed yet.</p>
                  <button
                    onClick={handleOpenAddModal}
                    className="px-4 py-1.5 rounded-full bg-[#FFE600] border-2 border-[#121316] font-mono text-xs font-black text-[#121316] shadow-pop-sm"
                  >
                    + Appoint Leader
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {leadershipMembers.map((leader) => (
                    <div
                      key={leader.$id}
                      className="p-6 rounded-[32px] bg-white border-4 border-[#121316] shadow-pop hover:shadow-pop-lg transition-all flex flex-col justify-between gap-6"
                    >
                      <div className="flex items-start gap-4">
                        {/* Avatar */}
                        <div className="w-20 h-20 rounded-2xl border-3 border-[#121316] overflow-hidden bg-[#FAF7F0] shadow-pop-sm flex-shrink-0 flex items-center justify-center">
                          {leader.imageId ? (
                            <img
                              src={StorageService.getTeamMemberAvatarUrl(leader.imageId, 200)}
                              alt={leader.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.currentTarget as HTMLElement).style.display = 'none';
                              }}
                            />
                          ) : (
                            <span className="font-mono font-black text-2xl text-[#121316]">
                              {leader.name.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>

                        {/* Details */}
                        <div className="space-y-1 flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            {getRoleBadge(leader.role)}
                            {getStatusBadge(leader.status)}
                          </div>
                          <h3 className="text-xl font-black text-[#121316] tracking-tight truncate">
                            {leader.name}
                          </h3>
                          
                          <div className="flex items-center gap-3 pt-1 font-mono text-xs text-gray-500 font-bold">
                            {leader.linkedinUrl && (
                              <a
                                href={leader.linkedinUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[#6C5CE7] hover:underline flex items-center gap-1"
                              >
                                <LinkedinIcon className="w-3.5 h-3.5" />
                                <span>LinkedIn</span>
                              </a>
                            )}
                            {leader.githubUrl && (
                              <a
                                href={leader.githubUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-gray-800 hover:underline flex items-center gap-1"
                              >
                                <GithubIcon className="w-3.5 h-3.5" />
                                <span>GitHub</span>
                              </a>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Action Bar */}
                      <div className="pt-3 border-t-2 border-[#121316]/10 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] font-bold text-gray-400 uppercase">Status:</span>
                          <select
                            value={leader.status}
                            disabled={statusUpdatingId === leader.$id}
                            onChange={(e) => handleQuickStatusChange(leader, e.target.value as TeamMemberStatus)}
                            className="px-2 py-1 rounded-lg bg-[#FAF7F0] border border-[#121316] font-mono text-[10px] font-black text-[#121316] cursor-pointer"
                          >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="alumni">Alumni</option>
                          </select>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(leader)}
                            className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#E1DCFF] border-2 border-[#121316] shadow-pop-sm font-mono text-xs font-black text-[#121316] flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <Edit className="w-3.5 h-3.5 text-[#6C5CE7]" />
                            <span>Edit</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setMemberToDelete(leader)}
                            className="p-1.5 rounded-xl bg-[#FFE5E5] hover:bg-[#FF4757] hover:text-white border-2 border-[#FF4757] text-[#FF4757] shadow-pop-sm cursor-pointer transition-colors"
                            title="Delete leader"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ============================================================= */}
            {/* 2. CORE TEAM SECTION (Sortable by displayOrder)               */}
            {/* ============================================================= */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b-3 border-[#121316]">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#6C5CE7]" />
                  <h2 className="text-xl font-black text-[#121316] uppercase tracking-wide">
                    Core Team Members ({coreMembers.length})
                  </h2>
                </div>
                <span className="font-mono text-xs font-bold text-gray-500">
                  Sorted by Display Order
                </span>
              </div>

              {coreMembers.length === 0 ? (
                <div className="p-12 text-center bg-white rounded-3xl border-3 border-dashed border-[#121316]/30 text-gray-500 font-bold text-xs space-y-2">
                  <p>No core team members added yet.</p>
                  <button
                    onClick={handleOpenAddModal}
                    className="px-5 py-2 rounded-full bg-[#FFE600] border-2 border-[#121316] font-mono text-xs font-black text-[#121316] shadow-pop-sm"
                  >
                    + Add Core Member
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {coreMembers.map((member, index) => (
                    <div
                      key={member.$id}
                      className="p-5 rounded-[32px] bg-white border-4 border-[#121316] shadow-pop hover:shadow-pop-md transition-all flex flex-col justify-between gap-4"
                    >
                      <div className="space-y-3">
                        {/* Top Meta: Order & Status */}
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-0.5 rounded-lg bg-[#FAF7F0] border border-[#121316] font-mono text-[10px] font-black text-gray-700">
                            #{member.displayOrder || index + 1}
                          </span>
                          <div className="flex items-center gap-1.5">
                            {getStatusBadge(member.status)}
                          </div>
                        </div>

                        {/* Avatar & Info */}
                        <div className="flex items-center gap-3.5">
                          <div className="w-16 h-16 rounded-2xl border-2 border-[#121316] overflow-hidden bg-[#FAF7F0] shadow-pop-sm flex-shrink-0 flex items-center justify-center">
                            {member.imageId ? (
                              <img
                                src={StorageService.getTeamMemberAvatarUrl(member.imageId, 180)}
                                alt={member.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.currentTarget as HTMLElement).style.display = 'none';
                                }}
                              />
                            ) : (
                              <span className="font-mono font-black text-xl text-[#121316]">
                                {member.name.charAt(0).toUpperCase()}
                              </span>
                            )}
                          </div>

                          <div className="space-y-0.5 min-w-0">
                            <span className="px-2 py-0.5 rounded-full bg-[#FAF7F0] border border-[#121316] font-mono text-[9px] font-black uppercase text-[#6C5CE7] block truncate max-w-[150px]">
                              {member.role}
                            </span>
                            <h3 className="text-lg font-black text-[#121316] tracking-tight truncate">
                              {member.name}
                            </h3>
                          </div>
                        </div>

                        {/* Social Links */}
                        <div className="flex items-center gap-3 font-mono text-[11px] text-gray-500 font-bold">
                          {member.linkedinUrl && (
                            <a
                              href={member.linkedinUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[#6C5CE7] hover:underline flex items-center gap-1"
                            >
                              <LinkedinIcon className="w-3 h-3" />
                              <span>LinkedIn</span>
                            </a>
                          )}
                          {member.githubUrl && (
                            <a
                              href={member.githubUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-gray-800 hover:underline flex items-center gap-1"
                            >
                              <GithubIcon className="w-3 h-3" />
                              <span>GitHub</span>
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Footer Actions: Reorder Buttons + Edit/Delete */}
                      <div className="pt-3 border-t-2 border-[#121316]/10 flex items-center justify-between gap-2">
                        {/* Move Up / Down */}
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={index === 0 || isReordering}
                            onClick={() => handleMoveCoreMember(index, 'up')}
                            className="p-1.5 rounded-lg bg-[#FAF7F0] hover:bg-[#FFE600] border border-[#121316] disabled:opacity-30 cursor-pointer shadow-pop-sm"
                            title="Move Up in display order"
                          >
                            <ArrowUp className="w-3.5 h-3.5 text-[#121316]" />
                          </button>

                          <button
                            type="button"
                            disabled={index === coreMembers.length - 1 || isReordering}
                            onClick={() => handleMoveCoreMember(index, 'down')}
                            className="p-1.5 rounded-lg bg-[#FAF7F0] hover:bg-[#FFE600] border border-[#121316] disabled:opacity-30 cursor-pointer shadow-pop-sm"
                            title="Move Down in display order"
                          >
                            <ArrowDown className="w-3.5 h-3.5 text-[#121316]" />
                          </button>
                        </div>

                        {/* Edit & Delete */}
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(member)}
                            className="px-2.5 py-1 rounded-lg bg-white hover:bg-[#E1DCFF] border border-[#121316] shadow-pop-sm font-mono text-[11px] font-black text-[#121316] flex items-center gap-1 cursor-pointer"
                          >
                            <Edit className="w-3 h-3 text-[#6C5CE7]" />
                            <span>Edit</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setMemberToDelete(member)}
                            className="p-1 rounded-lg bg-[#FFE5E5] hover:bg-[#FF4757] hover:text-white border border-[#FF4757] text-[#FF4757] cursor-pointer"
                            title="Delete member"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

      </div>

      {/* =================================================================== */}
      {/* ADD / EDIT MEMBER MODAL                                             */}
      {/* =================================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-white rounded-[36px] border-4 border-[#121316] shadow-pop-xl paper-pattern overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-6 bg-[#FAF7F0] border-b-3 border-[#121316] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#FFE600] border-2 border-[#121316] shadow-pop-sm flex items-center justify-center font-mono font-black text-sm text-[#121316]">
                  {editingMember ? '✎' : '+'}
                </div>
                <h3 className="text-xl font-black text-[#121316]">
                  {editingMember ? 'Edit Team Member' : 'Add Team Member'}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-9 h-9 rounded-xl bg-white border-2 border-[#121316] shadow-pop-sm flex items-center justify-center hover:bg-[#FFE5E5] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4 text-[#121316]" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleFormSubmit} className="p-6 overflow-y-auto space-y-5">
              
              {/* Profile Image Picker & Preview */}
              <div className="space-y-2">
                <label className="font-mono text-xs font-black uppercase text-gray-700 block">
                  Profile Picture
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-2xl border-3 border-[#121316] overflow-hidden bg-[#FAF7F0] shadow-pop-sm flex-shrink-0 flex items-center justify-center relative">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Camera className="w-6 h-6 text-gray-400" />
                    )}
                  </div>

                  <div className="space-y-1.5 flex-1">
                    <label className="px-4 py-2 rounded-xl bg-white hover:bg-gray-100 border-2 border-[#121316] shadow-pop-sm font-mono text-xs font-black text-[#121316] inline-flex items-center gap-2 cursor-pointer transition-all">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{imagePreview ? 'Change Image' : 'Upload Image'}</span>
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/avif"
                        onChange={handleImageFileChange}
                        className="hidden"
                      />
                    </label>

                    {imagePreview && (
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="text-[11px] font-mono font-bold text-[#FF4757] hover:underline block"
                      >
                        Remove picture
                      </button>
                    )}

                    <span className="font-mono text-[10px] text-gray-400 block">
                      PNG, JPG, or WebP up to 10MB.
                    </span>
                  </div>
                </div>
                {formErrors.image && (
                  <p className="font-mono text-xs text-[#FF4757] font-bold">{formErrors.image}</p>
                )}
              </div>

              {/* Full Name Input */}
              <div className="space-y-1.5">
                <label className="font-mono text-xs font-black uppercase text-gray-700 block">
                  Full Name <span className="text-[#FF4757]">*</span>
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Alex Johnson"
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#FAF7F0] border-2 border-[#121316] text-xs font-bold text-[#121316] placeholder-gray-400 focus:outline-none focus:bg-white shadow-pop-sm"
                />
                {formErrors.name && (
                  <p className="font-mono text-xs text-[#FF4757] font-bold">{formErrors.name}</p>
                )}
              </div>

              {/* Role Dropdown */}
              <div className="space-y-1.5">
                <label className="font-mono text-xs font-black uppercase text-gray-700 block">
                  Role in Club <span className="text-[#FF4757]">*</span>
                </label>
                <select
                  value={formRole}
                  onChange={(e) => setFormRole(e.target.value as TeamMemberRole)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#FAF7F0] border-2 border-[#121316] text-xs font-black text-[#121316] focus:outline-none focus:bg-white shadow-pop-sm cursor-pointer"
                >
                  <option value="President">👑 President (Leader #1)</option>
                  <option value="Vice President">⭐ Vice President (Leader #2)</option>
                  <option value="Core Member">Core Member (Department Lead)</option>
                  <option value="Technical Head">Technical Head</option>
                  <option value="Design Head">Design Head</option>
                  <option value="Operations Head">Operations Head</option>
                  <option value="Social Media Head">Social Media Head</option>
                  <option value="Outreach Head">Outreach Head</option>
                  <option value="Finance Head">Finance Head</option>
                </select>
                {formErrors.role && (
                  <p className="font-mono text-xs text-[#FF4757] font-bold">{formErrors.role}</p>
                )}
              </div>

              {/* LinkedIn URL */}
              <div className="space-y-1.5">
                <label className="font-mono text-xs font-black uppercase text-gray-700 flex items-center gap-1.5">
                  <LinkedinIcon className="w-3.5 h-3.5 text-[#6C5CE7]" />
                  <span>LinkedIn Profile URL</span>
                </label>
                <input
                  type="text"
                  value={formLinkedinUrl}
                  onChange={(e) => setFormLinkedinUrl(e.target.value)}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#FAF7F0] border-2 border-[#121316] text-xs font-bold text-[#121316] placeholder-gray-400 focus:outline-none focus:bg-white shadow-pop-sm"
                />
                {formErrors.linkedinUrl && (
                  <p className="font-mono text-xs text-[#FF4757] font-bold">{formErrors.linkedinUrl}</p>
                )}
              </div>

              {/* GitHub URL */}
              <div className="space-y-1.5">
                <label className="font-mono text-xs font-black uppercase text-gray-700 flex items-center gap-1.5">
                  <GithubIcon className="w-3.5 h-3.5 text-gray-800" />
                  <span>GitHub Profile URL</span>
                </label>
                <input
                  type="text"
                  value={formGithubUrl}
                  onChange={(e) => setFormGithubUrl(e.target.value)}
                  placeholder="https://github.com/username"
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#FAF7F0] border-2 border-[#121316] text-xs font-bold text-[#121316] placeholder-gray-400 focus:outline-none focus:bg-white shadow-pop-sm"
                />
                {formErrors.githubUrl && (
                  <p className="font-mono text-xs text-[#FF4757] font-bold">{formErrors.githubUrl}</p>
                )}
              </div>

              {/* Status Selector & Display Order Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-mono text-xs font-black uppercase text-gray-700 block">
                    Status
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as TeamMemberStatus)}
                    className="w-full px-3 py-2.5 rounded-2xl bg-[#FAF7F0] border-2 border-[#121316] text-xs font-bold text-[#121316] focus:outline-none focus:bg-white shadow-pop-sm cursor-pointer"
                  >
                    <option value="active">Active (Public)</option>
                    <option value="inactive">Inactive</option>
                    <option value="alumni">Alumni</option>
                  </select>
                </div>

                {formRole !== 'President' && formRole !== 'Vice President' && (
                  <div className="space-y-1.5">
                    <label className="font-mono text-xs font-black uppercase text-gray-700 block">
                      Display Order #
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={formDisplayOrder}
                      onChange={(e) => setFormDisplayOrder(Number(e.target.value))}
                      className="w-full px-3 py-2.5 rounded-2xl bg-[#FAF7F0] border-2 border-[#121316] text-xs font-bold text-[#121316] focus:outline-none focus:bg-white shadow-pop-sm"
                    />
                  </div>
                )}
              </div>

              {formErrors.submit && (
                <div className="p-3.5 rounded-2xl bg-[#FFE5E5] border-2 border-[#FF4757] text-[#FF4757] font-mono text-xs font-bold">
                  {formErrors.submit}
                </div>
              )}

              {/* Submit Buttons */}
              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-full bg-[#FAF7F0] font-mono text-xs font-black border-2 border-[#121316] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-full bg-[#FFE600] hover:bg-[#FFD32A] text-[#121316] font-mono text-xs font-black border-2 border-[#121316] shadow-pop-sm flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{uploadingImage ? 'Uploading Image...' : 'Saving...'}</span>
                    </>
                  ) : (
                    <span>{editingMember ? 'Save Changes' : 'Create Member'}</span>
                  )}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* DELETE CONFIRMATION MODAL                                           */}
      {/* =================================================================== */}
      {memberToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-[36px] border-4 border-[#121316] shadow-pop-xl p-6 sm:p-8 space-y-5 paper-pattern">
            <div className="w-14 h-14 rounded-2xl bg-[#FFE5E5] border-3 border-[#FF4757] shadow-pop flex items-center justify-center mx-auto text-[#FF4757]">
              <Trash2 className="w-7 h-7" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-xl font-black text-[#121316]">
                Delete Team Member?
              </h3>
              <p className="text-xs sm:text-sm font-bold text-gray-600">
                Are you sure you want to remove <span className="text-[#FF4757] font-black">"{memberToDelete.name}"</span> ({memberToDelete.role})? This will delete their profile and remove their photo from storage.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-3">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setMemberToDelete(null)}
                className="px-5 py-2.5 rounded-full bg-[#FAF7F0] font-mono text-xs font-black border-2 border-[#121316] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="px-6 py-2.5 rounded-full bg-[#FF4757] hover:bg-[#FF3838] text-white font-mono text-xs font-black border-2 border-[#121316] shadow-pop-sm disabled:opacity-50 flex items-center gap-2 cursor-pointer"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Confirm Delete</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminTeamPage;
