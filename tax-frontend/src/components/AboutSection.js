'use client'

import { motion } from 'framer-motion'
import { User, Target, Heart, Lightbulb, Shield, Users, Rocket, Mail } from 'lucide-react'

export default function AboutSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-[#0F2F4E] via-[#1a3d63] to-[#0F2F4E] rounded-2xl">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            className="flex items-center justify-center gap-6 mb-8"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, type: "spring" }}
          >
            <div className="p-4 bg-gradient-to-br from-[#1ED760] to-[#0F2F4E] rounded-3xl shadow-2xl shadow-[#1ED760]/25">
              <User className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              About TaxCul
            </h1>
          </motion.div>
          <motion.p 
            className="text-xl text-white/80 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Building Tax Culture Through Technology, Education, and Community
          </motion.p>
        </motion.div>

        {/* Leadership & Mission Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Leadership Profile */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            whileHover={{ y: -5 }}
            className="bg-white/10 backdrop-blur-sm rounded-3xl border border-[#FFD700]/30 p-8 hover:shadow-2xl hover:shadow-[#1ED760]/10 transition-all duration-500"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-gradient-to-br from-[#1ED760] to-[#0F2F4E] rounded-2xl">
                <User className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Leadership</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-[#1ED760] mb-2">Culverwell Venge</h3>
                <div className="inline-flex items-center gap-2 bg-[#1ED760]/20 text-[#1ED760] px-3 py-1 rounded-full text-sm font-medium mb-4 border border-[#1ED760]/30">
                  <Rocket className="w-3 h-3" />
                  Tax Innovation Lead
                </div>
              </div>
              
              <p className="text-white/80 leading-relaxed">
                Culverwell Venge is a licensed tax agent and public accountant.
                 As the tax innovation lead he is focused on advancing tax literacy, 
                 responsible digital adoption and stronger tax culture in Zimbabwe - 
                 grounded in clarity, capability, and community participation.
              </p>
            </div>
          </motion.div>

          {/* Mission & Approach */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* Mission */}
            <motion.div
              whileHover={{ y: -3 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl border border-[#FFD700]/30 p-6 hover:shadow-lg hover:shadow-[#1ED760]/10 transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-br from-[#1ED760] to-[#0F2F4E] rounded-xl">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white">Our Mission</h3>
              </div>
              <p className="text-white/80 text-sm leading-relaxed">
                To strengthen Zimbabwe’s tax culture by making tax knowledge accessible, practical, and empowering
                 — through technology, learning, and community participation.
              </p>
            </motion.div>

            {/* Vision */}
            <motion.div
              whileHover={{ y: -3 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl border border-[#FFD700]/30 p-6 hover:shadow-lg hover:shadow-[#1ED760]/10 transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-br from-[#1ED760] to-[#0F2F4E] rounded-xl">
                  <Lightbulb className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white">Our Vision</h3>
              </div>
              <p className="text-white/80 text-sm leading-relaxed">
                Building a trusted, supportive platform where Zimbabwean SMEs, professionals, 
                and students can build tax confidence and capability together, through accessible 
                learning, thoughtful planning tools, and a growing community committed to strengthening our tax culture.
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* Core Values */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-8">Our Approach</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Users,
                title: "Community First",
                description: "Building tax culture through shared learning and collective growth",
                color: "from-blue-500 to-cyan-500"
              },
              {
                icon: Shield,
                title: "Clarity & Transparency",
                description: "Making complex tax concepts accessible and understandable",
                color: "from-green-500 to-emerald-500"
              },
              {
                icon: Heart,
                title: "Education Focused",
                description: "Empowering through knowledge rather than enforcing through penalties",
                color: "from-purple-500 to-pink-500"
              }
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                whileHover={{ y: -5, scale: 1.05 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl border border-[#FFD700]/30 p-6 text-center hover:shadow-2xl hover:shadow-[#1ED760]/10 transition-all duration-500"
              >
                <div className={`w-14 h-14 bg-gradient-to-r ${value.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                  <value.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-bold text-white mb-3 text-lg">{value.title}</h3>
                <p className="text-white/70 text-sm leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Philosophy & Beta Notice */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Philosophy */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white/10 backdrop-blur-sm rounded-3xl border border-[#FFD700]/30 p-8 hover:shadow-2xl hover:shadow-[#1ED760]/10 transition-all duration-500"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-gradient-to-br from-[#1ED760] to-[#0F2F4E] rounded-2xl">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Our Philosophy</h2>
            </div>
            <div className="space-y-4 text-white/80 leading-relaxed">
              <p>
                Our work in tax advisory, finance, and SME development has shown that strong tax 
                culture does not start with penalties or pressure - it starts with clarity, 
                education, and community.
              </p>
              <p className="text-[#1ED760] font-semibold">
                We are building tax culture - with technology, with community, and with informed participation.
              </p>
            </div>
          </motion.div>

          {/* Beta Notice */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-gradient-to-r from-[#1ED760]/20 to-[#0F2F4E]/20 backdrop-blur-sm rounded-3xl border border-[#1ED760]/30 p-8 hover:shadow-2xl hover:shadow-[#1ED760]/10 transition-all duration-500"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-[#1ED760]/20 rounded-2xl border border-[#1ED760]/50">
                <Rocket className="w-6 h-6 text-[#1ED760]" />
              </div>
              <h2 className="text-2xl font-bold text-[#1ED760]">Beta Platform</h2>
            </div>
            <div className="space-y-4 text-white/80 leading-relaxed">
              <p>
                This beta platform is part of our journey: a space to explore tax scenarios, 
                build understanding, and support a more confident tax culture in Zimbabwe.
              </p>
              <p>
                This is an early demonstration available to a small test community. Your feedback 
                helps us refine and grow responsibly.
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="text-center mt-12"
        >
        </motion.div>
      </div>
    </section>
  )
}

// Compact version for smaller sections
export function CompactAbout() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white/10 backdrop-blur-sm rounded-2xl border border-[#FFD700]/30 p-6"
    >
      <div className="flex items-start gap-4">
        <div className="p-2 bg-gradient-to-br from-[#1ED760] to-[#0F2F4E] rounded-xl">
          <User className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-white mb-2">Culverwell Venge</h3>
          <p className="text-white/70 text-sm mb-2">
            Tax Innovation Lead, TaxCul Technology
          </p>
          <p className="text-white/60 text-xs leading-relaxed">
            Building tax culture through technology, education, and community. 
            This beta platform helps Zimbabwean businesses understand tax better and plan confidently.
          </p>
        </div>
      </div>
    </motion.div>
  )
}