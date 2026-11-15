import { Outlet } from 'react-router-dom';
import { Activity } from 'lucide-react';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl bg-[#007AFF] flex items-center justify-center">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-semibold text-black">Sweety</span>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
