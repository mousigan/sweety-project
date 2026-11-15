import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import Card from '../components/Card.jsx';
import Button from '../components/Button.jsx';
import Input from '../components/Input.jsx';
import Modal from '../components/Modal.jsx';
import { User, Mail, Calendar, ShieldCheck, HeartPulse, LogOut, Edit3, KeyRound } from 'lucide-react';
import { formatDate } from '../utils/helpers.js';
import { useNavigate } from 'react-router-dom';
import authService from '../services/auth.service.js';
import toast from 'react-hot-toast';

const SettingsPage = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();

  // Edit Profile Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
    }
  }, [user]);

  const handleOpenEdit = () => {
    setName(user?.name || '');
    setCurrentPassword('');
    setNewPassword('');
    setError('');
    setIsEditModalOpen(true);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Name cannot be empty.');
      return;
    }

    if (newPassword && newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword && !currentPassword) {
      setError('Please provide your current password to set a new password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = { name: name.trim() };
      if (newPassword) {
        payload.currentPassword = currentPassword;
        payload.newPassword = newPassword;
      }

      const res = await authService.updateProfile(payload);
      updateUser(res.data.data.user);
      toast.success('Account profile updated successfully!');
      setIsEditModalOpen(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-black">Settings & Profile</h1>
          <p className="text-sm text-[#86868B] mt-1">Manage your account preferences and view system details.</p>
        </div>
        <Button variant="primary" size="md" onClick={handleOpenEdit}>
          <Edit3 className="w-4 h-4" /> Edit Profile
        </Button>
      </div>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-black">Account Profile</h2>
          <span className="text-xs px-2.5 py-1 rounded-full bg-[#EAF2FF] text-[#007AFF] font-medium">
            Active Account
          </span>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-2 border-b border-[#F5F5F7]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#EAF2FF] flex items-center justify-center">
                <User className="w-5 h-5 text-[#007AFF]" />
              </div>
              <div>
                <p className="text-xs text-[#86868B]">Full Name</p>
                <p className="text-sm font-medium text-black">{user?.name || 'User'}</p>
              </div>
            </div>
            <button
              onClick={handleOpenEdit}
              className="text-xs font-medium text-[#007AFF] hover:underline"
            >
              Change
            </button>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-[#F5F5F7]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#EAF2FF] flex items-center justify-center">
                <Mail className="w-5 h-5 text-[#007AFF]" />
              </div>
              <div>
                <p className="text-xs text-[#86868B]">Email Address</p>
                <p className="text-sm font-medium text-black">{user?.email}</p>
              </div>
            </div>
            <span className="text-xs text-[#86868B]">Primary ID</span>
          </div>

          <div className="flex items-center gap-3 py-2">
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

      {/* Edit Profile Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Account Profile">
        <form onSubmit={handleSaveProfile} noValidate className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
              {error}
            </div>
          )}

          <Input
            label="Full Name"
            id="edit-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your full name"
            required
          />

          <div className="pt-2 border-t border-[#E5E5EA]">
            <p className="text-xs font-semibold text-[#86868B] uppercase tracking-wider mb-3">
              Change Password (Optional)
            </p>

            <div className="space-y-3">
              <Input
                label="Current Password"
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Required if changing password"
              />

              <Input
                label="New Password"
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimum 6 characters"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsEditModalOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default SettingsPage;
