import { Eye, Pencil, Trash2, FileText } from 'lucide-react';
import { formatDate } from '../utils/helpers.js';
import EmptyState from './EmptyState.jsx';

const ReadingsTable = ({ readings = [], onView, onEdit, onDelete, showActions = true }) => {
  if (!readings || readings.length === 0) {
    return (
      <EmptyState icon={FileText} title="No readings found"
        message="No glucose readings to display. Start by adding your first reading." />
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#E5E5EA]">
            <th className="text-left py-3 px-4 font-medium text-[#86868B]">Date</th>
            <th className="text-left py-3 px-4 font-medium text-[#86868B]">Time Slot</th>
            <th className="text-left py-3 px-4 font-medium text-[#86868B]">Glucose Value</th>
            {showActions && (
              <th className="text-right py-3 px-4 font-medium text-[#86868B]">Actions</th>
            )}
          </tr>
        </thead>
        <tbody>
          {readings.map((reading) => (
            <tr key={reading.id}
              className="border-b border-[#F5F5F7] hover:bg-[#F5F5F7] transition-colors">
              <td className="py-3 px-4 text-black">{formatDate(reading.date)}</td>
              <td className="py-3 px-4 text-[#333333]">{reading.timeSlot}</td>
              <td className="py-3 px-4">
                <span className="font-medium text-black">{reading.glucoseValue}</span>
                <span className="text-[#86868B] ml-1">mg/dL</span>
              </td>
              {showActions && (
                <td className="py-3 px-4">
                  <div className="flex justify-end gap-1">
                    {onView && (
                      <button onClick={() => onView(reading)}
                        className="p-1.5 rounded-lg hover:bg-[#EAF2FF] transition-colors" title="View">
                        <Eye className="w-4 h-4 text-[#007AFF]" />
                      </button>
                    )}
                    {onEdit && (
                      <button onClick={() => onEdit(reading)}
                        className="p-1.5 rounded-lg hover:bg-[#EAF2FF] transition-colors" title="Edit">
                        <Pencil className="w-4 h-4 text-[#86868B]" />
                      </button>
                    )}
                    {onDelete && (
                      <button onClick={() => onDelete(reading)}
                        className="p-1.5 rounded-lg hover:bg-red-50 transition-colors" title="Delete">
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReadingsTable;
