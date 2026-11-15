const SummaryCard = ({ title, value, unit = 'mg/dL', icon: Icon }) => {
  return (
    <div className="bg-white border border-[#E5E5EA] rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium text-[#86868B]">{title}</p>
        {Icon && (
          <div className="w-8 h-8 rounded-lg bg-[#EAF2FF] flex items-center justify-center">
            <Icon className="w-4 h-4 text-[#007AFF]" />
          </div>
        )}
      </div>
      <p className="text-2xl font-semibold text-black">
        {value !== null && value !== undefined ? value : '—'}
      </p>
      {value !== null && value !== undefined && (
        <p className="text-xs text-[#86868B] mt-1">{unit}</p>
      )}
    </div>
  );
};

export default SummaryCard;
