import { Loader2 } from 'lucide-react';

const variants = {
  primary: 'bg-[#007AFF] text-white hover:bg-[#0066DD] focus:ring-[#007AFF]',
  secondary: 'bg-white text-black border border-[#E5E5EA] hover:bg-[#F5F5F7] focus:ring-[#007AFF]',
  danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500',
  ghost: 'bg-transparent text-[#007AFF] hover:bg-[#EAF2FF] focus:ring-[#007AFF]',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-2.5 text-base',
};

const Button = ({ children, variant = 'primary', size = 'md', loading = false, disabled = false, className = '', ...props }) => {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
};

export default Button;
