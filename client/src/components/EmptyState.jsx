import { Inbox } from 'lucide-react';

const EmptyState = ({ icon: Icon = Inbox, title = 'No data found', message = 'There is nothing to display yet.', action }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="w-12 h-12 rounded-full bg-[#F5F5F7] flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-[#86868B]" />
      </div>
      <h3 className="text-base font-medium text-[#333333] mb-1">{title}</h3>
      <p className="text-sm text-[#86868B] text-center max-w-sm mb-4">{message}</p>
      {action}
    </div>
  );
};

export default EmptyState;
