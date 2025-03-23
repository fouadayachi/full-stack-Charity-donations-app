/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useState } from "react";
import { Button } from "@heroui/button";
import { parseAbsoluteToLocal } from "@internationalized/date";

import {
  X,
  Calendar as CalendarIcon,
  MapPin as MapPinIcon,
  Tag as TagIcon,
  DollarSign as DollarSignIcon,
  Users as UsersIcon,
  Package as PackageIcon,
  Plus as PlusIcon,
  Trash as TrashIcon,
  Clock,
} from "lucide-react";
import { DatePicker } from "@heroui/date-picker";
import { NumberInput } from "@heroui/number-input";

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

export const UpdateEventModal: React.FC<UpdateEventModalProps> = ({
  isOpen,
  onClose,
  event,
  onUpdate,
}) => {
  const [formData, setFormData] = useState<Event | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [startDate, setStartDate] = useState(
    parseAbsoluteToLocal("2025-03-14T20:50:33.777+00:00")
  );
  const [endDate, setEndDate] = useState(
    parseAbsoluteToLocal("2025-03-14T20:50:33.777+00:00")
  );
  const [itemInput, setItemInput] = useState<{
    name: string;
    quantityNeeded: number;
  }>({ name: "", quantityNeeded: 0 });

  useEffect(() => {
    if (event) {
      console.log(event.currentAmount);
      setFormData({
        ...event,
      });
      setStartDate(parseAbsoluteToLocal(event.startDate));
      setEndDate(parseAbsoluteToLocal(event.endDate));
    }
  }, [event]);

  if (!isOpen || !formData) return null;

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const handleAddItem = () => {
    if (!formData.targetItems) {
      formData.targetItems = [];
    }
    setFormData({
      ...formData,
      targetItems: [
        ...formData.targetItems,
        {
          name: itemInput.name,
          quantityNeeded: itemInput.quantityNeeded,
          quantityDonated: 0,
        },
      ],
    });
    setItemInput({ name: "", quantityNeeded: 0 });
  };

  const handleRemoveItem = (index: number) => {
    if (formData.targetItems && formData.targetItems.length > 1) {
      const updatedItems = [...formData.targetItems];

      updatedItems.splice(index, 1);
      setFormData({
        ...formData,
        targetItems: updatedItems,
      });
    }
  };

  const handleItemChange = (
    index: number,
    field: "name" | "quantityNeeded",
    value: string | number
  ) => {
    if (formData.targetItems) {
      const updatedItems = [...formData.targetItems];

      if (field === "name") {
        updatedItems[index].name = value as string;
      } else {
        updatedItems[index].quantityNeeded = value as number;
      }
      setFormData({
        ...formData,
        targetItems: updatedItems,
      });
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
    // Validate dates
    if (startDate && endDate) {
      if (endDate < startDate) {
        newErrors.endDate = "End date must be after start date";
      }
    }

    if (formData.type === "donation" && !formData.targetAmount) {
      newErrors.targetAmount = "Target amount is required";
    }

    if (formData.type === "volunteer" && !formData.targetVolunteers) {
      newErrors.targetVolunteers = "Number of volunteers is required";
    }

    if (
      formData.type === "items" &&
      formData.targetItems?.some(
        (item) => !item.name || item.quantityNeeded <= 0
      )
    ) {
      newErrors.targetItems = "All items must have a name and quantity needed";
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
      formData.startDate = changeDateFormat(startDate);
      formData.endDate = changeDateFormat(endDate);
      onUpdate(formData);
      onClose();
    }
  };

  const getTypeColor = (type: "donation" | "volunteer" | "items") => {
    switch (type) {
      case "donation":
        return "#3182CE";
      case "volunteer":
        return "#48BB78";
      case "items":
        return "#805AD5";
      default:
        return "#718096";
    }
  };

  const typeColor = getTypeColor(formData.type);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-[#1A365D] flex items-center">
            Update Event
            <span
              className="ml-2 px-2 py-1 text-xs font-semibold rounded-full text-white"
              style={{ backgroundColor: typeColor }}
            >
              {formData.type}
            </span>
          </h2>
          <button
            className="text-gray-400 hover:text-gray-600 transition-colors"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-130px)]">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <span className="flex items-center">
                      <TagIcon className="mr-1 text-[#3182CE]" size={16} />
                      Event Title <span className="text-red-500">*</span>
                    </span>
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
                    Event Status
                  </label>
                  <div className="flex gap-2">
                    {["active", "completed", "canceled"].map((state) => (
                      <Button
                        key={state}
                        className={`px-4 py-2 rounded-lg ${
                          formData.status === state
                            ? "bg-blue-500 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                        variant="bordered"
                        onPress={() =>
                          setFormData({
                            ...formData,
                            status: state as
                              | "active"
                              | "completed"
                              | "canceled",
                          })
                        }
                      >
                        {state.charAt(0).toUpperCase() + state.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>
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
                  Long Description
                </label>
                <textarea
                  className="block w-full border border-gray-300 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-[#3182CE] focus:border-[#3182CE]"
                  name="longDescription"
                  rows={3}
                  value={formData.longDescription}
                  onChange={handleInputChange}
                />
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              {formData.type === "donation" && (
                <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                  <h3 className="text-md font-medium text-gray-800 mb-3 flex items-center">
                    <DollarSignIcon className="mr-2 text-[#3182CE]" size={18} />
                    Donation Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        value={formData.targetAmount}
                        variant="bordered"
                        onValueChange={(value: number) => {
                          setFormData({ ...formData, targetAmount: value });
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
                        Current Amount
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
                        value={formData.currentAmount}
                        variant="bordered"
                        onValueChange={(value) => {
                          setFormData({ ...formData, currentAmount: value });
                          setErrors({
                            ...errors,
                            currentAmount: "",
                          });
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
              {formData.type === "volunteer" && (
                <div className="bg-green-50 p-4 rounded-md border border-green-100">
                  <h3 className="text-md font-medium text-gray-800 mb-3 flex items-center">
                    <UsersIcon className="mr-2 text-[#48BB78]" size={18} />
                    Volunteer Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        value={formData.targetVolunteers}
                        variant="bordered"
                        onValueChange={(value) => {
                          setFormData({
                            ...formData,
                            targetVolunteers: value > 1 ? value : 1,
                          });
                          setErrors({
                            ...errors,
                            volunteersNeeded: "",
                          });
                        }}
                      />
                      {errors.targetVolunteers && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.targetVolunteers}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Current Volunteers
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
                        value={formData.currentVolunteers}
                        variant="bordered"
                        onValueChange={(value) => {
                          setFormData({
                            ...formData,
                            currentVolunteers: value > 0 ? value : 0,
                          });
                          setErrors({
                            ...errors,
                            currentVolunteers: "",
                          });
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <span className="flex items-center">
                          <Clock className="mr-1 text-[#48BB78]" size={16} />
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
                        value={formData.volunteerHours}
                        variant="bordered"
                        onValueChange={(value) => {
                          setFormData({
                            ...formData,
                            volunteerHours: value > 0 ? value : 0,
                          });
                          setErrors({
                            ...errors,
                            volunteerHours: "",
                          });
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
              {formData.type === "items" && (
                <div className="bg-purple-50 p-4 rounded-md border border-purple-100">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-md font-medium text-gray-800 flex items-center">
                      <PackageIcon className="mr-2 text-[#805AD5]" size={18} />
                      Items Details
                    </h3>
                    <button
                      className="flex items-center text-[#805AD5] hover:text-purple-700 transition-colors"
                      type="button"
                      onClick={handleAddItem}
                    >
                      <PlusIcon className="mr-1" size={16} />
                      Add Item
                    </button>
                  </div>
                  {errors.targetItems && (
                    <p className="mb-2 text-sm text-red-500">
                      {errors.targetItems}
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
                      {formData.targetItems?.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2">
                            <input
                              className="block w-full border border-gray-300 rounded-md py-1 px-2 shadow-sm focus:outline-none focus:ring-[#3182CE] focus:border-[#3182CE] text-sm"
                              placeholder="Item name"
                              type="text"
                              value={item.name}
                              onChange={(e) =>
                                handleItemChange(index, "name", e.target.value)
                              }
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input
                              className="block w-full border border-gray-300 rounded-md py-1 px-2 shadow-sm focus:outline-none focus:ring-[#3182CE] focus:border-[#3182CE] text-sm"
                              min="1"
                              placeholder="Quantity"
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
                              disabled={formData.targetItems?.length === 1}
                              type="button"
                              onClick={() => handleRemoveItem(index)}
                            >
                              <TrashIcon size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
              <h3 className="text-md font-medium text-gray-800 mb-3">
                Reference Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Event ID
                  </label>
                  <input
                    readOnly
                    className="block w-full bg-gray-100 border border-gray-300 rounded-md py-2 px-3 shadow-sm text-gray-500"
                    type="text"
                    value={formData._id || ""}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Event Type
                  </label>
                  <input
                    readOnly
                    className="block w-full bg-gray-100 border border-gray-300 rounded-md py-2 px-3 shadow-sm text-gray-500"
                    type="text"
                    value={formData.type}
                  />
                </div>
              </div>
            </div>
          </form>
        </div>
        <div className="flex justify-end items-center p-4 border-t border-gray-200 bg-gray-50">
          <button
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 mr-3"
            type="button"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#3182CE] hover:bg-blue-600"
            type="button"
            onClick={handleSubmit}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};
