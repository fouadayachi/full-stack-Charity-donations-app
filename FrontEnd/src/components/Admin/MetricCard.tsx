import React from 'react'
interface MetricCardProps {
  title: string
  value:  any
  icon: React.ReactNode
  subtext: any
  gradientFrom: string
  gradientTo: string
}
export const MetricCard = ({
  title,
  value,
  icon,
  subtext,
  gradientFrom,
  gradientTo,
}: MetricCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow transition-shadow hover:translate-y-[-2px] duration-300 overflow-hidden">
      <div
        className="h-2"
        style={{
          background: `linear-gradient(to right, ${gradientFrom}, ${gradientTo})`,
        }}
      />
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium">{title}</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
          </div>
          <div
            className="p-2 rounded-lg"
            style={{
              background: `linear-gradient(135deg, ${gradientFrom}20, ${gradientTo}20)`,
              color: gradientFrom,
            }}
          >
            {icon}
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-3">{subtext}</p>
      </div>
    </div>
  )
}
