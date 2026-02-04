import { Check } from "lucide-react";

interface FormProgressProps {
    steps: string[];
    currentStep: number;
}

const FormProgress: React.FC<FormProgressProps> = ({ steps, currentStep }) => {
    return (
        <div >
            <div className="relative flex justify-between border-b-1 pb-2">
                {steps.map((step, index) => (
                    <div key={index} className="flex flex-col items-center">
                        <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center relative z-10 
                                ${index < currentStep ? "bg-blue-600 text-white" : index === currentStep ? "bg-blue-600 text-white" : "bg-white border-2 border-gray-300 text-gray-400"}`}
                        >
                            {index < currentStep ? (
                                <Check className="w-5 h-5" />
                            ) : (
                                <span>{index + 1}</span>
                            )}
                        </div>
                        <span
                            className={`mt-2 text-sm ${index <= currentStep ? "text-blue-600 font-medium" : "text-gray-500"} hidden sm:block`}
                        >
                            {step}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default FormProgress;