import LoginForm from '@/components/LoginForm';

export const metadata = {
  title: 'Login - Zimbabwe Tax Calculator',
  description: 'Sign in to access Simple Payroll and manage your payroll calculations.',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F2F4E] via-[#1a4d6f] to-[#0F2F4E]">
      <LoginForm />
    </div>
  );
}
