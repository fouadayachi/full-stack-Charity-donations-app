/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { Button } from "@heroui/button";
import { DatePicker } from "@heroui/date-picker";
import { parseAbsoluteToLocal } from "@internationalized/date";
import {
  Award as AwardIcon,
  Plus as PlusIcon,
  Save as SaveIcon,
  Trash as TrashIcon,
  X as XIcon,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import type { Showcase } from "./ShowcasePage";

interface UpdateShowcaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  showcase: Showcase | null;
  onUpdate: (updatedShowcase: Showcase) => void;
  isUpdating: boolean;
}

// Reusable Tailwind Input Component (Shadcn-style)
const StyledInput = ({ label, error, ...props }: any) => (
  <div className="w-full space-y-1.5">
    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
      {label}
    </label>
    <input
      {...props}
      className={`flex h-10 w-full rounded-md border ${
        error ? "border-red-500" : "border-gray-200"
      } bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3182CE] disabled:cursor-not-allowed disabled:opacity-50`}
    />
    {error && <p className="text-xs font-medium text-red-500">{error}</p>}
  </div>
);

export const UpdateShowcaseModal: React.FC<UpdateShowcaseModalProps> = ({
  isOpen,
  onClose,
  showcase,
  onUpdate,
  isUpdating,
}) => {
  const [formData, setFormData] = useState<Showcase | null>(null);
  const [startDate, setStartDate] = useState(parseAbsoluteToLocal("2025-03-14T20:50:33.777+00:00"));
  const [endDate, setEndDate] = useState(parseAbsoluteToLocal("2025-03-14T20:50:33.777+00:00"));
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (showcase) {
      setFormData({ ...showcase });
      setStartDate(parseAbsoluteToLocal(showcase.startDate));
      setEndDate(parseAbsoluteToLocal(showcase.endDate));
      setErrors({});
    }
  }, [showcase]);

  if (!isOpen || !formData) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const handleAchievementChange = (value: string, index: number) => {
    const newKeys = [...formData.keyAchievements];

    newKeys[index] = value;
    setFormData({ ...formData, keyAchievements: newKeys });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validation logic remains the same
    formData.startDate = startDate.toDate().toISOString().replace("Z", "+00:00");
    formData.endDate = endDate.toDate().toISOString().replace("Z", "+00:00");
    onUpdate(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b">
          <h2 className="text-xl font-semibold text-slate-800">Update Showcase</h2>
          <button className="p-1 hover:bg-gray-100 rounded-full transition-colors" onClick={onClose}>
            <XIcon className="text-gray-500" size={20} />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-8">
          <form className="space-y-6" id="showcase-form" onSubmit={handleSubmit}>
            
            {/* Section 1: Basic Info */}
            <div className="grid gap-4 p-4 border rounded-lg bg-slate-50/50">
              <StyledInput
                error={errors.title}
                label="Showcase Title *"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
              />
              <StyledInput
                error={errors.shortDescription}
                label="Short Description *"
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleInputChange}
              />
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Full Description *</label>
                <textarea
                  className="flex w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3182CE]"
                  name="longDescription"
                  rows={4}
                  value={formData.longDescription}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Section 2: Dates (Keeping HeroUI DatePicker as it handles complex logic) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border rounded-lg">
              <DatePicker
                label="Start Date"
                value={startDate}
                variant="bordered"
                onChange={(d: any) => setStartDate(d)}
              />
              <DatePicker
                label="End Date"
                value={endDate}
                variant="bordered"
                onChange={(d: any) => setEndDate(d)}
              />
            </div>

            {/* Section 3: Achievements */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium flex items-center gap-2">
                  <AwardIcon className="text-purple-600" size={18} />
                  Key Achievements
                </h3>
                <Button 
                   color="secondary" 
                   size="sm" 
                   variant="flat"
                   onPress={() => setFormData({...formData, keyAchievements: [...formData.keyAchievements, ""]})}
                >
                  <PlusIcon className="mr-1" size={14} /> Add
                </Button>
              </div>
              
              <div className="space-y-3">
                {formData.keyAchievements.map((ach, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      className="flex-1 rounded-md border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                      placeholder="Describe achievement..."
                      value={ach}
                      onChange={(e) => handleAchievementChange(e.target.value, idx)}
                    />
                    <Button
                      isIconOnly
                      color="danger"
                      variant="light"
                      onPress={() => {
                        const filtered = formData.keyAchievements.filter((_, i) => i !== idx);

                        setFormData({...formData, keyAchievements: filtered});
                      }}
                    >
                      <TrashIcon size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 flex justify-end gap-3">
          <Button variant="bordered" onPress={onClose}>Cancel</Button>
          <Button 
            className="bg-[#3182CE]" 
            color="primary" 
            isLoading={isUpdating}
            onClick={handleSubmit}
          >
            <SaveIcon className="mr-2" size={18} />
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};