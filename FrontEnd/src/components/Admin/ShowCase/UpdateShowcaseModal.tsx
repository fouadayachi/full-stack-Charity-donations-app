/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { Button } from "@heroui/button";
import { DatePicker } from "@heroui/date-picker";
import { parseAbsoluteToLocal } from "@internationalized/date";
import {
    Award as AwardIcon,
    Calendar as CalendarIcon,
    MapPin as MapPinIcon,
    // Image as ImageIcon,
    Plus as PlusIcon,
    Save as SaveIcon,
    Trash as TrashIcon,
    X as XIcon,
} from "lucide-react";
import React, { useEffect, useState } from "react";
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
  const [startDate, setStartDate] = useState(
    parseAbsoluteToLocal("2025-03-14T20:50:33.777+00:00")
  );
  const [endDate, setEndDate] = useState(
    parseAbsoluteToLocal("2025-03-14T20:50:33.777+00:00")
  );
  const [errors, setErrors] = useState<{
    [key: string]: string;
  }>({});
  // const [newImages, setNewImages] = useState<File[]>([])
  // const [imagesToRemove, setImagesToRemove] = useState<string[]>([])

  // Initialize form data when showcase changes
  useEffect(() => {
    if (showcase) {
      setFormData({
        ...showcase,
      });
      setStartDate(parseAbsoluteToLocal(showcase.startDate));
      setEndDate(parseAbsoluteToLocal(showcase.endDate));
      // setNewImages([])
      // setImagesToRemove([])
      setErrors({});
    }
  }, [showcase]);
  if (!isOpen || !formData) return null;
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };
  // const handleImageUpload = (images: File[]) => {
  //   setNewImages([...newImages, ...images])
  // }
  // const handleRemoveExistingImage = (imageUrl: string) => {
  //   // Mark image for removal
  //   setImagesToRemove([...imagesToRemove, imageUrl])
  //   // Remove from current formData
  //   setFormData({
  //     ...formData,
  //     images: formData.images.filter((img) => img !== imageUrl),
  //   })
  // }
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
    setFormData({
      ...formData,
      keyAchievements: [...newKeys],
    });
    // Clear achievement errors if any
    if (errors.keyAchievements) {
      setErrors({
        ...errors,
        keyAchievements: "",
      });
    }
  };
  const validateForm = (): boolean => {
    const newErrors: {
      [key: string]: string;
    } = {};

    // Validate required fields
    if (!formData.title) newErrors.title = "Title is required";
    if (!formData.shortDescription)
      newErrors.shortDescription = "Short description is required";
    if (!formData.location) newErrors.location = "Location is required";
    if (!formData.startDate) newErrors.startDate = "Start date is required";
    if (!formData.endDate) newErrors.endDate = "End date is required";
    // Validate dates
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);

      if (end < start) {
        newErrors.endDate = "End date must be after start date";
      }
    }
    // Validate images - ensure there's at least one image left
    // const remainingImages = formData.images.filter(
    //   (img) => !imagesToRemove.includes(img),
    // )

    // if (remainingImages.length === 0 && newImages.length === 0) {
    //   newErrors.images = 'At least one showcase image is required'
    // }
    // Validate achievements
    const emptyAchievements = formData.keyAchievements.some(
      (achievement) => !achievement.trim()
    );

    if (emptyAchievements) {
      newErrors.keyAchievements = "All achievements must have text";
    }
    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };
  const changeDateFormat = (date: any) => {
    const jsDate = date.toDate();
    const isoString = jsDate.toISOString();

    return isoString.replace("Z", "+00:00");
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm() && formData) {
      // In a real application, you would upload the new images to your server
      // and get back URLs, then update the showcase with those URLs
      // For demonstration purposes, we'll just simulate this
      //   const updatedShowcase = {
      //     ...formData,
      //     // In a real app, you would replace this with actual uploaded image URLs
      //     // images: [
      //     //   ...formData.images.filter((img) => !imagesToRemove.includes(img)),
      //     //   ...newImages.map((file) => URL.createObjectURL(file)),
      //     // ],
      //   };
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
          <h2 className="text-xl font-bold text-[#1A365D] flex items-center">
            Update Showcase
          </h2>
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Showcase Title <span className="text-red-500">*</span>
                </label>
                <input
                  className={`block w-full border ${
                    errors.title ? "border-red-500" : "border-gray-300"
                  } rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-[#3182CE] focus:border-[#3182CE]`}
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleInputChange}
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-500">{errors.title}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Short Description <span className="text-red-500">*</span>
                </label>
                <input
                  className={`block w-full border ${
                    errors.shortDescription
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-[#3182CE] focus:border-[#3182CE]`}
                  name="shortDescription"
                  type="text"
                  value={formData.shortDescription}
                  onChange={handleInputChange}
                />
                {errors.shortDescription && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.shortDescription}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  className={`block w-full border ${
                    errors.longDescription
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-[#3182CE] focus:border-[#3182CE]`}
                  name="longDescription"
                  rows={3}
                  value={formData.longDescription}
                  onChange={handleInputChange}
                />
                {errors.longDescription && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.longDescription}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <span className="flex items-center">
                    <MapPinIcon className="mr-1 text-[#3182CE]" size={16} />
                    Location <span className="text-red-500">*</span>
                  </span>
                </label>
                <input
                  className={`block w-full border ${
                    errors.location ? "border-red-500" : "border-gray-300"
                  } rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-[#3182CE] focus:border-[#3182CE]`}
                  name="location"
                  type="text"
                  value={formData.location}
                  onChange={handleInputChange}
                />
                {errors.location && (
                  <p className="mt-1 text-sm text-red-500">{errors.location}</p>
                )}
              </div>
            </div>
            {/* Dates Section */}
            <div className="border-t-8 border-[#48BB78] rounded-t-md pt-4">
              <h3 className="text-md font-semibold text-[#1A365D] mb-3">
                Dates
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <span className="flex items-center">
                      <CalendarIcon className="mr-1 text-[#3182CE]" size={16} />
                      Start Date <span className="text-red-500">*</span>
                    </span>
                  </label>
                  <DatePicker
                    hideTimeZone
                    showMonthAndYearPickers
                    granularity="minute"
                    value={startDate}
                    variant="bordered"
                    onChange={(date: any) => setStartDate(date)}
                  />
                  {errors.startDate && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.startDate}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <span className="flex items-center">
                      <CalendarIcon className="mr-1 text-[#3182CE]" size={16} />
                      End Date <span className="text-red-500">*</span>
                    </span>
                  </label>
                  <DatePicker
                    hideTimeZone
                    showMonthAndYearPickers
                    granularity="minute"
                    value={endDate}
                    variant="bordered"
                    onChange={(date: any) => setEndDate(date)}
                  />
                  {errors.endDate && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.endDate}
                    </p>
                  )}
                </div>
              </div>
            </div>
            {/* Images Section */}
            {/* <div className="border-t-8 border-[#F56565] rounded-t-md pt-4">
                            <h3 className="text-md font-semibold text-[#1A365D] mb-3 flex items-center">
                                <ImageIcon className="mr-2 text-[#F56565]" size={18} />
                                Images
                            </h3>
                            <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-3">
                                <div className="flex items-start">
                                    <ImageIcon className="w-5 h-5 text-blue-500 mr-2 mt-0.5" />
                                    <p className="text-sm text-blue-800">
                                        <strong>Note:</strong> The first image is used as the main
                                        showcase image. This image will appear in showcase listings
                                        and at the top of your showcase page.
                                    </p>
                                </div>
                            </div>
                            {/* Existing Images */}
            {/* {formData.images.length > 0 && (
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Current Images
                                    </label>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {formData.images.map((image, index) => (
                                            <div key={index} className="relative group">
                                                <img
                                                    alt={`Showcase image ${index + 1}`}
                                                    className={`w-full h-24 object-cover rounded-lg ${index === 0 ? 'border-2 border-blue-500' : ''}`}
                                                    src={image}
                                                />
                                                {index === 0 && (
                                                    <div className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-2 py-0.5 rounded">
                                                        Main
                                                    </div>
                                                )}
                                                <button
                                                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                    type="button"
                                                    onClick={() => handleRemoveExistingImage(image)}
                                                >
                                                    <XIcon className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )} */}
            {/* New Images */}
            {/* <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Add New Images
                                </label>
                                <ImageUpload
                                    error={errors.images}
                                    images={newImages}
                                    onChange={handleImageUpload}
                                />
                            </div>
                            {errors.images && (
                                <p className="mt-1 text-sm text-red-500">{errors.images}</p>
                            )}
                        </div> */}
            {/* Achievements Section */}
            <div className="border-t-8 border-[#805AD5] rounded-t-md pt-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-md font-semibold text-[#1A365D] flex items-center">
                  <AwardIcon className="mr-2 text-[#805AD5]" size={18} />
                  Key Achievements
                </h3>
                <button
                  className="flex items-center text-[#3182CE] hover:text-blue-700 transition-colors"
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
                  <div key={index} className="flex items-start space-x-2">
                    <div className="p-2 bg-purple-50 rounded-full">
                      <AwardIcon className="text-[#805AD5]" size={16} />
                    </div>
                    <input
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Enter an achievement (e.g., 'Raised $10,000 for charity')"
                      type="text"
                      value={achievement}
                      onChange={(e) =>
                        handleAchievementChange(e.target.value, index)
                      }
                    />
                    <button
                      className={`p-2 rounded-full ${
                        formData.keyAchievements.length === 1
                          ? "text-gray-300 cursor-not-allowed"
                          : "text-red-600 hover:bg-red-50 hover:text-red-700"
                      } transition-colors`}
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
