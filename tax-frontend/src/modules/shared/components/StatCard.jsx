'use client'

/**
 * StatCard Component
 * Displays key statistics with optional trend indicators
 */
export const StatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  trendValue,
  color = 'green',
  className = ''
}) => {
  const colors = {
    green: {
      bg: 'bg-[#1ED760]/10',
      icon: 'text-[#1ED760]',
      trend: 'text-[#1ED760]'
    },
    navy: {
      bg: 'bg-[#0F2F4E]/10',
      icon: 'text-[#0F2F4E]',
      trend: 'text-[#0F2F4E]'
    },
    gold: {
      bg: 'bg-[#FFD700]/10',
      icon: 'text-[#FFD700]',
      trend: 'text-[#FFD700]'
    },
    red: {
      bg: 'bg-red-500/10',
      icon: 'text-red-500',
      trend: 'text-red-500'
    }
  }

  const selectedColor = colors[color] || colors.green

  return (
    <div className={`bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-[#0F2F4E]/70 mb-2">
            {title}
          </p>
          
          <div className="text-3xl font-bold text-[#0F2F4E] mb-2">
            {value}
          </div>

          {trend && (
            <div className={`flex items-center gap-1 text-sm font-medium ${
              trend === 'up' ? 'text-[#1ED760]' : 'text-red-500'
            }`}>
              <span>{trend === 'up' ? '↑' : '↓'}</span>
              <span>{trendValue}</span>
            </div>
          )}
        </div>

        {Icon && (
          <div className={`p-3 rounded-xl ${selectedColor.bg} ${selectedColor.icon}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </div>
  )
}
