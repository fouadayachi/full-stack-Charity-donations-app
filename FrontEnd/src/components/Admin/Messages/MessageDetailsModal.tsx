import React from 'react'
import {
  X as XIcon,
  Mail as MailIcon,
  Trash as TrashIcon,
  User as UserIcon,
} from 'lucide-react'
interface Message {
  _id: string
  fullName: string
  email: string
  message: string
  isRead: boolean
  createdAt: string
}
interface MessageDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  message: Message | null
  onMarkAsUnread: (id: string) => void
  onDelete: (id: string) => void
}
export const MessageDetailsModal: React.FC<MessageDetailsModalProps> = ({
  isOpen,
  onClose,
  message,
  onMarkAsUnread,
  onDelete,
}) => {
  if (!isOpen || !message) return null
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }
  const handleMarkAsUnread = () => {
    onMarkAsUnread(message._id)
    onClose()
  }
  const handleDelete = () => {
    onDelete(message._id)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fadeIn">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-[#1A365D] flex items-center">
            Message Details
          </h2>
          <button
            className="text-gray-400 hover:text-gray-600 transition-colors"
            onClick={onClose}
          >
            <XIcon size={20} />
          </button>
        </div>
        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-130px)]">
          <div className="flex items-start mb-6">
            <div className="flex-shrink-0 h-12 w-12 mr-4">
              <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                <UserIcon className="text-gray-500" size={24} />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-900">
                {message.fullName}
              </h3>
              <p className="text-sm text-gray-500">{message.email}</p>
              <p className="text-xs text-gray-400 mt-1">
                {formatDate(message.createdAt)}
              </p>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-md border border-gray-100 mb-4">
            <p className="text-gray-800 whitespace-pre-wrap">
              {message.message}
            </p>
          </div>
        </div>
        {/* Footer */}
        <div className="flex justify-between items-center p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex space-x-2">
            <button
              className="flex items-center px-3 py-2 border border-red-300 text-red-700 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
              onClick={handleDelete}
            >
              <TrashIcon className="mr-2" size={16} />
              Delete
            </button>
            <button
              className="flex items-center px-3 py-2 border border-gray-300 text-gray-700 bg-white rounded-md hover:bg-gray-50 transition-colors"
              onClick={handleMarkAsUnread}
            >
              <MailIcon className="mr-2" size={16} />
              Mark as Unread
            </button>
          </div>
          <button
            className="px-4 py-2 bg-[#3182CE] text-white rounded-md hover:bg-blue-600 transition-colors"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
