import { useAuth } from '../context/AuthContext.jsx';
import Card from '../components/Card.jsx';
import Button from '../components/Button.jsx';
import { User, Mail, Calendar, ShieldCheck, HeartPulse, LogOut } from 'lucide-react';
import { formatDate } from '../utils/helpers.js';
import { useNavigate } from 'react-router-dom';

const SettingsPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-black">Settings & Profile</h1>
        <p className="text-sm text-[#86868B] mt-1">Manage your account preferences and view system details.</p>
      </div>

      <Card>
        <h2 className="text-base font-semibold text-black mb-4">Account Profile</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#EAF2FF] flex items-center justify-center">
              <User className="w-5 h-5 text-[#007AFF]" />
            </div>
            <div>
              <p className="text-xs text-[#86868B]">Full Name</p>
              <p className="text-sm font-medium text-black">{user?.name || 'User'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#EAF2FF] flex items-center justify-center">
              <Mail className="w-5 h-5 text-[#007AFF]" />
            </div>
            <div>
              <p className="text-xs text-[#86868B]">Email Address</p>
              <p className="text-sm font-medium text-black">{user?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#EAF2FF] flex items-center justify-center">
              <Calendar className="w-4 h-4 text-[#007AFF]" />
            </div>
            <div>
              <p className="text-xs text-[#86868B]">Member Since</p>
              <p className="text-sm font-medium text-black">{formatDate(user?.createdAt)}</p>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="text-base font-semibold text-black mb-4">Application Information</h2>
        <div className="space-y-3 text-sm text-[#333333]">
          <div className="flex items-center gap-2">
            <HeartPulse className="w-4 h-4 text-[#007AFF]" />
            <span><strong>Sweety</strong> — Blood Glucose Tracker v1.0.0</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#007AFF]" />
            <span>Strict User Data Isolation & Secure JWT Cookie Authentication</span>
          </div>
          <p className="text-xs text-[#86868B] pt-2">
            Target glucose thresholds (70–180 mg/dL) shown in charts are for illustrative reference only and do not constitute medical advice.
          </p>
        </div>
      </Card>

      <div className="pt-2">
        <Button variant="secondary" onClick={handleLogout} className="w-full sm:w-auto">
          <LogOut className="w-4 h-4 mr-1 text-[#86868B]" /> Sign Out
        </Button>
      </div>
    </div>
  );
};

export default SettingsPage;
