/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react'
import {
  X as XIcon,
  MapPin as MapPinIcon,
  Calendar as CalendarIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  CheckCircle as CheckCircleIcon,
} from 'lucide-react'
import type { Showcase } from './ShowcasePage'
interface ShowcaseDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  showcase: Showcase | null
  formatDate: (date: string) => string
}
export const ShowcaseDetailsModal: React.FC<ShowcaseDetailsModalProps> = ({
  isOpen,
  onClose,
  showcase,
  formatDate,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  if (!isOpen || !showcase) return null
  const handlePrevImage = () => {
    if (showcase.images && showcase.images.length > 0) {
      setActiveImageIndex(
        (prevIndex) =>
          (prevIndex - 1 + showcase.images.length) % showcase.images.length,
      )
    }
  }
  const handleNextImage = () => {
    if (showcase.images && showcase.images.length > 0) {
      setActiveImageIndex(
        (prevIndex) => (prevIndex + 1) % showcase.images.length,
      )
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden my-8 mx-4">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-xl font-bold text-[#1A365D]">Showcase Details</h2>
          <button
            aria-label="Close"
            className="text-gray-400 hover:text-gray-600 transition-colors"
            onClick={onClose}
          >
            <XIcon size={24} />
          </button>
        </div>
        {/* Body */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-130px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left column - Images */}
            <div>
              <div className="relative bg-gray-100 rounded-lg overflow-hidden h-64 mb-4">
                <img
                  alt={`${showcase.title} image ${activeImageIndex + 1}`}
                  className="w-full h-full object-cover"
                  src={showcase.images[activeImageIndex]}
                />
                {showcase.images.length > 1 && (
                  <>
                    <button
                      aria-label="Previous image"
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                      onClick={handlePrevImage}
                    >
                      <ChevronLeftIcon size={20} />
                    </button>
                    <button
                      aria-label="Next image"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                      onClick={handleNextImage}
                    >
                      <ChevronRightIcon size={20} />
                    </button>
                  </>
                )}
              </div>
              {showcase.images.length > 1 && (
                <div className="grid grid-cols-5 gap-2">
                  {showcase.images.map((image, index) => (
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
              )}
            </div>
            {/* Right column - Details */}
            <div>
              <h3 className="text-2xl font-bold text-[#1A365D] mb-2">
                {showcase.title}
              </h3>
              <div className="flex items-center mb-4 text-gray-600">
                <MapPinIcon className="mr-1 text-[#3182CE]" size={18} />
                <span>{showcase.location}</span>
              </div>
              <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <CalendarIcon className="mr-1 text-[#3182CE]" size={16} />
                  <span>Start: {formatDate(showcase.startDate)}</span>
                </div>
                <div className="flex items-center">
                  <CalendarIcon className="mr-1 text-[#3182CE]" size={16} />
                  <span>End: {formatDate(showcase.endDate)}</span>
                </div>
              </div>
              <div className="mb-4">
                <h4 className="text-md font-semibold text-[#1A365D] mb-2">
                  Description
                </h4>
                <div className="bg-gray-50 rounded-md p-4 border border-gray-100 text-gray-700 max-h-40 overflow-y-auto">
                  <p>{showcase.longDescription}</p>
                </div>
              </div>
              <div>
                <h4 className="text-md font-semibold text-[#1A365D] mb-2">
                  Key Achievements
                </h4>
                <ul className="bg-gray-50 rounded-md p-4 border border-gray-100">
                  {showcase.keyAchievements.map((achievement) => (
                    <li key={achievement} className="mb-2 flex items-start">
                      <CheckCircleIcon
                        className="mr-2 text-[#48BB78] flex-shrink-0 mt-0.5"
                        size={18}
                      />
                      <span className="text-gray-700">{achievement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        {/* Footer */}
        <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 flex justify-end">
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
