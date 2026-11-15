import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ page, totalPages, onPageChange }) => {
  if (!totalPages || totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-2 py-4">
      <button onClick={() => onPageChange(page - 1)} disabled={page <= 1}
        className="p-2 rounded-lg border border-[#E5E5EA] hover:bg-[#F5F5F7] disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
        <ChevronLeft className="w-4 h-4 text-[#333333]" />
      </button>
      <span className="text-sm text-[#86868B] px-3">Page {page} of {totalPages}</span>
      <button onClick={() => onPageChange(page + 1)} disabled={page >= totalPages}
        className="p-2 rounded-lg border border-[#E5E5EA] hover:bg-[#F5F5F7] disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
        <ChevronRight className="w-4 h-4 text-[#333333]" />
      </button>
    </div>
  );
};

export default Pagination;
