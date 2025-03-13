/* eslint-disable jsx-a11y/label-has-associated-control */
import { Textarea } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import ImageUpload from "./ImageUpload";

const HELP_TYPES = [
  "Food Assistance",
  "Clothing",
  "Medical Support",
  "Financial Aid",
  "Other",
];

const URGENCY_LEVELS = [
  {
    value: "low",
    label: "Low - Within the next month",
  },
  {
    value: "medium",
    label: "Medium - Within the next week",
  },
  {
    value: "high",
    label: "High - Immediate assistance needed",
  },
];

interface HelpDetailsProps {
  formData: {
    helpType: string;
    description: string;
    urgency: string;
    images: any[];
  };
  updateFormData: (data: Partial<HelpDetailsProps["formData"]>) => void;
  errors: {
    helpType?: string;
    description?: string;
    urgency?: string;
    images?: string;
  };
}

function HelpDetails({ formData, updateFormData, errors }: HelpDetailsProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Help Details</h2>
      <p className="text-gray-600">
        Tell us about the type of assistance you need and your current
        situation.
      </p>
      <div className="space-y-6 pt-2">
        <Select
          isRequired
          isInvalid={!!errors.helpType}
          label="Type of Help Needed"
          labelPlacement="outside"
          placeholder="Select a type"
          selectedKeys={[formData.helpType]}
          variant="bordered"
          onChange={(e) =>
            updateFormData({
              helpType: e.target.value,
            })
          }
        >
          {HELP_TYPES.map((helpType) => (
            <SelectItem key={helpType}>{helpType}</SelectItem>
          ))}
        </Select>
        <Textarea
          isRequired
          isInvalid={!!errors.description}
          label="Description of Situation"
          labelPlacement="outside"
          placeholder="Please provide details about your current situation and how we can help"
          value={formData.description}
          variant="bordered"
          onChange={(e) =>
            updateFormData({
              description: e.target.value,
            })
          }
        />
        <Select
          isRequired
          className="py-6"
          isInvalid={!!errors.urgency}
          label="Urgency Level"
          labelPlacement="outside"
          placeholder="Select urgency level"
          selectedKeys={[formData.urgency]}
          variant="bordered"
          onChange={(e) =>
            updateFormData({
              urgency: e.target.value,
            })
          }
        >
          {URGENCY_LEVELS.map((level) => (
            <SelectItem key={level.value}>{level.value}</SelectItem>
          ))}
        </Select>
        <div className="space-y-2">
          <label className="block text-gray-700 font-medium">
            {" "}
            Supporting Documents
          </label>

          <p className="text-sm text-gray-500">
            Upload any relevant documents or images that help explain your
            situation
          </p>
          <ImageUpload
            error={errors.images}
            images={formData.images}
            onChange={(images: any) =>
              updateFormData({
                images,
              })
            }
          />
        </div>
      </div>
    </div>
  );
}

export default HelpDetails;
