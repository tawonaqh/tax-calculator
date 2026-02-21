import CompanyProfile from '@/components/Company/CompanyProfile';
import ProtectedRoute from '@/components/ProtectedRoute';

export const metadata = {
  title: 'Company Profile - Zimbabwe Tax Calculator',
  description: 'Manage your company information and branding.',
};

export default function CompanyProfilePage() {
  return (
    <ProtectedRoute>
      <CompanyProfile />
    </ProtectedRoute>
  );
}
