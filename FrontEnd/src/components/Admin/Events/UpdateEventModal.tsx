/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Calendar as CalendarIcon,
  DollarSign as DollarSignIcon,
  MapPin as MapPinIcon,
  Package as PackageIcon,
  Plus as PlusIcon,
  Tag as TagIcon,
  Trash as TrashIcon,
  Users as UsersIcon,
  X,
} from "lucide-react";

export interface Event {
  _id?: string;
  title: string;
  type: "donation" | "volunteer" | "items";
  status: "active" | "completed" | "canceled";
  shortDescription: string;
  longDescription: string;
  startDate: string;
  endDate: string;
  location: string;
  mainImage: string;
  images: string[];
  targetAmount?: number;
  currentAmount?: number;
  targetVolunteers?: number;
  currentVolunteers?: number;
  volunteerHours?: number;
  targetItems?: Array<{
    name: string;
    quantityNeeded: number;
    quantityDonated: number;
  }>;
}

interface UpdateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event | null;
  onUpdate: (updatedEvent: Event) => void;
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

export const UpdateEventModal: React.FC<UpdateEventModalProps> = ({
  isOpen,
  onClose,
  event,
  onUpdate,
}) => {
  const [formData, setFormData] = useState<Event | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  
  const [itemInput, setItemInput] = useState<{
    name: string;
    quantityNeeded: number;
  }>({ name: "", quantityNeeded: 0 });
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newMainImage, setNewMainImage] = useState<File | null>(null);

  useEffect(() => {
    if (event) {
      setFormData({ ...event });
      setStartDate(event.startDate);
      setEndDate(event.endDate);
      setNewImages([]);
      setNewMainImage(null);
    }
  }, [event]);

  if (!isOpen || !formData) return null;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.title) newErrors.title = "Title is required";
    if (!formData.shortDescription) newErrors.shortDescription = "Short description is required";
    if (!formData.location) newErrors.location = "Location is required";
    if (!startDate) newErrors.startDate = "Start date is required";
    if (!endDate) newErrors.endDate = "End date is required";
    
    if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
      newErrors.endDate = "End date must be after start date";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm() && formData) {
      onUpdate({
        ...formData,
        startDate,
        endDate,
        // Assuming your backend handles the File objects via FormData
        // @ts-ignore
        newMainImage,
        // @ts-ignore
        newImages,
      });
      onClose();
    }
  };

  const handleRemoveMainImage = () => {
    if (formData && formData.images.length > 0) {
      const [newMain, ...remainingImages] = formData.images;

      setFormData({ ...formData, mainImage: newMain, images: remainingImages });
    } else {
      setNewMainImage(null);
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImagesList = [...formData.images];

    newImagesList.splice(index, 1);
    setFormData({ ...formData, images: newImagesList });
  };

  const handleAddItem = () => {
    const currentItems = formData.targetItems || [];

    setFormData({
      ...formData,
      targetItems: [
        ...currentItems,
        { name: itemInput.name, quantityNeeded: itemInput.quantityNeeded, quantityDonated: 0 },
      ],
    });
    setItemInput({ name: "", quantityNeeded: 0 });
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    if (formData.targetItems) {
      const updatedItems = [...formData.targetItems];

      // @ts-ignore
      updatedItems[index][field] = value;
      setFormData({ ...formData, targetItems: updatedItems });
    }
  };

  const typeColor = formData.type === "donation" ? "#3182CE" : formData.type === "volunteer" ? "#48BB78" : "#805AD5";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-[#1A365D] flex items-center">
            Update Event
            <span className="ml-2 px-2 py-1 text-xs font-semibold rounded-full text-white" style={{ backgroundColor: typeColor }}>
              {formData.type}
            </span>
          </h2>
          <button className="text-gray-400 hover:text-gray-600 transition-colors" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-130px)]">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="mb-1 block">
                    <span className="flex items-center">
                      <TagIcon className="mr-1 text-[#3182CE]" size={16} />
                      Event Title <span className="text-red-500">*</span>
                    </span>
                  </Label>
                  <Input
                    className={errors.title ? "border-red-500" : ""}
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                  />
                  {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
                </div>

                <div>
                  <Label className="mb-1 block">Event Status</Label>
                  <div className="flex gap-2">
                    {["active", "completed", "canceled"].map((state) => (
                      <Button
                        key={state}
                        className={formData.status === state ? "bg-blue-500" : ""}
                        type="button"
                        variant={formData.status === state ? "default" : "outline"}
                        onClick={() => setFormData({ ...formData, status: state as any })}
                      >
                        {state.charAt(0).toUpperCase() + state.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <Label className="mb-1 block">Short Description <span className="text-red-500">*</span></Label>
                <Input
                  className={errors.shortDescription ? "border-red-500" : ""}
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleInputChange}
                />
                {errors.shortDescription && <p className="mt-1 text-sm text-red-500">{errors.shortDescription}</p>}
              </div>

              <div>
                <Label className="mb-1 block">Long Description</Label>
                <Textarea
                  name="longDescription"
                  rows={3}
                  value={formData.longDescription}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <Label className="mb-1 block">
                  <span className="flex items-center">
                    <MapPinIcon className="mr-1 text-[#3182CE]" size={16} />
                    Location <span className="text-red-500">*</span>
                  </span>
                </Label>
                <Input
                  className={errors.location ? "border-red-500" : ""}
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                />
                {errors.location && <p className="mt-1 text-sm text-red-500">{errors.location}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="mb-1 block">
                    <span className="flex items-center">
                      <CalendarIcon className="mr-1 text-[#F56565]" size={16} />
                      Start Date <span className="text-red-500">*</span>
                    </span>
                  </Label>
                  <Input
                    className={errors.startDate ? "border-red-500" : ""}
                    type="datetime-local"
                    value={toDatetimeLocal(startDate)}
                    onChange={(e) => setStartDate(fromDatetimeLocal(e.target.value))}
                  />
                  {errors.startDate && <p className="mt-1 text-sm text-red-500">{errors.startDate}</p>}
                </div>
                <div>
                  <Label className="mb-1 block">
                    <span className="flex items-center">
                      <CalendarIcon className="mr-1 text-[#F56565]" size={16} />
                      End Date <span className="text-red-500">*</span>
                    </span>
                  </Label>
                  <Input
                    className={errors.endDate ? "border-red-500" : ""}
                    type="datetime-local"
                    value={toDatetimeLocal(endDate)}
                    onChange={(e) => setEndDate(fromDatetimeLocal(e.target.value))}
                  />
                  {errors.endDate && <p className="mt-1 text-sm text-red-500">{errors.endDate}</p>}
                </div>
              </div>

              {/* Donation Details */}
              {formData.type === "donation" && (
                <div className="bg-blue-50 p-4 rounded-md border border-blue-100 space-y-4">
                  <h3 className="text-md font-medium text-gray-800 flex items-center">
                    <DollarSignIcon className="mr-2 text-[#3182CE]" size={18} />
                    Donation Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="mb-1 block">Target Amount ($) *</Label>
                      <Input
                        className={errors.targetAmount ? "border-red-500" : ""}
                        type="number"
                        value={formData.targetAmount}
                        onChange={(e) => setFormData({ ...formData, targetAmount: Number(e.target.value) })}
                      />
                      {errors.targetAmount && <p className="mt-1 text-sm text-red-500">{errors.targetAmount}</p>}
                    </div>
                    <div>
                      <Label className="mb-1 block">Current Amount</Label>
                      <Input
                        type="number"
                        value={formData.currentAmount}
                        onChange={(e) => setFormData({ ...formData, currentAmount: Number(e.target.value) })}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Volunteer Details */}
              {formData.type === "volunteer" && (
                <div className="bg-green-50 p-4 rounded-md border border-green-100 space-y-4">
                  <h3 className="text-md font-medium text-gray-800 flex items-center">
                    <UsersIcon className="mr-2 text-[#48BB78]" size={18} />
                    Volunteer Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="mb-1 block">Volunteers Needed *</Label>
                      <Input
                        type="number"
                        value={formData.targetVolunteers}
                        onChange={(e) => setFormData({ ...formData, targetVolunteers: Number(e.target.value) })}
                      />
                    </div>
                    <div>
                      <Label className="mb-1 block">Hours Per Volunteer *</Label>
                      <Input
                        type="number"
                        value={formData.volunteerHours}
                        onChange={(e) => setFormData({ ...formData, volunteerHours: Number(e.target.value) })}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Items Section remains similar but using Shadcn Inputs */}
              {formData.type === "items" && (
                <div className="bg-purple-50 p-4 rounded-md border border-purple-100">
                   <div className="flex justify-between items-center mb-3">
                    <h3 className="text-md font-medium text-gray-800 flex items-center">
                      <PackageIcon className="mr-2 text-[#805AD5]" size={18} />
                      Items Details
                    </h3>
                    <Button className="text-[#805AD5]" size="sm" type="button" variant="ghost" onClick={handleAddItem}>
                      <PlusIcon className="mr-1" size={16} /> Add Item
                    </Button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item Name *</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qty Needed *</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {formData.targetItems?.map((item, index) => (
                          <tr key={index}>
                            <td className="px-4 py-2">
                              <Input 
                                value={item.name} 
                                onChange={(e) => handleItemChange(index, "name", e.target.value)} 
                              />
                            </td>
                            <td className="px-4 py-2">
                              <Input 
                                type="number" 
                                value={item.quantityNeeded} 
                                onChange={(e) => handleItemChange(index, "quantityNeeded", Number(e.target.value))} 
                              />
                            </td>
                            <td className="px-4 py-2">
                              <Button size="icon" variant="ghost" onClick={() => handleRemoveImage(index)}>
                                <TrashIcon className="text-red-500" size={16} />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </form>
        </div>

        <div className="flex justify-end items-center p-4 border-t border-gray-200 bg-gray-50">
          <Button className="mr-3" variant="outline" onClick={onClose}>Cancel</Button>
          <Button className="bg-[#3182CE] hover:bg-blue-600" onClick={handleSubmit}>Save Changes</Button>
        </div>
      </div>
    </div>
  );
};