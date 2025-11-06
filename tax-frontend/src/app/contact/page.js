'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import { 
  Phone, 
  Mail, 
  MapPin, 
  Send, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  User,
  MessageCircle,
  Building,
  Shield
} from 'lucide-react'

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || ""

// Move InputField component OUTSIDE to prevent recreation
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
        className={`w-full pl-10 pr-4 py-3 bg-white border rounded-lg text-[#0F2F4E] 
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

const Contact = () => {
  const [form, setForm] = useState({ 
    name: '', 
    email: '', 
    company: '',
    subject: '',
    message: '' 
  })
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(null)
  const [errors, setErrors] = useState({})

  const contactMethods = [
    {
      icon: Phone,
      label: 'Call Us',
      value: '+263 71 488 9981',
      description: 'Mon-Fri from 8AM to 5PM',
    },
    {
      icon: Mail,
      label: 'Email Us',
      value: 'info@taxcul.com',
      description: 'We\'ll respond within 24 hours',
    },
    {
      icon: MapPin,
      label: 'Visit Us',
      value: 'Harare, Zimbabwe',
      description: 'Zimbabwe',
    },
    {
      icon: Clock,
      label: 'Support Hours',
      value: '24/7 AI Support',
      description: 'Live chat available',
    }
  ]

  const subjectOptions = [
    'Tax Calculation Help',
    'Technical Support',
    'Feature Request',
    'Partnership Inquiry',
    'General Question',
    'Bug Report',
    'Billing Inquiry',
    'Security Concern'
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!form.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!form.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!form.subject) {
      newErrors.subject = 'Please select a subject'
    }

    if (!form.message.trim()) {
      newErrors.message = 'Message is required'
    } else if (form.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)
    setStatus(null)

    try {
      await axios.post(`${API_BASE}/contact`, form)
      setStatus({ 
        type: 'success', 
        msg: 'Message sent successfully! We\'ll get back to you within 24 hours.' 
      })
      setForm({ name: '', email: '', company: '', subject: '', message: '' })
      setErrors({})
    } catch (error) {
      setStatus({ 
        type: 'error', 
        msg: 'Something went wrong. Please try again later or email us directly.' 
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#EEEEEE] text-[#0F2F4E] py-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-[#0F2F4E] mt-4 mb-4">
            Get In Touch
          </h1>
          <p className="text-xl text-[#0F2F4E]/80 max-w-3xl mx-auto">
            Have questions about tax calculations or need professional support? 
            Our team is here to help you succeed.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-2xl font-bold text-[#0F2F4E] mb-6">
                Contact Information
              </h2>
              <p className="text-[#0F2F4E]/80 mb-8">
                Reach out through any of these channels. We're always happy to help 
                with your tax calculation needs.
              </p>
            </div>

            {/* Contact Methods */}
            <div className="space-y-4">
              {contactMethods.map((method, index) => {
                const IconComponent = method.icon
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                    className="p-4 rounded-xl bg-white border border-[#FFD700] shadow-lg hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-[#1ED760]/10 rounded-lg">
                        <IconComponent className="w-6 h-6 text-[#1ED760]" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#0F2F4E] text-lg">
                          {method.label}
                        </h3>
                        <p className="text-[#0F2F4E] font-medium">
                          {method.value}
                        </p>
                        <p className="text-[#0F2F4E]/70 text-sm">
                          {method.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Trust Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="p-4 bg-white rounded-xl border border-[#1ED760]/20"
            >
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-[#1ED760]" />
                <div>
                  <h4 className="font-semibold text-[#1ED760] text-sm">
                    Secure & Confidential
                  </h4>
                  <p className="text-[#0F2F4E]/70 text-xs">
                    All your information is encrypted and protected
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-2xl border border-[#EEEEEE] shadow-xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-[#1ED760]/10 rounded-xl">
                  <Send className="w-6 h-6 text-[#1ED760]" />
                </div>
                <h2 className="text-2xl font-bold text-[#0F2F4E]">
                  Send Us a Message
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="Full Name"
                    icon={User}
                    name="name"
                    value={form.name}
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
                    value={form.email}
                    onChange={handleChange}
                    error={errors.email}
                    placeholder="your.email@example.com"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="Company (Optional)"
                    icon={Building}
                    name="company"
                    value={form.company}
                    onChange={handleChange}
                    error={errors.company}
                    placeholder="Your company name"
                  />
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[#0F2F4E]">
                      Subject <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MessageCircle className="w-5 h-5 text-[#0F2F4E]/60" />
                      </div>
                      <select
                        name="subject"
                        value={form.subject}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-3 bg-white border rounded-lg text-[#0F2F4E] 
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
                    </div>
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
                    <div className="absolute top-3 left-3">
                      <MessageCircle className="w-5 h-5 text-[#0F2F4E]/60" />
                    </div>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Tell us about your tax calculation needs, questions, or how we can help you..."
                      rows={6}
                      className={`w-full pl-10 pr-4 py-3 bg-white border rounded-lg text-[#0F2F4E] 
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
                    {form.message.length}/5000 characters
                  </div>
                </div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  className={`w-full py-4 px-6 rounded-lg font-bold text-lg transition-all duration-300 
                             flex items-center justify-center gap-3 shadow-lg
                             ${loading 
                               ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                               : 'bg-[#1ED760] text-white hover:bg-[#1ED760]/90 hover:shadow-[#1ED760]/25'
                             }`}
                >
                  {loading ? (
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

              {/* Status Message */}
              <AnimatePresence>
                {status && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`mt-6 p-4 rounded-lg border ${
                      status.type === 'success' 
                        ? 'bg-green-50 border-green-200 text-green-700' 
                        : 'bg-red-50 border-red-200 text-red-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {status.type === 'success' ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <AlertCircle className="w-5 h-5" />
                      )}
                      <p className="text-sm">{status.msg}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Contact