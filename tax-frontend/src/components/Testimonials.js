'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, Quote, ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react'

const testimonials = [
  {
    name: "Tawona R.",
    role: "Project Manager",
    quote: "This calculator saved me hours every month. It's accurate and easy to use!",
    rating: 5,
    company: "Code Mafia Org"
  },
  {
    name: "Chirwa K.",
    role: "Freelance Accountant",
    quote: "I finally understand my taxes. The interface is clean and straightforward. The AI suggestions are incredibly helpful!",
    rating: 5,
    company: "Independent Consultant"
  },
  {
    name: "Moyo M.",
    role: "Finance Director",
    quote: "The best tool I've used for tax calculations. Highly recommended for any business serious about tax compliance.",
    rating: 5,
    company: "Global Enterprises Inc"
  },
  {
    name: "Sarah J.",
    role: "Small Business Owner",
    quote: "Revolutionary tool that simplified my tax planning completely.",
    rating: 5,
    company: "Sarah's Boutique"
  },
  {
    name: "David L.",
    role: "Tax Consultant",
    quote: "The accuracy and speed of calculations are unmatched in the market.",
    rating: 5,
    company: "TaxPro Associates"
  },
  {
    name: "Lisa M.",
    role: "Financial Analyst",
    quote: "Essential tool for any finance professional working in Zimbabwe.",
    rating: 5,
    company: "Wealth Management Corp"
  }
];

