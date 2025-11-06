'use client'

import Link from "next/link";
import FAQ from "@/components/FAQ";
import TaxCalculatorPreview from "@/components/TaxCalculatorPreview";
import { 
  FaCalculator, 
  FaChartLine, 
  FaFileInvoiceDollar, 
  FaShieldAlt,
  FaRocket,
  FaLightbulb,
  FaUsers,
  FaGlobeAmericas,
  FaSeedling,
  FaUmbrella,
  FaHandHoldingUsd,
  FaHeartbeat
} from "react-icons/fa"; 
import { 
  FiTrendingUp, 
  FiZap, 
  FiAward,
  FiClock
} from "react-icons/fi";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import ContactForm from "@/components/ContactForm";
import CallToAction from "@/components/CallToAction";
import ShowcaseCarousel from "@/components/ShowcaseCarousel";
import Testimonials from "@/components/Testimonials";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Shield } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { Calculator } from "lucide-react";

// Client component wrapper for animated sections
const AnimatedSection = ({ children, className = "" }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.section>
  );
};

// Client component for staggered grid
const StaggerGrid = ({ children, className = "" }) => {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, threshold: 0.1 }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1
          }
        }
      }}
    >
      {children}
    </motion.div>
  );
};

// Client component for staggered items
const StaggerItem = ({ children }) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
};

