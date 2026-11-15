import { useState, useEffect } from 'react';
import Input from './Input.jsx';
import Select from './Select.jsx';
import Button from './Button.jsx';
import { TIME_SLOTS, GLUCOSE_MIN, GLUCOSE_MAX } from '../utils/constants.js';
import { getTodayStr, toInputDate } from '../utils/helpers.js';

const ReadingForm = ({ initialData = null, onSubmit, onCancel, loading = false }) => {
  const [form, setForm] = useState({ date: '', timeSlot: '', glucoseValue: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setForm({
        date: toInputDate(initialData.date),
        timeSlot: initialData.timeSlot || '',
        glucoseValue: initialData.glucoseValue?.toString() || '',
      });
    } else {
      setForm({ date: getTodayStr(), timeSlot: '', glucoseValue: '' });
    }
  }, [initialData]);

  const validate = () => {
    const newErrors = {};
    const today = getTodayStr();
    if (!form.date) {
      newErrors.date = 'Date is required.';
    } else if (form.date > today) {
      newErrors.date = 'Date cannot be in the future.';
    }
    if (!form.timeSlot) {
      newErrors.timeSlot = 'Time slot is required.';
    }
    if (!form.glucoseValue) {
      newErrors.glucoseValue = 'Please enter a glucose value.';
    } else {
      const val = parseInt(form.glucoseValue, 10);
      if (isNaN(val) || val < GLUCOSE_MIN || val > GLUCOSE_MAX) {
        newErrors.glucoseValue = 'Value must be between 40 and 600 mg/dl.';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit({
      date: form.date,
      timeSlot: form.timeSlot,
      glucoseValue: parseInt(form.glucoseValue, 10),
    });
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <Input label="Date" id="reading-date" type="date" value={form.date}
        onChange={handleChange('date')} max={getTodayStr()} error={errors.date} />
      <Select label="Time Slot" id="reading-timeslot" value={form.timeSlot}
        onChange={handleChange('timeSlot')} options={TIME_SLOTS}
        placeholder="Select a time slot" error={errors.timeSlot} />
      <Input label="Glucose Value (mg/dL)" id="reading-value" type="number"
        min={GLUCOSE_MIN} max={GLUCOSE_MAX} value={form.glucoseValue}
        onChange={handleChange('glucoseValue')} placeholder="Enter glucose value"
        error={errors.glucoseValue} />
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit" loading={loading}>
          {initialData ? 'Update Reading' : 'Save Reading'}
        </Button>
      </div>
    </form>
  );
};

export default ReadingForm;
