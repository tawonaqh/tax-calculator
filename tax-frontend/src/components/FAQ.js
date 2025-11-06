"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiChevronDown, HiQuestionMarkCircle } from "react-icons/hi";
import { Search, BookOpen, Calculator, ShieldCheck, Users, Building } from "lucide-react";

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const faqCategories = {
    all: { name: "All Questions", icon: BookOpen, color: "from-[#1ED760] to-[#0F2F4E]" },
    individual: { name: "Individual Tax", icon: Users, color: "from-blue-500 to-cyan-500" },
    business: { name: "Business Tax", icon: Building, color: "from-purple-500 to-pink-500" },
    vat: { name: "VAT & Sales Tax", icon: Calculator, color: "from-orange-500 to-red-500" },
    compliance: { name: "Compliance", icon: ShieldCheck, color: "from-green-500 to-emerald-500" }
  };

  const faqs = [
    {
      question: "What is VAT in Zimbabwe and how does it work?",
      answer: "Value Added Tax (VAT) in Zimbabwe is a consumption tax levied on the supply of goods and services at a standard rate of 14.5%. It applies to most goods and services, with some exceptions for basic food items, medical services, and educational materials. Businesses with annual taxable supplies exceeding $60,000 must register for VAT.",
      category: "vat"
    },
    {
      question: "How is withholding tax calculated for different types of payments?",
      answer: "Withholding tax rates vary by payment type: 15% for royalties and fees to non-residents, 10% for contract payments, and 30% for payments to non-residents without tax clearance certificates. For residents, withholding tax applies to certain payments like interest and dividends at specified rates.",
      category: "business"
    },
    {
      question: "What are the current income tax rates for individuals in Zimbabwe?",
      answer: "Individual income tax in Zimbabwe follows a progressive tax bracket system: 0% on the first $10,000, 20% on income between $10,001 and $50,000, 25% on income between $50,001 and $100,000, and 30% on income above $100,000. These rates are subject to annual budget reviews.",
      category: "individual"
    },
    {
      question: "When are quarterly tax returns due for businesses?",
      answer: "Quarterly tax returns for businesses are due on the 25th day of the month following the end of each quarter: April 25th (Q1), July 25th (Q2), October 25th (Q3), and January 25th (Q4). Late submissions may attract penalties and interest charges.",
      category: "compliance"
    },
    {
      question: "What expenses are tax-deductible for small businesses?",
      answer: "Tax-deductible expenses include rent, utilities, employee salaries, marketing costs, professional fees, insurance premiums, and depreciation on business assets. Proper documentation and receipts are required for all deductions.",
      category: "business"
    },
    {
      question: "How do I register for tax in Zimbabwe as an individual?",
      answer: "Individuals can register for tax through the ZIMRA e-services portal or by visiting any ZIMRA office. You'll need your national ID, proof of residence, and employment details. Registration is free and should be completed within 30 days of starting employment or business.",
      category: "individual"
    }
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "all" || faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <section className="py-20 bg-gradient-to-br from-[#0F2F4E] to-[#1a3d63] rounded-2xl">
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
            className="flex items-center justify-center gap-4 mb-6"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, type: "spring" }}
          >
            <div className="p-4 bg-gradient-to-br from-[#1ED760] to-[#0F2F4E] rounded-3xl shadow-2xl shadow-[#1ED760]/25">
              <HiQuestionMarkCircle className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-white">
              FAQ Center
            </h2>
          </motion.div>
          <motion.p 
            className="text-xl text-white/80 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Get answers to common questions about Zimbabwean tax laws and calculations
          </motion.p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-12"
        >
          <div className="relative max-w-2xl mx-auto">
            <motion.div
              animate={{ rotate: searchTerm ? 90 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 w-6 h-6" />
            </motion.div>
            <motion.input
              type="text"
              placeholder="Search questions about taxes, rates, deadlines..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              whileFocus={{ scale: 1.02 }}
              className="w-full pl-14 pr-6 py-5 bg-white/10 backdrop-blur-sm border border-white/20 
                         rounded-2xl text-white placeholder-white/60 focus:outline-none 
                         focus:border-[#1ED760] focus:ring-4 focus:ring-[#1ED760]/30 
                         transition-all duration-300 text-lg"
            />
          </div>
        </motion.div>

        {/* Category Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {Object.entries(faqCategories).map(([key, category]) => {
            const IconComponent = category.icon;
            return (
              <motion.button
                key={key}
                onClick={() => setActiveCategory(key)}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-3 px-6 py-4 rounded-2xl text-base font-semibold 
                           transition-all duration-300 backdrop-blur-sm ${
                  activeCategory === key
                    ? `bg-gradient-to-r ${category.color} text-white shadow-2xl shadow-current/40`
                    : 'bg-white/10 text-white/90 hover:bg-white/20 border border-white/20'
                }`}
              >
                <IconComponent className="w-5 h-5" />
                {category.name}
              </motion.button>
            );
          })}
        </motion.div>

        {/* FAQ Items */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="space-y-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredFaqs.map((faq, index) => {
              const isActive = activeIndex === index;
              const category = faqCategories[faq.category];

              return (
                <motion.div
                  key={index}
                  layout
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -20 }}
                  transition={{ duration: 0.4, type: "spring" }}
                  whileHover={{ y: -5 }}
                  onHoverStart={() => setHoveredIndex(index)}
                  onHoverEnd={() => setHoveredIndex(null)}
                  className="relative bg-white/10 backdrop-blur-sm rounded-2xl border border-[#FFD700]/30 
                             hover:border-[#1ED760] hover:shadow-2xl hover:shadow-[#1ED760]/20
                             transition-all duration-500 overflow-hidden group"
                >
                  {/* Animated Background */}
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-[#1ED760]/10 to-[#FFD700]/5 opacity-0 group-hover:opacity-100"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                  />

                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full flex justify-between items-center p-8 text-left 
                               transition-all duration-300 relative z-10"
                  >
                    <div className="flex-1 pr-8">
                      <motion.h3 
                        className="text-xl font-semibold text-white group-hover:text-[#1ED760] transition-colors mb-3"
                        whileHover={{ x: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        {faq.question}
                      </motion.h3>
                      <div className="flex items-center gap-3">
                        <motion.span 
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm border ${
                            faq.category === 'individual' ? 'bg-blue-500/20 text-blue-200 border-blue-400/30' :
                            faq.category === 'business' ? 'bg-purple-500/20 text-purple-200 border-purple-400/30' :
                            faq.category === 'vat' ? 'bg-orange-500/20 text-orange-200 border-orange-400/30' :
                            'bg-green-500/20 text-green-200 border-green-400/30'
                          }`}
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.2 }}
                        >
                          {category.name}
                        </motion.span>
                      </div>
                    </div>
                    <motion.div
                      animate={{ rotate: isActive ? 180 : 0 }}
                      transition={{ duration: 0.3, type: "spring" }}
                      className="flex-shrink-0 p-2 bg-white/10 rounded-full border border-white/20"
                    >
                      <HiChevronDown className="w-6 h-6 text-[#1ED760]" />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="px-8 pb-8">
                          <motion.div 
                            className="border-t border-white/20 pt-6"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                          >
                            <p className="text-white/80 leading-relaxed text-lg">
                              {faq.answer}
                            </p>
                          </motion.div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Floating Animation */}
                  <motion.div
                    className="absolute top-4 right-4 w-1 h-1 bg-[#FFD700] rounded-full"
                    animate={{
                      scale: [1, 2, 1],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: index * 0.3
                    }}
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* No Results State */}
          {filteredFaqs.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <motion.div
                className="p-8 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 max-w-md mx-auto"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <HiQuestionMarkCircle className="w-16 h-16 text-white/40 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold text-white mb-4">
                  No questions found
                </h3>
                <p className="text-white/60 text-lg">
                  {searchTerm 
                    ? `No results found for "${searchTerm}". Try different keywords.`
                    : "No questions available in this category."
                  }
                </p>
              </motion.div>
            </motion.div>
          )}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16 pt-12 border-t border-white/20"
        >
          <motion.p 
            className="text-white/60 text-xl mb-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            Still have questions?
          </motion.p>
          <motion.button 
            className="px-8 py-4 bg-gradient-to-r from-[#1ED760] to-[#0F2F4E] text-white font-bold 
                       rounded-2xl hover:shadow-2xl hover:shadow-[#1ED760]/40 transition-all 
                       duration-300 text-lg"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            Contact Tax Support
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;