import { RequestHelpForm } from "@/components/GetHelp/RequestHelpForm";

import { Link } from "@heroui/link";
import {
  Navbar as HeroUINavbar,
  NavbarBrand,
  NavbarContent,
} from "@heroui/navbar";





const GetHelp = () => {


  return (
    <div className="relative min-h-screen w-full  bg-gray-50">
      <HeroUINavbar isBordered maxWidth="xl" position="sticky">
        <NavbarContent className=" w-full" justify="center">
          <NavbarBrand className="gap-3 max-w-fit">
            <Link href="/">
              <img alt="logo" className="w-[180px] h-[50px]" src="/logo.png" />
            </Link>
          </NavbarBrand>
        </NavbarContent>
      </HeroUINavbar>
      <main className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Request Help
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We&apos;re here to help. Please fill out the form below with your
              information and details about the assistance you need. All
              information will be kept confidential.
            </p>
          </div>
          <RequestHelpForm />
        </div>
      </main>
    </div>
  );
};

export default GetHelp;
