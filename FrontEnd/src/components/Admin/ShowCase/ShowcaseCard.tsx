import React from 'react'
import {
  EyeIcon,
  PencilIcon,
  TrashIcon,
  MapPinIcon,
  CalendarIcon,
  AwardIcon,
} from 'lucide-react'
import type { Showcase } from './ShowcasePage'
interface ShowcaseCardProps {
  showcase: Showcase
  onViewDetails: () => void
  onEdit: () => void
  onDelete: () => void
  formatDate: (date: string) => string
}
export const ShowcaseCard: React.FC<ShowcaseCardProps> = ({
  showcase,
  onViewDetails,
  onEdit,
  onDelete,
  formatDate,
}) => {
  const isActive = new Date(showcase.endDate) >= new Date()

  return (
    <div className="bg-white border border-gray-100 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow hover:translate-y-[-2px] duration-300">
      <div className="relative h-48 overflow-hidden">
        <img
          alt={showcase.title}
          className="w-full h-full object-cover"
          src={showcase.mainImage}
        />
        <div className="absolute top-0 right-0 flex gap-2 m-2">
          <div
            className={`text-xs font-bold px-3 py-1 rounded-full flex items-center ${isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
          >
            <div
              className={`w-2 h-2 rounded-full mr-1 ${isActive ? 'bg-green-500' : 'bg-gray-500'}`}
            />
            {isActive ? 'Active' : 'Completed'}
          </div>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-[#1A365D] mb-3">
          {showcase.title}
        </h3>
        <p className="text-gray-600 text-sm line-clamp-2 mb-4">
          {showcase.shortDescription}
        </p>
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <MapPinIcon className="mr-2 text-[#3182CE]" size={16} />
            <span>{showcase.location}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <CalendarIcon className="mr-2 text-[#3182CE]" size={16} />
            <span>
              {formatDate(showcase.startDate)} - {formatDate(showcase.endDate)}
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <AwardIcon className="mr-2 text-[#3182CE]" size={16} />
            <span>{showcase.keyAchievements.length} achievements</span>
          </div>
        </div>
        <div className="flex justify-between items-center border-t border-gray-100 pt-3">
          <button
            className="text-[#3182CE] hover:text-blue-700 flex items-center text-sm font-medium"
            onClick={onViewDetails}
          >
            <EyeIcon className="mr-1" size={16} />
            View Details
          </button>
          <div className="flex space-x-2">
            <button
              className="p-1.5 rounded-full text-gray-500 hover:text-[#3182CE] hover:bg-blue-50 transition-colors group relative"
              title="Edit Showcase"
              onClick={onEdit}
            >
              <PencilIcon size={16} />
              <span className="invisible group-hover:visible absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap">
                Edit Showcase
              </span>
            </button>
            <button
              className="p-1.5 rounded-full text-gray-500 hover:text-[#F56565] hover:bg-red-50 transition-colors group relative"
              title="Delete Showcase"
              onClick={onDelete}
            >
              <TrashIcon size={16} />
              <span className="invisible group-hover:visible absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap">
                Delete Showcase
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
