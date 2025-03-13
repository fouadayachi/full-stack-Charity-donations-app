import useAuthStore from "@/store/useAuthStore";
import useRequestsStore from "@/store/useRequestsStore";
import { Button } from "@heroui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdditionalInfo from "./AdditionalInfo";
import FormProgress from "./FormProgress";
import HelpDetails from "./HelpDetails";
import PersonalInfo from "./PersonalInfo";
import ReviewSubmit from "./ReviewSubmit";
import { FloatingBanner } from "./FloatingBanner";

const STEPS = [
  "Personal Information",
  "Help Details",
  "Additional Information",
  "Review & Submit",
];

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  helpType: string;
  description: string;
  urgency: string;
  images: string[];
  incomeLevel: string;
  referralSource: string;
  consent: boolean;
}

export function RequestHelpForm() {
  const { authenticated,user } = useAuthStore();
  const { addRequest, isLoading } = useRequestsStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    fullName: (user ? `${user.lastName} ${user.firstName}` : ""),
    email: (user ? user.email : ""),
    phone: (user ? user.phone : ""),
    address: (user ? user.address : ""),
    helpType: "",
    description: "",
    urgency: "",
    images: [],
    incomeLevel: "",
    referralSource: "",
    consent: false,
  });

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateStep = () => {
    let stepErrors: { [key: string]: string } = {};

    if (currentStep === 0) {
      if (!formData.fullName) stepErrors.fullName = "Name is required";
      if (!formData.email.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i))
        stepErrors.email = "Email is not valid";
      if (!formData.email) stepErrors.email = "Email is required";
      if (!formData.address) stepErrors.address = "Address is required";
      if (!formData.phone) stepErrors.phone = "Phone is required";
    } else if (currentStep === 1) {
      if (!formData.helpType)
        stepErrors.helpType = "Please select type of help needed";
      if (!formData.description)
        stepErrors.description = "Please describe your situation";
      if (!formData.urgency) stepErrors.urgency = "Please select urgency level";
    }
    setErrors(stepErrors);

    return Object.keys(stepErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < STEPS.length - 1) return;
    const data = new FormData();

    // Append all form data to FormData
    Object.keys(formData).forEach((key) => {
      if (key === "images") {
        // Append each image file
        formData.images.forEach((image) => {
          data.append("images", image);
        });
      } else {
        data.append(key, formData[key as keyof FormData] as string | Blob);
      }
    });

    try {
      await addRequest(data);
      navigate("/");
    } catch (error) {
      console.error("Error submitting request:", error);
    }
  };

  useEffect(() => {
    if (authenticated) setIsVisible(false);
  }, [authenticated]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
      {isVisible && <FloatingBanner onDismiss={() => setIsVisible(false)} />}
      <FormProgress currentStep={currentStep} steps={STEPS} />
      <form className="mt-8">
        {currentStep === 0 && (
          <PersonalInfo
            errors={errors}
            formData={formData}
            updateFormData={updateFormData}
          />
        )}
        {currentStep === 1 && (
          <HelpDetails
            errors={errors}
            formData={formData}
            updateFormData={updateFormData}
          />
        )}
        {currentStep === 2 && (
          <AdditionalInfo
            errors={errors}
            formData={formData}
            updateFormData={updateFormData}
          />
        )}
        {currentStep === 3 && <ReviewSubmit formData={formData} />}
        <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
          <Button
            className={`flex items-center px-6 py-2 rounded-full border-2 border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors ${
              currentStep === 0 ? "invisible" : ""
            }`}
            type="button"
            onPress={handleBack}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          {currentStep === STEPS.length - 1 ? (
            <Button
              className="flex items-center px-8 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
              isLoading={isLoading}
              type="submit"
              onClick={handleSubmit}
            >
              Submit Request
            </Button>
          ) : (
            <button
              className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
              type="button"
              onClick={handleNext}
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
