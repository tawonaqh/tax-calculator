"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calculator, Sparkles, TrendingUp, Shield, ArrowRight, Play, Star, Zap, Target } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  const [particles, setParticles] = useState([]);
  const [mounted, setMounted] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);

  useEffect(() => {
    setMounted(true);
    // Generate particle positions only on client
    const generated = Array.from({ length: 60 }).map(() => ({
      x: Math.random() * 2000 - 1000,
      y: Math.random() * 1600 - 800,
      delay: Math.random() * 8,
      duration: 15 + Math.random() * 20,
      size: 2 + Math.random() * 12,
      opacity: 0.1 + Math.random() * 0.4,
    }));
    setParticles(generated);

    // Auto-rotate features
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % 3);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const features = [
    { icon: TrendingUp, text: "AI-Powered Accuracy", color: "from-[#1ED760] to-[#0F2F4E]" },
    { icon: Shield, text: "Bank-Level Security", color: "from-[#FFD700] to-[#1ED760]" },
    { icon: Zap, text: "Real-time Calculations", color: "from-[#0F2F4E] to-[#1ED760]" }
  ];

  const floatingShapes = [
    { icon: Calculator, delay: 0, duration: 8, x: "10%", y: "20%" },
    { icon: Star, delay: 2, duration: 10, x: "85%", y: "15%" },
    { icon: Target, delay: 4, duration: 12, x: "15%", y: "80%" },
    { icon: Sparkles, delay: 6, duration: 9, x: "90%", y: "75%" },
  ];

  if (!mounted) {
    return (
      <section className="relative flex flex-col items-center justify-center min-h-screen text-center px-6 bg-white">
        <div className="animate-pulse">
          <div className="h-12 bg-gray-300 rounded-lg w-96 mx-auto mb-4"></div>
          <div className="h-6 bg-gray-300 rounded w-80 mx-auto mb-8"></div>
          <div className="flex gap-4 justify-center">
            <div className="h-12 bg-gray-300 rounded-lg w-32"></div>
            <div className="h-12 bg-gray-300 rounded-lg w-32"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen text-center px-6 bg-white overflow-hidden">
      {/* Animated Background Gradient */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-[#1ED760]/5 via-transparent to-[#1ED760]/5"
        animate={{
          background: [
            "linear-gradient(45deg, #1ED76005, transparent, #1ED76005)",
            "linear-gradient(135deg, #1ED76008, transparent, #1ED76008)",
            "linear-gradient(225deg, #1ED76005, transparent, #1ED76005)",
            "linear-gradient(315deg, #1ED76008, transparent, #1ED76008)",
            "linear-gradient(45deg, #1ED76005, transparent, #1ED76005)",
          ]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      />
      
      {/* Animated Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(#0F2F4E 1px, transparent 1px),
                             linear-gradient(90deg, #0F2F4E 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Floating Particles */}
      {particles.map((p, idx) => (
        <motion.div
          key={idx}
          className="absolute rounded-full bg-gradient-to-r from-[#1ED760]/20 to-[#1ED760]/10"
          style={{ 
            width: p.size, 
            height: p.size,
            filter: "blur(1px)"
          }}
          initial={{ 
            x: p.x, 
            y: p.y,
            opacity: 0,
            scale: 0
          }}
          animate={{
            x: [p.x, p.x + Math.random() * 400 - 200, p.x + Math.random() * 400 - 200, p.x],
            y: [p.y, p.y + Math.random() * 400 - 200, p.y + Math.random() * 400 - 200, p.y],
            opacity: [0, p.opacity, p.opacity, 0],
            scale: [0, 1, 1, 0],
            rotate: [0, 180, 360]
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

      {/* Floating Icons */}
      {floatingShapes.map((shape, idx) => {
        const IconComponent = shape.icon;
        return (
          <motion.div
            key={idx}
            className="absolute text-[#1ED760]/10"
            style={{
              left: shape.x,
              top: shape.y,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0, 0.3, 0],
              scale: [0, 1, 0],
              rotate: [0, 180, 360],
              y: [0, -30, 0]
            }}
            transition={{
              duration: shape.duration,
              repeat: Infinity,
              delay: shape.delay,
              ease: "easeInOut"
            }}
          >
            <IconComponent size={40} />
          </motion.div>
        );
      })}

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto mt-20">
        {/* Badge with pulse animation */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 bg-[#1ED760]/10 backdrop-blur-sm border border-[#1ED760]/20 
                     px-4 py-2 rounded-full text-[#1ED760] text-sm font-medium mb-8 relative"
        >
          <motion.div
            className="absolute inset-0 rounded-full bg-[#1ED760]/20"
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <Sparkles className="w-4 h-4 relative z-10" />
          <span className="relative z-10">Join the community <Link className="underline" href="https://chat.whatsapp.com/E7EEyNwLl9MGkijENxR3Kq">here</Link></span>
        </motion.div>

        {/* Main Heading with character animation */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            <motion.span 
              className="bg-gradient-to-r from-[#1ED760] to-[#0F2F4E] bg-clip-text text-transparent block"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Smart Tax Calculator
            </motion.span>
            <motion.span 
              className="bg-gradient-to-r from-[#0F2F4E] to-[#1ED760] bg-clip-text text-transparent block"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              to Simplify Your Finances
            </motion.span>
          </h1>
        </motion.div>

        {/* Animated Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="relative"
        >
          <p className="text-xl md:text-2xl text-[#0F2F4E]/80 mt-6 mb-8 max-w-3xl mx-auto leading-relaxed">
            AI-powered tax calculations platform for individuals, businesses, and tax professionals in
            <motion.span 
              className="text-[#1ED760] font-semibold mx-1"
              animate={{ color: ["#1ED760", "#0F2F4E", "#1ED760"] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              Zimbabwe
            </motion.span>
            . Guaranteed compliance accurately and quickly.
          </p>
        </motion.div>

        {/* Rotating Feature Highlight */}
        <motion.div
          key={currentFeature}
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -20 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="flex items-center justify-center gap-3 bg-gradient-to-r from-white to-white/80 backdrop-blur-sm 
                         px-6 py-4 rounded-2xl border border-[#FFD700] shadow-2xl max-w-md mx-auto">
            <div className={`p-2 bg-gradient-to-r ${features[currentFeature].color} rounded-lg text-white`}>
              {(() => {
                const IconComponent = features[currentFeature].icon;
                return <IconComponent size={20} />;
              })()}
            </div>
            <span className="text-[#0F2F4E] font-semibold text-lg">
              {features[currentFeature].text}
            </span>
          </div>
        </motion.div>

        {/* Feature Dots Indicator */}
        <div className="flex justify-center gap-2 mb-8">
          {features.map((_, index) => (
            <motion.button
              key={index}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentFeature ? 'bg-[#1ED760]' : 'bg-[#0F2F4E]/20'
              }`}
              whileHover={{ scale: 1.2 }}
              onClick={() => setCurrentFeature(index)}
              animate={{
                scale: index === currentFeature ? [1, 1.2, 1] : 1
              }}
              transition={{ duration: 2, repeat: index === currentFeature ? Infinity : 0 }}
            />
          ))}
        </div>

        {/* CTA Buttons with enhanced animations */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-24"
        >
          <motion.a
            href="/income-tax-calculator"
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 20px 40px rgba(30, 215, 96, 0.3)"
            }}
            whileTap={{ scale: 0.95 }}
            className="group relative bg-gradient-to-r from-[#1ED760] to-[#1ED760]/90 text-white 
                       px-8 py-4 rounded-xl font-bold text-lg shadow-2xl transition-all duration-300 
                       flex items-center gap-3 overflow-hidden"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{ x: [-100, 300] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 1 }}
            />
            <Calculator className="w-6 h-6 relative z-10" />
            <span className="relative z-10">Start Calculating Free</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200 relative z-10" />
          </motion.a>

          {/* <motion.a
            href="#features"
            whileHover={{ 
              scale: 1.05,
              borderColor: "#1ED760",
              color: "#1ED760"
            }}
            whileTap={{ scale: 0.95 }}
            className="group bg-white/80 backdrop-blur-sm text-[#0F2F4E] border border-[#0F2F4E]/20 
                       px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 
                       flex items-center gap-3 shadow-lg relative overflow-hidden"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-[#1ED760]/10 to-transparent"
              animate={{ x: [-100, 300] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            />
            <Play className="w-5 h-5 relative z-10" />
            <span className="relative z-10">Watch Demo</span>
          </motion.a> */}
        </motion.div>
      </div>

      {/* Enhanced Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center text-[#0F2F4E]/60 cursor-pointer group"
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
        >
          <span className="text-sm mb-2 group-hover:text-[#1ED760] transition-colors">Scroll to explore</span>
          <div className="w-6 h-10 border-2 border-[#0F2F4E]/40 rounded-full flex justify-center group-hover:border-[#1ED760] transition-colors">
            <motion.div
              animate={{ y: [0, 16, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1 h-3 bg-[#0F2F4E]/40 rounded-full mt-2 group-hover:bg-[#1ED760] transition-colors"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}