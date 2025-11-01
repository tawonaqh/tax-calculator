"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calculator, Sparkles, TrendingUp, Shield, ArrowRight, Play } from "lucide-react";

export default function Hero() {
  const [particles, setParticles] = useState([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Generate particle positions only on client
    const generated = Array.from({ length: 40 }).map(() => ({
      x: Math.random() * 2000 - 1000,
      y: Math.random() * 1600 - 800,
      delay: Math.random() * 8,
      duration: 15 + Math.random() * 20,
      size: 2 + Math.random() * 8,
      opacity: 0.1 + Math.random() * 0.3,
    }));
    setParticles(generated);
  }, []);

  const features = [
    { icon: TrendingUp, text: "AI-Powered Accuracy" },
    { icon: Shield, text: "Bank-Level Security" },
    { icon: Sparkles, text: "Real-time Calculations" }
  ];

  if (!mounted) {
    return (
      <section className="relative flex flex-col items-center justify-center min-h-screen text-center px-6 bg-gradient-to-br from-gray-900 via-gray-950 to-black">
        <div className="animate-pulse">
          <div className="h-12 bg-gray-700 rounded-lg w-96 mx-auto mb-4"></div>
          <div className="h-6 bg-gray-700 rounded w-80 mx-auto mb-8"></div>
          <div className="flex gap-4 justify-center">
            <div className="h-12 bg-gray-700 rounded-lg w-32"></div>
            <div className="h-12 bg-gray-700 rounded-lg w-32"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen text-center px-6 bg-gradient-to-br from-gray-900 via-gray-950 to-black overflow-hidden">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-lime-400/5 via-transparent to-cyan-400/5" />
      
      {/* Floating Particles */}
      {particles.map((p, idx) => (
        <motion.div
          key={idx}
          className="absolute rounded-full bg-gradient-to-r from-lime-400/40 to-cyan-400/40 backdrop-blur-sm"
          style={{ 
            width: p.size, 
            height: p.size,
            filter: "blur(1px)"
          }}
          initial={{ 
            x: p.x, 
            y: p.y,
            opacity: 0 
          }}
          animate={{
            x: [p.x, p.x + Math.random() * 800 - 400, p.x],
            y: [p.y, p.y + Math.random() * 800 - 400, p.y],
            opacity: [0, p.opacity, 0],
            scale: [0, 1, 0]
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

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto mt-20">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 bg-lime-400/10 backdrop-blur-sm border border-lime-400/20 
                     px-4 py-2 rounded-full text-lime-400 text-sm font-medium mb-8"
        >
          <Sparkles className="w-4 h-4" />
          Trusted by 2,500+ Tax Professionals
        </motion.div>

        {/* Main Heading */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            <span className="bg-gradient-to-r from-lime-400 via-white to-cyan-400 bg-clip-text text-transparent">
              Smart Tax Calculator
            </span>
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-white to-lime-400 bg-clip-text text-transparent">
              to Simplify Your Finances
            </span>
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl md:text-2xl text-gray-300 mt-6 mb-8 max-w-3xl mx-auto leading-relaxed"
        >
          AI-powered tax calculations platform for individuals, businesses, and tax professionals in
           Zimbabwe. Guaranteed compliance accurately and quickly.
        </motion.p>

        {/* Feature Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-wrap justify-center gap-6 mb-12"
        >
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                className="flex items-center gap-3 bg-gray-800/40 backdrop-blur-sm px-4 py-3 
                           rounded-2xl border border-gray-700/50 hover:border-lime-400/30 
                           transition-all duration-300 group"
              >
                <div className="p-2 bg-lime-400/10 rounded-lg group-hover:scale-110 transition-transform duration-300">
                  <IconComponent className="w-5 h-5 text-lime-400" />
                </div>
                <span className="text-gray-300 font-medium text-sm group-hover:text-lime-300 transition-colors">
                  {feature.text}
                </span>
              </motion.div>
            );
          })}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-24"
        >
          <motion.a
            href="/income-tax-calculator"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group bg-lime-400 text-gray-900 px-8 py-4 rounded-2xl font-bold 
                       text-lg shadow-2xl hover:shadow-lime-400/25 transition-all duration-300 
                       flex items-center gap-3"
          >
            <Calculator className="w-6 h-6" />
            Start Calculating Free
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
          </motion.a>

          <motion.a
            href="#features"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group bg-gray-800/60 backdrop-blur-sm text-white border border-gray-600 
                       px-8 py-4 rounded-2xl font-bold text-lg hover:border-lime-400 
                       hover:text-lime-400 transition-all duration-300 flex items-center gap-3"
          >
            <Play className="w-5 h-5" />
            Watch Demo
          </motion.a>
        </motion.div>

        {/* Trust Indicators */}
        {/* <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="text-center"
        >
          <p className="text-gray-400 text-sm mb-4">
            Used by leading accounting firms and businesses
          </p>
          <div className="flex justify-center items-center gap-8 opacity-60"> */}
            {/* Placeholder for trust logos - you can replace with actual logos */}
            {/* <div className="h-8 w-8 bg-gray-600 rounded-lg"></div>
            <div className="h-8 w-8 bg-gray-600 rounded-lg"></div>
            <div className="h-8 w-8 bg-gray-600 rounded-lg"></div>
            <div className="h-8 w-8 bg-gray-600 rounded-lg"></div>
          </div>
        </motion.div> */}
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-2 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center text-gray-400"
        >
          <span className="text-sm mb-2">Scroll to explore</span>
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-3 bg-gray-400 rounded-full mt-2"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}