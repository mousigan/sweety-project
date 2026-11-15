import { useState, useEffect, useCallback } from 'react';
import useReadings from '../hooks/useReadings.js';
import ReadingsTable from '../components/ReadingsTable.jsx';
import ReadingForm from '../components/ReadingForm.jsx';
import Modal from '../components/Modal.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import Button from '../components/Button.jsx';
import Pagination from '../components/Pagination.jsx';
import Input from '../components/Input.jsx';
import { Plus, Filter, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { getTodayStr } from '../utils/helpers.js';

const ReadingsPage = () => {
  const { readings, pagination, loading, fetchReadings, createReading, updateReading, deleteReading } = useReadings();
  const [page, setPage] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editReading, setEditReading] = useState(null);
  const [viewReading, setViewReading] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const loadReadings = useCallback(() => {
    const params = { page, limit: 10, sortBy: 'date', sortOrder: 'desc' };
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    fetchReadings(params);
  }, [fetchReadings, page, startDate, endDate]);

  useEffect(() => {
    loadReadings();
  }, [loadReadings]);

  const handleAdd = async (data) => {
    setFormLoading(true);
    try {
      await createReading(data);
      setShowAddModal(false);
      loadReadings();
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
      loadReadings();
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
      loadReadings();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete reading.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const resetFilters = () => {
    setStartDate('');
    setEndDate('');
    setPage(1);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-black">Glucose Readings</h1>
          <p className="text-sm text-[#86868B] mt-1">Manage and track your blood glucose logs.</p>
        </div>
        <Button onClick={() => setShowAddModal(true)} size="md">
          <Plus className="w-4 h-4" /> Add Reading
        </Button>
      </div>

      {/* Date Filter Bar */}
      <div className="bg-white border border-[#E5E5EA] rounded-xl p-4 flex flex-col sm:flex-row sm:items-end gap-3">
        <div className="flex items-center gap-2 text-sm font-medium text-[#333333] mb-1 sm:mb-2">
          <Filter className="w-4 h-4 text-[#007AFF]" />
          <span>Filter:</span>
        </div>
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="From Date"
            id="start-date"
            type="date"
            value={startDate}
            onChange={(e) => { setStartDate(e.target.value); setPage(1); }}
            max={endDate || getTodayStr()}
          />
          <Input
            label="To Date"
            id="end-date"
            type="date"
            value={endDate}
            onChange={(e) => { setEndDate(e.target.value); setPage(1); }}
            min={startDate}
            max={getTodayStr()}
          />
        </div>
        {(startDate || endDate) && (
          <Button variant="secondary" size="md" onClick={resetFilters}>
            <X className="w-4 h-4" /> Reset
          </Button>
        )}
      </div>

      {/* Readings Table Card */}
      <div className="bg-white border border-[#E5E5EA] rounded-xl p-5">
        {loading ? (
          <LoadingSpinner message="Loading readings..." />
        ) : (
          <>
            <ReadingsTable
              readings={readings}
              onView={(r) => setViewReading(r)}
              onEdit={(r) => setEditReading(r)}
              onDelete={(r) => setDeleteTarget(r)}
            />
            <Pagination
              page={pagination?.page || 1}
              totalPages={pagination?.totalPages || 1}
              onPageChange={setPage}
            />
          </>
        )}
      </div>

      {/* Add Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add Glucose Reading">
        <ReadingForm onSubmit={handleAdd} onCancel={() => setShowAddModal(false)} loading={formLoading} />
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={!!editReading} onClose={() => setEditReading(null)} title="Edit Glucose Reading">
        <ReadingForm
          initialData={editReading}
          onSubmit={handleEdit}
          onCancel={() => setEditReading(null)}
          loading={formLoading}
        />
      </Modal>

      {/* View Modal */}
      <Modal isOpen={!!viewReading} onClose={() => setViewReading(null)} title="Reading Details">
        {viewReading && (
          <div className="space-y-4">
            <div>
              <p className="text-xs text-[#86868B]">Date</p>
              <p className="text-base font-medium text-black">
                {new Date(viewReading.date).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                  timeZone: 'UTC',
                })}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#86868B]">Time Slot</p>
              <p className="text-base font-medium text-black">{viewReading.timeSlot}</p>
            </div>
            <div>
              <p className="text-xs text-[#86868B]">Glucose Value</p>
              <p className="text-2xl font-semibold text-black">
                {viewReading.glucoseValue} <span className="text-sm font-normal text-[#86868B]">mg/dL</span>
              </p>
            </div>
            <div className="flex justify-end pt-3">
              <Button variant="secondary" onClick={() => setViewReading(null)}>Close</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Reading"
        message="Are you sure you want to delete this glucose reading? This action cannot be undone."
        confirmText="Delete"
        loading={deleteLoading}
      />
    </div>
  );
};

export default ReadingsPage;
