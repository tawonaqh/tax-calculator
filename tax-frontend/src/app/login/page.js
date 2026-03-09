import LoginForm from '@/components/LoginForm';
import { Suspense } from 'react';

export const metadata = {
  title: 'Login - Zimbabwe Tax Calculator',
  description: 'Sign in to access Simple Payroll and manage your payroll calculations.',
};

function LoginFormWrapper() {
  return <LoginForm />;
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F2F4E] via-[#1a4d6f] to-[#0F2F4E]">
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#1ED760] mx-auto mb-4"></div>
            <p className="text-white text-lg">Loading...</p>
          </div>
        </div>
      }>
        <LoginFormWrapper />
      </Suspense>
    </div>
  );
}
