/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "react-router-dom";
import {
  ArrowLeftIcon,
  CalendarIcon,
  MapPinIcon,
  ImageIcon,
  SaveIcon,
  PlusIcon,
  TrashIcon,
  AwardIcon,
} from "lucide-react";
import ImageUpload from "./ShowCaseImageUpload";
import useShowCases from "@/store/useShowCaseStore";

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

/** * Helpers for datetime-local input 
 */
const toDatetimeLocal = (isoString: string) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  const offset = date.getTimezoneOffset() * 60000;

  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
};

const fromDatetimeLocal = (localValue: string) => {
  if (!localValue) return "";

  return new Date(localValue).toISOString();
};

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

  const [date, setDate] = useState(new Date().toISOString());
  const [errors, setErrors] = useState<FormErrors>({});
  const { addShowCase, isAdding } = useShowCases();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormState((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };

        delete newErrors[name];

        return newErrors;
      });
    }
  };

  const handleAddAchievement = () => {
    setFormState((prev) => ({
      ...prev,
      keyAchievements: [
        ...prev.keyAchievements,
        { id: Date.now().toString(), text: "" },
      ],
    }));
  };

  const handleRemoveAchievement = (id: string) => {
    if (formState.keyAchievements.length > 1) {
      setFormState((prev) => ({
        ...prev,
        keyAchievements: prev.keyAchievements.filter((a) => a.id !== id),
      }));
    }
  };

  const handleAchievementChange = (id: string, text: string) => {
    setFormState((prev) => ({
      ...prev,
      keyAchievements: prev.keyAchievements.map((a) =>
        a.id === id ? { ...a, text } : a
      ),
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formState.title.trim()) newErrors.title = "Title is required";
    if (!formState.location.trim()) newErrors.location = "Location is required";
    if (!date) newErrors.date = "Date is required";
    if (!formState.shortDescription.trim())
      newErrors.shortDescription = "Short description is required";
    if (!formState.mainImage) newErrors.mainImage = "Main image is required";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const formData = new FormData();

      formData.append("title", formState.title);
      formData.append("shortDescription", formState.shortDescription);
      formData.append("longDescription", formState.longDescription);
      formData.append("location", formState.location);
      formData.append("date", date);
      
      if (formState.mainImage) {
        formData.append("mainImage", formState.mainImage);
      }
      
      formState.additionalImages.forEach((img) => {
        formData.append("additionalImages", img);
      });

      const achievementsText = formState.keyAchievements
        .map((a) => a.text)
        .filter((t) => t.trim() !== "");

      formData.append("keyAchievements", JSON.stringify(achievementsText));

      await addShowCase(formData);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <Link 
          className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors" 
          to="/admin/showcases"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Back to Showcases
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-[#3182CE] px-6 py-4">
          <h1 className="text-xl font-bold text-white flex items-center">
            <PlusIcon className="w-6 h-6 mr-2" />
            Create New Showcase
          </h1>
        </div>

        <form className="p-6 space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label className="flex items-center mb-1">
                  <AwardIcon className="w-4 h-4 mr-2 text-blue-500" />
                  Showcase Title *
                </Label>
                <Input
                  className={errors.title ? "border-red-500" : ""}
                  name="title"
                  placeholder="Enter showcase title"
                  value={formState.title}
                  onChange={handleInputChange}
                />
                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
              </div>

              <div>
                <Label className="flex items-center mb-1">
                  <MapPinIcon className="w-4 h-4 mr-2 text-red-500" />
                  Location *
                </Label>
                <Input
                  className={errors.location ? "border-red-500" : ""}
                  name="location"
                  placeholder="Enter location"
                  value={formState.location}
                  onChange={handleInputChange}
                />
                {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
              </div>

              <div>
                <Label className="flex items-center mb-1">
                  <CalendarIcon className="w-4 h-4 mr-2 text-green-500" />
                  Event Date *
                </Label>
                <Input
                  className={errors.date ? "border-red-500" : ""}
                  type="datetime-local"
                  value={toDatetimeLocal(date)}
                  onChange={(e) => setDate(fromDatetimeLocal(e.target.value))}
                />
                {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col h-full">
                <Label className="flex items-center mb-1">
                  <ImageIcon className="w-4 h-4 mr-2 text-purple-500" />
                  Images *
                </Label>
                <div className="flex-grow border-2 border-dashed border-gray-200 rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                  <ImageUpload
                    images={[
                      ...(formState.mainImage ? [formState.mainImage] : []),
                      ...formState.additionalImages,
                    ]}
                    onChange={(allImages: File[]) => {
                      const [main, ...additional] = allImages;

                      setFormState((prev) => ({
                        ...prev,
                        mainImage: main || null,
                        additionalImages: additional || [],
                      }));
                    }}
                  />
                  {errors.mainImage && <p className="text-red-500 text-xs mt-1">{errors.mainImage}</p>}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="mb-1 block">Short Description *</Label>
              <Input
                className={errors.shortDescription ? "border-red-500" : ""}
                name="shortDescription"
                placeholder="A brief summary (max 150 chars)"
                value={formState.shortDescription}
                onChange={handleInputChange}
              />
              {errors.shortDescription && <p className="text-red-500 text-xs mt-1">{errors.shortDescription}</p>}
            </div>

            <div>
              <Label className="mb-1 block">Detailed Description</Label>
              <Textarea
                name="longDescription"
                placeholder="Tell the full story of this success..."
                rows={4}
                value={formState.longDescription}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-gray-100">
            <div className="flex justify-between items-center">
              <Label className="text-lg font-semibold flex items-center">
                <AwardIcon className="w-5 h-5 mr-2 text-yellow-500" />
                Key Achievements
              </Label>
              <Button
                className="text-blue-600 border-blue-600 hover:bg-blue-50"
                size="sm"
                type="button"
                variant="outline"
                onClick={handleAddAchievement}
              >
                <PlusIcon className="w-4 h-4 mr-1" /> Add Achievement
              </Button>
            </div>

            <div className="grid gap-3">
              {formState.keyAchievements.map((achievement) => (
                <div key={achievement.id} className="flex gap-2">
                  <Input
                    placeholder="Enter an achievement"
                    value={achievement.text}
                    onChange={(e) => handleAchievementChange(achievement.id, e.target.value)}
                  />
                  <Button
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    disabled={formState.keyAchievements.length === 1}
                    size="icon"
                    type="button"
                    variant="ghost"
                    onClick={() => handleRemoveAchievement(achievement.id)}
                  >
                    <TrashIcon className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-6 border-t border-gray-100">
            <Button
              className="bg-[#3182CE] hover:bg-blue-600 text-white min-w-[150px]"
              disabled={isAdding}
              type="submit"
            >
              {isAdding ? "Saving..." : (
                <>
                  <SaveIcon className="w-5 h-5 mr-2" />
                  Save Showcase
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};