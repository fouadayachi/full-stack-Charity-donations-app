/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { Button } from "@heroui/button";
import { DatePicker } from "@heroui/date-picker";
import { NumberInput } from "@heroui/number-input";
import { getLocalTimeZone, now } from "@internationalized/date";
import {
  ArrowLeftIcon,
  CalendarIcon,
  ClockIcon,
  DollarSignIcon,
  ImageIcon,
  MapPinIcon,
  PackageIcon,
  PlusIcon,
  SaveIcon,
  TagIcon,
  TrashIcon,
  UsersIcon,
  X,
} from "lucide-react";
import React, { useState } from "react";
import ImageUpload from "../ImageUpload";
import useEventsStore from "@/store/useEventsStore";
import { Link } from "@heroui/link";
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
  // Items specific
  items?: Array<{
    name: string;
    quantityNeeded: number;
  }>;
  mainImage?: File | null;
  images?: File[];
}
interface FormErrors {
  [key: string]: string;
}
export const AddEventPage: React.FC = () => {
  const {addEvent,isAddingEvent} = useEventsStore();
  const [startDate, setStartDate] = useState(now(getLocalTimeZone()));
  const [endDate, setEndDate] = useState(now(getLocalTimeZone()));
  const [formState, setFormState] = useState<FormState>({
    title: "",
    shortDescription: "",
    longDescription: "",
    eventType: "donation",
    location: "",
    mainImage: null,
    images: [],
    items: [
      {
        name: "",
        quantityNeeded: 0,
      },
    ],
  });
  const [errors, setErrors] = useState<FormErrors>({});
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
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };
  const handleEventTypeChange = (type: string) => {
    const newType = type as EventType;

    setFormState({
      ...formState,
      eventType: newType,
      targetAmount: undefined,
      currentAmount: undefined,
      volunteersNeeded: undefined,
      currentVolunteers: undefined,
      hoursPerVolunteer: undefined,
      items: [
        {
          name: "",
          quantityNeeded: 0,
        },
      ],
    });
  };
  const handleItemChange = (
    index: number,
    field: "name" | "quantityNeeded",
    value: string | number
  ) => {
    const updatedItems = [...(formState.items || [])];

    if (field === "name") {
      updatedItems[index].name = value as string;
    } else {
      updatedItems[index].quantityNeeded = value as number;
    }
    setFormState({
      ...formState,
      items: updatedItems,
    });
  };
  const addItem = () => {
    setFormState({
      ...formState,
      items: [
        ...(formState.items || []),
        {
          name: "",
          quantityNeeded: 0,
        },
      ],
    });
  };
  const removeItem = (index: number) => {
    const updatedItems = [...(formState.items || [])];

    updatedItems.splice(index, 1);
    setFormState({
      ...formState,
      items: updatedItems.length
        ? updatedItems
        : [
            {
              name: "",
              quantityNeeded: 0,
            },
          ],
    });
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validate required fields
    if (!formState.title) newErrors.title = "Title is required";
    if (!formState.shortDescription)
      newErrors.shortDescription = "Short description is required";
    if (!formState.longDescription)
      newErrors.longDescription = "Long description is required";
    if (!formState.eventType) newErrors.eventType = "Event type is required";
    if (!formState.location) newErrors.location = "Location is required";
    if (!startDate) newErrors.startDate = "Start date is required";
    if (!endDate) newErrors.endDate = "End date is required";
    // Validate dates
    if (startDate && endDate) {
      if (endDate < startDate) {
        newErrors.endDate = "End date must be after start date";
      }
    }
    // Validate type-specific fields
    if (formState.eventType === "donation") {
      if (!formState.targetAmount)
        newErrors.targetAmount = "Target amount is required";
      if (!formState.currentAmount)
        newErrors.currentAmount = "current amount is required";
    } else if (formState.eventType === "volunteer") {
      if (!formState.volunteersNeeded)
        newErrors.volunteersNeeded = "Number of volunteers is required";
      if (!formState.currentVolunteers)
        newErrors.currentVolunteers =
          "Number of current volunteers is required";
      if (!formState.hoursPerVolunteer)
        newErrors.hoursPerVolunteer = "Hours per volunteer is required";
    } else if (formState.eventType === "items") {
      const itemsValid = formState.items?.every(
        (item) => item.name && item.quantityNeeded > 0
      );

      if (!itemsValid)
        newErrors.items = "All items must have a name and quantityNeeded";
    }
    // Validate main image
    if (!formState.mainImage) newErrors.mainImage = "Main image is required";
    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const changeDateFormat = (date: any) => {
    const jsDate = date.toDate();
    const isoString = jsDate.toISOString();

    return isoString.replace("Z", "+00:00");
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();

    if (validateForm()) {

      // Append all form data to FormData
      Object.keys(formState).forEach((key) => {
        if (key === "images") {
          // Append each image file
          formState.images &&
            formState.images.forEach((image) => {
              data.append("images", image);
            });
        } else {
          data.append(key, formState[key as keyof FormState] as string | Blob);
        }
      });
      data.append("startDate", changeDateFormat(startDate));
      data.append("endDate", changeDateFormat(endDate));
      await addEvent(data);
    }
  };
  const handleImageUpload = (images: File[]) => {
    if (images.length > 0 && !formState.mainImage) {
      setFormState({
        ...formState,
        mainImage: images[0],
        images: images.slice(1),
      });
    } else {
      setFormState({
        ...formState,
        images: images,
      });
    }
  };

  const handleRemoveMainImage = () => {
    if (formState.images && formState.images.length > 0) {
      const [newMain, ...remainingImages] = formState.images;

      setFormState({
        ...formState,
        mainImage: newMain,
        images: remainingImages,
      });
    } else {
      setFormState({
        ...formState,
        mainImage: null,
      });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        
        <Button
          as={Link} 
          href="/admin/events"
          startContent={<ArrowLeftIcon className="mr-1" size={16} />}
          variant="ghost"
          
        >
          
          Back to Events
        </Button>
      </div>
      <form className="space-y-8" onSubmit={handleSubmit}>
      <h1 className="text-2xl font-bold text-[#1A365D]">Create New Event</h1>
        {/* Basic Details Section */}
        <section className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div
            className="h-2"
            style={{
              background: "linear-gradient(to right, #3182CE, #48BB78)",
            }}
          />
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Basic Details
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <span className="flex gap-1 items-center">
                    <TagIcon className="mr-1 text-[#3182CE]" size={16} />
                    Title <span className="text-red-500"> *</span>
                  </span>
                </label>
                <input
                  className={`block w-full border ${
                    errors.title ? "border-red-500" : "border-gray-300"
                  } rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-[#3182CE] focus:border-[#3182CE]`}
                  name="title"
                  placeholder="Event title"
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
                  className={`block w-full border ${
                    errors.shortDescription
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-[#3182CE] focus:border-[#3182CE]`}
                  name="shortDescription"
                  placeholder="Brief summary of the event (1-2 sentences)"
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
                  Long Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  className={`block w-full border ${
                    errors.longDescription
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-[#3182CE] focus:border-[#3182CE]`}
                  name="longDescription"
                  placeholder="Detailed description of the event"
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
                  Event Type <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  {["donation", "volunteer", "items"].map((type) => (
                    <Button
                      key={type}
                      className={`px-4 py-2 rounded-lg ${
                        formState.eventType === type
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                      variant="bordered"
                      onPress={() => handleEventTypeChange(type)}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Button>
                  ))}
                </div>

                {errors.eventType && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.eventType}
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
                  placeholder="Event location"
                  type="text"
                  value={formState.location}
                  onChange={handleInputChange}
                />
                {errors.location && (
                  <p className="mt-1 text-sm text-red-500">{errors.location}</p>
                )}
              </div>
            </div>
          </div>
        </section>
        {/* Event Type Specifics Section - Conditional */}
        {formState.eventType && (
          <section className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div
              className="h-2"
              style={{
                background:
                  formState.eventType === "donation"
                    ? "#3182CE"
                    : formState.eventType === "volunteer"
                    ? "#48BB78"
                    : "#805AD5",
              }}
            />
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                {formState.eventType === "donation" && (
                  <span className="flex items-center">
                    <DollarSignIcon className="mr-2 text-[#3182CE]" size={20} />
                    Donation Details
                  </span>
                )}
                {formState.eventType === "volunteer" && (
                  <span className="flex items-center">
                    <UsersIcon className="mr-2 text-[#48BB78]" size={20} />
                    Volunteer Details
                  </span>
                )}
                {formState.eventType === "items" && (
                  <span className="flex items-center">
                    <PackageIcon className="mr-2 text-[#805AD5]" size={20} />
                    Items Details
                  </span>
                )}
              </h2>
              <div className="space-y-4">
                {/* Donation-specific fields */}
                {formState.eventType === "donation" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Target Amount ($){" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <NumberInput
                        classNames={{
                          inputWrapper: [
                            "border rounded-md shadow-sm",
                            errors.targetAmount
                              ? "border-red-500"
                              : "border-gray-300",
                          ],
                          input: [
                            "focus:outline-none focus:ring-[#3182CE] focus:border-[#3182CE]",
                          ],
                        }}
                        defaultValue={10}
                        formatOptions={{
                          style: "currency",
                          currency: "USD",
                        }}
                        minValue={1}
                        placeholder="Amount needed"
                        size="sm"
                        value={formState.targetAmount}
                        variant="bordered"
                        onValueChange={(value) => {
                          setFormState({ ...formState, targetAmount: value });
                          setErrors({
                            ...errors,
                            targetAmount: "",
                          });
                        }}
                      />
                      {errors.targetAmount && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.targetAmount}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Current Amount ($){" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <NumberInput
                        classNames={{
                          inputWrapper: [
                            "border rounded-md shadow-sm",
                            errors.currentAmount
                              ? "border-red-500"
                              : "border-gray-300",
                          ],
                          input: [
                            "focus:outline-none focus:ring-[#3182CE] focus:border-[#3182CE]",
                          ],
                        }}
                        defaultValue={0}
                        formatOptions={{
                          style: "currency",
                          currency: "USD",
                        }}
                        placeholder="Amount currently"
                        size="sm"
                        value={formState.currentAmount}
                        variant="bordered"
                        onValueChange={(value) => {
                          setFormState({ ...formState, currentAmount: value });
                          setErrors({
                            ...errors,
                            currentAmount: "",
                          });
                        }}
                      />
                      {errors.currentAmount && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.currentAmount}
                        </p>
                      )}
                    </div>
                  </>
                )}
                {/* Volunteer-specific fields */}
                {formState.eventType === "volunteer" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Number of Volunteers Needed{" "}
                        <span className="text-red-500">*</span>
                      </label>

                      <NumberInput
                        classNames={{
                          inputWrapper: [
                            "border rounded-md shadow-sm",
                            errors.volunteersNeeded
                              ? "border-red-500"
                              : "border-gray-300",
                          ],
                          input: [
                            "focus:outline-none focus:ring-[#3182CE] focus:border-[#3182CE]",
                          ],
                        }}
                        defaultValue={1}
                        placeholder="Number of volunteers"
                        size="sm"
                        value={formState.volunteersNeeded}
                        variant="bordered"
                        onValueChange={(value) => {
                          setFormState({
                            ...formState,
                            volunteersNeeded: value > 1 ? value : 1,
                          });
                          setErrors({
                            ...errors,
                            volunteersNeeded: "",
                          });
                        }}
                      />
                      {errors.volunteersNeeded && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.volunteersNeeded}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Number of Current Volunteers{" "}
                        <span className="text-red-500">*</span>
                      </label>

                      <NumberInput
                        classNames={{
                          inputWrapper: [
                            "border rounded-md shadow-sm",
                            errors.currentVolunteers
                              ? "border-red-500"
                              : "border-gray-300",
                          ],
                          input: [
                            "focus:outline-none focus:ring-[#3182CE] focus:border-[#3182CE]",
                          ],
                        }}
                        defaultValue={0}
                        placeholder="Number current of volunteers"
                        size="sm"
                        value={formState.currentVolunteers}
                        variant="bordered"
                        onValueChange={(value) => {
                          setFormState({
                            ...formState,
                            currentVolunteers: value > 0 ? value : 0,
                          });
                          setErrors({
                            ...errors,
                            currentVolunteers: "",
                          });
                        }}
                      />
                      {errors.currentVolunteers && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.currentVolunteers}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <span className="flex items-center">
                          <ClockIcon
                            className="mr-1 text-[#48BB78]"
                            size={16}
                          />
                          Hours Per Volunteer{" "}
                          <span className="text-red-500">*</span>
                        </span>
                      </label>
                      <NumberInput
                        classNames={{
                          inputWrapper: [
                            "border rounded-md shadow-sm",
                            errors.hoursPerVolunteer
                              ? "border-red-500"
                              : "border-gray-300",
                          ],
                          input: [
                            "focus:outline-none focus:ring-[#3182CE] focus:border-[#3182CE]",
                          ],
                        }}
                        defaultValue={1}
                        maxValue={480}
                        minValue={1}
                        placeholder="Hours required per volunteer"
                        size="sm"
                        value={formState.hoursPerVolunteer}
                        variant="bordered"
                        onValueChange={(value) => {
                          setFormState({
                            ...formState,
                            hoursPerVolunteer: value > 0 ? value : 0,
                          });
                          setErrors({
                            ...errors,
                            hoursPerVolunteer: "",
                          });
                        }}
                      />

                      {errors.hoursPerVolunteer && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.hoursPerVolunteer}
                        </p>
                      )}
                    </div>
                  </>
                )}
                {/* Items-specific fields */}
                {formState.eventType === "items" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Items Needed <span className="text-red-500">*</span>
                    </label>
                    {errors.items && (
                      <p className="mb-2 text-sm text-red-500">
                        {errors.items}
                      </p>
                    )}
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            scope="col"
                          >
                            Item Name *
                          </th>
                          <th
                            className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            scope="col"
                          >
                            Quantity Needed * 
                          </th>
                          <th
                            className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            scope="col"
                          >
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {formState.items?.map((item, index) => (
                          <tr key={index}>
                            <td className="px-4 py-2">
                              <input
                                className="block w-full border border-gray-300 rounded-md py-1 px-2 shadow-sm focus:outline-none focus:ring-[#3182CE] focus:border-[#3182CE] text-sm"
                                placeholder="Item name"
                                type="text"
                                value={item.name}
                                onChange={(e) =>
                                  handleItemChange(
                                    index,
                                    "name",
                                    e.target.value
                                  )
                                }
                              />
                            </td>
                            <td className="px-4 py-2">
                              <input
                                className="block w-full border border-gray-300 rounded-md py-1 px-2 shadow-sm focus:outline-none focus:ring-[#3182CE] focus:border-[#3182CE] text-sm"
                                min="1"
                                placeholder="quantityNeeded"
                                type="number"
                                value={item.quantityNeeded || ""}
                                onChange={(e) =>
                                  handleItemChange(
                                    index,
                                    "quantityNeeded",
                                    parseInt(e.target.value || "0", 10)
                                  )
                                }
                              />
                            </td>
                            <td className="px-4 py-2">
                              <button
                                className="text-red-600 hover:text-red-800 transition-colors"
                                disabled={formState.items?.length === 1}
                                type="button"
                                onClick={() => removeItem(index)}
                              >
                                <TrashIcon size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <button
                      className="mt-3 flex items-center text-[#805AD5] hover:text-purple-700 transition-colors"
                      type="button"
                      onClick={addItem}
                    >
                      <PlusIcon className="mr-1" size={16} />
                      Add Row
                    </button>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}
        {/* Dates & Media Section */}
        <section className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div
            className="h-2"
            style={{
              background: "#F56565",
            }}
          />
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Dates & Media
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <span className="flex items-center">
                      <CalendarIcon className="mr-1 text-[#F56565]" size={16} />
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
                      <CalendarIcon className="mr-1 text-[#F56565]" size={16} />
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
                    <p className="mt-1 text-sm text-red-500">
                      {errors.endDate}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Images
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
                      <strong>Important:</strong> The first image you upload
                      will be used as the main event image. This image will
                      appear in event listings and at the top of your event
                      page.
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
                        alt="Main event image"
                        className="w-full max-w-md h-auto rounded-lg border-2 border-blue-400"
                        src={URL.createObjectURL(formState.mainImage)}
                      />
                      <button
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                        type="button"
                        onClick={handleRemoveMainImage}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
                <ImageUpload
                  error={errors.images}
                  images={formState.images}
                  onChange={handleImageUpload}
                />
                {formState.images && formState.images.length > 0 && (
                  <p className="text-sm text-gray-500 mt-2">
                    {formState.images.length} additional image
                    {formState.images.length !== 1 ? "s" : ""} will be shown in
                    the event gallery
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>
        <div className="flex justify-end">
          <Button
          className="bg-[#3182CE] hover:bg-blue-600 text-white py-2 px-6 rounded-md flex items-center transition-colors"
            isLoading={isAddingEvent}
            type="submit"
          >
            <SaveIcon className="mr-2" size={16} />
            Save Event
          </Button>
        </div>
      </form>
    </div>
  );
};
