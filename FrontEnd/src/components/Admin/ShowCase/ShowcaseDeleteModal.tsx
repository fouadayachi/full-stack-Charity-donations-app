import React from 'react'
import { AlertTriangle as AlertTriangleIcon } from 'lucide-react'
interface ShowcaseDeleteModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  showcaseTitle: string
}
export const ShowcaseDeleteModal: React.FC<ShowcaseDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  showcaseTitle,
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fadeIn">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 mx-4">
        <div className="flex items-center mb-4">
          <div className="bg-red-100 rounded-full p-2 mr-4">
            <AlertTriangleIcon className="text-red-500" size={24} />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Delete Showcase</h3>
        </div>
        <p className="mb-6 text-gray-600">
          Are you sure you want to delete{' '}
          <span className="font-semibold">{showcaseTitle}</span>? This action
          cannot be undone.
        </p>
        <div className="flex justify-end space-x-4">
          <button
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
