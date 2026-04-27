import { Button } from "@/components/ui/button";
import FormControles from "./formsControles";

interface FormProps {
    handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    buttonText?: string;
    formControles?: any[];
    formData: any;
    setFormData: (data: any) => void;
    state: boolean;
}

const Forms: React.FC<FormProps> = ({ handleSubmit, buttonText, formControles = [], formData, setFormData, state }) => {
    return (
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <FormControles formControles={formControles} formData={formData} setFormData={setFormData} />
            <Button 
                className="w-full bg-[#3182CE] hover:bg-blue-600" 
                disabled={state} 
                type="submit"
            >
                {state ? "Please wait..." : (buttonText || "Submit")}
            </Button>
        </form>
    );
};

export default Forms;