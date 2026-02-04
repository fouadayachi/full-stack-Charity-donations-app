import useAuthStore from "@/store/useAuthStore";
import { Button } from "@heroui/button";
import React, { useState } from "react";
import { FormField } from "./FormField";

export function ProfileSection() {
  const { user, updateProfile,isUpdating } = useAuthStore();
  const [formData, setFormData] = useState({
    firstName: user?.firstName,
    lastName: user?.lastName,
    email: user?.email,
    phone: user?.phone || "",
    address: user?.address || "",
  });
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
    // Validation
    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(value)) {
        setErrors({
          ...errors,
          email: "Please enter a valid email address",
        });
      } else {
        setErrors({
          ...errors,
          email: "",
        });
      }
    }
    if (name === "firstName" || name === "lastName") {
      if (!value.trim()) {
        setErrors({
          ...errors,
          [name]: `${name === "firstName" ? "First" : "Last"} name is required`,
        });
      } else {
        setErrors({
          ...errors,
          [name]: "",
        });
      }
    }
  };

  const handleSaveChanges = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.firstName || !formData.lastName || !formData.email) {
      setErrors({
        ...errors,
        firstName: !formData.firstName ? "First name is required" : "",
        lastName: !formData.lastName ? "Last name is required" : "",
        email: !formData.email ? "Email is required" : "",
      });

      return;
    }

    if (!emailRegex.test(formData.email)) {
      setErrors({
        ...errors,
        email: "Please enter a valid email address",
      });

      return;
    }

    updateProfile(formData);
  };

  return (
    <section className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold text-[#1A365D] mb-4">
        Profile Information
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          required
          error={errors.firstName}
          label="First Name"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
        />
        <FormField
          required
          error={errors.lastName}
          label="Last Name"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
        />
        <FormField
          required
          error={errors.email}
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
        />
        <FormField
          label="Phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
        />
        <div className="md:col-span-2">
          <FormField
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="flex justify-end space-x-4 pt-4 ">
        <Button
          className="px-6 py-2 bg-[#3182CE] text-white rounded hover:bg-blue-700 transition-colors"
          isLoading={isUpdating}
          onPress={handleSaveChanges}
        >
          Save Changes
        </Button>
      </div>
    </section>
  );
}
