/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from "react";
import useDonationStore from "@/store/useDonationStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckIcon, CreditCardIcon } from "lucide-react";

export function DonationSection({
  id,
  user,
  eventId,
}: {
  id: string;
  user: any;
  eventId: any;
}) {
  const [amount, setAmount] = useState<number>(10);
  const [name, setName] = useState<string>(
    user ? `${user.lastName} ${user.firstName}` : ""
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
    <section className="bg-white p-6 rounded-xl shadow-md my-8 border border-gray-100" id={id}>
      <h2 className="text-2xl font-bold text-blue-900 mb-6">Make a Donation</h2>
      <form onSubmit={handleSubmit}>
        
        {/* Amount Selection */}
        <div className="mb-6">
          <Label className="block text-gray-700 font-medium mb-2">
            Select Amount
          </Label>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-2 mb-3">
            {["10", "25", "50", "100", "250"].map((value) => (
              <button
                key={value}
                className={`py-2 border rounded-md text-sm font-medium transition-all ${
                  amount === Number(value)
                    ? "bg-[#3182CE] text-white border-[#3182CE] shadow-sm"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
                type="button"
                onClick={() => handleAmountSelect(Number(value))}
              >
                ${value}
              </button>
            ))}
          </div>
          
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <Input
              required
              className="pl-7 focus:ring-2 focus:ring-blue-500"
              min={10}
              placeholder="0.00"
              type="number"
              value={amount}
              onChange={(e) => {
                const val = parseFloat(e.target.value);

                setAmount(val > 0 ? val : 0);
              }}
            />
          </div>
          <p className="text-[10px] text-gray-400 mt-1 italic">Minimum donation is $10.00</p>
        </div>

        {/* Payment Methods */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-800 mb-3">
            Payment Methods
          </h3>
          <div className="flex flex-wrap gap-3 mb-4">
            <Button
              disabled
              className="p-3 h-12 w-16 bg-gray-50 border-dashed"
              variant="outline"
            >
              <CreditCardIcon className="text-gray-400" size={24} />
            </Button>
            
            <Button
              className={`p-3 h-12 w-24 bg-white hover:bg-gray-50 ${payment === "paypal" ? "border-blue-600 ring-2 ring-blue-100" : ""}`}
              type="button"
              variant={payment === "paypal" ? "default" : "outline"}
              onClick={() => setPayment("paypal")}
            >
              <img
                alt="PayPal"
                className="h-5"
                src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
              />
            </Button>

            <Button
              className={`p-3 h-12 w-24 bg-white hover:bg-gray-50 ${payment === "cash" ? "border-blue-600 ring-2 ring-blue-100" : ""}`}
              type="button"
              variant={payment === "cash" ? "default" : "outline"}
              onClick={() => setPayment("cash")}
            >
              <img
                alt="Cash"
                className="h-6 scale-125"
                src="/images/cash.png"
              />
            </Button>
          </div>
        </div>

        {/* Personal Info Fields */}
        <div className="flex flex-col gap-4 mb-6 pt-2">
          <div className="space-y-2">
            <Label>Full Name *</Label>
            <Input
              required
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Email Address *</Label>
            <Input
              required
              placeholder="Enter your email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Phone Number *</Label>
            <Input
              required
              placeholder="Enter your phone number"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
        </div>

        {/* Security Info */}
        <div className="flex items-center mb-6">
          <div className="p-2 bg-green-100 rounded-full mr-3">
            <svg
              className="text-green-600"
              fill="none"
              height="18"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="18"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <p className="text-sm text-gray-500">
            Your payment information is secured by SSL encryption
          </p>
        </div>

        <Button
          className="w-full py-6 bg-[#3182CE] hover:bg-blue-700 text-white font-bold rounded-md text-lg transition-all"
          disabled={isLoading}
          type="submit"
        >
          {isLoading ? "Processing..." : "Donate Now"}
        </Button>
      </form>
    </section>
  );
}