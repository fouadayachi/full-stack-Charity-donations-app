import { Select, SelectItem } from "@heroui/select";
import { Checkbox } from "@heroui/checkbox";

const INCOME_LEVELS = [
  "Below Poverty Line",
  "Low Income",
  "Middle Income",
  "Prefer not to say",
];
const REFERRAL_SOURCES = [
  "Friend/Family",
  "Social Media",
  "Search Engine",
  "Community Organization",
  "Other",
];

interface AdditionalInfoProps {
  formData: {
    incomeLevel: string;
    referralSource: string;
    consent: boolean;
  };
  updateFormData: (data: Partial<AdditionalInfoProps["formData"]>) => void;
  errors: {
    incomeLevel?: string;
    referralSource?: string;
    consent?: string;
  };
}

function AdditionalInfo({
  formData,
  updateFormData,
  errors,
}: AdditionalInfoProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">
        Additional Information
      </h2>
      <p className="text-gray-600">
        This information helps us better understand your situation and connect
        you with the right resources.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Select
          isInvalid={!!errors.incomeLevel}
          isRequired={false}
          label="Income Level"
          labelPlacement="outside"
          placeholder="Select a level"
          selectedKeys={[formData.incomeLevel]}
          variant="bordered"
          onChange={(e) =>
            updateFormData({
              incomeLevel: e.target.value,
            })
          }
        >
          {INCOME_LEVELS.map((level) => (
            <SelectItem key={level}>{level}</SelectItem>
          ))}
        </Select>
        <Select
          isInvalid={!!errors.referralSource}
          isRequired={false}
          label="How Did You Hear About Us?"
          labelPlacement="outside"
          placeholder="Select an option"
          selectedKeys={[formData.referralSource]}
          variant="bordered"
          onChange={(e) =>
            updateFormData({
              referralSource: e.target.value,
            })
          }
        >
          {REFERRAL_SOURCES.map((source) => (
            <SelectItem key={source}>{source}</SelectItem>
          ))}
        </Select>
      </div>
      <div className="mt-6">
        <Checkbox
          isSelected={formData.consent}
          onChange={(e) =>
            updateFormData({
              consent: e.target.checked,
            })
          }
        >
          <span className="text-gray-600 text-sm">
            I consent to being contacted about my request and understand that my
            information will be kept confidential and used only for the purpose
            of processing my assistance request.
          </span>
        </Checkbox>
      </div>
    </div>
  );
}

export default AdditionalInfo;
