'use client'

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaEnvelope, FaPaperPlane, FaCheckCircle } from 'react-icons/fa';

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
      } else {
        setError(data.message || 'Failed to send reset link. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-2xl shadow-2xl p-6 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="flex justify-center mb-4"
            >
              <div className="bg-green-100 p-4 rounded-full">
                <FaCheckCircle className="text-green-600 text-4xl" />
              </div>
            </motion.div>
            
            <h2 className="text-2xl font-bold text-[#0F2F4E] mb-2">Check Your Email</h2>
            <p className="text-gray-600 mb-6 text-sm">
              We've sent a password reset link to <strong>{email}</strong>
            </p>
            
            <div className="space-y-3">
              <Link
                href="/login"
                className="block w-full bg-gradient-to-r from-[#1ED760] to-[#17b34f] text-white py-2.5 rounded-lg font-semibold hover:shadow-lg transition-all text-sm"
              >
                Back to Login
              </Link>
              
              <button
                onClick={() => setSuccess(false)}
                className="block w-full text-[#1ED760] hover:text-[#1ED760]/80 transition-colors text-sm"
              >
                Resend email
              </button>
            </div>
          </div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center mt-4"
          >
            <Link href="/" className="text-gray-300 hover:text-white transition-colors text-sm">
              ← Back to home
            </Link>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        {/* Forgot Password Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-2xl p-6"
        >
          <h2 className="text-2xl font-bold text-[#0F2F4E] mb-1 text-center">Forgot Password?</h2>
          <p className="text-gray-600 text-center mb-4 text-sm">
            No worries! Enter your email and we'll send you reset instructions.
          </p>

          {error && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-red-50 border-l-4 border-red-500 text-red-700 px-3 py-2 rounded mb-4 text-sm"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-400 text-sm" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1ED760] focus:border-transparent transition-all text-sm"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#1ED760] to-[#17b34f] text-white py-2.5 rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 text-sm"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Sending...
                </>
              ) : (
                <>
                  <FaPaperPlane />
                  Send Reset Link
                </>
              )}
            </button>
          </form>

          <div className="mt-4 text-center">
            <Link
              href="/login"
              className="text-sm text-[#1ED760] hover:text-[#1ED760]/80 transition-colors font-medium"
            >
              ← Back to login
            </Link>
          </div>
        </motion.div>

        {/* Back to Home */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center mt-4"
        >
          <Link href="/" className="text-gray-300 hover:text-white transition-colors text-sm">
            ← Back to home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
