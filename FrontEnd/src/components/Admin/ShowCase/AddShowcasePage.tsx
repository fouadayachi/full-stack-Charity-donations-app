/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from "react";
import { DatePicker } from "@heroui/date-picker";
import { Button } from "@heroui/button";
import { getLocalTimeZone, now } from "@internationalized/date";
import {
  ArrowLeftIcon,
  CalendarIcon,
  MapPinIcon,
  ImageIcon,
  SaveIcon,
  PlusIcon,
  TrashIcon,
  AwardIcon,
  XIcon,
} from "lucide-react";
import ImageUpload from "./ShowCaseImageUpload";
import useShowCases from "@/store/useShowCaseStore";
import { Link } from "@heroui/link";
interface KeyAchievement {
  id: string;
  text: string;
}
interface FormState {
  title: string;
  shortDescription: string;
  longDescription: string;
  location: string;
  mainImage: File | null;
  additionalImages: File[];
  keyAchievements: KeyAchievement[];
}
interface FormErrors {
  [key: string]: string;
}
export const AddShowcasePage: React.FC = () => {
  const [formState, setFormState] = useState<FormState>({
    title: "",
    shortDescription: "",
    longDescription: "",
    location: "",
    mainImage: null,
    additionalImages: [],
    keyAchievements: [
      {
        id: "1",
        text: "",
      },
    ],
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [startDate, setStartDate] = useState(now(getLocalTimeZone()));
  const [endDate, setEndDate] = useState(now(getLocalTimeZone()));
  const { addShowCase, isAdding } = useShowCases();
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormState({
      ...formState,
      [name]: value,
    });
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };
  const handleImageUpload = (images: File[]) => {
    if (images.length > 0 && !formState.mainImage) {
      setFormState({
        ...formState,
        mainImage: images[0],
        additionalImages: images.slice(1),
      });
    } else {
      setFormState({
        ...formState,
        additionalImages: images,
      });
    }
  };
  const handleRemoveMainImage = () => {
    if (formState.additionalImages.length > 0) {
      const [newMain, ...remainingImages] = formState.additionalImages;

      setFormState({
        ...formState,
        mainImage: newMain,
        additionalImages: remainingImages,
      });
    } else {
      setFormState({
        ...formState,
        mainImage: null,
      });
    }
  };

  const handleAddAchievement = () => {
    const newId = (formState.keyAchievements.length + 1).toString();

    setFormState({
      ...formState,
      keyAchievements: [
        ...formState.keyAchievements,
        {
          id: newId,
          text: "",
        },
      ],
    });
  };
  const handleRemoveAchievement = (id: string) => {
    if (formState.keyAchievements.length > 1) {
      setFormState({
        ...formState,
        keyAchievements: formState.keyAchievements.filter(
          (achievement) => achievement.id !== id
        ),
      });
    }
  };
  const handleAchievementChange = (id: string, value: string) => {
    setFormState({
      ...formState,
      keyAchievements: formState.keyAchievements.map((achievement) =>
        achievement.id === id
          ? {
              ...achievement,
              text: value,
            }
          : achievement
      ),
    });
    // Clear achievement errors if any
    if (errors.keyAchievements) {
      setErrors({
        ...errors,
        keyAchievements: "",
      });
    }
  };
  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!formState.title) newErrors.title = "Title is required";
    if (!formState.shortDescription)
      newErrors.shortDescription = "Short description is required";
    if (!formState.location) newErrors.location = "Location is required";
    if (!startDate) newErrors.startDate = "Start date is required";
    if (!endDate) newErrors.endDate = "End date is required";
    // Validate dates
    if (startDate && endDate) {
      if (endDate < startDate) {
        newErrors.endDate = "End date must be after start date";
      }
    }
    if (!formState.mainImage) {
      newErrors.images = "Main image is required";
    }
    const emptyAchievements = formState.keyAchievements.some(
      (achievement) => !achievement.text.trim()
    );

    if (emptyAchievements) {
      newErrors.keyAchievements = "All achievements must have text";
    }
    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const data = new FormData();

      Object.keys(formState).forEach((key) => {
        if (key === "additionalImages") {
          // Append each image file
          formState.additionalImages &&
            formState.additionalImages.forEach((image) => {
              data.append("images", image);
            });
        } else if (key === "keyAchievements") {
          formState.keyAchievements.forEach((keyAchievement) => {
            data.append(key, keyAchievement.text);
          });
        } else {
          data.append(key, formState[key as keyof FormState] as string | Blob);
        }
      });

      data.append("startDate", changeDateFormat(startDate));
      data.append("endDate", changeDateFormat(endDate));
      await addShowCase(data);
    }
  };

  const changeDateFormat = (date: any) => {
    const jsDate = date.toDate();
    const isoString = jsDate.toISOString();

    return isoString.replace("Z", "+00:00");
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="mb-6">
        <Button as={Link} className=" text-gray-600 hover:text-gray-900" href="/admin/showcases" startContent={<ArrowLeftIcon className="w-5 h-5 mr-2" />} variant="ghost">
  
          Back to Showcases
        </Button>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Create New Showcase
        </h1>
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Basic Details Section */}
          <div className="space-y-4">
            <div className="border-t-8 border-[#3182CE] rounded-t-md pt-4">
              <h2 className="text-lg font-semibold text-[#1A365D] mb-4 px-1">
                Basic Details
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Showcase Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    className={`w-full px-3 py-2 border ${
                      errors.title ? "border-red-500" : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500`}
                    name="title"
                    placeholder="Enter showcase title"
                    type="text"
                    value={formState.title}
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
                    className={`w-full px-3 py-2 border ${
                      errors.shortDescription
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500`}
                    name="shortDescription"
                    placeholder="Brief description of the showcase"
                    type="text"
                    value={formState.shortDescription}
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
                    className={`w-full px-3 py-2 border ${
                      errors.longDescription
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500`}
                    name="longDescription"
                    placeholder="Detailed description of the showcase"
                    rows={4}
                    value={formState.longDescription}
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
                    className={`w-full px-3 py-2 border ${
                      errors.location ? "border-red-500" : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500`}
                    name="location"
                    placeholder="Showcase location"
                    type="text"
                    value={formState.location}
                    onChange={handleInputChange}
                  />
                  {errors.location && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.location}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* Dates Section */}
          <div className="border-t-8 border-[#48BB78] rounded-t-md pt-4">
            <h2 className="text-lg font-semibold text-[#1A365D] mb-4 px-1">
              Dates
            </h2>
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
                  value={endDate}
                  variant="bordered"
                  onChange={(date: any) => setEndDate(date)}
                />
                {errors.endDate && (
                  <p className="mt-1 text-sm text-red-500">{errors.endDate}</p>
                )}
              </div>
            </div>
          </div>
          {/* Images Section */}
          <div className="border-t-8 border-[#F56565] rounded-t-md pt-4">
            <h2 className="text-lg font-semibold text-[#1A365D] mb-4 px-1">
              Images
            </h2>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700">
                  Images <span className="text-red-500">*</span>
                </label>
                {formState.mainImage && (
                  <span className="text-xs text-blue-600 font-medium">
                    Main image selected
                  </span>
                )}
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-3">
                <div className="flex items-start">
                  <ImageIcon className="w-5 h-5 text-blue-500 mr-2 mt-0.5" />
                  <p className="text-sm text-blue-800">
                    <strong>Important:</strong> The first image you upload will
                    be used as the main showcase image. This image will appear
                    in showcase listings and at the top of your showcase page.
                  </p>
                </div>
              </div>
              {formState.mainImage && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Main Image
                    </label>
                  </div>
                  <div className="relative inline-block">
                    <img
                      alt="Main showcase image"
                      className="w-full max-w-md h-auto rounded-lg border-2 border-blue-400"
                      src={URL.createObjectURL(formState.mainImage)}
                    />
                    <button
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                      type="button"
                      onClick={handleRemoveMainImage}
                    >
                      <XIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
              <ImageUpload
                error={errors.images}
                images={formState.additionalImages}
                onChange={handleImageUpload}
              />
              {formState.additionalImages.length > 0 && (
                <p className="text-sm text-gray-500 mt-2">
                  {formState.additionalImages.length} additional image
                  {formState.additionalImages.length !== 1 ? "s" : ""} will be
                  shown in the showcase gallery
                </p>
              )}
            </div>
          </div>
          {/* Achievements Section */}
          <div className="border-t-8 border-[#805AD5] rounded-t-md pt-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-[#1A365D] px-1">
                Key Achievements
              </h2>
              <button
                className="flex items-center text-[#3182CE] hover:text-blue-700 transition-colors"
                type="button"
                onClick={handleAddAchievement}
              >
                <PlusIcon className="w-4 h-4 mr-1" />
                Add Achievement
              </button>
            </div>
            {errors.keyAchievements && (
              <p className="mt-1 mb-2 text-sm text-red-500">
                {errors.keyAchievements}
              </p>
            )}
            <div className="space-y-3">
              {formState.keyAchievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className="flex items-start space-x-2"
                >
                  <div className="p-2 bg-purple-50 rounded-full">
                    <AwardIcon className="text-[#805AD5]" size={16} />
                  </div>
                  <input
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Enter an achievement (e.g., 'Raised $10,000 for charity')"
                    type="text"
                    value={achievement.text}
                    onChange={(e) =>
                      handleAchievementChange(achievement.id, e.target.value)
                    }
                  />
                  <button
                    className={`p-2 rounded-full ${
                      formState.keyAchievements.length === 1
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-red-600 hover:bg-red-50 hover:text-red-700"
                    } transition-colors`}
                    disabled={formState.keyAchievements.length === 1}
                    type="button"
                    onClick={() => handleRemoveAchievement(achievement.id)}
                  >
                    <TrashIcon size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <Button
              className="flex items-center px-4 py-2 bg-[#3182CE] text-white rounded-md hover:bg-blue-600 transition-colors"
              isLoading={isAdding}
              type="submit"
            >
              <SaveIcon className="w-5 h-5 mr-2" />
              Save Showcase
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
