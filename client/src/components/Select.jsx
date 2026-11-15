const Select = ({ label, error, id, options = [], placeholder = 'Select an option', className = '', ...props }) => {
  return (
    <div className={className}>
      {label && <label htmlFor={id} className="block text-sm font-medium text-[#333333] mb-1.5">{label}</label>}
      <select
        id={id}
        className={`w-full px-3 py-2 rounded-lg border bg-white text-black text-sm focus:outline-none focus:ring-2 focus:ring-[#007AFF] focus:border-[#007AFF] transition-colors duration-150 ${error ? 'border-red-400' : 'border-[#E5E5EA]'}`}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value || opt} value={opt.value || opt}>{opt.label || opt}</option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default Select;
