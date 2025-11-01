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
      color: "from-blue-500 to-cyan-400",
      featured: true
    },
    { 
      href: "/paye-calculator", 
      label: "PAYE Calculator", 
      description: "Employee income tax calculation",
      icon: FaUsers,
      color: "from-green-500 to-emerald-400",
      featured: true
    },
    { 
      href: "/self-employment-tax-calculator", 
      label: "Individual Income Tax", 
      description: "Personal tax computation",
      icon: FaFileInvoiceDollar,
      color: "from-purple-500 to-pink-400",
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
      color: "from-orange-500 to-red-400"
    },
    { 
      href: "/vat-tax-calculator", 
      label: "VAT Calculator", 
      description: "Value Added Tax computations",
      icon: FaCalculator,
      color: "from-indigo-500 to-purple-400"
    },
    { 
      href: "/vat-imported-services", 
      label: "VAT Imported Services", 
      description: "VAT on imported services",
      icon: FaGlobeAmericas,
      color: "from-teal-500 to-cyan-400"
    },
    { 
      href: "/withholding-tax-royalties", 
      label: "Withholding Tax - Royalties", 
      description: "Tax on royalty payments",
      icon: FaHandHoldingUsd,
      color: "from-yellow-500 to-orange-400"
    },
    { 
      href: "/withholding-tax-fees", 
      label: "Withholding Tax - Fees", 
      description: "Tax on professional fees",
      icon: FaFileInvoiceDollar,
      color: "from-pink-500 to-rose-400"
    },
    { 
      href: "/withholding-tax-interest", 
      label: "Withholding Tax - Interest", 
      description: "Tax on interest payments",
      icon: FaChartLine,
      color: "from-cyan-500 to-blue-400"
    },
    { 
      href: "/withholding-tax-tenders", 
      label: "Withholding Tax - Tenders", 
      description: "Tax on tender payments",
      icon: FaShieldAlt,
      color: "from-emerald-500 to-green-400"
    },
    { 
      href: "/agriculture-tax", 
      label: "Agriculture Tax", 
      description: "Agricultural sector taxation",
      icon: FaSeedling,
      color: "from-lime-500 to-green-400"
    },
    { 
      href: "/insurance-tax", 
      label: "Insurance Tax", 
      description: "Insurance premium taxes",
      icon: FaUmbrella,
      color: "from-violet-500 to-purple-400"
    },
    { 
      href: "/banking-finance-taxes", 
      label: "Financial Sector Tax", 
      description: "Banking and financial taxes",
      icon: FaHandHoldingUsd,
      color: "from-amber-500 to-yellow-400"
    },
    { 
      href: "/health-care-tax", 
      label: "Healthcare Tax", 
      description: "Medical and healthcare taxes",
      icon: FaHeartbeat,
      color: "from-red-500 to-pink-400"
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

  const stats = [
    { number: "99.8%", label: "Calculation Accuracy" },
    { number: "2,500+", label: "Active Users" },
    { number: "15+", label: "Tax Calculators" },
    { number: "24/7", label: "AI Support" }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white">
      <Header />
      
      {/* Main */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-lime-400/10 to-cyan-400/10 blur-3xl"></div>
          <Hero />
        </section>

        {/* Stats Section */}
        <AnimatedSection className="py-16 bg-gray-800/30">
          <div className="max-w-6xl mx-auto px-6">
            <StaggerGrid className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <StaggerItem key={index}>
                  <div className="text-center">
                    <div className="text-3xl md:text-4xl font-bold text-lime-400 mb-2">
                      {stat.number}
                    </div>
                    <div className="text-gray-400 text-sm md:text-base">
                      {stat.label}
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerGrid>
          </div>
        </AnimatedSection>

        {/* Quick Features */}
        <AnimatedSection className="py-16">
          <div id="features" className="max-w-6xl mx-auto px-6">
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-lime-400 mb-4">
                Why Choose Our Tax Calculator?
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Time to ditch complicated tax calculations and confusion. Our Smart Tax Calculator is built to make your life easier. 
                In just a few clicks, you’ll get clear results you can trust, helping you plan better and make confident financial decisions. 
                All calculations secured & encrypted.
              </p>
            </motion.div>

            <StaggerGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickFeatures.map((feature, index) => (
                <StaggerItem key={index}>
                  <div className="p-6 bg-gray-800/40 rounded-2xl border border-gray-700 hover:border-lime-400/50 
                           transition-all duration-300 hover:transform hover:scale-105 group">
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-lime-400/10 
                                text-lime-400 mb-4 group-hover:bg-lime-400 group-hover:text-gray-900 
                                transition-all duration-300">
                      <feature.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      {feature.description}
                    </p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerGrid>
          </div>
        </AnimatedSection>

        {/* Featured Calculators */}
        <AnimatedSection className="py-16 bg-gray-800/20">
          <div id="calculator-cards" className="max-w-6xl mx-auto px-6">
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-lime-400 mb-4">
                Try Our Top Featured Calculators
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Our most powerful tools for comprehensive tax planning and calculations
              </p>
            </motion.div>

            <StaggerGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {featuredCalculators.map((calc, index) => (
                <StaggerItem key={index}>
                  <Link href={calc.href}>
                    <div className={`group p-6 rounded-2xl bg-gradient-to-br ${calc.color} 
                                  shadow-2xl hover:shadow-xl transition-all duration-300 
                                  hover:transform hover:scale-105 h-full flex flex-col`}>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm">
                          <calc.icon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-white">
                          {calc.label}
                        </h3>
                      </div>
                      <p className="text-white/80 text-sm flex-grow">
                        {calc.description}
                      </p>
                      <div className="flex items-center justify-between mt-4">
                        <span className="text-white/90 text-sm font-medium">
                          Get Started →
                        </span>
                        <div className="p-2 rounded-full bg-white/20 group-hover:bg-white/30 transition-all">
                          <FaRocket className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </StaggerItem>
              ))}
            </StaggerGrid>

            {/* All Calculators Grid */}
            <motion.div 
              className="text-center mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-2xl font-semibold text-lime-400 mb-6">
                Choose a Tax Calculator That Fits Your Needs
              </h3>
              <p className="text-gray-400 mb-8">
                Effortless Tax Calculations for Every Sector in Zimbabwe
              </p>
            </motion.div>

            <StaggerGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allCalculators.map((calc, index) => (
                <StaggerItem key={index}>
                  <Link href={calc.href}>
                    <div className="group p-6 bg-gray-800/40 rounded-xl border border-gray-700 
                                  hover:border-lime-400 hover:bg-gray-800/60 transition-all 
                                  duration-300 hover:transform hover:scale-105">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${calc.color} 
                                      group-hover:scale-110 transition-transform duration-300`}>
                          <calc.icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-white group-hover:text-lime-400 transition-colors">
                            {calc.label}
                          </h4>
                          <p className="text-gray-400 text-sm mt-1">
                            {calc.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </StaggerItem>
              ))}
            </StaggerGrid>
          </div>
        </AnimatedSection>

        {/* Showcase Carousel */}
        <AnimatedSection className="py-16">
          <div className="max-w-6xl mx-auto px-6">
            <ShowcaseCarousel />
          </div>
        </AnimatedSection>

        {/* Calculator Preview */}
        <AnimatedSection className="py-16 bg-gray-800/30">
          <div className="max-w-6xl mx-auto px-6">
            <TaxCalculatorPreview />
          </div>
        </AnimatedSection>

        {/* Testimonials */}
        <AnimatedSection className="py-16 bg-gray-800/20">
          <div className="max-w-6xl mx-auto px-6">
            <Testimonials />
          </div>
        </AnimatedSection>

        {/* FAQ */}
        <AnimatedSection className="py-16">
          <div className="max-w-6xl mx-auto px-6">
            <FAQ />
          </div>
        </AnimatedSection>

        {/* Contact Form */}
        <AnimatedSection className="py-16 bg-gray-800/30">
          <div className="max-w-6xl mx-auto px-6">
            <ContactForm />
          </div>
        </AnimatedSection>

        {/* CTA */}
        <AnimatedSection className="py-16">
          <div className="max-w-6xl mx-auto px-6">
            <CallToAction />
          </div>
        </AnimatedSection>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}