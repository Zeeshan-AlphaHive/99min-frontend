"use client";

import React, { useState, useMemo } from 'react';
import { DollarSign, MapPin, Tag, CloudUpload, Check, Clock, X } from 'lucide-react';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import CategorySelector from './CategorySelector';
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

interface CreateTaskFormProps {
  onSubmit?: (data: FormData, files: File[]) => Promise<void>;
  /** Pass prefilled values when editing an existing task */
  initialData?: Partial<FormData>;
  /** When true, shows "Update Ad" label instead of "Post Ad" */
  isEditMode?: boolean;
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

const CreateTaskForm: React.FC<CreateTaskFormProps> = ({
  onSubmit,
  initialData,
  isEditMode = false,
}) => {
  const router = useRouter();
  const { tr } = useI18n();
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // ─── File state ────────────────────────────────────────────────────────────
  const [files, setFiles] = useState<File[]>([]);
  const [fileType, setFileType] = useState<'image' | 'video' | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    setFiles((prev) => [...prev, ...selectedFiles]);
    setFileError(null);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    if (files.length === 1) setFileType(null);
  };

  // ─── Form state (merge defaults with any prefilled data) ───────────────────
  const [formData, setFormData] = useState<FormData>({
    ...defaultFormData,
    ...initialData,
  });

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // ─── Dirty check: true when something has changed from initialData ─────────
  const isDirty = useMemo(() => {
    if (!isEditMode) return true; // always "dirty" in create mode

    const base: FormData = { ...defaultFormData, ...initialData };

    const fieldsChanged = (Object.keys(base) as (keyof FormData)[]).some(
      (key) => formData[key] !== base[key]
    );

    return fieldsChanged || files.length > 0;
  }, [isEditMode, initialData, formData, files]);

  // ─── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (!formData.title || !formData.description || !formData.budget || !formData.location) {
      alert(tr('Please fill all required fields.'));
      return;
    }

    // In edit mode, media upload is optional (existing media is kept server-side)
    if (!isEditMode && files.length === 0) {
      alert(tr('Please upload at least one image or video.'));
      return;
    }

    try {
      if (onSubmit) {
        await onSubmit(formData, files);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 500));
        console.log('Form submitted:', formData, files);
      }
      setIsSuccessModalOpen(true);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : tr('Failed to post task. Please try again.');
      setSubmitError(msg);
    }
  };

  const resetForm = () => {
    setFormData(defaultFormData);
    setFiles([]);
    setFileType(null);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white px-6 py-8 pb-32">

      <Input
        label={tr("Task Title")}
        placeholder={tr("Enter task title")}
        value={formData.title}
        onChange={(e) => handleChange('title', e.target.value)}
        required
      />

      <Textarea
        label={tr("Description")}
        placeholder={tr("Describe what you need help with...")}
        value={formData.description}
        onChange={(e) => handleChange('description', e.target.value)}
        className="min-h-[120px]"
        required
      />

      <CategorySelector
        selectedCategory={formData.category}
        onCategoryChange={(category) => handleChange('category', category)}
      />

      <Input
        label={tr("Budget")}
        icon={<DollarSign className="w-5 h-5" />}
        type="text"
        placeholder={tr("Enter budget e.g. 25 or 25-50")}
        value={formData.budget}
        onChange={(e) => handleChange('budget', e.target.value)}
        required
      />

      <Input
        label={tr("Location")}
        icon={<MapPin className="w-5 h-5" />}
        type="text"
        placeholder={tr("Enter location")}
        value={formData.location}
        onChange={(e) => handleChange('location', e.target.value)}
        required
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <Input
            label={tr("Tags (Optional)")}
            icon={<Tag className="w-5 h-5" />}
            type="text"
            placeholder={tr("Enter tags (comma separated)")}
            value={formData.tags}
            onChange={(e) => handleChange('tags', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-1">{tr("Task Duration")}</label>
          <Select
            value={formData.duration}
            onValueChange={(value) => handleChange('duration', value as FormData['duration'])}
          >
            <SelectTrigger className="relative h-12 w-full pl-10 pr-4 rounded-xl mt-2 border border-gray-200 bg-gray-50 focus:ring-primary">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Clock className="w-5 h-5 text-gray-600" />
              </span>
              <SelectValue placeholder={tr("Select duration")} />
            </SelectTrigger>
            <SelectContent className="w-full">
              <SelectItem value="90_mins">{tr("90 Minutes")}</SelectItem>
              <SelectItem value="24_hours">{tr("24 Hours")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Upload Media */}
      <div className="mb-6">
        <label className="block text-sm font-bold text-gray-900 mb-2">
          {tr("Upload Media")}{" "}
          {!isEditMode && <span className="text-red-500">*</span>}
          {isEditMode && (
            <span className="text-gray-400 font-normal text-xs ml-1">
              {tr("(leave empty to keep existing media)")}
            </span>
          )}
        </label>

        <label
          htmlFor="file-upload"
          className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition"
        >
          <CloudUpload className="w-10 h-10 text-gray-400 mb-2" />
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

        {fileError && <p className="text-red-500 text-sm mt-1">{fileError}</p>}

        {files.length > 0 && (
          <div className="flex flex-wrap mt-3 gap-3">
            {files.map((file, index) => {
              const url = URL.createObjectURL(file);
              return (
                <div
                  key={file.name + index}
                  className="relative w-24 h-24 border rounded-lg overflow-hidden"
                >
                  <button
                    type="button"
                    className="absolute top-1 right-1 bg-gray-200 rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-gray-300 z-10"
                    onClick={() => { removeFile(index); URL.revokeObjectURL(url); }}
                  >
                    <X className="w-3 h-3" />
                  </button>

                  {file.type.startsWith('image') ? (
                    <Image src={url} alt={file.name} fill className="object-cover" />
                  ) : (
                    <video
                      src={url}
                      className="w-full h-full object-cover"
                      controls={false}
                      preload="metadata"
                    />
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
            {tr("Your ad will be live for")}{" "}
            <span className="font-bold">
              {formData.duration === '90_mins' ? tr('90 minutes') : tr('24 hours')}
            </span>{' '}
            {tr("and then automatically expire. Make it count!")}
          </>
        }
      />

      {submitError && (
        <p className="text-red-500 text-sm text-center mt-4">{submitError}</p>
      )}

      {/* Submit Button */}
      <div className="bg-white border-t border-gray-200 p-4 z-30">
        <div className="max-w-7xl mx-auto">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            disabled={!isDirty}
          >
            {isEditMode
              ? tr('Update Ad')
              : tr(
                  `Post Ad (Expires in ${
                    formData.duration === '90_mins' ? '90 mins' : '24 hours'
                  })`,
                )}
          </Button>
        </div>
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => {
          setIsSuccessModalOpen(false);
          if (!isEditMode) resetForm();
        }}
        title={isEditMode ? 'Ad Updated!' : 'Ad Posted!'}
        description={
          isEditMode ? (
            <>{tr("Your task has been updated successfully.")}</>
          ) : (
            <>
              {tr("Your ad is live and will expire in")}{" "}
              {formData.duration === '90_mins' ? tr('90 minutes') : tr('24 hours')}.
            </>
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