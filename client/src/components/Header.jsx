import { Menu, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const Header = ({ onMenuToggle }) => {
  const { user } = useAuth();
  return (
    <header className="bg-white border-b border-[#E5E5EA] px-4 sm:px-6 py-3">
      <div className="flex items-center justify-between">
        <button onClick={onMenuToggle} className="p-2 rounded-lg hover:bg-[#F5F5F7] lg:hidden">
          <Menu className="w-5 h-5 text-[#333333]" />
        </button>
        <div className="flex items-center gap-3 ml-auto">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-black">{user?.name}</p>
            <p className="text-xs text-[#86868B]">{user?.email}</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-[#EAF2FF] flex items-center justify-center">
            <User className="w-4 h-4 text-[#007AFF]" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
