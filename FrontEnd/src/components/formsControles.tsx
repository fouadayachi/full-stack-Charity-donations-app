import { Input, Textarea } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";

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
  const renderComponentByType = (item: FormControl) => {
    let element = null;

    switch (item.componentType) {
      case "input":
        element = (
          <Input
            key={item.name}
            isRequired={item.required}
            label={item.label}
            labelPlacement="outside"
            placeholder={item.placeholder}
            type={item.type}
            value={formData[item.name]}
            onChange={(e) => {
              setFormData({ ...formData, [item.name]: e.target.value });
            }}
          />
        );
        break;
      case "select":
        element = (
          <Select
            key={item.name}
            label={item.label}
            labelPlacement="outside"
            placeholder={item.placeholder}
            selectedKeys={[formData[item.name]]}
            onChange={(e) => {
              setFormData({ ...formData, [item.name]: e.target.value });
            }}
          >
            {item.options && item.options.length > 0
              ? item.options.map((option) => (
                  <SelectItem key={option.key}>{option.label}</SelectItem>
                ))
              : null}
          </Select>
        );
        break;
      case "textarea":
        element = (
          <Textarea
            key={item.name}
            label={item.label}
            labelPlacement="outside"
            placeholder={item.placeholder}
            value={formData[item.name]}
            onChange={(e) => {
              setFormData({ ...formData, [item.name]: e.target.value });
            }}
          />
        );
        break;
      default:
        break;
    }

    return element;
  };

  return (
    <div className="flex flex-col gap-3">
      {formControles.map((item, index) => (
        <div key={index}>{renderComponentByType(item)}</div>
      ))}
    </div>
  );
}

export default FormControles;
