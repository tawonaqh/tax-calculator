import { Suspense } from 'react';
import ResetPasswordForm from '@/components/ResetPasswordForm';

export const metadata = {
  title: 'Reset Password - Zimbabwe Tax Calculator',
  description: 'Create a new password for your account.',
};

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F2F4E] via-[#1a4d6f] to-[#0F2F4E]">
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      }>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
