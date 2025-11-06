"use client";

import { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import "swiper/css/effect-coverflow";
import { Autoplay, Navigation, EffectCoverflow } from "swiper/modules";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Play, Pause, Zap, Sparkles, ArrowRight } from "lucide-react";

const screenshots = [
  {
    src: "/screenshots/calc3.png",
    title: "Tax Planning Dashboard",
    description: "Comprehensive tax planning with real-time calculations",
    gradient: "from-[#1ED760] to-[#0F2F4E]",
    icon: "📊"
  },
  {
    src: "/screenshots/calc2.png",
    title: "Corporate Tax Calculator",
    description: "Advanced business tax computations",
    gradient: "from-[#FFD700] to-[#1ED760]",
    icon: "🏢"
  },
  {
    src: "/screenshots/calc1.png",
    title: "Individual Income Tax",
    description: "Personal tax planning and optimization",
    gradient: "from-[#0F2F4E] to-[#1ED760]",
    icon: "👤"
  }
];

export default function ShowcaseCarousel() {
  const [mounted, setMounted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [swiperInstance, setSwiperInstance] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleAutoplay = () => {
    if (swiperInstance) {
      if (isPlaying) {
        swiperInstance.autoplay.stop();
      } else {
        swiperInstance.autoplay.start();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const goNext = () => {
    if (swiperInstance) {
      swiperInstance.slideNext();
    }
  };

  const goPrev = () => {
    if (swiperInstance) {
      swiperInstance.slidePrev();
    }
  };

  // Floating particles effect
  const FloatingParticles = () => {
    const particles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 3 + Math.random() * 4,
      size: 4 + Math.random() * 8,
    }));

    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-gradient-to-r from-[#1ED760]/30 to-[#FFD700]/30"
            style={{
              width: particle.size,
              height: particle.size,
              left: `${particle.x}%`,
              top: `${particle.y}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              scale: [0, 1, 0],
              opacity: [0, 0.7, 0],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              repeatType: "loop",
              delay: particle.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    );
  };

  if (!mounted) {
    return (
      <section className="mb-20 py-16 bg-white rounded-2xl">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="h-8 bg-[#EEEEEE] rounded-lg w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-[#EEEEEE] rounded w-48 mx-auto animate-pulse"></div>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="aspect-video bg-[#EEEEEE] rounded-2xl animate-pulse"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white rounded-2xl relative overflow-hidden">
      {/* Animated Background Elements */}
      <FloatingParticles />
      
      {/* Floating Tax Elements */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          rotate: [0, 5, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-10 left-10 text-4xl opacity-10"
      >
        💰
      </motion.div>
      
      <motion.div
        animate={{
          y: [0, 15, 0],
          rotate: [0, -3, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
        className="absolute bottom-10 right-10 text-3xl opacity-10"
      >
        📈
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-[#1ED760]/10 px-6 py-3 rounded-full border border-[#1ED760]/20 mb-6"
          >
            <Sparkles className="w-5 h-5 text-[#1ED760]" />
            <span className="text-[#1ED760] font-semibold text-sm">Interactive Demo</span>
          </motion.div>
          
          <h2 className="text-5xl md:text-6xl font-bold text-[#0F2F4E] mb-6 leading-tight">
            See The <span className="bg-gradient-to-r from-[#1ED760] to-[#0F2F4E] bg-clip-text text-transparent">Magic</span> Unfold
          </h2>
          <p className="text-xl text-[#0F2F4E]/80 max-w-2xl mx-auto leading-relaxed">
            Experience our tax calculation platform through stunning interactive previews
          </p>
        </motion.div>

        <div className="relative max-w-6xl mx-auto" ref={containerRef}>
          {/* Enhanced Navigation Buttons */}
          <motion.button
            onClick={goPrev}
            whileHover={{ scale: 1.1, x: -5 }}
            whileTap={{ scale: 0.9 }}
            className="absolute top-1/2 -translate-y-1/2 -left-6 z-20 
                       p-4 bg-white shadow-2xl border-2 border-[#FFD700] rounded-full
                       text-[#1ED760] hover:bg-[#1ED760] hover:text-white 
                       transition-all duration-300 group"
          >
            <ChevronLeft size={28} />
            <motion.div
              className="absolute -inset-1 bg-[#1ED760]/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.button>

          <motion.button
            onClick={goNext}
            whileHover={{ scale: 1.1, x: 5 }}
            whileTap={{ scale: 0.9 }}
            className="absolute top-1/2 -translate-y-1/2 -right-6 z-20 
                       p-4 bg-white shadow-2xl border-2 border-[#FFD700] rounded-full
                       text-[#1ED760] hover:bg-[#1ED760] hover:text-white 
                       transition-all duration-300 group"
          >
            <ChevronRight size={28} />
            <motion.div
              className="absolute -inset-1 bg-[#1ED760]/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            />
          </motion.button>

          {/* Enhanced Swiper Carousel */}
          <div className="max-w-5xl mx-auto">
            <Swiper
              spaceBetween={40}
              slidesPerView={1.3}
              loop={true}
              centeredSlides={true}
              autoplay={isPlaying ? {
                delay: 5000,
                disableOnInteraction: false,
              } : false}
              navigation={false}
              effect="coverflow"
              coverflowEffect={{
                rotate: 0,
                stretch: -60,
                depth: 150,
                modifier: 3,
                slideShadows: true,
              }}
              modules={[Autoplay, Navigation, EffectCoverflow]}
              onSwiper={setSwiperInstance}
              onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
              breakpoints={{
                640: {
                  slidesPerView: 1.2,
                  spaceBetween: 30,
                },
                768: {
                  slidesPerView: 1.5,
                  spaceBetween: 40,
                },
                1024: {
                  slidesPerView: 1.8,
                  spaceBetween: 60,
                },
              }}
              style={{
                padding: "60px 0"
              }}
            >
              {screenshots.map((screenshot, idx) => (
                <SwiperSlide key={idx}>
                  {({ isActive }) => (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8, y: 50 }}
                      animate={{ 
                        opacity: isActive ? 1 : 0.6, 
                        scale: isActive ? 1 : 0.85,
                        y: isActive ? 0 : 20
                      }}
                      transition={{ duration: 0.7, type: "spring", stiffness: 100 }}
                      className="relative group"
                      onMouseEnter={() => setHoveredIndex(idx)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    >
                      {/* Glow Effect */}
                      <motion.div
                        className={`absolute -inset-4 bg-gradient-to-r ${screenshot.gradient} rounded-3xl opacity-0 blur-xl transition-opacity duration-500 ${
                          isActive ? 'opacity-20' : 'group-hover:opacity-10'
                        }`}
                        animate={{
                          scale: isActive ? [1, 1.05, 1] : 1,
                        }}
                        transition={{ duration: 3, repeat: Infinity }}
                      />
                      
                      <div className={`relative rounded-2xl overflow-hidden shadow-2xl transition-all duration-700 ${
                        isActive 
                          ? 'ring-4 ring-[#1ED760] shadow-2xl scale-105' 
                          : 'ring-2 ring-[#EEEEEE] shadow-lg'
                      } ${hoveredIndex === idx ? 'scale-102' : ''}`}>
                        {/* Image Container with Enhanced Styling */}
                        <div className="w-full h-full min-h-[450px] flex items-center justify-center bg-gradient-to-br from-[#0F2F4E]/5 to-[#1ED760]/5 relative">
                          <motion.img
                            src={screenshot.src}
                            alt={screenshot.title}
                            className="max-w-full max-h-full object-contain w-auto h-auto relative z-10"
                            style={{ 
                              width: 'auto', 
                              height: 'auto',
                              maxHeight: '450px'
                            }}
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.3 }}
                          />
                          
                          {/* Animated Icon */}
                          <motion.div
                            className="absolute top-4 right-4 text-2xl z-20"
                            animate={{
                              scale: [1, 1.2, 1],
                              rotate: [0, 10, 0],
                            }}
                            transition={{
                              duration: 3,
                              repeat: Infinity,
                              delay: idx * 0.5
                            }}
                          >
                            {screenshot.icon}
                          </motion.div>
                        </div>
                        
                        {/* Enhanced Overlay */}
                        <AnimatePresence>
                          {(isActive || hoveredIndex === idx) && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="absolute inset-0 bg-gradient-to-t from-[#0F2F4E]/90 via-[#0F2F4E]/50 to-transparent flex items-end p-8"
                            >
                              <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="text-center w-full"
                              >
                                <h3 className="text-2xl font-bold text-white mb-3">
                                  {screenshot.title}
                                </h3>
                                <p className="text-gray-200 text-lg mb-4">
                                  {screenshot.description}
                                </p>
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="inline-flex items-center gap-2 bg-[#1ED760] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#1ED760]/90 transition-all duration-300"
                                >
                                  Explore Feature
                                  <ArrowRight className="w-4 h-4" />
                                </motion.button>
                              </motion.div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  )}
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Enhanced Controls */}
          <div className="flex items-center justify-center mt-12 space-x-6">
            {/* Play/Pause Button with Animation */}
            <motion.button
              onClick={toggleAutoplay}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-4 bg-white shadow-xl border-2 border-[#FFD700] rounded-full
                         text-[#1ED760] hover:bg-[#1ED760] hover:text-white transition-all duration-300 relative"
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              {isPlaying && (
                <motion.div
                  className="absolute -inset-1 bg-[#1ED760]/20 rounded-full"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </motion.button>

            {/* Enhanced Slide Indicators */}
            <div className="flex space-x-3">
              {screenshots.map((_, idx) => (
                <motion.button
                  key={idx}
                  onClick={() => swiperInstance?.slideToLoop(idx)}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.8 }}
                  className={`relative rounded-full transition-all duration-300 ${
                    activeIndex === idx 
                      ? 'w-4 h-4 bg-[#1ED760] shadow-lg' 
                      : 'w-3 h-3 bg-[#EEEEEE] hover:bg-[#0F2F4E]/40'
                  }`}
                >
                  {activeIndex === idx && (
                    <motion.div
                      className="absolute -inset-1 bg-[#1ED760]/30 rounded-full"
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Enhanced Active Slide Info */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
              className="text-center mt-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 }}
                className="inline-flex items-center gap-2 bg-[#1ED760]/10 px-4 py-2 rounded-full mb-4"
              >
                <Zap className="w-4 h-4 text-[#1ED760]" />
                <span className="text-[#1ED760] text-sm font-medium">Currently Viewing</span>
              </motion.div>
              
              <h3 className="text-3xl font-bold text-[#0F2F4E] mb-3">
                {screenshots[activeIndex]?.title}
              </h3>
              <p className="text-[#0F2F4E]/80 text-lg max-w-md mx-auto leading-relaxed">
                {screenshots[activeIndex]?.description}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Enhanced Feature Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20"
        >
          {[
            { icon: "⚡", title: "Real-time Calculations", desc: "Instant results with live updates and AI-powered insights" },
            { icon: "🎯", title: "Smart Optimization", desc: "AI-driven tax optimization suggestions and planning" },
            { icon: "📊", title: "Professional Reports", desc: "Exportable, detailed tax computation reports" },
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="text-center p-8 bg-white rounded-2xl border-2 border-[#FFD700] shadow-xl hover:shadow-2xl transition-all duration-300 group"
            >
              <motion.div
                className="w-16 h-16 bg-gradient-to-br from-[#1ED760] to-[#0F2F4E] rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl text-white group-hover:scale-110 transition-transform duration-300"
                animate={{
                  rotate: [0, 5, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  delay: idx * 0.5
                }}
              >
                {feature.icon}
              </motion.div>
              <h4 className="font-bold text-[#0F2F4E] text-xl mb-3">{feature.title}</h4>
              <p className="text-[#0F2F4E]/70 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}