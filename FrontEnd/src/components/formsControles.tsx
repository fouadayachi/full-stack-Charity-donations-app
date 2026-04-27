import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
// Note: Shadcn Select is much more verbose than HeroUI, 
// using native select for simplicity in this dynamic mapping
import { Eye, EyeClosed } from "lucide-react";
import { useState } from "react";

interface FormControl {
  required: boolean | undefined;
  componentType: string;
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  options?: { key: string; label: string }[];
}

interface FormControlesProps {
  formControles: FormControl[];
  formData: { [key: string]: any };
  setFormData: (data: { [key: string]: any }) => void;
}

function FormControles({ formControles = [], formData, setFormData }: FormControlesProps) {
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  const renderComponentByType = (item: FormControl) => {
    let element = null;

    switch (item.componentType) {
      case "input":
        element = (
          <div className="space-y-2">
            <Label htmlFor={item.name}>
              {item.label} {item.required && <span className="text-red-500">*</span>}
            </Label>
            <div className="relative">
              <Input
                id={item.name}
                placeholder={item.placeholder}
                required={item.required}
                type={item.type === "password" ? (isVisible ? "text" : "password") : item.type}
                value={formData[item.name]}
                onChange={(e) => {
                  setFormData({ ...formData, [item.name]: e.target.value });
                }}
              />
              {item.type === "password" && (
                <button 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" 
                  type="button"
                  onClick={toggleVisibility}
                >
                  {isVisible ? <Eye size={18} /> : <EyeClosed size={18} />}
                </button>
              )}
            </div>
          </div>
        );
        break;

      case "select":
        element = (
          <div className="space-y-2">
            <Label htmlFor={item.name}>{item.label}</Label>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              id={item.name}
              value={formData[item.name]}
              onChange={(e) => {
                setFormData({ ...formData, [item.name]: e.target.value });
              }}
            >
              <option disabled value="">{item.placeholder}</option>
              {item.options?.map((option) => (
                <option key={option.key} value={option.key}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        );
        break;

      case "textarea":
        element = (
          <div className="space-y-2">
            <Label htmlFor={item.name}>{item.label}</Label>
            <Textarea
              id={item.name}
              placeholder={item.placeholder}
              value={formData[item.name]}
              onChange={(e) => {
                setFormData({ ...formData, [item.name]: e.target.value });
              }}
            />
          </div>
        );
        break;

      default:
        break;
    }

    return element;
  };

  return (
    <div className="flex flex-col gap-4">
      {formControles.map((item, index) => (
        <div key={index}>{renderComponentByType(item)}</div>
      ))}
    </div>
  );
}

export default FormControles;