const StarRating = ({ rating }) => {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: i * 0.1, type: "spring", stiffness: 100 }}
        >
          <Star
            className={`w-4 h-4 ${
              i < rating ? 'text-[#FFD700] fill-[#FFD700]' : 'text-[#0F2F4E]/40'
            }`}
          />
        </motion.div>
      ))}
    </div>
  )
}

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [direction, setDirection] = useState(0)

  const itemsPerPage = 3
  const totalPages = Math.ceil(testimonials.length / itemsPerPage)

  const nextTestimonial = () => {
    setDirection(1)
    setCurrentIndex((prev) => (prev + 1) % totalPages)
  }

  const prevTestimonial = () => {
    setDirection(-1)
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages)
  }

  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(nextTestimonial, 5000)
    return () => clearInterval(interval)
  }, [isPlaying, currentIndex])

  const currentTestimonials = testimonials.slice(
    currentIndex * itemsPerPage,
    (currentIndex + 1) * itemsPerPage
  )

  return (
    <section className="py-20 bg-[#0F2F4E] rounded-2xl">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.h2 
            className="text-4xl md:text-5xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Trusted by Professionals
          </motion.h2>
          <motion.p 
            className="text-xl text-white/80 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            See what tax professionals, business owners, and finance experts are saying about our platform
          </motion.p>
        </motion.div>

        {/* Testimonials Carousel */}
        <div className="relative max-w-6xl mx-auto">
          {/* Navigation Arrows */}
          <motion.button
            onClick={prevTestimonial}
            whileHover={{ scale: 1.1, x: -2 }}
            whileTap={{ scale: 0.95 }}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 
                       p-3 bg-white shadow-2xl border border-[#FFD700] rounded-full
                       text-[#1ED760] hover:bg-[#1ED760] hover:text-white transition-all duration-300"
          >
            <ChevronLeft size={24} />
          </motion.button>

          <motion.button
            onClick={nextTestimonial}
            whileHover={{ scale: 1.1, x: 2 }}
            whileTap={{ scale: 0.95 }}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 
                       p-3 bg-white shadow-2xl border border-[#FFD700] rounded-full
                       text-[#1ED760] hover:bg-[#1ED760] hover:text-white transition-all duration-300"
          >
            <ChevronRight size={24} />
          </motion.button>

          {/* Testimonials Grid */}
          <div className="overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <AnimatePresence mode="wait" custom={direction}>
                {currentTestimonials.map((testimonial, idx) => (
                  <motion.div
                    key={`${currentIndex}-${idx}`}
                    custom={direction}
                    initial={{ 
                      opacity: 0, 
                      x: direction > 0 ? 100 : -100,
                      scale: 0.8
                    }}
                    animate={{ 
                      opacity: 1, 
                      x: 0,
                      scale: 1
                    }}
                    exit={{ 
                      opacity: 0,
                      x: direction > 0 ? -100 : 100,
                      scale: 0.8
                    }}
                    transition={{ 
                      duration: 0.6, 
                      delay: idx * 0.1,
                      type: "spring",
                      stiffness: 100
                    }}
                    whileHover={{ 
                      y: -10,
                      transition: { duration: 0.3, ease: "easeOut" }
                    }}
                    className="group relative p-8 bg-white/10 backdrop-blur-sm rounded-2xl border border-[#FFD700]/30
                               hover:border-[#1ED760] hover:bg-white/15 transition-all duration-500 
                               hover:shadow-2xl overflow-hidden"
                  >
                    {/* Animated Background Glow */}
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-br from-[#1ED760]/10 to-[#FFD700]/10 opacity-0 group-hover:opacity-100"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    />

                    {/* Quote Icon */}
                    <motion.div 
                      className="mb-6"
                      whileHover={{ scale: 1.2, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Quote className="w-10 h-10 text-[#1ED760]" />
                    </motion.div>

                    {/* Rating */}
                    <div className="mb-6">
                      <StarRating rating={testimonial.rating} />
                    </div>

                    {/* Quote */}
                    <motion.p 
                      className="text-white text-lg leading-relaxed mb-8 italic"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                    >
                      "{testimonial.quote}"
                    </motion.p>

                    {/* Author Info */}
                    <motion.div 
                      className="border-t border-white/20 pt-6"
                      initial={{ opacity: 0.8 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h4 className="font-semibold text-white text-xl mb-2">
                        {testimonial.name}
                      </h4>
                      <motion.p 
                        className="text-[#1ED760] text-base mb-2 font-medium"
                        whileHover={{ x: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        {testimonial.role}
                      </motion.p>
                      <p className="text-white/70 text-sm">
                        {testimonial.company}
                      </p>
                    </motion.div>

                    {/* Floating Elements Animation */}
                    <motion.div
                      className="absolute top-4 right-4 w-2 h-2 bg-[#FFD700] rounded-full"
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.5, 1, 0.5]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: idx * 0.5
                      }}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center mt-12 space-x-6">
            {/* Play/Pause */}
            <motion.button
              onClick={() => setIsPlaying(!isPlaying)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-3 bg-white/10 backdrop-blur-sm shadow-lg border border-[#FFD700] rounded-full
                         text-white hover:bg-[#1ED760] hover:text-white transition-all duration-300"
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </motion.button>

            {/* Pagination Dots */}
            <div className="flex space-x-3">
              {[...Array(totalPages)].map((_, idx) => (
                <motion.button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  whileHover={{ scale: 1.3 }}
                  whileTap={{ scale: 0.8 }}
                  className={`w-4 h-4 rounded-full transition-all duration-300 ${
                    currentIndex === idx 
                      ? 'bg-[#1ED760] shadow-lg shadow-[#1ED760]/50' 
                      : 'bg-white/30 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Animated Background Pattern */}
          <motion.div 
            className="absolute inset-0 -z-10 opacity-10"
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%']
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, #1ED760 2px, transparent 0),
                                radial-gradient(circle at 75% 75%, #FFD700 1px, transparent 0)`,
              backgroundSize: '50px 50px'
            }}
          />
        </div>

        {/* Stats Section */}
        {/* <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 pt-12 border-t border-white/20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {[
            { number: "500+", label: "Happy Professionals" },
            { number: "98%", label: "Satisfaction Rate" },
            { number: "4.9/5", label: "Average Rating" }
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="text-center"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                className="text-3xl md:text-4xl font-bold text-[#1ED760] mb-2"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.5 }}
              >
                {stat.number}
              </motion.div>
              <div className="text-white/80 text-lg">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div> */}
      </div>
    </section>
  )
}