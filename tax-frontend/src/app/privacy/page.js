'use client'

import { motion } from 'framer-motion'
import { FileText, Scale, AlertTriangle, Shield, UserCheck, CreditCard, Copyright, Globe, Mail, MapPin } from 'lucide-react'

export default function TermsAndConditions() {
  const effectiveDate = "November 10, 2025"
  const companyName = "TaxCul"
  const companyAddress = "Harare, Zimbabwe"
  const contactEmail = "info@taxcul.com"

  const sections = [
    {
      icon: UserCheck,
      title: "Acceptance of Terms",
      content: `By accessing and using ${companyName}'s tax calculation services, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must immediately discontinue use of our services.`
    },
    {
      icon: Scale,
      title: "Service Description",
      content: `${companyName} provides AI-powered tax calculation tools, tax planning assistance, and related financial computation services. Our platform is designed to assist with tax calculations but does not replace professional tax advice. Users are responsible for verifying calculations with qualified tax professionals.`
    },
    {
      icon: CreditCard,
      title: "User Accounts & Registration",
      content: `To access certain features, you must register for an account. You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate. You are responsible for safeguarding your password and for all activities that occur under your account.`
    },
    {
      icon: Shield,
      title: "User Responsibilities",
      content: `You agree to use our services only for lawful purposes and in accordance with these Terms. You must not use our services to engage in any fraudulent, illegal, or unauthorized activities. You are solely responsible for the accuracy of the information you provide for tax calculations.`
    },
    {
      icon: Copyright,
      title: "Intellectual Property",
      content: `All content, features, and functionality available on ${companyName}, including but not limited to text, graphics, logos, icons, images, audio clips, and software, are the exclusive property of ${companyName} and are protected by international copyright, trademark, and other intellectual property laws.`
    },
    {
      icon: Globe,
      title: "Prohibited Activities",
      content: `You may not: attempt to reverse engineer any software; use the service for any illegal purpose; harass, abuse, or harm another person; upload viruses or malicious code; interfere with the proper working of the service; or attempt to bypass any security measures.`
    }
  ]

  const importantPoints = [
    {
      icon: AlertTriangle,
      title: "No Professional Tax Advice",
      description: "Our services provide calculation tools only and do not constitute professional tax advice. Always consult with a qualified tax professional for specific tax situations.",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: Shield,
      title: "Accuracy Disclaimer",
      description: "While we strive for accuracy, tax laws change frequently. We are not responsible for calculation errors resulting from outdated tax rates or legislative changes.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: CreditCard,
      title: "Service Availability",
      description: "We do not guarantee uninterrupted service availability. Maintenance, updates, or unforeseen circumstances may temporarily disrupt access to our services.",
      color: "from-purple-500 to-pink-500"
    }
  ]

  const legalSections = [
    {
      title: "Limitation of Liability",
      content: `To the fullest extent permitted by applicable law, ${companyName} shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the services.`
    },
    {
      title: "Indemnification",
      content: `You agree to defend, indemnify, and hold harmless ${companyName} and its affiliates, officers, agents, and employees from and against any claims, disputes, demands, liabilities, damages, losses, and costs arising from your violation of these Terms or your use of the services.`
    },
    {
      title: "Termination",
      content: `We may terminate or suspend your account and bar access to the service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever, including but not limited to a breach of the Terms.`
    },
    {
      title: "Governing Law",
      content: `These Terms shall be governed and construed in accordance with the laws of Zimbabwe, without regard to its conflict of law provisions. Any disputes shall be resolved in the courts of Harare, Zimbabwe.`
    },
    {
      title: "Changes to Terms",
      content: `We reserve the right, at our sole discretion, to modify or replace these Terms at any time. By continuing to access or use our service after those revisions become effective, you agree to be bound by the revised terms.`
    },
    {
      title: "Contact Information",
      content: `For any questions about these Terms and Conditions, please contact us at ${contactEmail} or write to us at ${companyAddress}.`
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F2F4E] via-[#1a3d63] to-[#0F2F4E] text-white py-16">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            className="flex items-center justify-center mt-4 gap-6 mb-8"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
          >
            <div className="p-4 bg-gradient-to-br from-[#1ED760] to-[#0F2F4E] rounded-3xl shadow-2xl shadow-[#1ED760]/25">
              <FileText className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white">
              Terms & Conditions
            </h1>
          </motion.div>
          <motion.p 
            className="text-xl text-white/80 max-w-3xl mx-auto mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Please read these terms carefully before using our tax calculation services. 
            These terms govern your access to and use of {companyName}.
          </motion.p>
          <motion.div 
            className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm 
                         px-6 py-3 rounded-2xl text-white/90 border border-[#FFD700]/30"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <span>Effective Date:</span>
            <span className="text-[#1ED760] font-semibold">{effectiveDate}</span>
          </motion.div>
        </motion.div>

        {/* Important Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-sm border border-orange-400/30 rounded-3xl p-8 mb-12"
        >
          <motion.div 
            className="flex items-start gap-6"
            whileHover={{ x: 5 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-3 bg-orange-500/20 rounded-2xl border border-orange-400/50">
              <AlertTriangle className="w-8 h-8 text-orange-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-orange-400 mb-4">Important Legal Notice</h2>
              <p className="text-orange-300/90 leading-relaxed text-lg">
                {companyName} provides tax calculation tools for informational purposes only. 
                Our services do not constitute professional tax advice, legal advice, or financial advice. 
                You should consult with qualified tax professionals for specific tax situations. 
                By using our services, you acknowledge this important distinction.
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Key Points Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
        >
          {importantPoints.map((point, index) => {
            const IconComponent = point.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl border border-[#FFD700]/30 p-6 text-center hover:shadow-2xl hover:shadow-[#1ED760]/10 transition-all duration-500"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${point.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-white mb-3 text-lg">{point.title}</h3>
                <p className="text-white/70 text-sm leading-relaxed">{point.description}</p>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Main Terms Sections */}
        <div className="space-y-8 mb-12">
          {sections.map((section, index) => {
            const IconComponent = section.icon
            return (
              <motion.section
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                whileHover={{ y: -2 }}
                className="bg-white/10 backdrop-blur-sm rounded-3xl border border-[#FFD700]/30 p-8 hover:shadow-2xl hover:shadow-[#1ED760]/10 transition-all duration-500"
              >
                <motion.div 
                  className="flex items-start gap-6"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="p-4 bg-gradient-to-br from-[#1ED760] to-[#0F2F4E] rounded-2xl shadow-lg flex-shrink-0">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-4">
                      {section.title}
                    </h2>
                    <p className="text-white/80 leading-relaxed text-lg">
                      {section.content}
                    </p>
                  </div>
                </motion.div>
              </motion.section>
            )
          })}
        </div>

        {/* Legal Sections */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="space-y-8"
        >
          <motion.h2 
            className="text-4xl font-bold text-white text-center mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            Additional Legal Provisions
          </motion.h2>

          {legalSections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
              whileHover={{ x: 5 }}
              className="bg-white/10 backdrop-blur-sm rounded-3xl border border-[#FFD700]/30 p-8 hover:shadow-lg hover:shadow-[#1ED760]/10 transition-all duration-300"
            >
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                <div className="w-2 h-2 bg-[#1ED760] rounded-full" />
                {section.title}
              </h3>
              <p className="text-white/80 leading-relaxed text-lg">
                {section.content}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Payment Terms Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          whileHover={{ y: -2 }}
          className="bg-white/10 backdrop-blur-sm rounded-3xl border border-[#FFD700]/30 p-8 mt-12 hover:shadow-2xl hover:shadow-[#1ED760]/10 transition-all duration-500"
        >
          <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-[#1ED760] to-[#0F2F4E] rounded-2xl">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            Payment Terms
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Free Services</h3>
              <ul className="space-y-3 text-white/80">
                {[
                  "Basic tax calculations available at no cost",
                  "Standard features accessible without payment",
                  "No hidden fees for basic functionality"
                ].map((item, index) => (
                  <motion.li 
                    key={index}
                    className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors duration-300"
                    whileHover={{ x: 5 }}
                  >
                    <div className="w-2 h-2 bg-[#1ED760] rounded-full mt-2 flex-shrink-0" />
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Premium Services</h3>
              <ul className="space-y-3 text-white/80">
                {[
                  "Clear pricing for advanced features",
                  "Automatic renewal with opt-out option",
                  "Refund policy as per Zimbabwean consumer law"
                ].map((item, index) => (
                  <motion.li 
                    key={index}
                    className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors duration-300"
                    whileHover={{ x: 5 }}
                  >
                    <div className="w-2 h-2 bg-[#FFD700] rounded-full mt-2 flex-shrink-0" />
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="bg-white/10 backdrop-blur-sm rounded-3xl border border-[#FFD700]/30 p-8 mt-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-[#1ED760] to-[#0F2F4E] rounded-2xl">
              <Mail className="w-6 h-6 text-white" />
            </div>
            Contact Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-4 p-6 bg-white/5 rounded-2xl border border-white/10 hover:border-[#1ED760] transition-all duration-300"
            >
              <Mail className="w-8 h-8 text-[#1ED760]" />
              <div>
                <p className="text-white/60 text-sm">Email</p>
                <p className="text-white font-semibold text-lg">{contactEmail}</p>
              </div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-4 p-6 bg-white/5 rounded-2xl border border-white/10 hover:border-[#1ED760] transition-all duration-300"
            >
              <MapPin className="w-8 h-8 text-[#1ED760]" />
              <div>
                <p className="text-white/60 text-sm">Address</p>
                <p className="text-white font-semibold text-lg">{companyAddress}</p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Final Acknowledgment */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 1.3 }}
          className="text-center mt-16 pt-12 border-t border-white/20"
        >
          <motion.div 
            className="bg-gradient-to-r from-[#1ED760]/10 to-[#0F2F4E]/10 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto border border-[#1ED760]/30"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <FileText className="w-12 h-12 text-[#1ED760] mx-auto mb-4" />
            <h3 className="text-xl font-bold text-[#1ED760] mb-4">
              Agreement to Terms
            </h3>
            <p className="text-white/80 text-lg leading-relaxed">
              By accessing or using {companyName}'s services, you acknowledge that you have read, 
              understood, and agree to be bound by these Terms and Conditions. If you do not agree 
              to these terms, please discontinue use of our services immediately.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}