export default function Home() {
  // Featured calculators (prominent display)
  const featuredCalculators = [
    { 
      href: "/income-tax-calculator", 
      label: "Tax Planning Suite", 
      description: "Comprehensive tax planning with AI assistance",
      icon: FaChartLine,
      featured: true
    },
    { 
      href: "/paye-calculator", 
      label: "PAYE Calculator", 
      description: "Employee income tax calculation",
      icon: FaUsers,
      featured: true
    },
    { 
      href: "/self-employment-tax-calculator", 
      label: "Individual Income Tax", 
      description: "Personal tax computation",
      icon: FaFileInvoiceDollar,
      featured: true
    }
  ];

  // All general calculators (complete list)
  const allCalculators = [
    { 
      href: "/corporate-tax-calculator", 
      label: "Corporate Tax", 
      description: "Business tax calculations",
      icon: FaShieldAlt,
    },
    { 
      href: "/vat-tax-calculator", 
      label: "VAT Calculator", 
      description: "Value Added Tax computations",
      icon: FaCalculator,
    },
    { 
      href: "/vat-imported-services", 
      label: "VAT Imported Services", 
      description: "VAT on imported services",
      icon: FaGlobeAmericas,
    },
    { 
      href: "/withholding-tax-royalties", 
      label: "Withholding Tax - Royalties", 
      description: "Tax on royalty payments",
      icon: FaHandHoldingUsd,
    },
    { 
      href: "/withholding-tax-fees", 
      label: "Withholding Tax - Fees", 
      description: "Tax on professional fees",
      icon: FaFileInvoiceDollar,
    },
    { 
      href: "/withholding-tax-interest", 
      label: "Withholding Tax - Interest", 
      description: "Tax on interest payments",
      icon: FaChartLine,
    },
    { 
      href: "/withholding-tax-tenders", 
      label: "Withholding Tax - Tenders", 
      description: "Tax on tender payments",
      icon: FaShieldAlt,
    },
    { 
      href: "/agriculture-tax", 
      label: "Agriculture Tax", 
      description: "Agricultural sector taxation",
      icon: FaSeedling,
    },
    { 
      href: "/insurance-tax", 
      label: "Insurance Tax", 
      description: "Insurance premium taxes",
      icon: FaUmbrella,
    },
    { 
      href: "/banking-finance-taxes", 
      label: "Financial Sector Tax", 
      description: "Banking and financial taxes",
      icon: FaHandHoldingUsd,
    },
    { 
      href: "/health-care-tax", 
      label: "Healthcare Tax", 
      description: "Medical and healthcare taxes",
      icon: FaHeartbeat,
    }
  ];

  const quickFeatures = [
    {
      icon: FiZap,
      title: "Lightning Fast",
      description: "Instant calculations with real-time results"
    },
    {
      icon: FiTrendingUp,
      title: "Improved Accuracy",
      description: "Updated with latest tax laws and rates"
    },
    {
      icon: FaLightbulb,
      title: "AI Powered",
      description: "Smart suggestions and optimization tips"
    },
    {
      icon: FiClock,
      title: "Time Saving",
      description: "Automate complex tax computations"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#EEEEEE] text-[#0F2F4E]">
      <Header />
      
      {/* Main */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-white">
          <div className="absolute inset-0 bg-gradient-to-r from-[#1ED760]/10 to-[#1ED760]/5"></div>
          <Hero />
        </section>

        {/* Quick Features */}
        <AnimatedSection className="py-20 bg-gradient-to-br from-[#0F2F4E] via-[#0F2F4E] to-[#1a3a5f] relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-10 left-10 w-20 h-20 bg-[#1ED760] rounded-full blur-xl"></div>
            <div className="absolute top-40 right-20 w-16 h-16 bg-[#FFD700] rounded-full blur-xl"></div>
            <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-[#1ED760] rounded-full blur-xl"></div>
          </div>
          
          <div id="features" className="max-w-6xl mx-auto px-6 relative z-10">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1ED760]/10 border border-[#1ED760]/30 mb-6"
              >
                <Shield className="w-4 h-4 text-[#1ED760]" />
                <span className="text-[#1ED760] text-sm font-medium">Trusted & Secure</span>
              </motion.div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Why Choose Our <span className="text-[#1ED760]">Tax Calculator</span>?
              </h2>
              <motion.p 
                className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                Time to ditch complicated tax calculations and confusion. Our Smart Tax Calculator is built to make your life easier. 
                In just a few clicks, you'll get clear results you can trust, helping you plan better and make confident financial decisions.
              </motion.p>
              
              {/* Trust Badges */}
              <motion.div 
                className="flex flex-wrap justify-center gap-6 mt-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="flex items-center gap-2 text-white/70 text-sm">
                  <div className="w-2 h-2 bg-[#1ED760] rounded-full"></div>
                  All Calculations Secured & Encrypted
                </div>
                <div className="flex items-center gap-2 text-white/70 text-sm">
                  <div className="w-2 h-2 bg-[#1ED760] rounded-full"></div>
                  Real-time Zimbabwe Tax Updates
                </div>
                <div className="flex items-center gap-2 text-white/70 text-sm">
                  <div className="w-2 h-2 bg-[#1ED760] rounded-full"></div>
                  Professional Grade Accuracy
                </div>
              </motion.div>
            </motion.div>

            <StaggerGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {quickFeatures.map((feature, index) => (
                <StaggerItem key={index}>
                  <motion.div 
                    className="group relative p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 
                            hover:border-[#1ED760]/30 hover:bg-white/10 transition-all duration-500 
                            hover:transform hover:scale-105 cursor-pointer overflow-hidden"
                    whileHover={{ 
                      y: -8,
                      transition: { duration: 0.3, ease: "easeOut" }
                    }}
                  >
                    {/* Hover Effect Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#1ED760]/5 to-transparent opacity-0 
                                group-hover:opacity-100 transition-all duration-500"></div>
                    
                    {/* Animated Border */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#1ED760] to-[#FFD700] opacity-0 
                                group-hover:opacity-100 transition-all duration-500 blur-sm group-hover:blur-0"></div>
                    <div className="absolute inset-[1px] rounded-2xl bg-gradient-to-br from-[#0F2F4E] to-[#1a3a5f]"></div>
                    
                    <div className="relative z-10">
                      {/* Icon Container with Enhanced Animation */}
                      <motion.div 
                        className="flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-[#1ED760] to-[#1ED760]/80 
                                text-white mb-6 group-hover:from-white group-hover:to-white group-hover:text-[#1ED760]
                                shadow-lg shadow-[#1ED760]/25 group-hover:shadow-xl group-hover:shadow-[#1ED760]/40
                                transition-all duration-500"
                        whileHover={{ 
                          rotate: [0, -5, 5, 0],
                          transition: { duration: 0.5 }
                        }}
                      >
                        <feature.icon className="w-6 h-6" />
                      </motion.div>
                      
                      {/* Feature Text */}
                      <motion.h3 
                        className="text-xl font-bold text-white mb-3 group-hover:text-[#1ED760] transition-colors duration-300"
                        whileHover={{ x: 5 }}
                      >
                        {feature.title}
                      </motion.h3>
                      
                      <motion.p 
                        className="text-white/70 leading-relaxed text-sm group-hover:text-white/90 transition-colors duration-300"
                        whileHover={{ x: 5 }}
                      >
                        {feature.description}
                      </motion.p>
                      
                      {/* Animated Arrow */}
                      <motion.div 
                        className="mt-4 text-[#1ED760] opacity-0 group-hover:opacity-100 transition-all duration-300"
                        whileHover={{ x: 5 }}
                      >
                        <ArrowRight className="w-5 h-5" />
                      </motion.div>
                    </div>
                    
                    {/* Floating Particles */}
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200">
                      <div className="flex gap-1">
                        {[1, 2, 3].map((dot) => (
                          <motion.div
                            key={dot}
                            className="w-1 h-1 bg-[#1ED760] rounded-full"
                            animate={{
                              y: [0, -4, 0],
                              opacity: [0.5, 1, 0.5],
                            }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                              delay: dot * 0.2,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerGrid>
            
            {/* Bottom CTA */}
            <motion.div 
              className="text-center mt-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Link
                href="#calculator-cards"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#1ED760] to-[#1ED760]/90 
                            text-white rounded-xl font-semibold shadow-lg shadow-[#1ED760]/25 
                            hover:shadow-xl hover:shadow-[#1ED760]/40 transition-all duration-300 cursor-pointer"
                >
                  <Calculator className="w-5 h-5" />
                  Start Calculating Now
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              </Link>
              
              <p className="text-white/60 text-sm mt-4">
                Join thousands of professionals who trust our tax calculations
              </p>
            </motion.div>
          </div>
        </AnimatedSection>

        {/* Featured Calculators */}
        <AnimatedSection className="py-16 bg-[#EEEEEE]">
          <div id="calculator-cards" className="max-w-6xl mx-auto px-6">
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <motion.h2 
                className="text-3xl md:text-4xl font-bold text-[#0F2F4E] mb-4"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Try Our Top Featured Calculators
              </motion.h2>
              <motion.p 
                className="text-xl text-[#0F2F4E]/80 max-w-3xl mx-auto"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Our most powerful tools for comprehensive tax planning and calculations
              </motion.p>
            </motion.div>

            <StaggerGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {featuredCalculators.map((calc, index) => (
                <StaggerItem key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ 
                      duration: 0.6, 
                      delay: index * 0.1,
                      ease: "easeOut"
                    }}
                    whileHover={{ 
                      y: -8,
                      transition: { duration: 0.3, ease: "easeInOut" }
                    }}
                  >
                    <Link href={calc.href}>
                      <div className="group relative p-6 rounded-xl bg-white 
                                    border border-[#FFD700] shadow-lg hover:shadow-2xl 
                                    transition-all duration-500 hover:transform hover:scale-105 
                                    h-full flex flex-col overflow-hidden">
                        
                        {/* Gold Accent Glow Effect */}
                        <motion.div 
                          className="absolute inset-0 rounded-xl border border-[#FFD700]/20"
                          initial={{ opacity: 0.3 }}
                          whileHover={{ opacity: 0.6 }}
                          transition={{ duration: 0.3 }}
                        />
                        
                        <div className="flex items-center gap-4 mb-4 relative z-10">
                          <motion.div 
                            className="p-3 rounded-xl bg-[#1ED760]/10"
                            whileHover={{ 
                              scale: 1.1,
                              rotate: 5,
                              backgroundColor: "rgba(30, 215, 96, 0.2)"
                            }}
                            transition={{ duration: 0.3 }}
                          >
                            <calc.icon className="w-6 h-6 text-[#1ED760]" />
                          </motion.div>
                          <h3 className="text-xl font-bold text-[#0F2F4E]">
                            {calc.label}
                          </h3>
                        </div>
                        
                        <motion.p 
                          className="text-[#0F2F4E]/70 text-sm flex-grow relative z-10"
                          initial={{ opacity: 0.8 }}
                          whileHover={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          {calc.description}
                        </motion.p>
                        
                        <div className="flex items-center justify-between mt-6 relative z-10">
                          <motion.span 
                            className="text-[#1ED760] text-sm font-medium group-hover:text-[#0F2F4E] transition-colors"
                            whileHover={{ x: 5 }}
                            transition={{ duration: 0.2 }}
                          >
                            Get Started →
                          </motion.span>
                          <motion.div 
                            className="p-2 rounded-full bg-[#1ED760]/10 group-hover:bg-[#1ED760] transition-all"
                            whileHover={{ 
                              scale: 1.2,
                              rotate: 360
                            }}
                            transition={{ duration: 0.4 }}
                          >
                            <FaRocket className="w-4 h-4 text-[#1ED760] group-hover:text-white" />
                          </motion.div>
                        </div>

                        {/* Animated Background Effect */}
                        <motion.div 
                          className="absolute inset-0 bg-gradient-to-br from-[#1ED760]/5 to-[#FFD700]/5 opacity-0 group-hover:opacity-100 rounded-xl"
                          initial={{ opacity: 0 }}
                          whileHover={{ opacity: 1 }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                    </Link>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerGrid>

            {/* All Calculators Grid */}
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <motion.h3 
                className="text-2xl font-semibold text-[#0F2F4E] mb-6"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                Choose a Tax Calculator That Fits Your Needs
              </motion.h3>
              <motion.p 
                className="text-[#0F2F4E]/70 mb-8"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                Effortless Tax Calculations for Every Sector in Zimbabwe
              </motion.p>
            </motion.div>

            <StaggerGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allCalculators.map((calc, index) => (
                <StaggerItem key={index}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-30px" }}
                    transition={{ 
                      duration: 0.5, 
                      delay: index * 0.05,
                      ease: "easeOut"
                    }}
                    whileHover={{ 
                      scale: 1.03,
                      y: -5
                    }}
                  >
                    <Link href={calc.href}>
                      <div className="group relative p-6 bg-white rounded-lg border border-[#EEEEEE] 
                                    hover:border-[#1ED760] transition-all duration-400 
                                    hover:transform hover:scale-105 shadow-sm hover:shadow-lg
                                    overflow-hidden">
                        
                        {/* Subtle Gold Border Effect on Hover */}
                        <motion.div 
                          className="absolute inset-0 border border-[#FFD700]/0 rounded-lg"
                          whileHover={{ borderColor: "rgba(255, 215, 0, 0.3)" }}
                          transition={{ duration: 0.3 }}
                        />
                        
                        <div className="flex items-center gap-4 relative z-10">
                          <motion.div 
                            className="p-3 rounded-xl bg-[#1ED760]/10 group-hover:bg-[#1ED760] transition-colors"
                            whileHover={{ 
                              scale: 1.15,
                              rotate: -5
                            }}
                            transition={{ duration: 0.3 }}
                          >
                            <calc.icon className="w-5 h-5 text-[#1ED760] group-hover:text-white transition-colors" />
                          </motion.div>
                          <div>
                            <motion.h4 
                              className="font-semibold text-[#0F2F4E] group-hover:text-[#1ED760] transition-colors"
                              whileHover={{ x: 3 }}
                              transition={{ duration: 0.2 }}
                            >
                              {calc.label}
                            </motion.h4>
                            <motion.p 
                              className="text-[#0F2F4E]/70 text-sm mt-1"
                              initial={{ opacity: 0.7 }}
                              whileHover={{ opacity: 1 }}
                              transition={{ duration: 0.3 }}
                            >
                              {calc.description}
                            </motion.p>
                          </div>
                        </div>

                        {/* Pulse Animation on Hover */}
                        <motion.div 
                          className="absolute inset-0 bg-[#1ED760]/0 rounded-lg"
                          whileHover={{ 
                            backgroundColor: "rgba(30, 215, 96, 0.03)"
                          }}
                          transition={{ duration: 0.4 }}
                        />
                      </div>
                    </Link>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerGrid>
          </div>
        </AnimatedSection>

        {/* Showcase Carousel */}
        {/* <AnimatedSection className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <ShowcaseCarousel />
          </div>
        </AnimatedSection> */}

        {/* Calculator Preview */}
        <AnimatedSection className="py-16 bg-[#EEEEEE]">
          <div className="max-w-6xl mx-auto px-6">
            <TaxCalculatorPreview />
          </div>
        </AnimatedSection>

        {/* Testimonials */}
        <AnimatedSection className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <Testimonials />
          </div>
        </AnimatedSection>

        {/* FAQ */}
        <AnimatedSection className="py-16 bg-[#EEEEEE]">
          <div className="max-w-6xl mx-auto px-6">
            <FAQ />
          </div>
        </AnimatedSection>

        {/* Contact Form */}
        <AnimatedSection className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <ContactForm />
          </div>
        </AnimatedSection>

        {/* CTA */}
        <AnimatedSection className="py-16 bg-[#0F2F4E]">
          <div className="max-w-6xl mx-auto px-6">
            <CallToAction />
          </div>
        </AnimatedSection>
      </main>

      <Footer />
    </div>
  );
}