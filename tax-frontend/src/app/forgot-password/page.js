import ForgotPasswordForm from '@/components/ForgotPasswordForm';

export const metadata = {
  title: 'Forgot Password - Zimbabwe Tax Calculator',
  description: 'Reset your password to regain access to your account.',
};

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F2F4E] via-[#1a4d6f] to-[#0F2F4E]">
      <ForgotPasswordForm />
    </div>
  );
}
