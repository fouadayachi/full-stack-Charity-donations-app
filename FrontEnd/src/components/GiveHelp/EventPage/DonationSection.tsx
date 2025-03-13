/* eslint-disable jsx-a11y/label-has-associated-control */
import useDonationStore from "@/store/useDonationStore";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { NumberInput } from "@heroui/number-input";
import { CheckIcon, CreditCardIcon } from "lucide-react";
import React, { useState } from "react";
export function DonationSection({
  id,
  user,
  eventId,
}: {
  id: string;
  user: any;
  eventId: any;
}) {
  const [amount, setAmount] = useState<number>(0);
  const [name, setName] = useState<string>(
    user ? user.lastName + " " + user.firstName : ""
  );
  const [email, setEmail] = useState<string>(user ? user.email : "");
  const [phone, setPhone] = useState<string>(user ? user.phone : "");
  const [payment, setPayment] = useState<string>("paypal");
  const { isLoading, isSubmitted, addDonation } = useDonationStore();
  const handleAmountSelect = (selectedAmount: number) => {
    setAmount(selectedAmount);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const donationData = {
      userId: user?._id,
      eventId: eventId,
      amount,
      paymentMethod: payment,
      name,
      email,
      phone,
    };

    // Call the addDonation function from the store
    await addDonation(donationData);
  };

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
            Your generosity helps make a difference. You&apos;ll receive a
            confirmation email shortly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="bg-white p-6 rounded-xl shadow-md my-8" id={id}>
      <h2 className="text-2xl font-bold text-blue-900 mb-6">Make a Donation</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            Select Amount
          </label>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-2 mb-3">
            {["10", "25", "50", "100", "250"].map((value) => (
              <button
                key={value}
                className={`py-2 border rounded-md transition-colors ${
                  amount === Number(value)
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
                type="button"
                onClick={() => handleAmountSelect(Number(value))}
              >
                ${value}
              </button>
            ))}
          </div>
          <NumberInput
            isRequired
            className="w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            defaultValue={6}
            formatOptions={{
              style: "currency",
              currency: "USD",
            }}
            label="Amount"
            minValue={5}
            placeholder="Enter custom amount"
            size="md"
            value={amount}
            variant="bordered"
            onValueChange={setAmount}
          />
        </div>
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-800 mb-3">
            Payment Methods
          </h3>
          <div className="flex flex-wrap gap-3 mb-4">
            <Button
              isDisabled
              className="p-3 rounded-md bg-white "
              variant="bordered"
            >
              <CreditCardIcon className="text-gray-700" size={24} />
            </Button>
            <Button
              className="p-3  bg-white"
              color={payment === "paypal" ? "primary" : "default"}
              variant="bordered"
              onPress={() => setPayment("paypal")}
            >
              <img
                alt="PayPal"
                className="h-6"
                src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
              />
            </Button>
            <Button
              className="p-3  bg-white"
              color={payment === "google" ? "primary" : "default"}
              variant="bordered"
              onPress={() => setPayment("google")}
            >
              <img
                alt="Google Pay"
                className="h-6"
                src="https://upload.wikimedia.org/wikipedia/commons/3/39/Google_Pay_Logo.svg"
              />
            </Button>
            <Button
              className="p-3  bg-white"
              color={payment === "apple" ? "primary" : "default"}
              variant="bordered"
              onPress={() => setPayment("apple")}
            >
              <img
                alt="Apple Pay"
                className="h-6"
                src="https://upload.wikimedia.org/wikipedia/commons/b/b0/Apple_Pay_logo.svg"
              />
            </Button>
          </div>
        </div>
        <div className="flex flex-col gap-4 mb-6 pt-2">
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
            label="Phone Number"
            labelPlacement="outside"
            placeholder="Enter your phone number"
            size="lg"
            type="tel"
            value={phone}
            variant="bordered"
            onValueChange={setPhone}
          />
        </div>
        <div className="flex items-center mb-6">
          <div className="p-2 bg-green-100 rounded-full mr-3">
            <svg
              className="text-green-600"
              fill="none"
              height="20"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <p className="text-sm text-gray-600">
            Your payment information is secured by SSL encryption
          </p>
        </div>
        <Button
          className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-md text-lg shadow-md transition-colors"
          isLoading={isLoading}
          type="submit"
        >
          Donate Now
        </Button>
      </form>
    </section>
  );
}
