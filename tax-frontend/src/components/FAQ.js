"use client";

import React, { useState } from "react";

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "What is income tax in Zimbabwe?",
      answer: "Income tax is charged on taxable income at current rate of 25%."
    },
    {
      question: "Who must pay income tax?",
      answer: "Every person who produces taxable income is liable to pay taxes."
    }
  ];

  return (
    <div className="min-h-screen bg-blue-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-white text-center mb-8">Tax FAQ</h1>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white/10 rounded-lg p-4">
              <button
                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                className="w-full text-left text-white font-medium"
              >
                {faq.question}
              </button>
              {activeIndex === index && (
                <p className="text-white/80 mt-2">{faq.answer}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;