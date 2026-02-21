import RegisterForm from '@/components/RegisterForm';

export const metadata = {
  title: 'Register - Zimbabwe Tax Calculator',
  description: 'Create an account to access Simple Payroll and manage your payroll calculations.',
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F2F4E] via-[#1a4d6f] to-[#0F2F4E]">
      <RegisterForm />
    </div>
  );
}
