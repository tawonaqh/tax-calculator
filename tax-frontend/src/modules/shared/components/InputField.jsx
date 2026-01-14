'use client'

/**
 * InputField Component
 * Reusable input field with label and error handling
 */
export const InputField = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  icon: Icon,
  prefix,
  suffix,
  disabled = false,
  required = false,
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
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0F2F4E]/50">
            <Icon className="w-5 h-5" />
          </div>
        )}

        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0F2F4E]/70 font-medium">
            {prefix}
          </span>
        )}

        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          className={`
            w-full px-4 py-3
            ${Icon ? 'pl-11' : ''}
            ${prefix ? 'pl-8' : ''}
            ${suffix ? 'pr-12' : ''}
            bg-white
            border-2 rounded-xl
            text-[#0F2F4E] font-medium
            placeholder-[#0F2F4E]/40
            transition-all duration-300
            shadow-sm
            ${error 
              ? 'border-red-500 focus:ring-red-500/20' 
              : 'border-[#EEEEEE] focus:border-[#1ED760] focus:ring-4 focus:ring-[#1ED760]/20'
            }
            ${disabled ? 'bg-gray-50 cursor-not-allowed opacity-60' : ''}
            focus:outline-none
          `}
          {...props}
        />

        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0F2F4E]/70 font-medium">
            {suffix}
          </span>
        )}
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
