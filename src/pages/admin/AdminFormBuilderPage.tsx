import React, { useState, useEffect, useMemo } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Rocket,
  Eye,
  Edit3,
  Sliders,
  Plus,
  CheckCircle2,
  AlertTriangle,
  X,
  RotateCw,
  Sparkles,
  Layers,
  FileText,
  ExternalLink,
  ChevronRight,
  HelpCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { customFormService } from '../../services/customFormService';
import {
  CustomForm,
  FormFieldDefinition,
  FormFieldType,
  FormSettings,
  DEFAULT_FORM_SETTINGS,
  FormStatus,
} from '../../types/customForm.types';
import { FieldPalette } from '../../components/forms/builder/FieldPalette';
import { FieldEditorCard } from '../../components/forms/builder/FieldEditorCard';
import { FieldSettingsPanel } from '../../components/forms/builder/FieldSettingsPanel';
import { FormSettingsPanel } from '../../components/forms/builder/FormSettingsPanel';
import { FormLivePreview } from '../../components/forms/builder/FormLivePreview';
import { ATCStatusBadge } from '../../components/visual';

type ActiveTab = 'canvas' | 'palette' | 'field-settings' | 'form-settings' | 'preview';

export const AdminFormBuilderPage: React.FC = () => {
  const { formId } = useParams<{ formId?: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(formId);

  // Form State
  const [title, setTitle] = useState<string>('Untitled Form');
  const [description, setDescription] = useState<string>('');
  const [slug, setSlug] = useState<string>('untitled-form');
  const [status, setStatus] = useState<FormStatus>('draft');
  const [fields, setFields] = useState<FormFieldDefinition[]>([]);
  const [settings, setSettings] = useState<FormSettings>({ ...DEFAULT_FORM_SETTINGS });
  const [responseCount, setResponseCount] = useState<number>(0);

  // Selection & Active UI
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('canvas');
  const [viewMode, setViewMode] = useState<'editor' | 'preview'>('editor');

  // Loading & Action State
  const [loading, setLoading] = useState<boolean>(isEditMode);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);

  // Feedback Toast
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  // Auto-dismiss toast
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Load Form for Edit Mode
  useEffect(() => {
    if (!formId) {
      setTitle('Untitled Form');
      setDescription('');
      setSlug(`form-${Date.now().toString(36)}`);
      setStatus('draft');
      setFields([]);
      setSettings({ ...DEFAULT_FORM_SETTINGS });
      setLoading(false);
      setHasUnsavedChanges(false);
      return;
    }

    const fetchForm = async () => {
      setLoading(true);
      setLoadError(null);
      try {
        const res = await customFormService.getForm(formId);
        if (res.success && res.data) {
          const f = res.data;
          setTitle(f.title);
          setDescription(f.description || '');
          setSlug(f.slug);
          setStatus(f.status);
          setFields(f.fields || []);
          setSettings(f.settings || { ...DEFAULT_FORM_SETTINGS });
          setResponseCount(f.responseCount || 0);
          if (f.fields && f.fields.length > 0) {
            setSelectedFieldId(f.fields[0].id);
          }
          setHasUnsavedChanges(false);
        } else {
          setLoadError(res.error || 'Form could not be found.');
        }
      } catch (err: any) {
        setLoadError(err?.message || 'Failed to load form details.');
      } finally {
        setLoading(false);
      }
    };

    fetchForm();
  }, [formId]);

  // Current Selected Field
  const selectedField = useMemo(() => {
    if (!selectedFieldId) return fields[0] || null;
    return fields.find((f) => f.id === selectedFieldId) || null;
  }, [fields, selectedFieldId]);

  // Handle Adding a Field from Palette
  const handleAddField = (
    type: FormFieldType,
    defaults: { label: string; placeholder?: string; options?: string[] }
  ) => {
    const newFieldId = `field_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const newField: FormFieldDefinition = {
      id: newFieldId,
      type,
      label: defaults.label,
      placeholder: defaults.placeholder || '',
      description: '',
      required: false,
      options: defaults.options ? [...defaults.options] : [],
      order: fields.length,
      minRating: type === 'rating' ? 1 : undefined,
      maxRating: type === 'rating' ? 5 : undefined,
    };

    const updatedFields = [...fields, newField];
    setFields(updatedFields);
    setSelectedFieldId(newFieldId);
    setHasUnsavedChanges(true);

    // Switch to field-settings tab on mobile
    if (window.innerWidth < 1024) {
      setActiveTab('field-settings');
    }
  };

  // Field Reordering
  const handleMoveField = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= fields.length) return;

    const copy = [...fields];
    const [moved] = copy.splice(index, 1);
    copy.splice(targetIndex, 0, moved);

    // Recalculate orders
    const reordered = copy.map((f, i) => ({ ...f, order: i }));
    setFields(reordered);
    setHasUnsavedChanges(true);
  };

  // Duplicate Field
  const handleDuplicateField = (index: number) => {
    const original = fields[index];
    if (!original) return;

    const newFieldId = `field_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const duplicated: FormFieldDefinition = {
      ...original,
      id: newFieldId,
      label: `${original.label} (Copy)`,
      options: original.options ? [...original.options] : [],
    };

    const copy = [...fields];
    copy.splice(index + 1, 0, duplicated);

    const reordered = copy.map((f, i) => ({ ...f, order: i }));
    setFields(reordered);
    setSelectedFieldId(newFieldId);
    setHasUnsavedChanges(true);
  };

  // Delete Field
  const handleDeleteField = (index: number) => {
    const copy = fields.filter((_, i) => i !== index);
    const reordered = copy.map((f, i) => ({ ...f, order: i }));
    setFields(reordered);

    if (selectedFieldId === fields[index]?.id) {
      const nextSelected = reordered[index] || reordered[index - 1] || null;
      setSelectedFieldId(nextSelected ? nextSelected.id : null);
    }
    setHasUnsavedChanges(true);
  };

  // Update Field Properties
  const handleUpdateSelectedField = (updated: Partial<FormFieldDefinition>) => {
    if (!selectedFieldId) return;
    setFields((prev) =>
      prev.map((f) => (f.id === selectedFieldId ? { ...f, ...updated } : f))
    );
    setHasUnsavedChanges(true);
  };

  // Title & Slug Auto-sync
  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    setHasUnsavedChanges(true);
    if (!isEditMode && status === 'draft') {
      const autoSlug = customFormService.generateSlug(newTitle);
      setSlug(autoSlug);
    }
  };

  // Client-side Thorough Validation
  const validateFormBeforeSave = (): { valid: boolean; message?: string } => {
    if (!title.trim()) {
      return { valid: false, message: 'Please provide a form title.' };
    }

    if (fields.length === 0) {
      return { valid: false, message: 'Add at least one field to the form.' };
    }

    for (let i = 0; i < fields.length; i++) {
      const f = fields[i];
      if (!f.label || !f.label.trim()) {
        return { valid: false, message: `Question #${i + 1} requires a label.` };
      }

      if (['radio', 'checkbox', 'select'].includes(f.type)) {
        if (!f.options || f.options.length === 0) {
          return { valid: false, message: `Question "${f.label}" requires at least one option.` };
        }
        if (f.options.some((opt) => !opt.trim())) {
          return { valid: false, message: `Question "${f.label}" has empty options.` };
        }
      }

      if (f.type === 'number') {
        if (f.min !== undefined && f.max !== undefined && f.min > f.max) {
          return { valid: false, message: `Question "${f.label}" has minimum value greater than maximum.` };
        }
      }

      if (f.type === 'rating') {
        const minR = f.minRating ?? 1;
        const maxR = f.maxRating ?? 5;
        if (minR >= maxR) {
          return { valid: false, message: `Question "${f.label}" rating maximum must be greater than minimum.` };
        }
      }
    }

    return { valid: true };
  };

  // Save Draft Action
  const handleSaveDraft = async () => {
    if (!title.trim()) {
      setToastMessage({ type: 'error', text: 'Form title is required.' });
      return;
    }

    setIsSaving(true);
    try {
      if (isEditMode && formId) {
        const res = await customFormService.updateForm(formId, {
          title: title.trim(),
          slug: slug.trim(),
          description: description.trim(),
          fields,
          settings,
        });

        if (res.success && res.data) {
          setHasUnsavedChanges(false);
          setSlug(res.data.slug);
          setToastMessage({ type: 'success', text: 'Form draft saved successfully!' });
        } else {
          setToastMessage({ type: 'error', text: res.error || 'Failed to save draft.' });
        }
      } else {
        // Create Mode
        const res = await customFormService.createForm({
          title: title.trim(),
          slug: slug.trim(),
          description: description.trim(),
          status: 'draft',
          fields,
          settings,
        });

        if (res.success && res.data) {
          setHasUnsavedChanges(false);
          setToastMessage({ type: 'success', text: 'Form created as Draft!' });
          navigate(`/admin/forms/${res.data.id}/edit`, { replace: true });
        } else {
          setToastMessage({ type: 'error', text: res.error || 'Failed to create form.' });
        }
      }
    } catch {
      setToastMessage({ type: 'error', text: 'An unexpected error occurred while saving.' });
    } finally {
      setIsSaving(false);
    }
  };

  // Publish Form Action
  const handlePublish = async () => {
    const validation = validateFormBeforeSave();
    if (!validation.valid) {
      setToastMessage({ type: 'error', text: validation.message || 'Validation failed.' });
      return;
    }

    setIsPublishing(true);
    try {
      let savedForm: CustomForm | undefined;

      if (isEditMode && formId) {
        const res = await customFormService.updateForm(formId, {
          title: title.trim(),
          slug: slug.trim(),
          description: description.trim(),
          status: 'published',
          fields,
          settings,
        });
        if (res.success && res.data) {
          savedForm = res.data;
        } else {
          setToastMessage({ type: 'error', text: res.error || 'Failed to publish form.' });
          setIsPublishing(false);
          return;
        }
      } else {
        // Create & Publish
        const res = await customFormService.createForm({
          title: title.trim(),
          slug: slug.trim(),
          description: description.trim(),
          status: 'published',
          fields,
          settings,
        });
        if (res.success && res.data) {
          savedForm = res.data;
          navigate(`/admin/forms/${res.data.id}/edit`, { replace: true });
        } else {
          setToastMessage({ type: 'error', text: res.error || 'Failed to publish form.' });
          setIsPublishing(false);
          return;
        }
      }

      if (savedForm) {
        setStatus('published');
        setSlug(savedForm.slug);
        setHasUnsavedChanges(false);
        setToastMessage({ type: 'success', text: '🎉 Form published live!' });
        confetti({
          particleCount: 80,
          spread: 85,
          origin: { y: 0.6 },
          colors: ['#FFE600', '#6C5CE7', '#2ED573', '#FF4757'],
        });
      }
    } catch {
      setToastMessage({ type: 'error', text: 'An unexpected error occurred while publishing.' });
    } finally {
      setIsPublishing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF7F0] py-16 px-4 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-[#FFE600] border-3 border-[#121316] flex items-center justify-center animate-spin">
          <RotateCw className="w-6 h-6 text-[#121316]" />
        </div>
        <p className="font-mono text-xs font-black uppercase text-gray-600">
          Loading Form Workbench...
        </p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="min-h-screen bg-[#FAF7F0] py-16 px-4 flex flex-col items-center justify-center">
        <div className="max-w-md w-full p-8 rounded-[36px] bg-white border-4 border-[#121316] shadow-pop-xl text-center space-y-4">
          <AlertTriangle className="w-12 h-12 text-[#FF4757] mx-auto" />
          <h3 className="font-black text-xl text-[#121316]">FORM NOT FOUND</h3>
          <p className="text-xs font-bold text-gray-600">{loadError}</p>
          <div className="pt-2">
            <Link
              to="/admin/forms"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#FFE600] hover:bg-[#FFD32A] text-[#121316] font-mono text-xs font-black uppercase border-2 border-[#121316] shadow-pop-sm transition-all"
            >
              <ArrowLeft className="w-4 h-4 stroke-[3]" />
              Return to Forms
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F0] py-6 sm:py-10 px-4 sm:px-6 lg:px-8 paper-pattern select-none">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Top Builder Header */}
        <div className="p-5 sm:p-6 rounded-[32px] bg-white border-4 border-[#121316] shadow-pop flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Left: Navigation & Status */}
          <div className="flex items-center gap-3.5">
            <Link
              to="/admin/forms"
              className="p-2.5 rounded-2xl bg-[#FAF7F0] hover:bg-gray-200 border-2 border-[#121316] shadow-pop-xs transition-all flex items-center justify-center flex-shrink-0 cursor-pointer"
              title="Back to Forms"
            >
              <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
            </Link>

            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#E1DCFF] text-[#6C5CE7] border border-[#121316] font-mono text-[10px] font-black uppercase">
                  {isEditMode ? 'EDIT WORKBENCH' : 'NEW FORM DRAFT'}
                </span>
                <ATCStatusBadge status={status} size="xs" />
                {hasUnsavedChanges ? (
                  <span className="font-mono text-[10px] font-black text-amber-600 flex items-center gap-1">
                    ● UNSAVED CHANGES
                  </span>
                ) : (
                  <span className="font-mono text-[10px] font-bold text-gray-400 flex items-center gap-1">
                    ✓ SAVED
                  </span>
                )}
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-[#121316] tracking-tight truncate max-w-md mt-0.5">
                {title || 'Untitled Form'}
              </h1>
            </div>
          </div>

          {/* Right: View Mode Toggle & Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            
            {/* Edit vs Preview Toggle */}
            <div className="flex items-center bg-[#FAF7F0] p-1 rounded-2xl border-2 border-[#121316]">
              <button
                type="button"
                onClick={() => setViewMode('editor')}
                className={`px-3 py-1.5 rounded-xl font-mono text-xs font-black uppercase transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'editor'
                    ? 'bg-[#121316] text-white shadow-pop-xs'
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Editor</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('preview')}
                className={`px-3 py-1.5 rounded-xl font-mono text-xs font-black uppercase transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'preview'
                    ? 'bg-[#121316] text-white shadow-pop-xs'
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Preview</span>
              </button>
            </div>

            {/* Save Draft CTA */}
            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={isSaving || isPublishing}
              className="px-4 py-2 rounded-2xl bg-white hover:bg-gray-100 text-[#121316] font-mono text-xs font-black uppercase border-2 border-[#121316] shadow-pop-xs hover:shadow-pop transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
            >
              <Save className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>{isSaving ? 'Saving...' : 'Save Draft'}</span>
            </button>

            {/* Publish CTA */}
            <button
              type="button"
              onClick={handlePublish}
              disabled={isSaving || isPublishing}
              className="px-5 py-2 rounded-2xl bg-[#FFE600] hover:bg-[#FFD32A] text-[#121316] font-mono text-xs font-black uppercase border-2 border-[#121316] shadow-pop hover:shadow-pop-lg active:translate-x-[1px] active:translate-y-[1px] transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
            >
              <Rocket className="w-4 h-4 stroke-[2.5]" />
              <span>{isPublishing ? 'Publishing...' : status === 'published' ? 'Update & Publish' : 'Publish Live'}</span>
            </button>

          </div>
        </div>

        {/* Feedback Toast */}
        {toastMessage && (
          <div
            className={`p-4 rounded-2xl border-3 border-[#121316] shadow-pop flex items-center justify-between gap-3 animate-fadeIn ${
              toastMessage.type === 'success'
                ? 'bg-[#E8F8F0] text-emerald-900'
                : toastMessage.type === 'error'
                ? 'bg-[#FFE5E5] text-[#FF4757]'
                : 'bg-[#E1DCFF] text-[#6C5CE7]'
            }`}
          >
            <div className="flex items-center gap-2 text-xs sm:text-sm font-black font-mono">
              {toastMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-700 stroke-[2.5]" />
              ) : (
                <AlertTriangle className="w-4 h-4 stroke-[2.5]" />
              )}
              <span>{toastMessage.text}</span>
            </div>
            <button
              type="button"
              onClick={() => setToastMessage(null)}
              className="p-1 rounded-lg hover:bg-black/10 cursor-pointer"
            >
              <X className="w-4 h-4 stroke-[3]" />
            </button>
          </div>
        )}

        {/* VIEW MODE: PREVIEW */}
        {viewMode === 'preview' ? (
          <FormLivePreview
            title={title}
            description={description}
            fields={fields}
            settings={settings}
          />
        ) : (
          /* VIEW MODE: WORKBENCH EDITOR */
          <div className="space-y-4">
            
            {/* Mobile / Tablet Tab Switcher */}
            <div className="lg:hidden flex items-center gap-1 bg-white p-1.5 rounded-2xl border-3 border-[#121316] shadow-pop-xs overflow-x-auto scrollbar-none">
              {(
                [
                  { id: 'canvas', label: 'Form Canvas' },
                  { id: 'palette', label: '+ Add Field' },
                  { id: 'field-settings', label: 'Field Config' },
                  { id: 'form-settings', label: 'Settings' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 rounded-xl font-mono text-[11px] font-black uppercase whitespace-nowrap transition-all flex-1 text-center cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-[#121316] text-white shadow-pop-xs'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* 3-Column Desktop Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* LEFT COLUMN: Field Palette (3 Cols on Desktop) */}
              <div
                className={`lg:col-span-3 lg:block ${
                  activeTab === 'palette' ? 'block' : 'hidden'
                }`}
              >
                <div className="sticky top-6">
                  <FieldPalette onAddField={handleAddField} />
                </div>
              </div>

              {/* CENTER COLUMN: Form Canvas (6 Cols on Desktop) */}
              <div
                className={`lg:col-span-6 space-y-4 ${
                  activeTab === 'canvas' ? 'block' : 'hidden lg:block'
                }`}
              >
                {/* Form Header Card (Title & Description) */}
                <div className="p-6 sm:p-7 rounded-[32px] bg-white border-4 border-[#121316] shadow-pop space-y-4 relative">
                  <div className="tape-strip pointer-events-none bg-[#FFE600]" />
                  
                  <div className="space-y-2">
                    <label className="block font-mono text-xs font-black uppercase text-gray-500">
                      FORM TITLE <span className="text-[#FF4757]">*</span>
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder="e.g. Robotics Workshop Registration"
                      className="w-full text-2xl sm:text-3xl font-black text-[#121316] bg-transparent border-b-3 border-transparent hover:border-gray-200 focus:border-[#121316] focus:outline-none py-1 placeholder:text-gray-300 transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block font-mono text-xs font-black uppercase text-gray-500">
                      FORM DESCRIPTION / INSTRUCTIONS
                    </label>
                    <textarea
                      rows={3}
                      value={description}
                      onChange={(e) => {
                        setDescription(e.target.value);
                        setHasUnsavedChanges(true);
                      }}
                      placeholder="Add brief details about the form, deadline, instructions, or requirements..."
                      className="w-full px-4 py-3 rounded-2xl bg-[#FAF7F0] border-2 border-[#121316] text-xs sm:text-sm font-bold text-[#121316] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] resize-none"
                    />
                  </div>
                </div>

                {/* Fields List Container */}
                {fields.length === 0 ? (
                  <div className="p-10 rounded-[32px] bg-white border-4 border-dashed border-[#121316] text-center space-y-4">
                    <div className="w-14 h-14 rounded-2xl bg-[#FFF9DB] border-3 border-[#121316] shadow-pop mx-auto flex items-center justify-center">
                      <Plus className="w-7 h-7 text-[#121316] stroke-[3]" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-black text-lg text-[#121316]">YOUR FORM IS EMPTY</h4>
                      <p className="text-xs font-bold text-gray-500 max-w-sm mx-auto">
                        Click any field from the palette on the left to add questions to your form.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {fields.map((field, idx) => (
                      <FieldEditorCard
                        key={field.id}
                        field={field}
                        index={idx}
                        totalFields={fields.length}
                        isSelected={selectedFieldId === field.id}
                        onSelect={() => {
                          setSelectedFieldId(field.id);
                          if (window.innerWidth < 1024) {
                            setActiveTab('field-settings');
                          }
                        }}
                        onMoveUp={() => handleMoveField(idx, 'up')}
                        onMoveDown={() => handleMoveField(idx, 'down')}
                        onDuplicate={() => handleDuplicateField(idx)}
                        onDelete={() => handleDeleteField(idx)}
                        onUpdateField={handleUpdateSelectedField}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* RIGHT COLUMN: Field Config & Form Settings (3 Cols on Desktop) */}
              <div
                className={`lg:col-span-3 space-y-6 ${
                  activeTab === 'field-settings' || activeTab === 'form-settings'
                    ? 'block'
                    : 'hidden lg:block'
                }`}
              >
                <div className="sticky top-6 space-y-6">
                  
                  {/* Field Settings Panel */}
                  <FieldSettingsPanel
                    field={selectedField}
                    onUpdateField={handleUpdateSelectedField}
                  />

                  {/* Form Settings Panel */}
                  <FormSettingsPanel
                    slug={slug}
                    settings={settings}
                    onUpdateSlug={(newSlug) => {
                      setSlug(newSlug);
                      setHasUnsavedChanges(true);
                    }}
                    onUpdateSettings={(updated) => {
                      setSettings((prev) => ({ ...prev, ...updated }));
                      setHasUnsavedChanges(true);
                    }}
                  />

                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminFormBuilderPage;
