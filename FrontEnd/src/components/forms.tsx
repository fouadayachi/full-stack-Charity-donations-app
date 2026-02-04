import { Button } from "@heroui/button";
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
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <FormControles formControles={formControles} formData={formData} setFormData={setFormData} />
            <Button color="primary" isLoading={state} type="submit">{buttonText || "Submit"}</Button>
        </form>
    );
};

export default Forms;
