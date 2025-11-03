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
    name: "Sarah T.",
    role: "Small Business Owner",
    quote: "As a small business owner, this platform has been invaluable. It's like having a tax expert on demand.",
    rating: 4,
    company: "Sarah's Boutique"
  },
  {
    name: "David L.",
    role: "Tax Consultant",
    quote: "I recommend this to all my clients. The accuracy and ease of use are unmatched in the market.",
    rating: 5,
    company: "DL Tax Advisory"
  },
  {
    name: "Lisa M.",
    role: "Startup Founder",
    quote: "The comprehensive tax planning suite helped us optimize our tax strategy from day one. Game changer!",
    rating: 5,
    company: "InnovateTech Startup"
  }
]

const StarRating = ({ rating }) => {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'
          }`}
        />
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

  const goToPage = (index) => {
    setDirection(index > currentIndex ? 1 : -1)
    setCurrentIndex(index)
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

  // Fixed variants without TypeScript annotations
  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0
    })
  }

  return (
    <section className="mb-20 py-16 bg-gradient-to-br from-gray-800/20 to-gray-900/40 rounded-3xl">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-lime-400 mb-4">
            Trusted by Professionals
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            See what tax professionals, business owners, and finance experts are saying about our platform
          </p>
        </motion.div>

        {/* Testimonials Carousel */}
        <div className="relative max-w-6xl mx-auto">
          {/* Navigation Arrows */}
          <button
            onClick={prevTestimonial}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 
                       p-3 bg-gray-800/80 backdrop-blur-sm rounded-full border border-lime-400/30 
                       text-lime-400 hover:bg-lime-400 hover:text-gray-900 transition-all duration-300 
                       shadow-lg hover:shadow-lime-400/25"
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={nextTestimonial}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 
                       p-3 bg-gray-800/80 backdrop-blur-sm rounded-full border border-lime-400/30 
                       text-lime-400 hover:bg-lime-400 hover:text-gray-900 transition-all duration-300 
                       shadow-lg hover:shadow-lime-400/25"
          >
            <ChevronRight size={24} />
          </button>

          {/* Testimonials Grid */}
          <div className="overflow-hidden">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                {currentTestimonials.map((testimonial, idx) => (
                  <motion.div
                    key={`${currentIndex}-${idx}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="group p-8 bg-gray-800/40 rounded-2xl border border-gray-700/50 
                               hover:border-lime-400/30 hover:bg-gray-800/60 transition-all duration-500 
                               hover:transform hover:scale-105"
                  >
                    {/* Quote Icon */}
                    <div className="mb-4">
                      <Quote className="w-8 h-8 text-lime-400/60" />
                    </div>

                    {/* Rating */}
                    <div className="mb-4">
                      <StarRating rating={testimonial.rating} />
                    </div>

                    {/* Quote */}
                    <p className="text-gray-300 text-lg leading-relaxed mb-6 italic">
                      "{testimonial.quote}"
                    </p>

                    {/* Author Info */}
                    <div className="border-t border-gray-700/50 pt-4">
                      <h4 className="font-semibold text-white text-lg">
                        {testimonial.name}
                      </h4>
                      <p className="text-lime-400 text-sm mb-1">
                        {testimonial.role}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {testimonial.company}
                      </p>
                    </div>

                    {/* Hover Effect */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-lime-400/5 to-green-400/5 
                                    opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center mt-8 space-x-4">
            {/* Play/Pause */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2 bg-gray-800/80 backdrop-blur-sm rounded-full border border-lime-400/30 
                         text-lime-400 hover:bg-lime-400 hover:text-gray-900 transition-all duration-300"
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            </button>

            {/* Pagination Dots */}
            <div className="flex space-x-2">
              {[...Array(totalPages)].map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => goToPage(idx)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    currentIndex === idx 
                      ? 'bg-lime-400 scale-125' 
                      : 'bg-gray-600 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        {/* will put back stats after beta version */}
        {/* <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-8 border-t border-gray-700/50"
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-lime-400 mb-2">500+</div>
            <div className="text-gray-400 text-sm">Active Users</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-lime-400 mb-2">99.8%</div>
            <div className="text-gray-400 text-sm">Accuracy Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-lime-400 mb-2">4.9/5</div>
            <div className="text-gray-400 text-sm">User Rating</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-lime-400 mb-2">24/7</div>
            <div className="text-gray-400 text-sm">AI Support</div>
          </div>
        </motion.div> */}
      </div>
    </section>
  )
}