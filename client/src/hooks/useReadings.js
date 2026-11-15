import { useState, useCallback } from 'react';
import readingService from '../services/reading.service.js';
import toast from 'react-hot-toast';

const useReadings = () => {
  const [readings, setReadings] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReadings = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await readingService.getAll(params);
      setReadings(response.data.data.readings);
      setPagination(response.data.data.pagination);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch readings.');
    } finally {
      setLoading(false);
    }
  }, []);

  const createReading = async (data) => {
    const response = await readingService.create(data);
    toast.success('Reading added successfully.');
    return response.data;
  };

  const updateReading = async (id, data) => {
    const response = await readingService.update(id, data);
    toast.success('Reading updated successfully.');
    return response.data;
  };

  const deleteReading = async (id) => {
    await readingService.delete(id);
    toast.success('Reading deleted successfully.');
  };

  return { readings, pagination, loading, error, fetchReadings, createReading, updateReading, deleteReading };
};

export default useReadings;
