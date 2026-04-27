/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from "react";
import useItemDonationStore from "@/store/useItemDonationStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckIcon, Loader2 } from "lucide-react";

interface Item {
  name: string;
  quantityNeeded: number;
  quantityDonated: number;
}

export function DonateItemsSection({
  items,
  id,
  user,
  eventId,
}: {
  items: Item[];
  id: string;
  user: any;
  eventId: any;
}) {
  const [donations, setDonations] = useState<{ [key: string]: number }>(
    items.reduce((acc, item) => ({ ...acc, [item.name]: 0 }), {})
  );
  const [name, setName] = useState<string>(
    user ? `${user.lastName} ${user.firstName}` : ""
  );
  const [email, setEmail] = useState<string>(user ? user.email : "");
  const [phone, setPhone] = useState<string>(user ? user.phone : "");
  const [address, setAddress] = useState<string>(user ? user.address : "");
  const { isLoading, isSubmitted, addItemDonation } = useItemDonationStore();

  const handleDonationChange = (itemName: string, value: string) => {
    const numValue = parseInt(value) || 0;

    setDonations({
      ...donations,
      [itemName]: numValue < 0 ? 0 : numValue,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const itemsToDonate = [];

    for (let donation in donations) {
      if (donations[donation] > 0) {
        itemsToDonate.push({
          name: donation,
          quantityDonated: donations[donation],
        });
      }
    }

    const itemDonateData = {
      userId: user?._id,
      eventId: eventId,
      items: itemsToDonate,
      name,
      email,
      phone,
      address,
    };

    await addItemDonation(itemDonateData);
  };

  const hasDonations = Object.values(donations).some((value) => value > 0);

  if (isSubmitted) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-md my-8 border border-gray-100">
        <div className="text-center py-8">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckIcon className="text-green-600" size={32} />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            Thank You for Your Donation!
          </h3>
          <p className="text-gray-600">
            We&apos;ll contact you soon with drop-off details for your donated
            items.
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="bg-white p-6 rounded-xl shadow-md my-8 border border-gray-100" id={id}>
      <h2 className="text-2xl font-bold text-blue-900 mb-6">Donate Items</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-800 mb-3">
            Select Items to Donate
          </h3>
          <div className="space-y-4">
            {items.map((item, index) => {
              const remaining = item.quantityNeeded - item.quantityDonated;

              return (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100">
                  <div>
                    <p className="font-semibold text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      {remaining} more needed
                    </p>
                  </div>
                  <div className="w-24">
                    <Input
                      className="text-center focus:ring-blue-500"
                      max={remaining}
                      min={0}
                      type="number"
                      value={donations[item.name]}
                      onChange={(e) =>
                        handleDonationChange(item.name, e.target.value)
                      }
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-5 mb-6 pt-2">
          <div className="space-y-2">
            <Label htmlFor="fullname">Full Name *</Label>
            <Input
              required
              id="fullname"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              required
              id="email"
              placeholder="Enter your email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              required
              id="phone"
              placeholder="Enter your phone number"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address *</Label>
            <Input
              required
              id="address"
              placeholder="Enter your address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
        </div>

        <Button
          className={`w-full py-6 font-bold text-lg shadow-sm transition-all ${
            hasDonations
              ? "bg-[#3182CE] hover:bg-blue-700 text-white"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
          disabled={!hasDonations || isLoading}
          type="submit"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Processing...
            </>
          ) : (
            "Donate Items"
          )}
        </Button>
        
        {!hasDonations && (
          <p className="text-xs text-gray-400 mt-3 text-center italic">
            Please select at least one item quantity to continue
          </p>
        )}
      </form>
    </section>
  );
}