"use client";

import React, { useState, useMemo } from 'react';
import { DollarSign, MapPin, Tag, CloudUpload, Check, Clock, X, Play } from 'lucide-react';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import InfoBox from '@/components/shared/InfoBox';
import SuccessModal from '@/components/shared/SuccessModal';
import { Button } from '@/components/ui';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useI18n } from '@/contexts/i18n-context';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

export interface FormData {
  title: string;
  description: string;
  category: string;
  budget: string;
  location: string;
  tags: string;
  duration: '90_mins' | '24_hours';
  urgent?: boolean;
}

interface FormErrors {
  title?: string;
  description?: string;
  category?: string;
  budget?: string;
  location?: string;
  duration?: string;
  media?: string;
}

interface CreateTaskFormProps {
  onSubmit?: (data: FormData, files: File[]) => Promise<void>;
  initialData?: Partial<FormData>;
  isEditMode?: boolean;
  submitDisabled?: boolean;
  submitDisabledMessage?: string;
}

const defaultFormData: FormData = {
  title: '',
  description: '',
  category: 'errands',
  budget: '',
  location: '',
  tags: '',
  duration: '90_mins',
};

// ─── Video thumbnail generator ────────────────────────────────────────────────
const getVideoThumbnail = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    const url = URL.createObjectURL(file);
    video.src = url;
    video.currentTime = 1;
    video.muted = true;
    video.playsInline = true;
    video.onloadeddata = () => {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 320;
      canvas.height = video.videoHeight || 240;
      canvas.getContext('2d')?.drawImage(video, 0, 0);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL('image/jpeg'));
    };
    video.onerror = () => { URL.revokeObjectURL(url); resolve(''); };
  });
};

// ─── Reusable required label ──────────────────────────────────────────────────
const RequiredLabel = ({ text }: { text: string }) => (
  <span className="block text-sm font-bold text-gray-900 mb-1">
    {text} <span className="text-red-500">*</span>
  </span>
);

// ─── Inline field error ───────────────────────────────────────────────────────
const FieldError = ({ message }: { message?: string }) =>
  message ? (
    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
      <span>⚠</span> {message}
    </p>
  ) : null;

