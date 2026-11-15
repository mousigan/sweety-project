import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Droplets, FileBarChart, Settings, LogOut, X, Activity } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/readings', label: 'Glucose Readings', icon: Droplets },
  { to: '/reports', label: 'Reports', icon: FileBarChart },
  { to: '/settings', label: 'Settings', icon: Settings },
];

const Sidebar = ({ isOpen, onClose }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={onClose} />}
      <aside className={`fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-[#E5E5EA] flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:z-auto ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-5 border-b border-[#E5E5EA]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#007AFF] flex items-center justify-center">
              <Activity className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-semibold text-black">Sweety</span>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-[#F5F5F7] lg:hidden">
            <X className="w-5 h-5 text-[#86868B]" />
          </button>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-[#EAF2FF] text-[#007AFF]' : 'text-[#333333] hover:bg-[#F5F5F7]'}`
              }>
              <Icon className="w-5 h-5" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-[#E5E5EA]">
          <button onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#333333] hover:bg-[#F5F5F7] transition-colors w-full">
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
