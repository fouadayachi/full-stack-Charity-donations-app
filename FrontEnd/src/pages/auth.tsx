import { siteConfig } from "@/config/site";
import { useState } from "react";
import { Link } from "@heroui/link";
import { Tabs, Tab } from "@heroui/tabs";
import { Card, CardBody } from "@heroui/card";
import {
  Navbar as HeroUINavbar,
  NavbarBrand,
  NavbarContent,
} from "@heroui/navbar";
import Forms from "@/components/forms";
import useAuthStore from "@/store/useAuthStore";

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
  const {signup,isSigningUp,login,isLoggingIn} = useAuthStore();

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

  return (
    <div className="relative flex flex-col h-screen">
      <HeroUINavbar isBordered maxWidth="xl" position="sticky">
        <NavbarContent className=" w-full" justify="center" >
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
              </Tab>
              <Tab key="signup" className="flex flex-col gap-3" title="Sign Up">
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
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