const CreateTaskForm: React.FC<CreateTaskFormProps> = ({
  onSubmit,
  initialData,
  isEditMode = false,
  submitDisabled = false,
  submitDisabledMessage,
}) => {
  const router = useRouter();
  const { tr } = useI18n();
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ─── Validation state ─────────────────────────────────────────────────────────
  const [errors, setErrors]   = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormErrors, boolean>>>({});

  // ─── File state ──────────────────────────────────────────────────────────────
  const [files, setFiles]                   = useState<File[]>([]);
  const [previewUrls, setPreviewUrls]       = useState<string[]>([]);
  const [videoThumbnails, setVideoThumbnails] = useState<Record<number, string>>({});
  const [fileType, setFileType]             = useState<'image' | 'video' | null>(null);
  const [fileError, setFileError]           = useState<string | null>(null);

  // ─── Form state ───────────────────────────────────────────────────────────────
  const [formData, setFormData] = useState<FormData>({
    ...defaultFormData,
    ...initialData,
  });
// ─── Validation helpers ───────────────────────────────────────────────────────
const TITLE_REGEX = /^[A-Za-z0-9\s.,!?'"()\-/:&]+$/;
const LOCATION_REGEX = /^[A-Za-z0-9\s.,#'"\-]+$/;
const DESCRIPTION_REGEX = /^[\s\S]*$/; // allow any characters; enforce length only

type ParsedBudget = { min: number; max: number };
const parseBudget = (raw: string): ParsedBudget | null => {
  const s = raw.trim().replace(/\s+/g, "");
  if (!s) return null;

  // Allow: "25", "25.5", "25-50", "25.5-50", "25-50.25"
  const parts = s.split("-");
  if (parts.length > 2) return null;

  const a = Number(parts[0]);
  const b = parts.length === 2 ? Number(parts[1]) : a;
  if (!Number.isFinite(a) || !Number.isFinite(b)) return null;

  // Support up to 2 decimals
  const hasTooManyDecimals = (nStr: string) => {
    const [, dec] = nStr.split(".");
    return dec ? dec.length > 2 : false;
  };
  if (hasTooManyDecimals(parts[0]) || (parts[1] && hasTooManyDecimals(parts[1]))) return null;

  return { min: a, max: b };
};
  // ─── Per-field validation rules ───────────────────────────────────────────────
 const validateField = (field: keyof FormErrors, value: string): string => {
  switch (field) {
    case 'title':
      if (!value.trim()) return tr('Task title is required.');
      if (value.trim().length < 5)
        return tr('Title must be at least 5 characters.');
      if (value.trim().length > 100)
        return tr('Title must not exceed 100 characters.');
      if (!TITLE_REGEX.test(value.trim()))
        return tr('Title contains invalid characters.');
      return '';

    case 'description':
      if (!value.trim()) return tr('Description is required.');
      if (value.trim().length < 20)
        return tr('Description must be at least 20 characters.');
      if (value.trim().length > 1000)
        return tr('Description must not exceed 1000 characters.');
      if (!DESCRIPTION_REGEX.test(value)) return tr('Description is invalid.');
      return '';

    case 'location':
      if (!value.trim()) return tr('Location is required.');
      if (value.trim().length < 3)
        return tr('Location must be at least 3 characters.');
      if (value.trim().length > 120)
        return tr('Location must not exceed 120 characters.');
      if (!LOCATION_REGEX.test(value.trim()))
        return tr('Location contains invalid characters.');
      return '';

    case 'category':
      if (!value.trim()) return tr('Category is required.');
      return '';

    case 'budget':
      if (!value.trim()) return tr('Budget is required.');
      const parsed = parseBudget(value);
      if (!parsed) return tr('Enter a valid budget (e.g. 25 or 25-50).');
      if (parsed.min <= 0 || parsed.max <= 0) return tr('Budget must be greater than 0.');
      if (parsed.max < parsed.min) return tr('Budget range must be like min-max (max ≥ min).');
      if (parsed.max > 100000) return tr('Budget seems too high.');
      return '';

    case 'duration':
      if (!value.trim()) return tr('Duration is required.');
      if (value !== '90_mins' && value !== '24_hours') return tr('Invalid duration.');
      return '';

    default:
      return '';
  }
};

  // ─── Validate entire form, return errors map ──────────────────────────────────
  const validateAll = (): FormErrors => {
    const fields: (keyof FormErrors)[] = ['title', 'description', 'category', 'budget', 'location', 'duration'];
    const newErrors: FormErrors = {};
    fields.forEach((f) => {
      const err = validateField(f, formData[f as keyof FormData] as string);
      if (err) newErrors[f] = err;
    });
    if (!isEditMode && files.length === 0)
      newErrors.media = tr('Please upload at least one image or video.');
    return newErrors;
  };

  // ─── onChange: update value + re-validate if already touched ──────────────────
  const handleChange = (field: keyof FormData, value: string) => {
  let updatedValue = value;
  // Keep budget input sane while typing (allow digits, dot, dash, spaces)
  if (field === 'budget') updatedValue = value.replace(/[^0-9.\-\s]/g, '');

  setFormData((prev) => ({ ...prev, [field]: updatedValue }));

  if (touched[field as keyof FormErrors]) {
    const err = validateField(field as keyof FormErrors, updatedValue);
    setErrors((prev) => ({ ...prev, [field]: err }));
  }
};

  // ─── onBlur: mark touched + show error immediately ────────────────────────────
  const handleBlur = (field: keyof FormErrors) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const err = validateField(field, formData[field as keyof FormData] as string);
    setErrors((prev) => ({ ...prev, [field]: err }));
  };

  // ─── File handling ────────────────────────────────────────────────────────────
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (!selectedFiles.length) return;

    const isVideo = selectedFiles[0].type.startsWith('video');
    const isImage = selectedFiles[0].type.startsWith('image');

    if (fileType && ((fileType === 'video' && isImage) || (fileType === 'image' && isVideo))) {
      setFileError(tr(`You can only upload ${fileType === 'video' ? 'videos' : 'images'}.`));
      return;
    }
    if (!fileType) {
      if (isVideo) setFileType('video');
      if (isImage) setFileType('image');
    }
    if (isImage && files.length + selectedFiles.length > 3) {
      setFileError(tr('You can only upload up to 3 images.'));
      return;
    }

    const startIndex = files.length;
    setPreviewUrls((prev) => [...prev, ...selectedFiles.map((f) => URL.createObjectURL(f))]);
    setFiles((prev) => [...prev, ...selectedFiles]);
    setFileError(null);
    // Clear media validation error once files are added
    setErrors((prev) => ({ ...prev, media: '' }));

    for (let i = 0; i < selectedFiles.length; i++) {
      if (selectedFiles[i].type.startsWith('video')) {
        const thumb = await getVideoThumbnail(selectedFiles[i]);
        setVideoThumbnails((prev) => ({ ...prev, [startIndex + i]: thumb }));
      }
    }
  };

  const removeFile = (index: number) => {
    URL.revokeObjectURL(previewUrls[index]);
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
    setFiles((prev) => {
      const next = prev.filter((_, i) => i !== index);
      if (next.length === 0 && !isEditMode)
        setErrors((e) => ({ ...e, media: tr('Please upload at least one image or video.') }));
      return next;
    });
    setVideoThumbnails((prev) => {
      const updated: Record<number, string> = {};
      Object.entries(prev).forEach(([key, val]) => {
        const k = Number(key);
        if (k < index) updated[k] = val;
        else if (k > index) updated[k - 1] = val;
      });
      return updated;
    });
    if (files.length === 1) setFileType(null);
  };

  // ─── Dirty check ──────────────────────────────────────────────────────────────
  const isDirty = useMemo(() => {
    if (!isEditMode) return true;
    const base: FormData = { ...defaultFormData, ...initialData };
    return (Object.keys(base) as (keyof FormData)[]).some((k) => formData[k] !== base[k])
      || files.length > 0;
  }, [isEditMode, initialData, formData, files]);

  // ─── Submit ───────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (isSubmitting) return;

    if (submitDisabled) {
      setSubmitError(submitDisabledMessage || tr("Your account is restricted. You can't post an ad right now."));
      return;
    }

    // Touch every required field so errors surface
    setTouched({ title: true, description: true, category: true, budget: true, location: true, duration: true });
    const newErrors = validateAll();
    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) return;

    try {
      setIsSubmitting(true);
      if (onSubmit) {
        await onSubmit(formData, files);
      } else {
        await new Promise((r) => setTimeout(r, 500));
      }
      setIsSuccessModalOpen(true);
    } catch (error: unknown) {
      setSubmitError(
        error instanceof Error ? error.message : tr('Failed to post task. Please try again.')
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    previewUrls.forEach((url) => URL.revokeObjectURL(url));
    setFormData(defaultFormData);
    setFiles([]);
    setPreviewUrls([]);
    setVideoThumbnails({});
    setFileType(null);
    setErrors({});
    setTouched({});
  };

  // ─── Shared input border helper ───────────────────────────────────────────────
  const inputClass = (field: keyof FormErrors) =>
    touched[field] && errors[field] ? 'border-red-400 focus:ring-red-300' : '';

  return (
    <form onSubmit={handleSubmit} noValidate className="bg-white px-6 py-8 pb-32">

      {/* ── Task Title ── */}
      <div className="mb-4">
        <Input
          label={<RequiredLabel text={tr('Task Title')} />}
          placeholder={tr('Enter task title')}
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          onBlur={() => handleBlur('title')}
          className={inputClass('title')}
        />
        <FieldError message={touched.title ? errors.title : undefined} />
      </div>

      {/* ── Description ── */}
      <div className="mb-4">
        <Textarea
          label={<RequiredLabel text={tr('Description')} />}
          placeholder={tr('Describe what you need help with...')}
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          onBlur={() => handleBlur('description')}
          className={`min-h-[120px] ${inputClass('description')}`}
        />
        <FieldError message={touched.description ? errors.description : undefined} />
        {/* Character counter */}
        <p className="text-xs text-gray-400 text-right mt-0.5">
          {formData.description.length} / 1000
        </p>
      </div>

      {/* ── Category ── */}
      <div className="mb-4">
        <label className="block text-sm font-bold text-gray-900 mb-1">
          {tr('Category')} <span className="text-red-500">*</span>
        </label>
        <Select
          value={formData.category}
          onValueChange={(value) => handleChange('category', value)}
        >
          <SelectTrigger className={`relative h-12 w-full rounded-xl mt-2 border border-gray-200 bg-gray-50 focus:ring-primary ${inputClass('category')}`}>
            <SelectValue placeholder={tr('Select category')} />
          </SelectTrigger>
          <SelectContent className="w-full">
            <SelectItem value="errands">{tr('Errands')}</SelectItem>
            <SelectItem value="tech">{tr('Tech')}</SelectItem>
            <SelectItem value="design">{tr('Design')}</SelectItem>
            <SelectItem value="moving">{tr('Moving')}</SelectItem>
            <SelectItem value="pet-care">{tr('Pet Care')}</SelectItem>
            <SelectItem value="translation">{tr('Translation')}</SelectItem>
          </SelectContent>
        </Select>
        <FieldError message={touched.category ? errors.category : undefined} />
      </div>

      {/* ── Budget ── */}
      <div className="mb-4">
        <Input
          label={<RequiredLabel text={tr('Budget')} />}
          icon={<DollarSign className="w-5 h-5" />}
          type="text"
          placeholder={tr('Enter budget e.g. 25 or 25-50')}
          value={formData.budget}
          onChange={(e) => handleChange('budget', e.target.value)}
          onBlur={() => handleBlur('budget')}
          className={inputClass('budget')}
        />
        <FieldError message={touched.budget ? errors.budget : undefined} />
      </div>

      {/* ── Location ── */}
      <div className="mb-4">
        <Input
          label={<RequiredLabel text={tr('Location')} />}
          icon={<MapPin className="w-5 h-5" />}
          type="text"
          placeholder={tr('Enter location')}
          value={formData.location}
          onChange={(e) => handleChange('location', e.target.value)}
          onBlur={() => handleBlur('location')}
          className={inputClass('location')}
        />
        <FieldError message={touched.location ? errors.location : undefined} />
      </div>

      {/* ── Tags + Duration ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <Input
            label={
              <span className="block text-sm font-bold text-gray-900 mb-1">
                {tr('Tags')}{' '}
                <span className="text-gray-400 font-normal text-xs">
                  ({tr('Optional')})
                </span>
              </span>
            }
            icon={<Tag className="w-5 h-5" />}
            type="text"
            placeholder={tr('Enter tags (comma separated)')}
            value={formData.tags}
            onChange={(e) => handleChange('tags', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-1">
            {tr('Task Duration')} <span className="text-red-500">*</span>
          </label>
          <Select
            value={formData.duration}
            onValueChange={(value) => handleChange('duration', value as FormData['duration'])}
          >
            <SelectTrigger className={`relative h-12 w-full pl-10 pr-4 rounded-xl mt-2 border border-gray-200 bg-gray-50 focus:ring-primary ${inputClass('duration')}`}>
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Clock className="w-5 h-5 text-gray-600" />
              </span>
              <SelectValue placeholder={tr('Select duration')} />
            </SelectTrigger>
            <SelectContent className="w-full">
              <SelectItem value="90_mins">{tr('90 Minutes')}</SelectItem>
              <SelectItem value="24_hours">{tr('24 Hours')}</SelectItem>
            </SelectContent>
          </Select>
          <FieldError message={touched.duration ? errors.duration : undefined} />
        </div>
      </div>

      {/* ── Upload Media ── */}
      <div className="mb-6">
        <label className="block text-sm font-bold text-gray-900 mb-2">
          {tr('Upload Media')}
          {!isEditMode && <span className="text-red-500 ml-0.5">*</span>}
          {isEditMode && (
            <span className="text-gray-400 font-normal text-xs ml-1">
              {tr('(leave empty to keep existing media)')}
            </span>
          )}
        </label>

        <label
          htmlFor="file-upload"
          className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer transition
            ${errors.media
              ? 'border-red-400 bg-red-50 hover:bg-red-100'
              : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
            }`}
        >
          <CloudUpload className={`w-10 h-10 mb-2 ${errors.media ? 'text-red-400' : 'text-gray-400'}`} />
          <span className="text-gray-500 text-sm">
            {fileType === 'video'
              ? tr('Video selected')
              : fileType === 'image'
              ? tr(`${files.length} image(s) selected`)
              : tr('Click to upload image or video')}
          </span>
          <input
            id="file-upload"
            type="file"
            accept="image/*,video/*"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />
        </label>

        {fileError && <p className="text-red-500 text-xs mt-1">⚠ {fileError}</p>}
        <FieldError message={errors.media} />

        {files.length > 0 && (
          <div className="flex flex-wrap mt-3 gap-3">
            {files.map((file, index) => {
              const isVideo    = file.type.startsWith('video');
              const thumbSrc   = isVideo ? videoThumbnails[index] : previewUrls[index];
              return (
                <div
                  key={file.name + index}
                  className="relative w-24 h-24 border rounded-lg overflow-hidden bg-gray-100"
                >
                  <button
                    type="button"
                    className="absolute top-1 right-1 bg-gray-200 rounded-full w-5 h-5 flex items-center justify-center hover:bg-gray-300 z-10"
                    onClick={() => removeFile(index)}
                  >
                    <X className="w-3 h-3" />
                  </button>
                  {thumbSrc ? (
                    <>
                      <Image src={thumbSrc} alt={file.name} fill className="object-cover" unoptimized />
                      {isVideo && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                          <Play className="w-6 h-6 text-white fill-white" />
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-xs text-gray-400">{isVideo ? 'Loading…' : 'Error'}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <InfoBox
        variant="warning"
        message={
          <>
            {tr('Your ad will be live for')}{' '}
            <span className="font-bold">
              {formData.duration === '90_mins' ? tr('90 minutes') : tr('24 hours')}
            </span>{' '}
            {tr('and then automatically expire. Make it count!')}
          </>
        }
      />

      {submitDisabled && (
        <p className="text-red-500 text-sm text-center mt-4">
          {submitDisabledMessage || tr("Your account is restricted. You can't post an ad right now.")}
        </p>
      )}

      {submitError && (
        <p className="text-red-500 text-sm text-center mt-4">{submitError}</p>
      )}

      {/* ── Submit ── */}
      <div className="bg-white border-t border-gray-200 p-4 z-30">
        <div className="max-w-7xl mx-auto">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            disabled={!isDirty || submitDisabled || isSubmitting}
          >
            {isSubmitting
              ? (isEditMode ? tr("Updating…") : tr("Posting…"))
              : isEditMode
                ? tr("Update Ad")
                : tr(`Post Ad (Expires in ${formData.duration === '90_mins' ? '90 mins' : '24 hours'})`)}
          </Button>
        </div>
      </div>

      {/* ── Success Modal ── */}
      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => { setIsSuccessModalOpen(false); if (!isEditMode) resetForm(); }}
        title={isEditMode ? 'Ad Updated!' : 'Ad Posted!'}
        description={
          isEditMode ? (
            <>{tr('Your task has been updated successfully.')}</>
          ) : (
            <>{tr('Your ad is live and will expire in')}{' '}
              {formData.duration === '90_mins' ? tr('90 minutes') : tr('24 hours')}.</>
          )
        }
        buttonText="Got it"
        onButtonClick={() => router.push('/dashboard/explore')}
        icon={<Check className="w-10 h-10" strokeWidth={3} />}
      />
    </form>
  );
};

export default CreateTaskForm;