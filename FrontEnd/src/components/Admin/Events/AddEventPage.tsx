/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/label-has-associated-control */
import useEventsStore from "@/store/useEventsStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "react-router-dom";
import {
  ArrowLeftIcon,
  CalendarIcon,
  SaveIcon,
  TagIcon,
} from "lucide-react";
import React, { useState } from "react";


type EventType = "donation" | "volunteer" | "items" | "";

interface FormState {
  title: string;
  shortDescription: string;
  longDescription: string;
  eventType: EventType;
  location: string;
  targetAmount?: number;
  currentAmount?: number;
  volunteersNeeded?: number;
  currentVolunteers?: number;
  hoursPerVolunteer?: number;
  items?: Array<{
    name: string;
    quantityNeeded: number;
    quantityDonated?: number; 
  }>;
  mainImage?: File | null;
  images?: File[];
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

export const AddEventPage: React.FC = () => {
  const { addEvent, isAddingEvent } = useEventsStore();
  
  // Use ISO strings for state to keep logic simple with Shadcn
  const [startDate, setStartDate] = useState(new Date().toISOString());
  const [endDate, setEndDate] = useState(new Date().toISOString());
  
  const [formState, setFormState] = useState<FormState>({
    title: "",
    shortDescription: "",
    longDescription: "",
    eventType: "donation",
    location: "",
    mainImage: null,
    images: [],
    items: [{ name: "", quantityNeeded: 0 }],
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormState({ ...formState, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const handleEventTypeChange = (type: string) => {
    setFormState({
      ...formState,
      eventType: type as EventType,
      targetAmount: undefined,
      currentAmount: undefined,
      volunteersNeeded: undefined,
      currentVolunteers: undefined,
      hoursPerVolunteer: undefined,
      items: [{ name: "", quantityNeeded: 0 }],
    });
  };



  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formState.title) newErrors.title = "Title is required";
    if (!formState.location) newErrors.location = "Location is required";
    if (!startDate) newErrors.startDate = "Start date is required";
    if (!endDate) newErrors.endDate = "End date is required";
    if (new Date(endDate) < new Date(startDate)) {
      newErrors.endDate = "End date must be after start date";
    }
    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const data = new FormData();

      Object.keys(formState).forEach((key) => {
        if (key === "images") {
          formState.images?.forEach((image) => data.append("images", image));
        } else {
          data.append(key, (formState as any)[key]);
        }
      });
      data.append("startDate", startDate);
      data.append("endDate", endDate);
      await addEvent(data);
    }
  };



  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <Link className="flex items-center text-sm text-gray-600 hover:text-black" to="/admin/events">
          <ArrowLeftIcon className="mr-1" size={16} /> Back to Events
        </Link>
      </div>

      <form className="space-y-8" onSubmit={handleSubmit}>
        <h1 className="text-2xl font-bold text-[#1A365D]">Create New Event</h1>

        <section className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-[#3182CE] to-[#48BB78]" />
          <div className="p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Basic Details</h2>
            
            <div>
              <Label className="flex gap-1 items-center mb-1">
                <TagIcon className="text-[#3182CE]" size={16} /> Title *
              </Label>
              <Input
                className={errors.title ? "border-red-500" : ""}
                name="title"
                placeholder="Event title"
                value={formState.title}
                onChange={handleInputChange}
              />
              {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
            </div>

            <div>
              <Label className="mb-1 block">Short Description *</Label>
              <Input
                name="shortDescription"
                value={formState.shortDescription}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <Label className="mb-1 block">Long Description *</Label>
              <Textarea
                name="longDescription"
                rows={4}
                value={formState.longDescription}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <Label className="mb-1 block">Event Type *</Label>
              <div className="flex gap-2">
                {["donation", "volunteer", "items"].map((type) => (
                  <Button
                    key={type}
                    className={formState.eventType === type ? "bg-blue-500" : ""}
                    type="button"
                    variant={formState.eventType === type ? "default" : "outline"}
                    onClick={() => handleEventTypeChange(type)}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {formState.eventType && (
          <section className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="space-y-4">
              {formState.eventType === "donation" && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="mb-1 block">Target Amount ($) *</Label>
                    <Input
                      type="number"
                      value={formState.targetAmount}
                      onChange={(e) => setFormState({ ...formState, targetAmount: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label className="mb-1 block">Current Amount ($)</Label>
                    <Input
                      type="number"
                      value={formState.currentAmount}
                      onChange={(e) => setFormState({ ...formState, currentAmount: Number(e.target.value) })}
                    />
                  </div>
                </div>
              )}
              {/* ... Volunteer and Items sections follow same pattern ... */}
            </div>
          </section>
        )}

        <section className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Dates & Media</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="flex items-center mb-1">
                <CalendarIcon className="mr-1 text-[#F56565]" size={16} /> Start Date *
              </Label>
              <Input
                type="datetime-local"
                value={toDatetimeLocal(startDate)}
                onChange={(e) => setStartDate(fromDatetimeLocal(e.target.value))}
              />
            </div>
            <div>
              <Label className="flex items-center mb-1">
                <CalendarIcon className="mr-1 text-[#F56565]" size={16} /> End Date *
              </Label>
              <Input
                type="datetime-local"
                value={toDatetimeLocal(endDate)}
                onChange={(e) => setEndDate(fromDatetimeLocal(e.target.value))}
              />
            </div>
          </div>
        </section>

        <div className="flex justify-end">
          <Button 
            className="bg-[#3182CE] hover:bg-blue-600 px-6" 
            disabled={isAddingEvent}
            type="submit"
          >
            <SaveIcon className="mr-2" size={16} /> Save Event
          </Button>
        </div>
      </form>
    </div>
  );
};