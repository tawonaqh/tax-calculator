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
  Shield
} from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const quickLinks = [
    { name: 'Tax Planning', href: '/income-tax-calculator' },
    { name: 'PAYE Calculator', href: '/paye-calculator' },
    { name: 'Corporate Tax', href: '/corporate-tax-calculator' },
    { name: 'VAT Calculator', href: '/vat-tax-calculator' },
  ]

  const companyLinks = [
    { name: 'About Us', href: '#about-us' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
  ]

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="bg-[#0F2F4E] border-t border-[#1ED760]/20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Link href="/" className="flex items-center gap-3 group">
                <img src="/img/taxcul.svg" alt="TaxCul Logo" className="w-auto h-[28px]" />
              </Link>
              <span className="bg-[#FFD700] text-[#0F2F4E] text-xs font-bold px-2 py-0.5 ml-1 mb-1 rounded-full uppercase">
                Beta
              </span>
            </div>

            <p className="text-gray-300 text-sm mb-6 leading-relaxed">
              Professional tax calculation tools powered by AI. 
              Simplify your tax workflow with accurate, real-time computations.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-300 text-sm">
                <Mail className="w-4 h-4 text-[#1ED760]" />
                <span>info@taxcul.com</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300 text-sm">
                <Phone className="w-4 h-4 text-[#1ED760]" />
                <span>+263 71 488 9981</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300 text-sm">
                <MapPin className="w-4 h-4 text-[#1ED760]" />
                <span>Harare, Zimbabwe</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-[#1ED760] mb-4">Calculators</h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    href={link.href}
                    className="text-gray-300 hover:text-[#1ED760] transition-colors duration-300 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-lg font-semibold text-[#1ED760] mb-4">Company</h3>
            <ul className="space-y-3">
              {companyLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    href={link.href}
                    className="text-gray-300 hover:text-[#1ED760] transition-colors duration-300 text-sm"
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
                    className="p-2 bg-white/10 rounded-lg text-gray-300 hover:bg-[#1ED760] 
                               hover:text-white transition-all duration-300"
                    aria-label={social.label}
                  >
                    <social.icon className="w-4 h-4" />
                  </motion.a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright and Credits */}
            <div className="flex flex-col sm:flex-row items-center gap-2 text-gray-300 text-sm">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#1ED760]" />
                <span>© {currentYear} TaxCul. All rights reserved.</span>
              </div>
              {/* developed by hidden for now */}
              {/* <div className="hidden sm:block text-gray-500">•</div>
              
              <div className="flex items-center gap-2">
                <span>Developed by</span>
                <span className="text-[#1ED760] font-semibold">Code Mafia</span>
              </div> */}
            </div>

            {/* Security Badge and Scroll to Top */}
            <div className="flex items-center gap-4">
              {/* Security Badge */}
              <div className="flex items-center gap-2 text-gray-300 text-sm">
                <div className="w-2 h-2 bg-[#1ED760] rounded-full animate-pulse" />
                <span>All calculations secured & encrypted</span>
              </div>

              {/* Scroll to Top Button */}
              <motion.button
                onClick={scrollToTop}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 bg-white/10 rounded-lg text-gray-300 hover:bg-[#1ED760] 
                           hover:text-white transition-all duration-300"
                aria-label="Scroll to top"
              >
                <ArrowUp className="w-4 h-4" />
              </motion.button>
            </div>
          </div>

          {/* Additional Info */}
          <div className="text-center mt-4">
            <p className="text-gray-400 text-xs">
              TaxCul provides calculation tools for informational purposes only. 
              Consult with a qualified tax professional for specific advice.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer