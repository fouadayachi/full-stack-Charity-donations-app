import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
}

interface PersonalInfoProps {
  formData: FormData;
  errors: any;
  updateFormData: (data: Partial<FormData>) => void;
}

function PersonalInfo({ formData, updateFormData, errors }: PersonalInfoProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Personal Information</h2>
      <p className="text-gray-600">
        Please provide your contact information so we can reach you about your
        request.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Name Field */}
        <div className="space-y-2">
          <Label htmlFor="fullName">
            Full Name <span className="text-red-500">*</span>
          </Label>
          <Input
            required
            className={errors.fullName ? "border-red-500" : ""}
            id="fullName"
            placeholder="Your full name"
            type="text"
            value={formData.fullName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              updateFormData({
                fullName: e.target.value,
              })
            }
          />
          {errors.fullName && (
            <p className="text-sm text-red-500">{errors.fullName}</p>
          )}
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email">
            Email <span className="text-red-500">*</span>
          </Label>
          <Input
            required
            className={errors.email ? "border-red-500" : ""}
            id="email"
            placeholder="example@email.com"
            type="email"
            value={formData.email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              updateFormData({
                email: e.target.value,
              })
            }
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email}</p>
          )}
        </div>

        {/* Phone Number Field */}
        <div className="space-y-2">
          <Label htmlFor="phone">
            Phone Number <span className="text-red-500">*</span>
          </Label>
          <Input
            required
            className={errors.phone ? "border-red-500" : ""}
            id="phone"
            placeholder="Phone number"
            type="tel"
            value={formData.phone}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              updateFormData({
                phone: e.target.value,
              })
            }
          />
          {errors.phone && (
            <p className="text-sm text-red-500">{errors.phone}</p>
          )}
        </div>

        {/* Address Field */}
        <div className="space-y-2">
          <Label htmlFor="address">
            Address <span className="text-red-500">*</span>
          </Label>
          <Input
            required
            className={errors.address ? "border-red-500" : ""}
            id="address"
            placeholder="Your address"
            type="text"
            value={formData.address}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              updateFormData({
                address: e.target.value,
              })
            }
          />
          {errors.address && (
            <p className="text-sm text-red-500">{errors.address}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default PersonalInfo;