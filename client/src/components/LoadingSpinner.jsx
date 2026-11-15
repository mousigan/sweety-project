import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 className="w-8 h-8 animate-spin text-[#007AFF] mb-3" />
      <p className="text-sm text-[#86868B]">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
