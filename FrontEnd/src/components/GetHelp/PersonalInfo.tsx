import { Input } from "@heroui/input";


interface FormData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
}

interface PersonalInfoProps {
  formData: FormData;
  errors : any;
  updateFormData: (data: Partial<FormData>) => void;
}

function PersonalInfo({ formData, updateFormData,errors }: PersonalInfoProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Personal Information</h2>
      <p className="text-gray-600">
        Please provide your contact information so we can reach you about your
        request.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          isRequired
          errorMessage={errors.fullName}
          isInvalid={errors.fullName ? true : false}
          label="Full Name"
          labelPlacement="outside"
          placeholder=" "
          type="text"
          value={formData.fullName}
          variant="bordered"
          onChange={(e: any) =>
            updateFormData({
              fullName: e.target.value,
            })
          }
        />
        <Input
          isRequired
          errorMessage={errors.email}
          isInvalid={errors.email ? true : false}
          label="Email"
          labelPlacement="outside"
          placeholder=" "
          type="email"
          value={formData.email}
          variant="bordered"
          onChange={(e: any) =>
            updateFormData({
              email: e.target.value,
            })
          }
        />
        <Input
          isRequired
          errorMessage={errors.phone}
          isInvalid={errors.phone ? true : false}
          label="Phone Number"
          labelPlacement="outside"
          placeholder=" "
          type="tel"
          value={formData.phone}
          variant="bordered"
          onChange={(e: any) =>
            updateFormData({
              phone: e.target.value,
            })
          }
        />
        <Input
          isRequired
          errorMessage={errors.address}
          isInvalid={errors.address ? true : false}
          label="Address"
          labelPlacement="outside"
          placeholder=" "
          type="text"
          value={formData.address}
          variant="bordered"
          onChange={(e: any) =>
            updateFormData({
              address: e.target.value,
            })
          }
        />
      </div>
    </div>
  );
}

export default PersonalInfo;
