/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react'
import {
  X as XIcon,
  Mail as MailIcon,
  Phone as PhoneIcon,
  MapPin as MapPinIcon,
  HelpCircle as HelpCircleIcon,
  AlertTriangle as AlertTriangleIcon,
  FileText as FileTextIcon,
  DollarSign as DollarSignIcon,
  Users as UsersIcon,
  Check as CheckIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from 'lucide-react'
import { AdminRequest } from './RequestsPage'
type RequestStatus = 'pending' | 'accepted' | 'refused'

interface RequestDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  request: AdminRequest | null
  onAccept?: (requestId: string) => void
  onRefuse?: (requestId: string) => void
}

export const RequestDetailsModal: React.FC<RequestDetailsModalProps> = ({
  isOpen,
  onClose,
  request,
  onAccept,
  onRefuse,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  if (!isOpen || !request) return null
  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            🔴 High
          </span>
        )
      case 'medium':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
            🟠 Medium
          </span>
        )
      case 'low':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            ⚪ Low
          </span>
        )
    }
  }
  const getStatusBadge = (status: RequestStatus) => {
    switch (status) {
      case 'accepted':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            🟢 Accepted
          </span>
        )
      case 'refused':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            🔴 Refused
          </span>
        )
      case 'pending':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
            🟠 Pending
          </span>
        )
    }
  }
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }
  const handlePrevImage = () => {
    if (request.images && request.images.length > 0) {
      setActiveImageIndex(
        (prevIndex) =>
          (prevIndex - 1 + request.images!.length) % request.images!.length,
      )
    }
  }
  const handleNextImage = () => {
    if (request.images && request.images.length > 0) {
      setActiveImageIndex(
        (prevIndex) => (prevIndex + 1) % request.images!.length,
      )
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden my-8 mx-4">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center">
            <h2 className="text-xl font-bold text-[#1A365D]">
              Request Details
            </h2>
            <div className="ml-3">{getStatusBadge(request.status)}</div>
          </div>
          <button
            aria-label="Close"
            className="text-gray-400 hover:text-gray-600 transition-colors"
            onClick={onClose}
          >
            <XIcon size={24} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-130px)]">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-[#1A365D] mb-3 pb-2 border-b border-gray-200">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center mb-3">
                  <div className="flex-shrink-0 h-10 w-10 mr-3">                    
                      <div className="h-10 w-10 rounded-full bg-[#3182CE] flex items-center justify-center text-white font-medium">
                        {request.fullName
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .toUpperCase()}
                      </div>
                  </div>
                  <div>
                    <h4 className="text-md font-medium text-gray-900">
                      {request.fullName}
                    </h4>
                    <p className="text-sm text-gray-500">Requester</p>
                  </div>
                </div>
                <div className="space-y-2 mt-4">
                  <div className="flex items-start">
                    <MailIcon
                      className="text-gray-400 mt-0.5 mr-2 flex-shrink-0"
                      size={18}
                    />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="text-sm font-medium">
                        {request.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <PhoneIcon
                      className="text-gray-400 mt-0.5 mr-2 flex-shrink-0"
                      size={18}
                    />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="text-sm font-medium">
                        {request.phone || 'Not provided'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start">
                  <MapPinIcon
                    className="text-gray-400 mt-0.5 mr-2 flex-shrink-0"
                    size={18}
                  />
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="text-sm font-medium">
                      {request.address || 'Not provided'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <FileTextIcon
                    className="text-gray-400 mt-0.5 mr-2 flex-shrink-0"
                    size={18}
                  />
                  <div>
                    <p className="text-sm text-gray-500">Date Submitted</p>
                    <p className="text-sm font-medium">
                      {formatDate(request.createdAt)}
                    </p>
                  </div>
                </div>
                {request.dateUpdated && (
                  <div className="flex items-start">
                    <FileTextIcon
                      className="text-gray-400 mt-0.5 mr-2 flex-shrink-0"
                      size={18}
                    />
                    <div>
                      <p className="text-sm text-gray-500">Last Updated</p>
                      <p className="text-sm font-medium">
                        {formatDate(request.dateUpdated)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-[#1A365D] mb-3 pb-2 border-b border-gray-200">
              Request Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex items-start">
                <HelpCircleIcon
                  className="text-[#3182CE] mt-0.5 mr-2 flex-shrink-0"
                  size={18}
                />
                <div>
                  <p className="text-sm text-gray-500">Help Type</p>
                  <p className="text-sm font-medium">{request.helpType}</p>
                </div>
              </div>
              <div className="flex items-start">
                <AlertTriangleIcon
                  className="text-[#F56565] mt-0.5 mr-2 flex-shrink-0"
                  size={18}
                />
                <div>
                  <p className="text-sm text-gray-500">Urgency</p>
                  <div className="mt-1">{getUrgencyBadge(request.urgency)}</div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-md p-4 mb-4 border border-gray-100">
              <p className="text-sm text-gray-700 font-medium mb-2">
                Description
              </p>
              <p className="text-sm text-gray-800 whitespace-pre-wrap">
                {request.description}
              </p>
            </div>
          </div>
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-[#1A365D] mb-3 pb-2 border-b border-gray-200">
              Additional Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start">
                <DollarSignIcon
                  className="text-gray-400 mt-0.5 mr-2 flex-shrink-0"
                  size={18}
                />
                <div>
                  <p className="text-sm text-gray-500">Income Level</p>
                  <p className="text-sm font-medium">
                    {request.incomeLevel || 'Not provided'}
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <UsersIcon
                  className="text-gray-400 mt-0.5 mr-2 flex-shrink-0"
                  size={18}
                />
                <div>
                  <p className="text-sm text-gray-500">Referral Source</p>
                  <p className="text-sm font-medium">
                    {request.referralSource || 'Not provided'}
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckIcon
                  className="text-gray-400 mt-0.5 mr-2 flex-shrink-0"
                  size={18}
                />
                <div>
                  <p className="text-sm text-gray-500">Consent</p>
                  <p className="text-sm font-medium">
                    {request.consent === true
                      ? 'Consent Given: Yes'
                      : 'Consent Given: No'}
                  </p>
                </div>
              </div>
            </div>
          </div>
          {request.images && request.images.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-[#1A365D] mb-3 pb-2 border-b border-gray-200">
                Images
              </h3>
              <div className="mb-4">
                <div className="relative bg-gray-100 rounded-lg overflow-hidden h-64 flex items-center justify-center">
                  <img
                    alt={`Request image ${activeImageIndex + 1}`}
                    className="max-h-full max-w-full object-contain"
                    src={request.images[activeImageIndex]}
                  />
                  {request.images.length > 1 && (
                    <>
                      <button
                        aria-label="Previous image"
                        className="absolute left-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                        onClick={handlePrevImage}
                      >
                        <ChevronLeftIcon size={20} />
                      </button>
                      <button
                        aria-label="Next image"
                        className="absolute right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                        onClick={handleNextImage}
                      >
                        <ChevronRightIcon size={20} />
                      </button>
                    </>
                  )}
                </div>
                {request.images.length > 1 && (
                  <div className="flex justify-center mt-2">
                    <p className="text-sm text-gray-500">
                      {activeImageIndex + 1} of {request.images.length}
                    </p>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-5 gap-2">
                {request.images.map((image, index) => (
                  <div
                    key={index}
                    className={`relative rounded-md overflow-hidden h-16 cursor-pointer ${index === activeImageIndex ? 'ring-2 ring-[#3182CE]' : 'opacity-70 hover:opacity-100'}`}
                    onClick={() => setActiveImageIndex(index)}
                  >
                    <img
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                      src={image}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
          
        </div>
        <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 flex justify-between">
          <div>
            {request.status === 'pending' && (
              <div className="flex space-x-3">
                <button
                  className="px-4 py-2 border border-red-500 text-red-600 rounded-md hover:bg-red-50 transition-colors"
                  onClick={() => onRefuse && onRefuse(request._id)}
                >
                  Refuse Request
                </button>
                <button
                  className="px-4 py-2 bg-[#48BB78] text-white rounded-md hover:bg-green-600 transition-colors"
                  onClick={() => onAccept && onAccept(request._id)}
                >
                  Accept Request
                </button>
              </div>
            )}
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
