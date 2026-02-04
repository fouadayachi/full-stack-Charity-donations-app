import Forms from "@/components/forms";
import { siteConfig } from "@/config/site";
import useAuthStore from "@/store/useAuthStore";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Input } from "@heroui/input";
import { Link } from "@heroui/link";
import {
  Navbar as HeroUINavbar,
  NavbarBrand,
  NavbarContent,
} from "@heroui/navbar";
import { Tab, Tabs } from "@heroui/tabs";
import { Eye, EyeClosed } from "lucide-react";
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
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const [changePasswordEmail, setChangePasswordEmail] = useState("");
  const [forgotPasswordStep, setForgotPasswordStep] = useState(1);

  const handleTabsChange = (key: string) => {
    setSelected(key);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phone: "",
      address: "",
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selected === "signup") {
      signup(formData);
    } else {
      login(formData);
    }
  };

  const handleForgotPasswordClick = () => {
    setIsForgotPassword(true);
  };

  const handleBackToLogin = () => {
    setIsForgotPassword(false);
  };

  const handleEmailSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Add logic to send reset email
    setForgotPasswordStep(2);
  };

  const handleOtpSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Add logic to verify OTP
    setForgotPasswordStep(3);
  };

  const handlePasswordChangeSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Add logic to change the password
    setIsForgotPassword(false);
    setForgotPasswordStep(1);
  };

  return (
    <div className="relative flex flex-col h-screen">
      <HeroUINavbar isBordered maxWidth="xl" position="sticky">
        <NavbarContent className=" w-full" justify="center">
          <NavbarBrand className="gap-3 max-w-fit">
            <Link href="/">
              <img alt="logo" className="w-[180px] h-[50px]" src="/logo.png" />
            </Link>
          </NavbarBrand>
        </NavbarContent>
      </HeroUINavbar>
      <div className="flex justify-center items-center p-6">
        <Card className="w-[550px] max-w-full  p-2">
          <CardBody className="overflow-hidden">
            {isForgotPassword ? (
              <div className="flex flex-col gap-3">
                <div className="text-center">
                  <h1 className="text-2xl font-semibold">Forgot Password</h1>
                  <p className="text-sm text-gray-500 mt-2">
                    {forgotPasswordStep === 1 &&
                      "Enter your email to reset your password"}
                    {forgotPasswordStep === 2 &&
                      "Enter the OTP sent to your email"}
                    {forgotPasswordStep === 3 && "Enter your new password"}
                  </p>
                </div>
                {forgotPasswordStep === 1 && (
                  <form
                    className="flex flex-col gap-5"
                    onSubmit={handleEmailSubmit}
                  >
                    <Input
                      isRequired
                      label={"Email"}
                      labelPlacement="outside"
                      placeholder={"Enter your email"}
                      value={changePasswordEmail}
                      onChange={(e) => setChangePasswordEmail(e.target.value)}
                    />
                    <Button color="primary" type="submit">
                      Submit
                    </Button>
                  </form>
                )}
                {forgotPasswordStep === 2 && (
                  <form
                    className="flex flex-col gap-5"
                    onSubmit={handleOtpSubmit}
                  >
                    <Input
                      isRequired
                      label={"OTP"}
                      labelPlacement="outside"
                      placeholder={"Enter the OTP"}
                    />
                    <Button color="primary" type="submit">
                      Submit
                    </Button>
                  </form>
                )}
                {forgotPasswordStep === 3 && (
                  <form
                    className="flex flex-col gap-5"
                    onSubmit={handlePasswordChangeSubmit}
                  >
                    <Input
                      isRequired
                      endContent={
                        <button
                          className="text-gray-500"
                          type="button"
                          onClick={toggleVisibility}
                        >
                          {isVisible ? <Eye /> : <EyeClosed />}
                        </button>
                      }
                      label={"New Password"}
                      labelPlacement="outside"
                      placeholder={"Enter your new password"}
                      type={isVisible ? "text" : "password"}
                    />
                    <Button color="primary" type="submit">
                      Submit
                    </Button>
                  </form>
                )}
                <div className="text-center mt-2">
                  <button
                    className="text-sm text-blue-500 hover:underline"
                    onClick={handleBackToLogin}
                  >
                    Back to Login
                  </button>
                </div>
              </div>
            ) : (
              <Tabs
                fullWidth
                aria-label="tabs form"
                color="primary"
                radius="full"
                selectedKey={selected}
                size="md"
                onSelectionChange={(key) => handleTabsChange(key.toString())}
              >
                <Tab key="login" className="flex flex-col gap-3" title="Login">
                  <div className="text-center">
                    <h1 className="text-2xl font-semibold">
                      Sign in to your account
                    </h1>
                    <p className="text-sm text-gray-500 mt-2">
                      Enter your email and password to access your account
                    </p>
                  </div>
                  <Forms
                    key={"login"}
                    buttonText={"Login"}
                    formControles={signInFormControl}
                    formData={formData}
                    handleSubmit={handleSubmit}
                    setFormData={setFormData}
                    state={isLoggingIn}
                  />
                  <div className="text-center mt-2">
                    <Link
                      className="text-sm text-blue-500 hover:underline cursor-pointer"
                      onPress={handleForgotPasswordClick}
                    >
                      Forgot Password?
                    </Link>
                  </div>
                </Tab>
                <Tab
                  key="signup"
                  className="flex flex-col gap-3"
                  title="Sign Up"
                >
                  <div className="text-center">
                    <h1 className="text-2xl font-semibold">
                      Create new account
                    </h1>
                    <p className="text-sm text-gray-500 mt-2">
                      Enter your details to get started
                    </p>
                  </div>
                  <Forms
                    key={"signup"}
                    buttonText={"Sign Up"}
                    formControles={signUpFormControl}
                    formData={formData}
                    handleSubmit={handleSubmit}
                    setFormData={setFormData}
                    state={isSigningUp}
                  />
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
