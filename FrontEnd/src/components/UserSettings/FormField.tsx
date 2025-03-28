import React from 'react'
interface FormFieldProps {
  label: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  type?: string
  required?: boolean
  error?: string
}
export function FormField({
  label,
  name,
  value,
  onChange,
  type = 'text',
  required = false,
  error = '',
}: FormFieldProps) {
  return (
    <div className="mb-2">
      <label
        className="block text-sm font-medium text-gray-700 mb-1"
        htmlFor={name}
      >
        {label} {required && <span className="text-[#F56565]">*</span>}
      </label>
      <input
        className={`w-full px-3 py-2 border ${error ? 'border-[#F56565]' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3182CE] focus:border-transparent transition-colors`}
        id={name}
        name={name}
        required={required}
        type={type}
        value={value}
        onChange={onChange}
      />
      {error && <p className="mt-1 text-sm text-[#F56565]">{error}</p>}
    </div>
  )
}
