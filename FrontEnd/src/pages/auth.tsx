import Forms from "@/components/forms";
import { siteConfig } from "@/config/site";
import useAuthStore from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardBody } from "@heroui/card"; 
import { Tab, Tabs } from "@heroui/tabs";
import { ArrowLeft, Mail } from "lucide-react";
import { useState } from "react";


interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  address: string;
}

const Auth = () => {
  const [selected, setSelected] = useState<string>("login");
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });

  const { signUpFormControl, signInFormControl } = siteConfig;
  const { signup, isSigningUp, login, isLoggingIn } = useAuthStore();
  
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [changePasswordEmail, setChangePasswordEmail] = useState("");
  // REMOVED: const [forgotPasswordStep, setForgotPasswordStep] = useState(1);

  const handleTabsChange = (key: any) => {
    setSelected(key as string);
  };

  function handleForgotPasswordClick() {
    setIsForgotPassword(true);
  }

  function handleBackToLogin() {
    setIsForgotPassword(false);
    // REMOVED: setForgotPasswordStep(1);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (selected === "login") {
      await login(formData);
    } else {
      await signup(formData);
    }
  }

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-none">
          <CardBody className="p-8">
            {isForgotPassword ? (
              <div className="flex flex-col gap-6">
                <div className="text-center">
                  <h1 className="text-2xl font-bold text-gray-900">Reset Password</h1>
                  <p className="text-sm text-gray-500 mt-2">
                    Enter your email address to receive a reset link
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reset-email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                      className="pl-10"
                      id="reset-email"
                      placeholder="name@example.com"
                      type="email"
                      value={changePasswordEmail}
                      onChange={(e) => setChangePasswordEmail(e.target.value)}
                    />
                  </div>
                </div>

                <Button 
                  className="w-full bg-[#3182CE] hover:bg-blue-600"
                  onClick={() => {
                    console.log("Reset email sent to:", changePasswordEmail);
                    // Add your actual password reset logic here
                  }}
                >
                  Send Reset Link
                </Button>

                <button
                  className="flex items-center justify-center text-sm text-gray-600 hover:text-[#3182CE] transition-colors"
                  onClick={handleBackToLogin}
                >
                  <ArrowLeft className="mr-2" size={16} />
                  Back to Login
                </button>
              </div>
            ) : (
              <Tabs
                fullWidth
                aria-label="Auth options"
                color="primary"
                selectedKey={selected}
                size="lg"
                variant="underlined"
                onSelectionChange={handleTabsChange}
              >
                <Tab key="login" title="Login">
                   <div className="flex flex-col gap-4 pt-4">
                    <div className="text-center py-2">
                        <h1 className="text-2xl font-semibold">Welcome Back</h1>
                        <p className="text-sm text-gray-500 mt-1">Please enter your details</p>
                    </div>
                    
                    <Forms
                        buttonText={"Login"}
                        formControles={signInFormControl}
                        formData={formData}
                        handleSubmit={handleSubmit}
                        setFormData={setFormData}
                        state={isLoggingIn}
                    />

                    <div className="text-center mt-2">
                        <button
                        className="text-sm text-blue-500 hover:underline"
                        type="button"
                        onClick={handleForgotPasswordClick}
                        >
                        Forgot Password?
                        </button>
                    </div>
                  </div>
                </Tab>

                <Tab key="signup" title="Sign Up">
                  <div className="flex flex-col gap-4 pt-4">
                    <div className="text-center py-2">
                        <h1 className="text-2xl font-semibold">Create Account</h1>
                        <p className="text-sm text-gray-500 mt-1">Join us today</p>
                    </div>
                    
                    <Forms
                        buttonText={"Sign Up"}
                        formControles={signUpFormControl}
                        formData={formData}
                        handleSubmit={handleSubmit}
                        setFormData={setFormData}
                        state={isSigningUp}
                    />
                  </div>
                </Tab>
              </Tabs>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default Auth;