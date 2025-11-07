'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Calculator, Sparkles, Users, Zap } from 'lucide-react'

export default function CallToAction() {
  const features = [
    {
      icon: Calculator,
      text: '15+ Tax Calculators'
    },
    {
      icon: Zap,
      text: 'AI-Powered Insights'
    },
    {
      icon: Users,
      text: '2,500+ Users'
    },
    {
      icon: Sparkles,
      text: '99.8% Accuracy'
    }
  ]

  return (
    <section className="relative py-16 px-6 rounded-3xl mb-20 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1ED760] via-[#1ED760] to-[#0F2F4E]" />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full animate-pulse" />
        <div className="absolute top-1/2 right-20 w-16 h-16 bg-white rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-20 left-1/3 w-12 h-12 bg-white rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 
                       px-4 py-2 rounded-full text-white text-sm font-medium mb-8"
          >
            <Sparkles className="w-4 h-4" />
            Trusted by Tax Professionals
          </motion.div>

          {/* Main Heading */}
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Ready to Transform Your
            <span className="block bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
              Tax Workflow?
            </span>
          </h2>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            Join our community for accurate, 
            AI-powered tax calculations and comprehensive planning tools.
          </motion.p>

          {/* Feature Highlights */}
          {/* put back after beta version */}
          {/* <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-6 mb-12"
          >
            {features.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                  className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-3 
                             rounded-2xl border border-white/30"
                >
                  <IconComponent className="w-5 h-5 text-white" />
                  <span className="text-white font-medium text-sm">
                    {feature.text}
                  </span>
                </motion.div>
              )
            })}
          </motion.div> */}

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
          >
            <motion.a
              href="/income-tax-calculator"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group bg-white text-[#0F2F4E] px-8 py-4 rounded-2xl font-bold 
                         text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 
                         flex items-center gap-3 min-w-[200px] justify-center"
            >
              Start Calculating Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </motion.a>

            {/* <motion.a
              href="/demo"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group bg-white/20 backdrop-blur-sm text-white border border-white/30 
                         px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/30 
                         transition-all duration-300 flex items-center gap-3 min-w-[200px] justify-center"
            >
              Watch Demo
              <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-[#1ED760] rounded-full" />
              </div>
            </motion.a> */}
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="space-y-4"
          >
            <p className="text-gray-300 text-sm font-medium">
              No credit card required • Free forever plan • Setup in 2 minutes
            </p>

            {/* Social Proof */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-gray-300">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 bg-white rounded-full border-2 border-[#1ED760]"
                    />
                  ))}
                </div>
                <span className="text-sm font-medium">Join 2,500+ tax professionals</span>
              </div>

              <div className="hidden sm:block w-px h-6 bg-white/20" />

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="w-4 h-4 bg-white rounded-sm" />
                  ))}
                </div>
                <span className="text-sm font-medium">4.9/5 rating</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Floating Elements */}
      <motion.div
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-8 right-8 opacity-20"
      >
        <Calculator className="w-12 h-12 text-white" />
      </motion.div>

      <motion.div
        animate={{
          y: [0, 10, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
        className="absolute bottom-8 left-8 opacity-20"
      >
        <Zap className="w-10 h-10 text-white" />
      </motion.div>
    </section>
  )
}