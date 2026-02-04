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
import { useState } from "react";

const AdminAuth = () => {
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [forgotPasswordStep, setForgotPasswordStep] = useState(1);
  const [adminEmail, setAdminEmail] = useState("");
  const {adminLogin} = useAuthStore();
  const {signInFormControl } = siteConfig;
  const [formData,setFormData] = useState({
    email : "",
    password : ""
  });

  const handleForgotPasswordClick = () => {
    setIsForgotPassword(true);
  };

  const handleBackToLogin = () => {
    setIsForgotPassword(false);
    setForgotPasswordStep(1);
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
          <NavbarBrand className="gap-3 max-w-fit scale-150">
          <Link href="/">
            <img alt="logo" className="w-[100px] h-[40px]" src="/newLogo.png" />
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
                  <h1 className="text-2xl font-semibold">Admin Reset Password</h1>
                  <p className="text-sm text-gray-500 mt-2">
                    {forgotPasswordStep === 1 && "Enter your email to reset your password"}
                    {forgotPasswordStep === 2 && "Enter the OTP sent to your email"}
                    {forgotPasswordStep === 3 && "Enter your new password"}
                  </p>
                </div>
                {forgotPasswordStep === 1 && (
                  <form className="flex flex-col gap-5" onSubmit={handleEmailSubmit}>
                    <Input
                      isRequired
                      label={"Email"}
                      labelPlacement="outside"
                      placeholder={"Enter your email"}
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                    />
                    <Button color="primary" type="submit">Submit</Button>
                  </form>
                )}
                {forgotPasswordStep === 2 && (
                  <form className="flex flex-col gap-5" onSubmit={handleOtpSubmit}>
                    <Input
                      isRequired
                      label={"OTP"}
                      labelPlacement="outside"
                      placeholder={"Enter the OTP"}
                    />
                    <Button color="primary" type="submit">Submit</Button>
                  </form>
                )}
                {forgotPasswordStep === 3 && (
                  <form className="flex flex-col gap-5" onSubmit={handlePasswordChangeSubmit}>
                    <Input
                      isRequired
                      label={"New Password"}
                      labelPlacement="outside"
                      placeholder={"Enter your new password"}
                      type="password"
                    />
                    <Button color="primary" type="submit">Submit</Button>
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
              <div className="flex flex-col gap-3">
                <div className="text-center">
                  <h1 className="text-2xl font-semibold">Admin Login</h1>
                  <p className="text-sm text-gray-500 mt-2">
                    Enter your email and password to access the admin panel
                  </p>
                </div>
                <Forms
                  key={"admin-login"}
                  buttonText={"Login"}
                  formControles={signInFormControl}
                  formData={formData}
                  handleSubmit={(e) => {
                    e.preventDefault();
                    adminLogin(formData);
                  }}
                  setFormData={setFormData}
                  state={false}
                />
                <div className="text-center mt-2">
                  <button
                    className="text-sm text-blue-500 hover:underline"
                    onClick={handleForgotPasswordClick}
                  >
                    Forgot Password?
                  </button>
                </div>
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default AdminAuth;