import React, { useState } from "react";
import { CheckIcon } from "lucide-react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import useVolunteerStore from "@/store/useVolunteerStore";

export function VolunteerSection({ id, user,eventId }: { id: string; user: any,eventId: any}) {
  const [name, setName] = useState<string>(
    user ? `${user.lastName} ${user.firstName}` : ""
  );
  const [email, setEmail] = useState<string>(user ? user.email : "");
  const [phone, setPhone] = useState<string>(user ? user.phone : "");
  const [address, setAddress] = useState<string>(user ? user.address : "");
  const { isLoading, isSubmitted, addVolunteer } = useVolunteerStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const volunteerData = {
      userId: user?._id,
      eventId: eventId,
      name,
      email,
      phone,
      address
    };
    
    await addVolunteer(volunteerData)
  };

  if (isSubmitted) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-md my-8">
        <div className="text-center py-8">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckIcon className="text-green-600" size={32} />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            Thank You for Signing Up!
          </h3>
          <p className="text-gray-600">
            We&apos;ll contact you soon with more details about volunteering for
            this event.
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="bg-white p-6 rounded-xl shadow-md my-8" id={id}>
      <h2 className="text-2xl font-bold text-blue-900 mb-6">
        Volunteer Sign Up
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 mb-6">
          <Input
            isRequired
            className="w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            label="Full Name"
            labelPlacement="outside"
            placeholder="Enter your full name"
            size="lg"
            type="text"
            value={name}
            variant="bordered"
            onValueChange={setName}
          />

          <Input
            isRequired
            className="w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            label="Email Address"
            labelPlacement="outside"
            placeholder="Enter your email address"
            size="lg"
            type="email"
            value={email}
            variant="bordered"
            onValueChange={setEmail}
          />

          <Input
            isRequired
            className="w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            label="Phone Number"
            labelPlacement="outside"
            placeholder="Enter your phone number"
            size="lg"
            type="tel"
            value={phone}
            variant="bordered"
            onValueChange={setPhone}
          />

          <Input
            isRequired
            className="w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            label="Address"
            labelPlacement="outside"
            placeholder="Enter your address"
            size="lg"
            type="text"
            value={address}
            variant="bordered"
            onValueChange={setAddress}
          />
        </div>
        <Button
          className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-md text-lg shadow-md transition-colors"
          isLoading={isLoading}
          type="submit"
        >
          Sign Up
        </Button>
      </form>
    </section>
  );
}
