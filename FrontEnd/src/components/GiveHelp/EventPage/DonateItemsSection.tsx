import useItemDonationStore from "@/store/useItemDonationStore";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { NumberInput } from "@heroui/number-input";
import { CheckIcon } from "lucide-react";
import React, { useState } from "react";

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

  const handleDonationChange = (itemName: string, value: number) => {
    setDonations({
      ...donations,
      [itemName]: value < 0 ? 0 : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const items = [];

    for (let donation in donations) {
      if (donations[donation] > 0) {
        items.push({
          name: donation,
          quantityDonated: donations[donation],
        });
      }
    }

    const itemDonateData = {
      userId: user?._id,
      eventId: eventId,
      items: items,
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
      <div className="bg-white p-6 rounded-xl shadow-md my-8">
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
    <section className="bg-white p-6 rounded-xl shadow-md my-8" id={id}>
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
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-600">
                      {remaining} more needed
                    </p>
                  </div>
                  <div className="w-24">
                    <NumberInput
                      className="w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                      maxValue={remaining}
                      size="sm"
                      value={donations[item.name]}
                      variant="bordered"
                      onValueChange={(value) =>
                        handleDonationChange(item.name, value)
                      }
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
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
        {/* <div className="bg-blue-50 p-4 rounded-md mb-6">
          <h4 className="font-medium text-blue-900 mb-2">
            Drop-Off Instructions
          </h4>
          <p className="text-gray-700">
            Items can be dropped off at our main location (123 Main Street,
            Anytown) Monday through Friday between 9 AM and 5 PM. Please bring
            this confirmation with you when you drop off your items.
          </p>
        </div> */}
        <Button
          className={`w-full px-6 py-3 font-bold rounded-md text-lg shadow-md transition-colors ${
            hasDonations
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          disabled={!hasDonations}
          isLoading={isLoading}
          type="submit"
        >
          Donate Items
        </Button>
        {!hasDonations && (
          <p className="text-sm text-gray-500 mt-2 text-center">
            Please select at least one item to donate
          </p>
        )}
      </form>
    </section>
  );
}
