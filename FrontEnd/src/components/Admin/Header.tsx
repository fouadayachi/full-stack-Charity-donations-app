import { Avatar } from "@heroui/avatar";
import {  LogOut } from "lucide-react";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
export const Header = () => {
  return (
    <header className="bg-white border-b border-gray-100 shadow-sm">
      <div className="flex items-center px-5 py-3 justify-center">
        <div className="flex items-center space-x-4 mr-auto  w-full justify-end">
          <div className="relative flex items-center">
            <Dropdown>
              <DropdownTrigger className=" cursor-pointer">
                <Avatar isBordered color="primary" name="Fouad" size="sm" />
              </DropdownTrigger>
              <DropdownMenu aria-label="Static Actions">
                <DropdownItem
                  key={"Logout"}
                  className="text-danger-600"
                  color="danger"
                  startContent={<LogOut />}
                >
                  Log out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
            <div className="ml-2 hidden md:block">
              <p className="text-sm font-medium">Fouad Ayachi</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
