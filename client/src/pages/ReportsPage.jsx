import { useState, useEffect } from 'react';
import reportService from '../services/report.service.js';
import SummaryCard from '../components/SummaryCard.jsx';
import ReadingsTable from '../components/ReadingsTable.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import EmptyState from '../components/EmptyState.jsx';
import Input from '../components/Input.jsx';
import { TrendingUp, TrendingDown, Activity, Hash, FileBarChart } from 'lucide-react';
import { getTodayStr } from '../utils/helpers.js';
import toast from 'react-hot-toast';

const REPORT_TABS = [
  { id: 'daily', label: 'Daily Report' },
  { id: 'month-to-date', label: 'Month-to-Date Report' },
  { id: 'monthly', label: 'Monthly Report (Previous Month)' },
];

const ReportsPage = () => {
  const [activeTab, setActiveTab] = useState('daily');
  const [date, setDate] = useState(getTodayStr());
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchReport = async () => {
      if (!date) return;
      setLoading(true);
      try {
        let response;
        if (activeTab === 'daily') {
          response = await reportService.getDaily(date);
        } else if (activeTab === 'month-to-date') {
          response = await reportService.getMonthToDate(date);
        } else {
          response = await reportService.getMonthly(date);
        }
        setReport(response.data.data);
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to load report.');
        setReport(null);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [activeTab, date]);

  const getReportDescription = () => {
    if (!report) return '';
    if (activeTab === 'daily') {
      return `Displaying readings for ${report.date}`;
    }
    if (activeTab === 'month-to-date') {
      return `Displaying month-to-date readings from ${report.startDate} to ${report.endDate}`;
    }
    return `Displaying previous full calendar month: ${report.month} (${report.startDate} to ${report.endDate})`;
  };

  const hasNoReadings = !loading && report && report.totalReadings === 0;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-black">Reports & Analytics</h1>
        <p className="text-sm text-[#86868B] mt-1">Review your blood glucose statistics across daily and monthly periods.</p>
      </div>

      {/* Report Selection Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[#E5E5EA] pb-3">
        {REPORT_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-[#007AFF] text-white shadow-sm'
                : 'bg-white text-[#333333] border border-[#E5E5EA] hover:bg-[#F5F5F7]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Date Selector */}
      <div className="bg-white border border-[#E5E5EA] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="max-w-xs w-full">
          <Input
            label="Selected Date"
            id="report-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            max={getTodayStr()}
          />
        </div>
        {report && (
          <div className="text-sm text-[#86868B] sm:text-right">
            {getReportDescription()}
          </div>
        )}
      </div>

      {loading ? (
        <LoadingSpinner message="Calculating report statistics..." />
      ) : hasNoReadings ? (
        <div className="bg-white border border-[#E5E5EA] rounded-xl p-6">
          <EmptyState
            icon={FileBarChart}
            title="No glucose readings found for this date."
            message="No readings match the selected reporting period and criteria."
          />
        </div>
      ) : report ? (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <SummaryCard
              title="Average Glucose"
              value={report.average !== null ? report.average : '—'}
              unit="mg/dL"
              icon={Activity}
            />
            <SummaryCard
              title="Highest Reading"
              value={report.highest !== null ? report.highest : '—'}
              unit="mg/dL"
              icon={TrendingUp}
            />
            <SummaryCard
              title="Lowest Reading"
              value={report.lowest !== null ? report.lowest : '—'}
              unit="mg/dL"
              icon={TrendingDown}
            />
            <SummaryCard
              title="Total Readings"
              value={report.totalReadings}
              unit="readings"
              icon={Hash}
            />
          </div>

          {/* Individual Readings Table */}
          <div className="bg-white border border-[#E5E5EA] rounded-xl p-5">
            <h3 className="text-base font-semibold text-black mb-4">Individual Readings</h3>
            <ReadingsTable readings={report.readings} showActions={false} />
          </div>
        </>
      ) : null}
    </div>
  );
};

export default ReportsPage;
