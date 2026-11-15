import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';

// Components
import Button from '../components/Button.jsx';
import Input from '../components/Input.jsx';
import Select from '../components/Select.jsx';
import SummaryCard from '../components/SummaryCard.jsx';
import EmptyState from '../components/EmptyState.jsx';
import ReadingsTable from '../components/ReadingsTable.jsx';
import ReadingForm from '../components/ReadingForm.jsx';
import Modal from '../components/Modal.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import LoginPage from '../pages/LoginPage.jsx';
import RegisterPage from '../pages/RegisterPage.jsx';

// Context mock
vi.mock('../context/AuthContext.jsx', () => ({
  useAuth: () => ({
    user: { id: 1, name: 'John Doe', email: 'john@example.com' },
    isAuthenticated: true,
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
  }),
}));

// Recharts ResponsiveContainer mock for tests
vi.mock('recharts', async () => {
  const original = await vi.importActual('recharts');
  return {
    ...original,
    ResponsiveContainer: ({ children }) => (
      <div style={{ width: '500px', height: '300px' }}>{children}</div>
    ),
  };
});

describe('Sweety Frontend UI & Component Tests', () => {
  // ============================================
  // 1. Reusable Components
  // ============================================
  describe('Base UI Components', () => {
    it('renders Button correctly with variant classes and handles clicks', async () => {
      const handleClick = vi.fn();
      render(
        <Button variant="primary" onClick={handleClick}>
          Click Me
        </Button>
      );
      const btn = screen.getByRole('button', { name: /click me/i });
      expect(btn).toBeInTheDocument();
      expect(btn.className).toContain('bg-[#007AFF]');

      await userEvent.click(btn);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('renders Input with label, placeholder and error message', () => {
      render(
        <Input
          label="Email Address"
          id="email-input"
          placeholder="user@example.com"
          error="Email is required."
        />
      );
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText('user@example.com')).toBeInTheDocument();
      expect(screen.getByText('Email is required.')).toBeInTheDocument();
    });

    it('renders Select dropdown with options', () => {
      const options = ['Morning (fasting)', 'After breakfast'];
      render(
        <Select
          label="Time Slot"
          id="slot-select"
          options={options}
          placeholder="Choose slot"
        />
      );
      expect(screen.getByLabelText(/time slot/i)).toBeInTheDocument();
      expect(screen.getByText('Choose slot')).toBeInTheDocument();
      expect(screen.getByText('Morning (fasting)')).toBeInTheDocument();
    });

    it('renders SummaryCard with title, calculated value, and unit', () => {
      render(
        <SummaryCard title="Average Glucose" value={118.5} unit="mg/dL" />
      );
      expect(screen.getByText('Average Glucose')).toBeInTheDocument();
      expect(screen.getByText('118.5')).toBeInTheDocument();
      expect(screen.getByText('mg/dL')).toBeInTheDocument();
    });

    it('renders EmptyState with custom title and message', () => {
      render(
        <EmptyState
          title="No glucose readings found for this date."
          message="Please add your first reading."
        />
      );
      expect(
        screen.getByText('No glucose readings found for this date.')
      ).toBeInTheDocument();
      expect(
        screen.getByText('Please add your first reading.')
      ).toBeInTheDocument();
    });

    it('renders ConfirmDialog and responds to confirm and cancel', async () => {
      const onConfirm = vi.fn();
      const onClose = vi.fn();

      render(
        <ConfirmDialog
          isOpen={true}
          onClose={onClose}
          onConfirm={onConfirm}
          title="Delete Reading"
          message="Are you sure you want to delete this reading?"
          confirmText="Delete"
        />
      );

      expect(screen.getByText('Delete Reading')).toBeInTheDocument();
      expect(
        screen.getByText('Are you sure you want to delete this reading?')
      ).toBeInTheDocument();

      const cancelBtn = screen.getByRole('button', { name: /cancel/i });
      await userEvent.click(cancelBtn);
      expect(onClose).toHaveBeenCalled();

      const deleteBtn = screen.getByRole('button', { name: /delete/i });
      await userEvent.click(deleteBtn);
      expect(onConfirm).toHaveBeenCalled();
    });
  });

  // ============================================
  // 2. Readings Table Component
  // ============================================
  describe('ReadingsTable Component', () => {
    it('renders empty state when readings array is empty', () => {
      render(<ReadingsTable readings={[]} />);
      expect(screen.getByText(/no readings found/i)).toBeInTheDocument();
    });

    it('renders rows with date, time slot, and glucose value', () => {
      const mockReadings = [
        {
          id: 1,
          date: '2026-11-14T00:00:00.000Z',
          timeSlot: 'Morning (fasting)',
          glucoseValue: 105,
        },
        {
          id: 2,
          date: '2026-11-14T00:00:00.000Z',
          timeSlot: 'After lunch',
          glucoseValue: 142,
        },
      ];

      render(<ReadingsTable readings={mockReadings} />);
      expect(screen.getByText('Morning (fasting)')).toBeInTheDocument();
      expect(screen.getByText('105')).toBeInTheDocument();
      expect(screen.getByText('After lunch')).toBeInTheDocument();
      expect(screen.getByText('142')).toBeInTheDocument();
    });
  });

  // ============================================
  // 3. Add Reading Form Validation
  // ============================================
  describe('ReadingForm Validation', () => {
    it('validates required fields and exact error messages', async () => {
      const onSubmit = vi.fn();
      const onCancel = vi.fn();

      render(<ReadingForm onSubmit={onSubmit} onCancel={onCancel} />);

      const saveBtn = screen.getByRole('button', { name: /save reading/i });
      await userEvent.click(saveBtn);

      // Form validation should prevent submit and show errors
      expect(onSubmit).not.toHaveBeenCalled();
      expect(screen.getByText('Time slot is required.')).toBeInTheDocument();
      expect(
        screen.getByText('Please enter a glucose value.')
      ).toBeInTheDocument();
    });

    it('validates glucose range between 40 and 600 mg/dl', async () => {
      const onSubmit = vi.fn();
      render(<ReadingForm onSubmit={onSubmit} onCancel={vi.fn()} />);

      const glucoseInput = screen.getByLabelText(/glucose value/i);
      await userEvent.type(glucoseInput, '35');

      const slotSelect = screen.getByLabelText(/time slot/i);
      await userEvent.selectOptions(slotSelect, 'Morning (fasting)');

      const saveBtn = screen.getByRole('button', { name: /save reading/i });
      await userEvent.click(saveBtn);

      expect(
        screen.getByText('Value must be between 40 and 600 mg/dl.')
      ).toBeInTheDocument();
      expect(onSubmit).not.toHaveBeenCalled();
    });

    it('submits valid reading data successfully', async () => {
      const onSubmit = vi.fn();
      render(<ReadingForm onSubmit={onSubmit} onCancel={vi.fn()} />);

      const glucoseInput = screen.getByLabelText(/glucose value/i);
      await userEvent.clear(glucoseInput);
      await userEvent.type(glucoseInput, '115');

      const slotSelect = screen.getByLabelText(/time slot/i);
      await userEvent.selectOptions(slotSelect, 'Morning (fasting)');

      const saveBtn = screen.getByRole('button', { name: /save reading/i });
      await userEvent.click(saveBtn);

      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          glucoseValue: 115,
          timeSlot: 'Morning (fasting)',
        })
      );
    });
  });

  // ============================================
  // 4. Login & Register Form Validation
  // ============================================
  describe('Authentication Forms Validation', () => {
    it('validates login form required fields', async () => {
      render(
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      );

      const submitBtn = screen.getByRole('button', { name: /sign in/i });
      await userEvent.click(submitBtn);

      expect(screen.getByText('Email is required.')).toBeInTheDocument();
      expect(screen.getByText('Password is required.')).toBeInTheDocument();
    });

    it('validates registration form password matching and length', async () => {
      render(
        <BrowserRouter>
          <RegisterPage />
        </BrowserRouter>
      );

      const nameInput = screen.getByLabelText(/full name/i);
      await userEvent.type(nameInput, 'Alex');

      const emailInput = screen.getByLabelText(/email/i);
      await userEvent.type(emailInput, 'alex@example.com');

      const passInput = screen.getByLabelText(/^password/i);
      await userEvent.type(passInput, '12345'); // Too short

      const confirmInput = screen.getByLabelText(/confirm password/i);
      await userEvent.type(confirmInput, '123456'); // Mismatched

      const submitBtn = screen.getByRole('button', { name: /create account/i });
      await userEvent.click(submitBtn);

      expect(
        screen.getByText('Password must be at least 6 characters long.')
      ).toBeInTheDocument();
    });
  });
});

import DashboardPage from '../pages/DashboardPage.jsx';
import ReportsPage from '../pages/ReportsPage.jsx';

describe('Page Integration Rendering', () => {
  it('renders DashboardPage structure properly', async () => {
    render(
      <BrowserRouter>
        <DashboardPage />
      </BrowserRouter>
    );

    // Should display loading or greeting
    expect(screen.getByText(/loading dashboard/i)).toBeInTheDocument();
  });

  it('renders ReportsPage tab headers and date selector properly', () => {
    render(
      <BrowserRouter>
        <ReportsPage />
      </BrowserRouter>
    );

    expect(screen.getByText('Reports & Analytics')).toBeInTheDocument();
    expect(screen.getByText('Daily Report')).toBeInTheDocument();
    expect(screen.getByText('Month-to-Date Report')).toBeInTheDocument();
    expect(screen.getByText('Monthly Report (Previous Month)')).toBeInTheDocument();
    expect(screen.getByLabelText(/selected date/i)).toBeInTheDocument();
  });
});
