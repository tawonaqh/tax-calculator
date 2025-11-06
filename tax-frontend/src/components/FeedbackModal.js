"use client";

import { useState } from "react";

const FeedbackModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    subject: "",
    message: "",
    rating: 5
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          subject: "",
          message: "",
          rating: 5
        });
        // Auto close after 2 seconds
        setTimeout(() => {
          onClose();
          setSubmitStatus(null);
        }, 2000);
      } else {
        throw new Error('Failed to submit feedback');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl border border-[#FFD700] max-w-md w-full mx-auto max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[#0F2F4E]">Send Anonymous Feedback</h2>
            <button
              onClick={onClose}
              className="text-[#0F2F4E]/60 hover:text-[#0F2F4E] transition-colors p-2 rounded-lg hover:bg-[#EEEEEE]"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Privacy Notice */}
          <div className="mb-4 p-3 bg-[#0F2F4E]/5 border border-[#0F2F4E]/20 rounded-lg text-[#0F2F4E] text-sm">
            <svg className="w-4 h-4 inline mr-2 text-[#1ED760]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Your feedback is completely anonymous. We don't collect any personal information.
          </div>

          {/* Success Message */}
          {submitStatus === 'success' && (
            <div className="mb-4 p-4 bg-[#1ED760]/10 border border-[#1ED760] rounded-lg text-[#0F2F4E]">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-[#1ED760]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Thank you for your feedback! We appreciate your input.
              </div>
            </div>
          )}

          {/* Error Message */}
          {submitStatus === 'error' && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-[#0F2F4E]">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                Failed to submit feedback. Please try again.
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Rating */}
            <div>
              <label htmlFor="rating" className="block text-sm font-medium text-[#0F2F4E] mb-2">
                How would you rate your experience?
              </label>
              <select
                id="rating"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-white border border-[#EEEEEE] rounded-lg text-[#0F2F4E] 
                           placeholder-[#0F2F4E]/40 focus:border-[#1ED760] focus:ring-2 focus:ring-[#1ED760] 
                           focus:ring-opacity-50 transition-all duration-200 outline-none shadow-sm"
              >
                <option value="5">⭐⭐⭐⭐⭐ - Excellent</option>
                <option value="4">⭐⭐⭐⭐ - Good</option>
                <option value="3">⭐⭐⭐ - Average</option>
                <option value="2">⭐⭐ - Poor</option>
                <option value="1">⭐ - Terrible</option>
              </select>
            </div>

            {/* Subject */}
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-[#0F2F4E] mb-2">
                Category *
              </label>
              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-white border border-[#EEEEEE] rounded-lg text-[#0F2F4E] 
                           placeholder-[#0F2F4E]/40 focus:border-[#1ED760] focus:ring-2 focus:ring-[#1ED760] 
                           focus:ring-opacity-50 transition-all duration-200 outline-none shadow-sm"
              >
                <option value="">What type of feedback?</option>
                <option value="bug">Bug Report</option>
                <option value="feature">Feature Request</option>
                <option value="improvement">Improvement Suggestion</option>
                <option value="ui">User Interface</option>
                <option value="content">Content/Information</option>
                <option value="calculation">Calculation Accuracy</option>
                <option value="performance">Performance</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-[#0F2F4E] mb-2">
                Your Feedback *
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="4"
                className="w-full px-3 py-2 bg-white border border-[#EEEEEE] rounded-lg text-[#0F2F4E] 
                           placeholder-[#0F2F4E]/40 focus:border-[#1ED760] focus:ring-2 focus:ring-[#1ED760] 
                           focus:ring-opacity-50 transition-all duration-200 outline-none shadow-sm resize-none"
                placeholder="Please share your feedback, suggestions, or issues..."
                minLength="10"
              />
              <p className="text-xs text-[#0F2F4E]/60 mt-1">Minimum 10 characters</p>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-[#EEEEEE] text-[#0F2F4E] rounded-lg font-medium 
                           hover:bg-[#0F2F4E]/5 transition-colors disabled:opacity-50"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-4 py-3 bg-[#1ED760] text-white rounded-lg font-semibold 
                           hover:bg-[#1ED760]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                           shadow-lg shadow-[#1ED760]/25"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </span>
                ) : (
                  "Send Anonymously"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;