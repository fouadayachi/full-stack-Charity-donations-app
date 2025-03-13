
import { Check } from "lucide-react";
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

export function ReviewSubmit({ formData }: { formData: FormData }) {
  const sections = [
    {
      title: "Personal Information",
      fields: [
        {
          label: "Full Name",
          value: formData.fullName,
        },
        {
          label: "Email",
          value: formData.email,
        },
        {
          label: "Phone",
          value: formData.phone || "Not provided",
        },
        {
          label: "Address",
          value: formData.address,
        },
      ],
    },
    {
      title: "Help Details",
      fields: [
        {
          label: "Type of Help",
          value: formData.helpType,
        },
        {
          label: "Urgency",
          value: formData.urgency,
        },
        {
          label: "Description",
          value: formData.description,
        },
      ],
    },
    {
      title: "Additional Information",
      fields: [
        {
          label: "Income Level",
          value: formData.incomeLevel || "Not provided",
        },
        {
          label: "Referral Source",
          value: formData.referralSource || "Not provided",
        },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Review Your Request</h2>
      <p className="text-gray-600">
        Please review your information before submitting. You can go back to
        make changes if needed.
      </p>
      <div className="space-y-8">
        {sections.map((section, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {section.title}
            </h3>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {section.fields.map((field, fieldIndex) => (
                <div key={fieldIndex}>
                  <dt className="text-sm font-medium text-gray-500">
                    {field.label}
                  </dt>
                  <dd className="mt-1 text-gray-900">{field.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
        {formData.images.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Uploaded Images ({formData.images.length})
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {formData.images.map((image : any, index : any) => (
                <img
                  key={index}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg"
                  src={URL.createObjectURL(image)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start space-x-3">
        <Check className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-blue-700">
          By submitting this request, you confirm that all provided information
          is accurate and consent to being contacted about your request.
        </p>
      </div>
    </div>
  );
}

export default ReviewSubmit;