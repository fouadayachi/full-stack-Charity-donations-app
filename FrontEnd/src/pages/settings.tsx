import { PasswordChangeModal } from '@/components/UserSettings/PasswordChangeModal';
import { ProfileSection } from '@/components/UserSettings/ProfileSection';
import { SecuritySection } from '@/components/UserSettings/SecuritySection';
import { Link } from '@heroui/link';
import {
    Navbar as HeroUINavbar,
    NavbarBrand,
    NavbarContent,
} from "@heroui/navbar";
import { useState } from 'react';
export function SettingsPage() {
  const [showPasswordModal, setShowPasswordModal] = useState(false)


  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans bg-gradient-to-b from-blue-500/20 to-white">
        <HeroUINavbar isBordered maxWidth="xl" position="sticky">
        <NavbarContent className=" w-full" justify="center">
          <NavbarBrand className="gap-3 max-w-fit">
            <Link href="/">
              <img alt="logo" className="w-[180px] h-[50px]" src="/logo.png" />
            </Link>
          </NavbarBrand>
        </NavbarContent>
      </HeroUINavbar>
      <div className=" container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#1A365D]">
            Account Settings
          </h1>
        </div>
        
        <div className="space-y-8">
          <ProfileSection />
          <SecuritySection
            onChangePassword={() => setShowPasswordModal(true)}
          />
        </div>
      </div>
      {showPasswordModal && (
        <PasswordChangeModal
          onClose={() => setShowPasswordModal(false)}
          onSuccess={() => {
            setShowPasswordModal(false)
          }}
        />
      )}
    </div>
  )
}
