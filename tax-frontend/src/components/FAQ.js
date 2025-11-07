'use client';

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiChevronDown, HiQuestionMarkCircle } from "react-icons/hi";
import { Search, BookOpen, Calculator, ShieldCheck, Users, Building, DollarSign, FileText } from "lucide-react";

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const faqCategories = {
    all: { name: "All Questions", icon: BookOpen, color: "from-[#1ED760] to-[#0F2F4E]" },
    individual: { name: "Individual Tax", icon: Users, color: "from-blue-500 to-cyan-500" },
    business: { name: "Business Tax", icon: Building, color: "from-purple-500 to-pink-500" },
    vat: { name: "VAT", icon: Calculator, color: "from-orange-500 to-red-500" },
    compliance: { name: "Compliance", icon: ShieldCheck, color: "from-green-500 to-emerald-500" },
    currency: { name: "Currency", icon: DollarSign, color: "from-yellow-500 to-orange-500" },
    paye: { name: "PAYE", icon: FileText, color: "from-red-500 to-pink-500" }
  };

  const faqs = [
    {
      question: "What is income tax in Zimbabwe?",
      answer: "Income tax is charged on 'taxable income' received by or accrued to any person for each year of assessment. The current rate is 25% as charged by Finance Act of 2023 for period effective 01 January 2024 onwards. Aids Levy is charged at the rate of 3% of the income tax payable.",
      category: "individual"
    },
    {
      question: "Who must pay income tax?",
      answer: "Tax is payable by the person to whom income accrues/is received; representative taxpayers pay in that capacity (for income they manage or control). This means every person (natural or artificial) who produces taxable income is liable to pay taxes.",
      category: "individual"
    },
    {
      question: "What counts as 'taxable income'?",
      answer: "Start from 'gross income' (all amounts received by or accrued to a person from a Zimbabwean source, unless capital), then apply exemptions and deductions to arrive at taxable income. Amounts listed in the Third Schedule are exempt from tax.",
      category: "business"
    },
    {
      question: "What income is exempt from tax?",
      answer: "Amounts listed in the Third Schedule are exempt (e.g., income earned by specified public entities and agricultural, mining and commercial institutions or societies not operating for the private pecuniary profit or gain of the members etc).",
      category: "business"
    },
    {
      question: "What deductions reduce taxable income?",
      answer: "Deductions allowed are those listed in section 15 (and related Schedules). General deduction formula is expenditure and losses to the extent to which they are incurred for the purposes of trade or in the production of the income.",
      category: "business"
    },
    {
      question: "What relief do I get on capital expenditure?",
      answer: "Capital allowances are tax deductions that let a business write off the cost of long-term assets (like machinery, equipment, or eligible buildings) over time. Instead of expensing the whole purchase in one go, you claim allowances each year to reduce taxable profits.",
      category: "business"
    },
    {
      question: "How to utilize capital allowances (practical steps)?",
      answer: "1. Identify the asset & schedule. 2. Determine the claim for year 1 and after. 3. Time-apportion and apportion for use. 4. Keep an asset register. 5. On disposal, do a balancing calculation. 6. Reflect in the tax computation.",
      category: "business"
    },
    {
      question: "What is PAYE and who remits it?",
      answer: "Employees' tax (PAYE) is payable in terms of the Thirteenth Schedule of the income tax act on 'remuneration' paid to an employee, and is remitted by the employer as per that Schedule.",
      category: "paye"
    },
    {
      question: "What happens if PAYE isn't paid on time?",
      answer: "Interest is chargeable on unpaid PAYE at a rate fixed by the Minister, for as long as the amount remains unpaid, currently at 10% p.a for foreign currency and bank policy rate of 35% plus 5% (40%) for ZiG as per SI 26 of 2025.",
      category: "paye"
    },
    {
      question: "What are the PAYE deadlines?",
      answer: "The PAYE return should be submitted by the 5th of the following month. Payment periods are prescribed in paragraph 3(1) of the Thirteenth Schedule; currently the 10th of the following month.",
      category: "paye"
    },
    {
      question: "When must I register for VAT?",
      answer: "Apply once you meet the conditions for voluntary or compulsory registration under section 23 of the VAT Act; the Commissioner registers you via your application on TARMS if your 12-month taxable supplies are likely to exceed US$25,000.00 or local currency equivalent currently.",
      category: "vat"
    },
    {
      question: "Which items are zero-rated?",
      answer: "Examples in the regulations include: Export goods and services, Certain tourism services to 'tourists' (accommodation excluded—taxed at the standard rate).",
      category: "vat"
    },
    {
      question: "What proof is needed to support zero-rating?",
      answer: "Keep documents such as tax invoices, contracts, and export documents stamped at exit.",
      category: "vat"
    },
    {
      question: "Which supplies are VAT-exempt?",
      answer: "The First Schedule lists exempt goods/services (e.g., domestic piped water; local authority rates; certain agricultural equipment; fuel categories; tobacco at auction, etc.).",
      category: "vat"
    },
    {
      question: "When do VAT refunds accrue interest?",
      answer: "If ZIMRA doesn't refund within 30 days of receiving your return/refund application, interest is payable at the prescribed rate (subject to exceptions).",
      category: "vat"
    },
    {
      question: "What is IMTT (intermediated money transfer tax)?",
      answer: "It is charged and collected per section 36G and the Thirtieth Schedule of the Income Tax Act at a rate of 2% on specified transactions. Common exempt transactions include transfer of money on payment of remuneration, transfer to and from ZIMRA, intra corporate transfers, and transfers between individual's mobile wallet and bank account.",
      category: "compliance"
    },
    {
      question: "Which withholding taxes exist in the Income Tax Act?",
      answer: "WHT types include: Resident shareholders' tax (10-15%), Residents' tax on interest (5-15%), Contracts WHT (30% without tax clearance), Non-executive directors' fees (20%), Non-resident shareholders' tax (5-15%), Non-resident tax on fees (15%), Non-resident tax on remittances (15%), Non-resident tax on royalties (15%).",
      category: "compliance"
    },
    {
      question: "Can losses be carried forward?",
      answer: "Yes. An assessed loss not set off in the year may be carried forward and set against future income for six years; however, the Commissioner can issue additional assessments that reduce or eliminate an assessed loss.",
      category: "business"
    },
    {
      question: "What are disallowed expenses?",
      answer: "Section 16 lists items that are not deductible, including: entertainment; leasing certain passenger motor vehicles beyond set caps; expenditure linked to exempt/foreign income; interest that breaches thin-capitalization limits, and others.",
      category: "business"
    },
    {
      question: "Are donations tax-deductible?",
      answer: "Only where the Act expressly allows them. Example: specific empowerment/indigenization-related contributions are allowed under paragraph (ll) of section 15(2). General donations are not deductible unless specifically permitted.",
      category: "business"
    },
    {
      question: "How is interest expense treated (thin capitalization)?",
      answer: "Interest is disallowed to the extent a local branch/subsidiary (or certain local companies) exceeds a 3:1 debt-to-equity ratio, subject to provisos (e.g., qualifying local lending).",
      category: "business"
    },
    {
      question: "Can I claim entertainment expenses?",
      answer: "No. Entertainment (including hospitality) is specifically non-deductible.",
      category: "business"
    },
    {
      question: "What records must companies keep for tax?",
      answer: "Every taxpayer must keep reasonable records and documents for at least 6 years after the tax period.",
      category: "compliance"
    },
    {
      question: "What is the deadline for company tax filing?",
      answer: "For self-assessment taxpayers with annual accounts, the return is due within 4 months after year-end; the Commissioner can accept a different accounting date on application.",
      category: "compliance"
    },
    {
      question: "Can a company file NIL returns?",
      answer: "Yes. A return must be submitted whether tax is payable or a refund is due; NIL returns are therefore required. It is important to specify whether the company is trading or not as this affects ZIMRA's risk assessment.",
      category: "compliance"
    },
    {
      question: "What is provisional tax?",
      answer: "It's tax you estimate on income not fully subject to PAYE; it's paid in four instalments during the year under the QPD system. 'Quarterly Payment Dates' are the four due dates for the provisional tax instalments.",
      category: "compliance"
    },
    {
      question: "Who must pay provisional tax?",
      answer: "Anyone whose taxable income includes amounts not subject to employees' tax (PAYE), unless specifically excluded by the Commissioner.",
      category: "compliance"
    },
    {
      question: "How do I calculate QPDs?",
      answer: "Use the Act's cumulative percentages of the estimated annual tax: 1st QPD: 10%, 2nd QPD: 25% (cumulative), 3rd QPD: 30% (cumulative), 4th QPD: 35% (cumulative). These sum to 100%.",
      category: "compliance"
    },
    {
      question: "Can I change my QPD estimate?",
      answer: "Yes. Provisional taxpayers submit an estimate with each period; the Commissioner can waive interest if an under-estimate is within 10% or due to sufficient cause.",
      category: "compliance"
    },
    {
      question: "What if I underpay provisional tax?",
      answer: "Any shortfall is deemed unpaid after the due date and can attract interest under section 71 of the Income Tax Act.",
      category: "compliance"
    },
    {
      question: "Do I pay tax in USD or ZiG?",
      answer: "You must file/pay per currency - one return for ZiG, a separate one for foreign-currency income, and pay VAT and income tax in the same currency you charged/received. No cross-currency mixing is allowed.",
      category: "currency"
    },
    {
      question: "Which exchange rate should I use for tax?",
      answer: "ZIMRA publishes the exchange rate to be used for tax purposes. You should use the official ZIMRA exchange rates for currency conversions in your tax computations.",
      category: "currency"
    },
    {
      question: "Are USD earnings treated differently for tax?",
      answer: "Taxability depends on source and exemptions, not currency. The Act taxes income from Zimbabwean sources (subject to exemptions), regardless of the currency, with conversion rules where stated.",
      category: "currency"
    },
    {
      question: "Do I declare USD revenue to ZIMRA?",
      answer: "Yes. Returns must disclose taxable income; dual-currency specifics are addressed where the Act provides conversion provisions. Separate returns are required for foreign currency income.",
      category: "currency"
    },
    {
      question: "Is USD payroll taxed differently?",
      answer: "PAYE applies to 'remuneration' per the Thirteenth Schedule; currency does not change the obligation to withhold/remit. The same PAYE rules apply regardless of currency.",
      category: "paye"
    },
    {
      question: "How do I treat exchange gains/losses for tax?",
      answer: "Foreign currency gains/losses follow the nature of the underlying item. Trading/operational items are revenue if gains or expenditure if losses (taxable/deductible on realization); capital items are treated as capital in nature.",
      category: "currency"
    },
    {
      question: "What triggers a ZIMRA tax audit?",
      answer: "The Act empowers officers to require information/records and to enter/search with a warrant where there are reasonable grounds of suspected offences; compliance reviews can occur under these powers.",
      category: "compliance"
    },
    {
      question: "What documents does ZIMRA ask for?",
      answer: "Books of account, records, statements, working papers or calculations supporting income/expenses/tax, and computer print-outs where necessary.",
      category: "compliance"
    },
    {
      question: "How do I respond to a ZIMRA tax query?",
      answer: "You must provide the requested information; you may be accompanied by a tax agent/legal practitioner/accountant when attending interviews. Keep 6-year records to substantiate positions.",
      category: "compliance"
    },
    {
      question: "Why was my tax clearance blocked?",
      answer: "Where a taxpayer has arrears/non-compliance in the form of not submitting returns, these commonly result in no clearance.",
      category: "compliance"
    },
    {
      question: "How do I restore tax clearance?",
      answer: "Rectify non-compliance and arrears so that section 80 withholding no longer applies and your tax clearance is renewed.",
      category: "compliance"
    },
    {
      question: "What are the penalties for tax evasion/late payment?",
      answer: "Interest accrues on late payment under section 71(2) - (3). Additional tax/penalties may apply under various provisions. Current rates are 10% p.a for foreign currency and 40% for ZiG.",
      category: "compliance"
    },
    {
      question: "Can ZIMRA garnish my bank account?",
      answer: "Yes. The Commissioner may appoint an agent (including a financial institution) and require payment of tax due from moneys held for the taxpayer (garnishee).",
      category: "compliance"
    },
    {
      question: "How long must I keep tax records?",
      answer: "At least 6 years after the tax period.",
      category: "compliance"
    },
    {
      question: "Can ZIMRA back-tax previous years?",
      answer: "Yes. The Commissioner may make additional/estimated assessments within the statutory framework (including where prejudice or misstatement is suspected).",
      category: "compliance"
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
                            faq.category === 'compliance' ? 'bg-green-500/20 text-green-200 border-green-400/30' :
                            faq.category === 'currency' ? 'bg-yellow-500/20 text-yellow-200 border-yellow-400/30' :
                            'bg-red-500/20 text-red-200 border-red-400/30'
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