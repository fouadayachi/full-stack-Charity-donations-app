import { Button } from "@heroui/button";
import { Link } from "@heroui/link";

import { siteConfig } from "@/config/site";
import useAuthStore from "@/store/useAuthStore";
import { Avatar } from "@heroui/avatar";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import {
  Navbar as HeroUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@heroui/navbar";
import { link as linkStyles } from "@heroui/theme";
import clsx from "clsx";
import { LogOut, Settings, Star } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Navbar = () => {
  const navigate = useNavigate();
  const { authenticated, logout } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <HeroUINavbar
      isBordered
      isMenuOpen={isMenuOpen}
      maxWidth="xl"
      position="sticky"
      onMenuOpenChange={setIsMenuOpen}
    >
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand className="gap-3 max-w-fit">
          <Link href="/">
            <img alt="logo" className="w-[180px] h-[50px]" src="/logo.png" />
          </Link>
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent>
        <div className="hidden sm:flex gap-8 justify-start ml-2">
          {siteConfig.navItems.map((item) => (
            <NavbarItem key={item.href} className="">
              <Link
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  "data-[active=true]:text-primary data-[active=true]:font-medium"
                )}
                color="foreground"
                href={item.href}
                underline="hover"
                onPress={item.scroll}
              >
                {item.label}
              </Link>
            </NavbarItem>
          ))}
        </div>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden sm:flex">
          {authenticated ? (
            <Dropdown>
              <DropdownTrigger className=" cursor-pointer">
                <Avatar isBordered color="primary" name="Fouad" size="sm" />
              </DropdownTrigger>
              <DropdownMenu aria-label="Static Actions">
                <DropdownItem key={"myImpacts"} startContent={<Star />}>
                  <Link color="foreground" href="/impact">
                    My Impacts
                  </Link>
                </DropdownItem>
                <DropdownItem key={"settings"} startContent={<Settings />}>
                  <Link color="foreground" href="/settings">
                    Settings
                  </Link>
                </DropdownItem>
                <DropdownItem
                  key={"Logout"}
                  className="text-danger-600"
                  color="danger"
                  startContent={<LogOut />}
                  onPress={() => logout()}
                >
                  Log out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          ) : (
            <Button
              className="text-sm font-normal "
              color="primary"
              variant="shadow"
              onPress={() => navigate("/login")}
            >
              Log in
            </Button>
          )}
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        {authenticated ? (
          <Dropdown>
            <DropdownTrigger className=" cursor-pointer">
              <Avatar isBordered color="primary" name="Fouad" size="sm" />
            </DropdownTrigger>
            <DropdownMenu aria-label="Static Actions">
              <DropdownItem key={"myImpacts"} startContent={<Star />}>
                <Link color="foreground" href="/impact">
                  My Impacts
                </Link>
              </DropdownItem>
              <DropdownItem key={"settings"} startContent={<Settings />}>
                <Link color="foreground" href="/settings">
                  Settings
                </Link>
              </DropdownItem>
              <DropdownItem
                key={"Logout"}
                className="text-danger-600"
                color="danger"
                startContent={<LogOut />}
                onPress={() => logout()}
              >
                Log out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        ) : (
          <Button
            className="text-sm font-normal "
            color="primary"
            variant="shadow"
            onPress={() => navigate("/login")}
          >
            Log in
          </Button>
        )}
      </NavbarContent>

      <NavbarMenu>
        <div className="mx-4  flex flex-col gap-10 items-center justify-center my-10">
          {siteConfig.navItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                color="foreground"
                href={item.href}
                size="lg"
                underline="hover"
                onPress={() => {
                  item.scroll && item.scroll();
                  setIsMenuOpen(false);
                }}
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>
    </HeroUINavbar>
  );
};
