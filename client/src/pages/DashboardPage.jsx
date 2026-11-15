import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import dashboardService from '../services/dashboard.service.js';
import SummaryCard from '../components/SummaryCard.jsx';
import GlucoseChart from '../components/GlucoseChart.jsx';
import ReadingsTable from '../components/ReadingsTable.jsx';
import Modal from '../components/Modal.jsx';
import ReadingForm from '../components/ReadingForm.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import Button from '../components/Button.jsx';
import { Activity, TrendingUp, TrendingDown, Hash, Plus } from 'lucide-react';
import { getGreeting } from '../utils/helpers.js';
import useReadings from '../hooks/useReadings.js';
import toast from 'react-hot-toast';

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { createReading, updateReading, deleteReading } = useReadings();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState(30);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editReading, setEditReading] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const response = await dashboardService.getData({ days: period });
      setDashboard(response.data.data);
    } catch (err) {
      toast.error('Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => { fetchDashboard(); }, [fetchDashboard]);

  const handleAdd = async (data) => {
    setFormLoading(true);
    try {
      await createReading(data);
      setShowAddModal(false);
      fetchDashboard();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add reading.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = async (data) => {
    setFormLoading(true);
    try {
      await updateReading(editReading.id, data);
      setEditReading(null);
      fetchDashboard();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update reading.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await deleteReading(deleteTarget.id);
      setDeleteTarget(null);
      fetchDashboard();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete reading.');
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading dashboard..." />;

  const { summary, chartData, recentReadings } = dashboard || {};

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-black">
            {getGreeting()}, {user?.name?.split(' ')[0]}
          </h1>
          <p className="text-sm text-[#86868B] mt-1">
            Track your blood glucose readings and review your daily progress.
          </p>
        </div>
        <Button onClick={() => setShowAddModal(true)} size="md">
          <Plus className="w-4 h-4" /> Add Reading
        </Button>
      </div>

      {/* Period Selector */}
      <div className="flex gap-2">
        {[7, 14, 30, 90].map((d) => (
          <button key={d} onClick={() => setPeriod(d)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              period === d ? 'bg-[#007AFF] text-white' : 'bg-white text-[#333333] border border-[#E5E5EA] hover:bg-[#F5F5F7]'
            }`}>
            {d}d
          </button>
        ))}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard title="Average Glucose" value={summary?.averageGlucose} icon={Activity} />
        <SummaryCard title="Highest Reading" value={summary?.highestReading} icon={TrendingUp} />
        <SummaryCard title="Lowest Reading" value={summary?.lowestReading} icon={TrendingDown} />
        <SummaryCard title="Total Readings" value={summary?.totalReadings} unit="readings" icon={Hash} />
      </div>

      {/* Chart */}
      <GlucoseChart data={chartData} title={`Glucose Trend (Last ${period} days)`} />

      {/* Recent Readings */}
      <div className="bg-white border border-[#E5E5EA] rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-black">Recent Readings</h3>
          <Button variant="ghost" size="sm" onClick={() => navigate('/readings')}>View All</Button>
        </div>
        <ReadingsTable
          readings={recentReadings}
          onView={(r) => navigate('/readings')}
          onEdit={(r) => setEditReading(r)}
          onDelete={(r) => setDeleteTarget(r)}
        />
      </div>

      {/* Add Reading Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add Glucose Reading">
        <ReadingForm onSubmit={handleAdd} onCancel={() => setShowAddModal(false)} loading={formLoading} />
      </Modal>

      {/* Edit Reading Modal */}
      <Modal isOpen={!!editReading} onClose={() => setEditReading(null)} title="Edit Glucose Reading">
        <ReadingForm initialData={editReading} onSubmit={handleEdit}
          onCancel={() => setEditReading(null)} loading={formLoading} />
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete} title="Delete Reading"
        message="Are you sure you want to delete this glucose reading? This action cannot be undone."
        confirmText="Delete" loading={deleteLoading} />
    </div>
  );
};

export default DashboardPage;
