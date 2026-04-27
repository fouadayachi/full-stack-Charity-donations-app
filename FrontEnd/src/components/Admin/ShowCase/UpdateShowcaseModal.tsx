/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { Button } from "@heroui/button";
import { parseAbsoluteToLocal } from "@internationalized/date";
import {
  Award as AwardIcon,
  Calendar as CalendarIcon,
  MapPin as MapPinIcon,
  Plus as PlusIcon,
  Save as SaveIcon,
  Trash as TrashIcon,
  X as XIcon,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
// import ImageUpload from './ShowCaseImageUpload'
import type { Showcase } from "./ShowcasePage";

interface UpdateShowcaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  showcase: Showcase | null;
  onUpdate: (updatedShowcase: Showcase) => void;
  isUpdating: boolean;
}

export const UpdateShowcaseModal: React.FC<UpdateShowcaseModalProps> = ({
  isOpen,
  onClose,
  showcase,
  onUpdate,
  isUpdating,
}) => {
  const [formData, setFormData] = useState<Showcase | null>(null);
  const [startDate, setStartDate] = useState<any>(
    parseAbsoluteToLocal("2025-03-14T20:50:33.777+00:00")
  );
  const [endDate, setEndDate] = useState<any>(
    parseAbsoluteToLocal("2025-03-14T20:50:33.777+00:00")
  );
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleAddAchievement = () => {
    setFormData({
      ...formData,
      keyAchievements: [...formData.keyAchievements, ""],
    });
  };

  const handleRemoveAchievement = (index: number) => {
    if (formData.keyAchievements.length > 1) {
      setFormData({
        ...formData,
        keyAchievements: formData.keyAchievements.filter(
          (_, keyIndex) => index !== keyIndex
        ),
      });
    }
  };

  const handleAchievementChange = (value: string, index: number) => {
    const newKeys = [...formData.keyAchievements];

    newKeys[index] = value;
    setFormData({ ...formData, keyAchievements: [...newKeys] });
    if (errors.keyAchievements) {
      setErrors({ ...errors, keyAchievements: "" });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.title) newErrors.title = "Title is required";
    if (!formData.shortDescription)
      newErrors.shortDescription = "Short description is required";
    if (!formData.location) newErrors.location = "Location is required";
    if (!startDate) newErrors.startDate = "Start date is required";
    if (!endDate) newErrors.endDate = "End date is required";

    if (startDate && endDate) {
      const start = new Date(changeDateFormat(startDate));
      const end = new Date(changeDateFormat(endDate));

      if (end < start) {
        newErrors.endDate = "End date must be after start date";
      }
    }

    const emptyAchievements = formData.keyAchievements.some(
      (achievement) => !achievement.trim()
    );

    if (emptyAchievements) {
      newErrors.keyAchievements = "All achievements must have text";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const changeDateFormat = (date: any): string => {
    const jsDate = date.toDate();
    const isoString = jsDate.toISOString();

    return isoString.replace("Z", "+00:00");
  };

  // Convert ZonedDateTime to HTML datetime-local string "YYYY-MM-DDTHH:MM"
  const toDatetimeLocal = (zonedDate: any): string => {
    try {
      const jsDate = zonedDate.toDate();
      const pad = (n: number) => String(n).padStart(2, "0");

      return (
        `${jsDate.getFullYear()}-${pad(jsDate.getMonth() + 1)}-${pad(jsDate.getDate())}` +
        `T${pad(jsDate.getHours())}:${pad(jsDate.getMinutes())}`
      );
    } catch {
      return "";
    }
  };

  // Convert datetime-local string back to ZonedDateTime
  const fromDatetimeLocal = (value: string) => {
    if (!value) return null;
    const isoString = new Date(value).toISOString();

    return parseAbsoluteToLocal(isoString);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm() && formData) {
      formData.startDate = changeDateFormat(startDate);
      formData.endDate = changeDateFormat(endDate);
      onUpdate(formData);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden">

        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-[#1A365D]">Update Showcase</h2>
          <button
            className="text-gray-400 hover:text-gray-600 transition-colors"
            onClick={onClose}
          >
            <XIcon size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-130px)]">
          <form className="space-y-6" onSubmit={handleSubmit}>

            {/* Basic Details */}
            <div className="space-y-4 border-t-8 border-[#3182CE] rounded-t-md pt-4">
              <h3 className="text-md font-semibold text-[#1A365D] mb-3">
                Basic Details
              </h3>

              {/* Title */}
              <div className="space-y-1">
                <Label htmlFor="title">
                  Showcase Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  className={
                    errors.title
                      ? "border-red-500 focus-visible:ring-red-500"
                      : ""
                  }
                  id="title"
                  name="title"
                  placeholder="Enter showcase title"
                  type="text"
                  value={formData.title}
                  onChange={handleInputChange}
                />
                {errors.title && (
                  <p className="text-sm text-red-500">{errors.title}</p>
                )}
              </div>

              {/* Short Description */}
              <div className="space-y-1">
                <Label htmlFor="shortDescription">
                  Short Description <span className="text-red-500">*</span>
                </Label>
                <Input
                  className={
                    errors.shortDescription
                      ? "border-red-500 focus-visible:ring-red-500"
                      : ""
                  }
                  id="shortDescription"
                  name="shortDescription"
                  placeholder="Brief summary of the showcase"
                  type="text"
                  value={formData.shortDescription}
                  onChange={handleInputChange}
                />
                {errors.shortDescription && (
                  <p className="text-sm text-red-500">
                    {errors.shortDescription}
                  </p>
                )}
              </div>

              {/* Long Description */}
              <div className="space-y-1">
                <Label htmlFor="longDescription">
                  Full Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  className={
                    errors.longDescription
                      ? "border-red-500 focus-visible:ring-red-500"
                      : ""
                  }
                  id="longDescription"
                  name="longDescription"
                  placeholder="Detailed description of the showcase"
                  rows={3}
                  value={formData.longDescription}
                  onChange={handleInputChange}
                />
                {errors.longDescription && (
                  <p className="text-sm text-red-500">
                    {errors.longDescription}
                  </p>
                )}
              </div>

              {/* Location */}
              <div className="space-y-1">
                <Label htmlFor="location">
                  <span className="flex items-center gap-1">
                    <MapPinIcon className="text-[#3182CE]" size={16} />
                    Location <span className="text-red-500">*</span>
                  </span>
                </Label>
                <Input
                  className={
                    errors.location
                      ? "border-red-500 focus-visible:ring-red-500"
                      : ""
                  }
                  id="location"
                  name="location"
                  placeholder="City, Country"
                  type="text"
                  value={formData.location}
                  onChange={handleInputChange}
                />
                {errors.location && (
                  <p className="text-sm text-red-500">{errors.location}</p>
                )}
              </div>
            </div>

            {/* Dates Section */}
            <div className="border-t-8 border-[#48BB78] rounded-t-md pt-4">
              <h3 className="text-md font-semibold text-[#1A365D] mb-3">
                Dates
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Start Date */}
                <div className="space-y-1">
                  <Label htmlFor="startDate">
                    <span className="flex items-center gap-1">
                      <CalendarIcon className="text-[#3182CE]" size={16} />
                      Start Date <span className="text-red-500">*</span>
                    </span>
                  </Label>
                  <Input
                    className={
                      errors.startDate
                        ? "border-red-500 focus-visible:ring-red-500"
                        : ""
                    }
                    id="startDate"
                    type="datetime-local"
                    value={toDatetimeLocal(startDate)}
                    onChange={(e) => {
                      const parsed = fromDatetimeLocal(e.target.value);

                      if (parsed) {
                        setStartDate(parsed);
                        if (errors.startDate)
                          setErrors({ ...errors, startDate: "" });
                      }
                    }}
                  />
                  {errors.startDate && (
                    <p className="text-sm text-red-500">{errors.startDate}</p>
                  )}
                </div>

                {/* End Date */}
                <div className="space-y-1">
                  <Label htmlFor="endDate">
                    <span className="flex items-center gap-1">
                      <CalendarIcon className="text-[#3182CE]" size={16} />
                      End Date <span className="text-red-500">*</span>
                    </span>
                  </Label>
                  <Input
                    className={
                      errors.endDate
                        ? "border-red-500 focus-visible:ring-red-500"
                        : ""
                    }
                    id="endDate"
                    type="datetime-local"
                    value={toDatetimeLocal(endDate)}
                    onChange={(e) => {
                      const parsed = fromDatetimeLocal(e.target.value);

                      if (parsed) {
                        setEndDate(parsed);
                        if (errors.endDate)
                          setErrors({ ...errors, endDate: "" });
                      }
                    }}
                  />
                  {errors.endDate && (
                    <p className="text-sm text-red-500">{errors.endDate}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Achievements Section */}
            <div className="border-t-8 border-[#805AD5] rounded-t-md pt-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-md font-semibold text-[#1A365D] flex items-center">
                  <AwardIcon className="mr-2 text-[#805AD5]" size={18} />
                  Key Achievements
                </h3>
                <button
                  className="flex items-center text-[#3182CE] hover:text-blue-700 transition-colors text-sm"
                  type="button"
                  onClick={handleAddAchievement}
                >
                  <PlusIcon className="mr-1" size={16} />
                  Add Achievement
                </button>
              </div>
              {errors.keyAchievements && (
                <p className="mb-2 text-sm text-red-500">
                  {errors.keyAchievements}
                </p>
              )}
              <div className="space-y-3">
                {formData.keyAchievements.map((achievement, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="p-2 bg-purple-50 rounded-full shrink-0">
                      <AwardIcon className="text-[#805AD5]" size={16} />
                    </div>
                    <Input
                      className={
                        errors.keyAchievements
                          ? "border-red-500 focus-visible:ring-red-500"
                          : ""
                      }
                      placeholder="Enter an achievement (e.g., 'Raised $10,000 for charity')"
                      type="text"
                      value={achievement}
                      onChange={(e) =>
                        handleAchievementChange(e.target.value, index)
                      }
                    />
                    <button
                      className={`p-2 rounded-full shrink-0 transition-colors ${
                        formData.keyAchievements.length === 1
                          ? "text-gray-300 cursor-not-allowed"
                          : "text-red-600 hover:bg-red-50 hover:text-red-700"
                      }`}
                      disabled={formData.keyAchievements.length === 1}
                      type="button"
                      onClick={() => handleRemoveAchievement(index)}
                    >
                      <TrashIcon size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="flex justify-end items-center p-4 border-t border-gray-200 bg-gray-50">
          <button
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 mr-3"
            type="button"
            onClick={onClose}
          >
            Cancel
          </button>
          <Button
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#3182CE] hover:bg-blue-600 flex items-center"
            isLoading={isUpdating}
            type="button"
            onClick={handleSubmit}
          >
            <SaveIcon className="mr-2" size={16} />
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};