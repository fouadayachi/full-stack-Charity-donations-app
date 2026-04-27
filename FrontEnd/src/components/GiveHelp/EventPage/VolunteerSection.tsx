/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from "react";
import useVolunteerStore from "@/store/useVolunteerStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckIcon, Loader2 } from "lucide-react";

export function VolunteerSection({
  id,
  user,
  eventId,
}: {
  id: string;
  user: any;
  eventId: any;
}) {
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
      address,
    };

    await addVolunteer(volunteerData);
  };

  if (isSubmitted) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-md my-8 border border-gray-100">
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
    <section
      className="bg-white p-6 rounded-xl shadow-md my-8 border border-gray-100"
      id={id}
    >
      <h2 className="text-2xl font-bold text-blue-900 mb-6">
        Volunteer Sign Up
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-5 mb-6">
          <div className="space-y-2">
            <Label htmlFor="volunteer-name">Full Name *</Label>
            <Input
              required
              id="volunteer-name"
              placeholder="Enter your full name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="volunteer-email">Email Address *</Label>
            <Input
              required
              id="volunteer-email"
              placeholder="Enter your email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="volunteer-phone">Phone Number *</Label>
            <Input
              required
              id="volunteer-phone"
              placeholder="Enter your phone number"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="volunteer-address">Address *</Label>
            <Input
              required
              id="volunteer-address"
              placeholder="Enter your address"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
        </div>

        <Button
          className="w-full py-6 bg-[#3182CE] hover:bg-blue-700 text-white font-bold rounded-md text-lg shadow-sm transition-all"
          disabled={isLoading}
          type="submit"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Processing...
            </>
          ) : (
            "Sign Up"
          )}
        </Button>
      </form>
    </section>
  );
}