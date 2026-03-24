"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Calculator, Sparkles, TrendingUp, Shield, ArrowRight, Play, Star, Zap, Target, ChevronDown, CheckCircle2, Users, Clock, Award } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  const [particles, setParticles] = useState([]);
  const [mounted, setMounted] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  useEffect(() => {
    setMounted(true);
    // Generate particle positions only on client
    const generated = Array.from({ length: 80 }).map(() => ({
      x: Math.random() * 2000 - 1000,
      y: Math.random() * 1600 - 800,
      delay: Math.random() * 8,
      duration: 20 + Math.random() * 25,
      size: 1 + Math.random() * 8,
      opacity: 0.05 + Math.random() * 0.3,
    }));
    setParticles(generated);

    // Auto-rotate features
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % 3);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const features = [
    { icon: TrendingUp, text: "AI-Powered Accuracy", description: "99.9% calculation precision", color: "from-[#1ED760] to-[#0F2F4E]" },
    { icon: Shield, text: "Bank-Level Security", description: "256-bit encryption", color: "from-[#FFD700] to-[#1ED760]" },
    { icon: Zap, text: "Real-time Calculations", description: "Instant results", color: "from-[#0F2F4E] to-[#1ED760]" }
  ];

  const floatingShapes = [
    { icon: Calculator, delay: 0, duration: 12, x: "5%", y: "15%", size: 48 },
    { icon: Star, delay: 2, duration: 14, x: "88%", y: "10%", size: 32 },
    { icon: Target, delay: 4, duration: 10, x: "12%", y: "85%", size: 40 },
    { icon: Sparkles, delay: 6, duration: 16, x: "92%", y: "80%", size: 36 },
    { icon: Users, delay: 1, duration: 13, x: "78%", y: "70%", size: 28 },
    { icon: Clock, delay: 3, duration: 11, x: "20%", y: "25%", size: 30 },
  ];

  const stats = [
    { value: "50K+", label: "Active Users", icon: Users },
    { value: "99.9%", label: "Accuracy Rate", icon: CheckCircle2 },
    { value: "24/7", label: "Support", icon: Award },
  ];

  if (!mounted) {
    return (
      <section className="relative flex flex-col items-center justify-center min-h-screen text-center px-6 bg-gradient-to-br from-white via-gray-50 to-white">
        <div className="animate-pulse">
          <div className="h-12 bg-gray-200 rounded-full w-96 mx-auto mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-80 mx-auto mb-8"></div>
          <div className="flex gap-4 justify-center">
            <div className="h-12 bg-gray-200 rounded-full w-32"></div>
            <div className="h-12 bg-gray-200 rounded-full w-32"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <motion.section 
      style={{ opacity, scale }}
      className="relative flex flex-col items-center justify-center min-h-screen text-center px-6 bg-gradient-to-br from-white via-gray-50/30 to-white overflow-hidden"
    >
      {/* Elegant Radial Gradient Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#1ED760]/10 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-[#0F2F4E]/5 via-transparent to-transparent" />
      </div>
      
      {/* Sophisticated Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(#0F2F4E 0.5px, transparent 0.5px),
                             linear-gradient(90deg, #0F2F4E 0.5px, transparent 0.5px)`,
            backgroundSize: '80px 80px',
          }}
        />
      </div>

      {/* Animated Gradient Orbs */}
      <motion.div
        className="absolute top-1/4 -left-48 w-96 h-96 rounded-full bg-gradient-to-r from-[#1ED760]/20 to-transparent blur-3xl"
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute bottom-1/4 -right-48 w-96 h-96 rounded-full bg-gradient-to-l from-[#0F2F4E]/20 to-transparent blur-3xl"
        animate={{
          x: [0, -100, 0],
          y: [0, -50, 0],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      />

      {/* Floating Particles - Enhanced */}
      {particles.map((p, idx) => (
        <motion.div
          key={idx}
          className="absolute rounded-full bg-gradient-to-r from-[#1ED760] to-[#0F2F4E]"
          style={{ 
            width: p.size, 
            height: p.size,
          }}
          initial={{ 
            x: p.x, 
            y: p.y,
            opacity: 0,
          }}
          animate={{
            x: [p.x, p.x + Math.random() * 500 - 250, p.x + Math.random() * 500 - 250, p.x],
            y: [p.y, p.y + Math.random() * 500 - 250, p.y + Math.random() * 500 - 250, p.y],
            opacity: [0, p.opacity, p.opacity, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            repeatType: "loop",
            delay: p.delay,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Floating Icons - Enhanced */}
      {floatingShapes.map((shape, idx) => {
        const IconComponent = shape.icon;
        return (
          <motion.div
            key={idx}
            className="absolute text-[#1ED760]/5"
            style={{
              left: shape.x,
              top: shape.y,
            }}
            initial={{ opacity: 0, scale: 0, rotate: -180 }}
            animate={{ 
              opacity: [0, 0.15, 0],
              scale: [0, 1, 0],
              rotate: [0, 180, 360],
              y: [0, -40, 0]
            }}
            transition={{
              duration: shape.duration,
              repeat: Infinity,
              delay: shape.delay,
              ease: "easeInOut"
            }}
          >
            <IconComponent size={shape.size} strokeWidth={0.8} />
          </motion.div>
        );
      })}

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto mt-20">
        {/* Elegant Badge */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex justify-center mb-8"
        >
          <div className="group relative inline-flex items-center gap-2 bg-white/80 backdrop-blur-md border border-gray-200 
                         px-5 py-2.5 rounded-full text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300">
            <motion.div
              className="absolute inset-0 rounded-full bg-gradient-to-r from-[#1ED760]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />
            <Sparkles className="w-4 h-4 text-[#1ED760] relative z-10" />
            <span className="text-[#0F2F4E] relative z-10">
              Join the community{" "}
              <Link 
                href="https://chat.whatsapp.com/E7EEyNwLl9MGkijENxR3Kq" 
                className="text-[#1ED760] hover:underline font-semibold"
                target="_blank"
              >
                here
              </Link>
            </span>
          </div>
        </motion.div>

        {/* Main Heading with refined animation */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-3"
        >
          <motion.h1 
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <span className="bg-gradient-to-r from-[#1ED760] via-[#0F2F4E] to-[#1ED760] bg-clip-text text-transparent inline-block">
              Smart Tax
            </span>
            <br />
            <span className="bg-gradient-to-r from-[#0F2F4E] via-[#1ED760] to-[#0F2F4E] bg-clip-text text-transparent inline-block">
              Calculator
            </span>
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Simplify Your Finances
          </motion.p>
        </motion.div>

        {/* Enhanced Subtitle with gradient border */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="relative mt-8"
        >
          <div className="relative max-w-3xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#1ED760]/10 to-transparent rounded-2xl blur-xl" />
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed px-4 py-6 relative">
              AI-powered tax calculations platform for individuals, businesses, and tax professionals in
              <span className="relative inline-block mx-1">
                <motion.span 
                  className="absolute inset-0 bg-[#1ED760]/20 rounded-full blur-md"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="relative text-[#1ED760] font-semibold">Zimbabwe.</span>
              </span>
              Guaranteed compliance accurately and quickly.
            </p>
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="grid grid-cols-3 gap-4 md:gap-8 max-w-2xl mx-auto mt-12 mb-16"
        >
          {stats.map((stat, idx) => {
            const IconComponent = stat.icon;
            return (
              <motion.div
                key={idx}
                className="text-center"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex justify-center mb-2">
                  <div className="p-2 bg-gradient-to-br from-[#1ED760]/10 to-[#0F2F4E]/10 rounded-full">
                    <IconComponent className="w-5 h-5 text-[#1ED760]" />
                  </div>
                </div>
                <div className="text-2xl md:text-3xl font-bold text-[#0F2F4E]">{stat.value}</div>
                <div className="text-xs md:text-sm text-gray-500">{stat.label}</div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Rotating Feature Highlight - Enhanced */}
        <motion.div
          key={currentFeature}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="group relative bg-gradient-to-r from-white via-white to-white/90 
                         backdrop-blur-sm px-6 py-5 rounded-2xl border border-gray-200 
                         shadow-xl hover:shadow-2xl transition-all duration-300 max-w-md mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-[#1ED760]/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="flex items-center justify-center gap-4 relative">
              <div className={`p-3 bg-gradient-to-r ${features[currentFeature].color} rounded-xl text-white shadow-lg`}>
                {(() => {
                  const IconComponent = features[currentFeature].icon;
                  return <IconComponent size={24} />;
                })()}
              </div>
              <div className="text-left">
                <div className="text-[#0F2F4E] font-bold text-lg">
                  {features[currentFeature].text}
                </div>
                <div className="text-gray-500 text-sm">
                  {features[currentFeature].description}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Refined Feature Dots Indicator */}
        <div className="flex justify-center gap-2 mb-12">
          {features.map((_, index) => (
            <motion.button
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentFeature 
                  ? 'bg-[#1ED760] w-8' 
                  : 'bg-gray-300 w-2 hover:bg-gray-400'
              }`}
              whileHover={{ scale: 1.2 }}
              onClick={() => setCurrentFeature(index)}
            />
          ))}
        </div>

        {/* Enhanced CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="flex flex-col sm:flex-row gap-5 justify-center items-center mb-24"
        >
          <motion.a
            href="/income-tax-calculator"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="group relative bg-gradient-to-r from-[#1ED760] to-[#1ED760]/80 
                       text-white px-8 py-4 rounded-full font-bold text-lg shadow-xl 
                       transition-all duration-300 flex items-center gap-3 overflow-hidden"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{ x: [-150, 300] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
            />
            <Calculator className="w-5 h-5 relative z-10" />
            <span className="relative z-10">Start Calculating Free</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200 relative z-10" />
          </motion.a>

          <motion.a
            href="#features"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="group bg-white/90 backdrop-blur-sm text-[#0F2F4E] border border-gray-200 
                       px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 
                       flex items-center gap-3 shadow-lg hover:shadow-xl hover:border-[#1ED760]/30"
          >
            <Play className="w-5 h-5 group-hover:text-[#1ED760] transition-colors" />
            <span>Watch Demo</span>
          </motion.a>
        </motion.div>
      </div>

      {/* Enhanced Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.8 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center text-gray-400 cursor-pointer group"
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
        >
          <span className="text-xs mb-2 group-hover:text-[#1ED760] transition-colors">Explore</span>
          <ChevronDown className="w-5 h-5 group-hover:text-[#1ED760] transition-colors" />
        </motion.div>
      </motion.div>
    </motion.section>
  );
}