'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Calculator, 
  Mail, 
  MapPin, 
  Phone, 
  Twitter, 
  Linkedin, 
  Github,
  ArrowUp,
  Shield,
  Heart
} from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const quickLinks = [
    { name: 'Tax Planning', href: '/income-tax-calculator' },
    { name: 'PAYE Calculator', href: '/paye-calculator' },
    { name: 'Corporate Tax', href: '/corporate-tax-calculator' },
    { name: 'VAT Calculator', href: '/vat-tax-calculator' },
  ]

  const supportLinks = [
    { name: 'Documentation', href: '/docs' },
    { name: 'Help Center', href: '/help' },
    { name: 'Contact Support', href: '/contact' },
    { name: 'API Docs', href: '/api' },
  ]

  const companyLinks = [
    { name: 'About Us', href: 'https://culverwellvenge.com' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
  ]

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-950 border-t border-gray-800 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-1"
          >
            <div className="flex items-center gap-2 mb-4">
              <Link href="/" className="flex items-center gap-3 group">
                <img src="/img/taxcul.svg" alt="Tax Portal Logo" className="w-auto h-[28px]" />
              </Link>
              {/* Beta pill */}
              <span className="bg-yellow-300 text-gray-900 text-xs font-bold px-2 py-0.5 ml-1 mb-1 rounded-full uppercase">
                Beta
              </span>
            </div>

            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              Professional tax calculation tools powered by AI. 
              Simplify your tax workflow with accurate, real-time computations.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-400 text-sm">
                <Mail className="w-4 h-4 text-lime-400" />
                <span>culverwell@culverwellvenge.com</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400 text-sm">
                <Phone className="w-4 h-4 text-lime-400" />
                <span>+263 71 488 9981</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400 text-sm">
                <MapPin className="w-4 h-4 text-lime-400" />
                <span>Harare, Zimbabwe</span>
              </div>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="text-lg font-semibold text-lime-400 mb-4">Calculators</h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-lime-400 transition-colors duration-300 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Support Links */}
          {/* <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold text-lime-400 mb-4">Support</h3>
            <ul className="space-y-3">
              {supportLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-lime-400 transition-colors duration-300 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div> */}

          {/* Company Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="text-lg font-semibold text-lime-400 mb-4">Company</h3>
            <ul className="space-y-3">
              {companyLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-lime-400 transition-colors duration-300 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Social Links */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold text-gray-300 mb-3">Follow Us</h4>
              <div className="flex gap-3">
                {[
                  { icon: Twitter, href: '#', label: 'Twitter' },
                  { icon: Linkedin, href: '#', label: 'LinkedIn' },
                  { icon: Github, href: 'https://github.com/TaxCul', label: 'GitHub' },
                ].map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 bg-gray-800 rounded-lg text-gray-400 hover:bg-lime-400 
                               hover:text-gray-900 transition-all duration-300"
                    aria-label={social.label}
                  >
                    <social.icon className="w-4 h-4" />
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright and Credits */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center gap-2 text-gray-400 text-sm"
            >
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-lime-400" />
                <span>© {currentYear} TaxCul. All rights reserved.</span>
              </div>
              
              <div className="hidden sm:block text-gray-600">•</div>
              
              <div className="flex items-center gap-2">
                <span>Developed by</span>
                <span className="text-lime-400 font-semibold">Code Mafia</span>
              </div>
            </motion.div>

            {/* Security Badge and Scroll to Top */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex items-center gap-4"
            >
              {/* Security Badge */}
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span>All calculations secured & encrypted</span>
              </div>

              {/* Scroll to Top Button */}
              <motion.button
                onClick={scrollToTop}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 bg-gray-800 rounded-lg text-gray-400 hover:bg-lime-400 
                           hover:text-gray-900 transition-all duration-300"
                aria-label="Scroll to top"
              >
                <ArrowUp className="w-4 h-4" />
              </motion.button>
            </motion.div>
          </div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-center mt-4"
          >
            <p className="text-gray-500 text-xs">
              TaxCul provides calculation tools for informational purposes only. 
              Consult with a qualified tax professional for specific advice.
            </p>
          </motion.div>
        </div>
      </div>
    </footer>
  )
}

export default Footer