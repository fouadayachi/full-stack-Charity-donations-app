
interface SecuritySectionProps {
  onChangePassword: () => void
}
export function SecuritySection({ onChangePassword }: SecuritySectionProps) {
  return (
    <section className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold text-[#1A365D] mb-4">Security</h2>
      <div>
        <p className="text-gray-600 mb-4">
          Manage your account security settings and change your password.
        </p>
        <button
          className="px-4 py-2 bg-[#3182CE] text-white rounded hover:bg-blue-700 transition-colors"
          onClick={onChangePassword}
        >
          Change Password
        </button>
      </div>
    </section>
  )
}
