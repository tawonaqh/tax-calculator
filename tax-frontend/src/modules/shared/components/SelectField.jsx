'use client'

/**
 * SelectField Component
 * Reusable select dropdown with label and error handling
 */
export const SelectField = ({
  label,
  name,
  value,
  onChange,
  options = [],
  error,
  icon: Icon,
  disabled = false,
  required = false,
  placeholder = 'Select an option',
  className = '',
  ...props
}) => {
  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className="block text-sm font-semibold text-[#0F2F4E] mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0F2F4E]/50 z-10 pointer-events-none">
            <Icon className="w-5 h-5" />
          </div>
        )}

        <select
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`
            w-full px-4 py-3
            ${Icon ? 'pl-11' : ''}
            pr-10
            bg-white
            border-2 rounded-xl
            text-[#0F2F4E] font-medium
            transition-all duration-300
            shadow-sm
            appearance-none
            cursor-pointer
            ${error 
              ? 'border-red-500 focus:ring-red-500/20' 
              : 'border-[#EEEEEE] focus:border-[#1ED760] focus:ring-4 focus:ring-[#1ED760]/20'
            }
            ${disabled ? 'bg-gray-50 cursor-not-allowed opacity-60' : ''}
            focus:outline-none
          `}
          {...props}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option, index) => (
            <option 
              key={index} 
              value={option.value || option}
            >
              {option.label || option}
            </option>
          ))}
        </select>

        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg
            className="w-5 h-5 text-[#0F2F4E]/70"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
          <span>⚠</span>
          {error}
        </p>
      )}
    </div>
  )
}
