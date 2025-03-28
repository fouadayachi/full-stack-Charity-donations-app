import useAuthStore from "@/store/useAuthStore";
import { XIcon } from 'lucide-react';
import React, { useState } from 'react';

interface PasswordChangeModalProps {
  onClose: () => void
  onSuccess: () => void
}

export function PasswordChangeModal({
  onClose,
  onSuccess,
}: PasswordChangeModalProps) {
  const { changePassword } = useAuthStore();
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  })
  const [errors, setErrors] = useState({
    current: '',
    new: '',
    confirm: '',
  })
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setPasswords({
      ...passwords,
      [name]: value,
    })
    // Clear errors when typing
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: '',
      })
    }
    // Check if passwords match when typing in confirm field
    if (
      name === 'confirm' &&
      passwords.new &&
      value &&
      passwords.new !== value
    ) {
      setErrors({
        ...errors,
        confirm: "Passwords don't match",
      })
    }
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors = {
      current: !passwords.current ? 'Current password is required' : '',
      new: !passwords.new
        ? 'New password is required'
        : passwords.new.length < 8
          ? 'Password must be at least 8 characters'
          : '',
      confirm: !passwords.confirm
        ? 'Please confirm your password'
        : passwords.new !== passwords.confirm
          ? "Passwords don't match"
          : '',
    }

    setErrors(newErrors)
    // If no errors, submit
    if (!newErrors.current && !newErrors.new && !newErrors.confirm) {
      try {
        await changePassword({
          currentPassword: passwords.current,
          newPassword: passwords.new,
        });
        onSuccess();
      } catch (error) {
        console.error(error);
      }
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-[#1A365D]">
            Change Password
          </h3>
          <button
            className="text-gray-500 hover:text-gray-700 transition-colors"
            onClick={onClose}
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>
        <form className="p-6" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="current"
            >
              Current Password <span className="text-[#F56565]">*</span>
            </label>
            <input
              className={`w-full px-3 py-2 border ${errors.current ? 'border-[#F56565]' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3182CE] focus:border-transparent`}
              id="current"
              name="current"
              type="password"
              value={passwords.current}
              onChange={handleChange}
            />
            {errors.current && (
              <p className="mt-1 text-sm text-[#F56565]">{errors.current}</p>
            )}
          </div>
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="new"
            >
              New Password <span className="text-[#F56565]">*</span>
            </label>
            <input
              className={`w-full px-3 py-2 border ${errors.new ? 'border-[#F56565]' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3182CE] focus:border-transparent`}
              id="new"
              name="new"
              type="password"
              value={passwords.new}
              onChange={handleChange}
            />
            {errors.new && (
              <p className="mt-1 text-sm text-[#F56565]">{errors.new}</p>
            )}
          </div>
          <div className="mb-6">
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="confirm"
            >
              Confirm New Password <span className="text-[#F56565]">*</span>
            </label>
            <input
              className={`w-full px-3 py-2 border ${errors.confirm ? 'border-[#F56565]' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3182CE] focus:border-transparent`}
              id="confirm"
              name="confirm"
              type="password"
              value={passwords.confirm}
              onChange={handleChange}
            />
            {errors.confirm && (
              <p className="mt-1 text-sm text-[#F56565]">{errors.confirm}</p>
            )}
          </div>
          <div className="flex justify-end space-x-3">
            <button
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
              type="button"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-[#3182CE] text-white rounded hover:bg-blue-700 transition-colors"
              type="submit"
            >
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
