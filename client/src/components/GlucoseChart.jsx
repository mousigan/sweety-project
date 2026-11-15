import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from 'recharts';
import EmptyState from './EmptyState.jsx';
import { BarChart3 } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-[#E5E5EA] rounded-lg p-3 shadow-sm">
      <p className="text-xs text-[#86868B] mb-1">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-sm font-medium text-black">
          {entry.value} mg/dL
          <span className="text-xs text-[#86868B] ml-1">({entry.payload.timeSlot})</span>
        </p>
      ))}
    </div>
  );
};

const GlucoseChart = ({ data = [], title = 'Glucose Trend' }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white border border-[#E5E5EA] rounded-xl p-5">
        <h3 className="text-base font-semibold text-black mb-4">{title}</h3>
        <EmptyState icon={BarChart3} title="No chart data"
          message="Add glucose readings to see your trend chart." />
      </div>
    );
  }

  const chartData = data.map((d, i) => ({
    ...d,
    label: d.date ? d.date.slice(5) : `#${i + 1}`,
  }));

  return (
    <div className="bg-white border border-[#E5E5EA] rounded-xl p-5">
      <h3 className="text-base font-semibold text-black mb-4">{title}</h3>
      <div className="h-64 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E5EA" />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#86868B' }}
              tickLine={false} axisLine={{ stroke: '#E5E5EA' }} />
            <YAxis tick={{ fontSize: 11, fill: '#86868B' }} tickLine={false}
              axisLine={{ stroke: '#E5E5EA' }} domain={['auto', 'auto']} />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={70} stroke="#E5E5EA" strokeDasharray="6 3"
              label={{ value: '70', position: 'right', fontSize: 10, fill: '#86868B' }} />
            <ReferenceLine y={180} stroke="#E5E5EA" strokeDasharray="6 3"
              label={{ value: '180', position: 'right', fontSize: 10, fill: '#86868B' }} />
            <Line type="monotone" dataKey="glucoseValue" stroke="#007AFF" strokeWidth={2}
              dot={{ r: 3, fill: '#007AFF', strokeWidth: 0 }}
              activeDot={{ r: 5, fill: '#007AFF' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-[#86868B] mt-2 text-center">
        Reference lines (70, 180) are illustrative only — not medical advice.
      </p>
    </div>
  );
};

export default GlucoseChart;
