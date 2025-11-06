'use client'

import { motion } from 'framer-motion'
import { Shield, Lock, Eye, User, Database, Cookie, Mail, Phone } from 'lucide-react'

export default function PrivacyPolicy() {
  const lastUpdated = "October 1, 2025"

  const sections = [
    {
      icon: User,
      title: "Information We Collect",
      content: [
        {
          subtitle: "Personal Information",
          items: [
            "Name, email address, and contact details",
            "Company information and tax identification numbers",
            "Payment and billing information",
            "Communication preferences"
          ]
        },
        {
          subtitle: "Tax Calculation Data",
          items: [
            "Income and expense information",
            "Business financial data",
            "Tax deduction details",
            "Asset and investment information"
          ]
        },
        {
          subtitle: "Technical Information",
          items: [
            "IP address and device information",
            "Browser type and version",
            "Usage patterns and preferences",
            "Cookies and similar technologies"
          ]
        }
      ]
    },
    {
      icon: Eye,
      title: "How We Use Your Information",
      content: [
        {
          subtitle: "Service Provision",
          items: [
            "Process and calculate tax obligations",
            "Generate tax reports and documentation",
            "Provide personalized tax recommendations",
            "Maintain and improve our services"
          ]
        },
        {
          subtitle: "Communication",
          items: [
            "Respond to your inquiries and support requests",
            "Send important service updates and notifications",
            "Provide tax law updates and compliance information",
            "Share educational content about tax optimization"
          ]
        },
        {
          subtitle: "Legal Compliance",
          items: [
            "Comply with applicable tax laws and regulations",
            "Prevent fraud and unauthorized access",
            "Enforce our terms of service",
            "Protect our rights and property"
          ]
        }
      ]
    },
    {
      icon: Database,
      title: "Data Storage & Security",
      content: [
        {
          subtitle: "Data Protection",
          items: [
            "Bank-level 256-bit SSL encryption",
            "Regular security audits and penetration testing",
            "Secure data centers with 24/7 monitoring",
            "Role-based access control systems"
          ]
        },
        {
          subtitle: "Data Retention",
          items: [
            "Tax calculation data: 7 years (legal requirement)",
            "User account information: Until deletion request",
            "Backup data: 30 days rolling retention",
            "Analytics data: 26 months maximum"
          ]
        },
        {
          subtitle: "International Transfers",
          items: [
            "Data primarily stored in secure Zimbabwean servers",
            "Some analytics processed through EU-compliant services",
            "Adequate safeguards for all international transfers",
            "Your explicit consent obtained where required"
          ]
        }
      ]
    },
    {
      icon: Cookie,
      title: "Cookies & Tracking",
      content: [
        {
          subtitle: "Essential Cookies",
          items: [
            "Session management and user authentication",
            "Security and fraud prevention",
            "Load balancing and performance optimization",
            "Required for core functionality"
          ]
        },
        {
          subtitle: "Analytical Cookies",
          items: [
            "Website usage and performance analytics",
            "Feature adoption and user behavior tracking",
            "Service improvement and optimization",
            "Opt-out available in user settings"
          ]
        },
        {
          subtitle: "Third-Party Services",
          items: [
            "Google Analytics for website analytics",
            "Stripe for secure payment processing",
            "AWS for secure cloud infrastructure",
            "All partners are GDPR and CCPA compliant"
          ]
        }
      ]
    },
    {
      icon: Shield,
      title: "Your Rights & Choices",
      content: [
        {
          subtitle: "Access and Control",
          items: [
            "Access your personal information anytime",
            "Correct inaccurate or incomplete data",
            "Request deletion of your personal data",
            "Export your data in machine-readable format"
          ]
        },
        {
          subtitle: "Communication Preferences",
          items: [
            "Opt-out of marketing communications",
            "Choose notification frequency",
            "Set communication channel preferences",
            "Manage email subscription settings"
          ]
        },
        {
          subtitle: "Legal Rights",
          items: [
            "Right to be informed about data usage",
            "Right to restrict processing in certain cases",
            "Right to data portability between services",
            "Right to lodge complaints with authorities"
          ]
        }
      ]
    },
    {
      icon: Lock,
      title: "Data Sharing & Disclosure",
      content: [
        {
          subtitle: "Service Providers",
          items: [
            "Cloud hosting and infrastructure partners",
            "Payment processing services",
            "Customer support and communication tools",
            "Analytics and monitoring services"
          ]
        },
        {
          subtitle: "Legal Requirements",
          items: [
            "When required by law or legal process",
            "To protect our rights and property",
            "In emergency situations involving safety",
            "As part of business transfers or mergers"
          ]
        },
        {
          subtitle: "Third Parties",
          items: [
            "Only with your explicit consent",
            "Anonymized and aggregated data for research",
            "Compliance with lawful requests",
            "Never sold to third-party advertisers"
          ]
        }
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white py-16">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-4 mt-4 mb-6">
            <div className="p-3 bg-lime-400/10 rounded-2xl">
              <Shield className="w-8 h-8 text-lime-400" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-lime-400">
              Privacy Policy
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-4">
            Your privacy and data security are our top priority. Learn how we protect 
            and handle your tax information with the highest standards of security.
          </p>
          <div className="inline-flex items-center gap-2 bg-gray-800/60 backdrop-blur-sm 
                         px-4 py-2 rounded-full text-gray-300 text-sm border border-gray-700">
            <span>Last Updated:</span>
            <span className="text-lime-400 font-medium">{lastUpdated}</span>
          </div>
        </motion.div>

        {/* Quick Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-gray-800/40 backdrop-blur-sm rounded-3xl border border-gray-700/50 p-8 mb-12"
        >
          <h2 className="text-2xl font-bold text-lime-400 mb-6">At a Glance</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-lime-400/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Lock className="w-6 h-6 text-lime-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">Bank-Level Security</h3>
              <p className="text-gray-400 text-sm">
                256-bit encryption and regular security audits
              </p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-lime-400/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Eye className="w-6 h-6 text-lime-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">Transparent Practices</h3>
              <p className="text-gray-400 text-sm">
                Clear data usage and no hidden tracking
              </p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-lime-400/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                <User className="w-6 h-6 text-lime-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">Your Control</h3>
              <p className="text-gray-400 text-sm">
                Full control over your data and preferences
              </p>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="space-y-12">
          {sections.map((section, sectionIndex) => {
            const IconComponent = section.icon
            return (
              <motion.section
                key={sectionIndex}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * sectionIndex }}
                className="bg-gray-800/40 backdrop-blur-sm rounded-3xl border border-gray-700/50 p-8"
              >
                {/* Section Header */}
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-lime-400/10 rounded-xl">
                    <IconComponent className="w-6 h-6 text-lime-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-lime-400">
                    {section.title}
                  </h2>
                </div>

                {/* Section Content */}
                <div className="space-y-8">
                  {section.content.map((subsection, subsectionIndex) => (
                    <div key={subsectionIndex} className="border-l-2 border-lime-400/30 pl-6">
                      <h3 className="text-lg font-semibold text-white mb-4">
                        {subsection.subtitle}
                      </h3>
                      <ul className="space-y-2">
                        {subsection.items.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex items-start gap-3 text-gray-300">
                            <div className="w-1.5 h-1.5 bg-lime-400 rounded-full mt-2 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </motion.section>
            )
          })}
        </div>

        {/* Additional Legal Sections */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 space-y-8"
        >
          {/* Children's Privacy */}
          <div className="bg-gray-800/40 backdrop-blur-sm rounded-3xl border border-gray-700/50 p-8">
            <h2 className="text-2xl font-bold text-lime-400 mb-4">Children's Privacy</h2>
            <p className="text-gray-300 leading-relaxed">
              Our services are not directed to individuals under the age of 18. We do not 
              knowingly collect personal information from children. If you become aware 
              that a child has provided us with personal information, please contact us 
              immediately.
            </p>
          </div>

          {/* Changes to Policy */}
          <div className="bg-gray-800/40 backdrop-blur-sm rounded-3xl border border-gray-700/50 p-8">
            <h2 className="text-2xl font-bold text-lime-400 mb-4">Policy Updates</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              We may update this privacy policy from time to time to reflect changes in 
              our practices, technology, legal requirements, or other factors. When we do, 
              we will update the "Last Updated" date at the top of this policy.
            </p>
            <p className="text-gray-300 leading-relaxed">
              For significant changes, we will notify you through email or prominent 
              notices on our website. We encourage you to periodically review this page 
              for the latest information on our privacy practices.
            </p>
          </div>

          {/* Contact Information */}
          <div className="bg-gray-800/40 backdrop-blur-sm rounded-3xl border border-gray-700/50 p-8">
            <h2 className="text-2xl font-bold text-lime-400 mb-6">Contact Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-4 p-4 bg-gray-700/30 rounded-xl">
                <Mail className="w-5 h-5 text-lime-400" />
                <div>
                  <p className="text-gray-400 text-sm">Email</p>
                  <p className="text-white font-medium">info@taxcul.com</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-gray-700/30 rounded-xl">
                <Phone className="w-5 h-5 text-lime-400" />
                <div>
                  <p className="text-gray-400 text-sm">Phone</p>
                  <p className="text-white font-medium">+263 71 488 9981</p>
                </div>
              </div>
            </div>
            <p className="text-gray-300 mt-6">
              If you have any questions, concerns, or requests regarding this privacy policy 
              or our data practices, please don't hesitate to contact our privacy team.
            </p>
          </div>
        </motion.div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="text-center mt-16 pt-8 border-t border-gray-700/50"
        >
          <p className="text-gray-400 text-sm">
            This privacy policy is designed to be transparent and easy to understand. 
            We are committed to protecting your privacy and being clear about how we 
            handle your tax information.
          </p>
        </motion.div>
      </div>
    </div>
  )
}