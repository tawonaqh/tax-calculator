'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, Mail, Phone, MapPin, User, MessageCircle, CheckCircle, AlertCircle } from 'lucide-react'

const InputField = ({ label, icon: Icon, type = 'text', name, value, onChange, error, placeholder, required = false }) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-[#0F2F4E]">
      {label} {required && <span className="text-red-400">*</span>}
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Icon className="w-5 h-5 text-[#0F2F4E]/60" />
      </div>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`w-full pl-10 pr-4 py-4 bg-white border rounded-xl text-[#0F2F4E] 
                   placeholder-[#0F2F4E]/40 focus:outline-none focus:ring-2 transition-all duration-300
                   ${error 
                     ? 'border-red-400 focus:border-red-400 focus:ring-red-400/50' 
                     : 'border-[#EEEEEE] focus:border-[#1ED760] focus:ring-[#1ED760]/50'
                   }`}
      />
    </div>
    {error && (
      <div className="flex items-center gap-2 text-red-400 text-sm">
        <AlertCircle className="w-4 h-4" />
        {error}
      </div>
    )}
  </div>
)

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errors, setErrors] = useState({})

  const contactMethods = [
    {
      icon: Mail,
      label: 'Email Us',
      value: 'info@taxcul.com',
      description: 'We\'ll respond within 24 hours'
    },
    {
      icon: Phone,
      label: 'Call Us',
      value: '+263 71 488 9981',
      description: 'Mon-Fri from 8AM to 5PM'
    },
    {
      icon: MapPin,
      label: 'Visit Us',
      value: 'Harare, Zimbabwe',
      description: 'Zimbabwe'
    }
  ]

  const subjectOptions = [
    'Tax Calculation Help',
    'Technical Support',
    'Feature Request',
    'Partnership Inquiry',
    'General Question',
    'Bug Report'
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.subject) {
      newErrors.subject = 'Please select a subject'
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required'
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      setIsSubmitted(true)
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
    } catch (error) {
      console.error('Submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <section className="py-16 bg-white rounded-2xl">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-[#1ED760]/20 rounded-2xl">
                <CheckCircle className="w-16 h-16 text-[#1ED760]" />
              </div>
            </div>
            <h2 className="text-4xl font-bold text-[#0F2F4E] mb-4">
              Message Sent!
            </h2>
            <p className="text-xl text-[#0F2F4E]/80 mb-8 max-w-2xl mx-auto">
              Thank you for reaching out! We've received your message and will get back to you within 24 hours.
            </p>
            <button
              onClick={() => setIsSubmitted(false)}
              className="px-8 py-4 bg-[#1ED760] text-white font-semibold rounded-xl 
                         hover:bg-[#1ED760]/90 transition-all duration-300 shadow-lg 
                         hover:shadow-[#1ED760]/25"
            >
              Send Another Message
            </button>
          </motion.div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-white rounded-2xl">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-[#0F2F4E] mb-4">
            Get In Touch
          </h2>
          <p className="text-xl text-[#0F2F4E]/80 max-w-2xl mx-auto">
            Have questions about tax calculations? Our team is here to help you with any inquiries.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-[#0F2F4E] mb-6">
              Contact Information
            </h3>
            
            {contactMethods.map((method, index) => {
              const IconComponent = method.icon
              return (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 bg-white rounded-xl border border-[#FFD700] shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="p-3 bg-[#1ED760]/10 rounded-xl">
                    <IconComponent className="w-6 h-6 text-[#1ED760]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#0F2F4E] mb-1">
                      {method.label}
                    </h4>
                    <p className="text-[#1ED760] font-medium mb-1">
                      {method.value}
                    </p>
                    <p className="text-[#0F2F4E]/70 text-sm">
                      {method.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Full Name"
                  icon={User}
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  error={errors.name}
                  placeholder="Enter your full name"
                  required
                />
                <InputField
                  label="Email Address"
                  icon={Mail}
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  placeholder="your.email@example.com"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Phone Number (Optional)"
                  icon={Phone}
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  error={errors.phone}
                  placeholder="+263 XXX XXX XXX"
                />
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[#0F2F4E]">
                    Subject <span className="text-red-400">*</span>
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={`w-full px-4 py-4 bg-white border rounded-xl text-[#0F2F4E] 
                               focus:outline-none focus:ring-2 transition-all duration-300
                               ${errors.subject 
                                 ? 'border-red-400 focus:border-red-400 focus:ring-red-400/50' 
                                 : 'border-[#EEEEEE] focus:border-[#1ED760] focus:ring-[#1ED760]/50'
                               }`}
                  >
                    <option value="">Select a subject</option>
                    {subjectOptions.map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  {errors.subject && (
                    <div className="flex items-center gap-2 text-red-400 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      {errors.subject}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#0F2F4E]">
                  Message <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute top-4 left-3">
                    <MessageCircle className="w-5 h-5 text-[#0F2F4E]/60" />
                  </div>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your tax calculation needs, questions, or issues..."
                    rows={6}
                    className={`w-full pl-10 pr-4 py-4 bg-white border rounded-xl text-[#0F2F4E] 
                               placeholder-[#0F2F4E]/40 focus:outline-none focus:ring-2 transition-all duration-300
                               ${errors.message 
                                 ? 'border-red-400 focus:border-red-400 focus:ring-red-400/50' 
                                 : 'border-[#EEEEEE] focus:border-[#1ED760] focus:ring-[#1ED760]/50'
                               }`}
                  />
                </div>
                {errors.message && (
                  <div className="flex items-center gap-2 text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {errors.message}
                  </div>
                )}
                <div className="text-right text-sm text-[#0F2F4E]/60">
                  {formData.message.length}/5000 characters
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300 
                           flex items-center justify-center gap-3 shadow-lg
                           ${isSubmitting 
                             ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                             : 'bg-[#1ED760] text-white hover:bg-[#1ED760]/90 hover:shadow-[#1ED760]/25'
                           }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending Message...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Message
                  </>
                )}
              </motion.button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}