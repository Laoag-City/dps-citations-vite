// src/__tests__/Dashboard.test.jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import axios from 'axios';
import Dashboard from '../components/Dashboard';
import { logout } from '../features/auth/authSlice';

jest.mock('axios');
jest.mock('../features/auth/authSlice', () => ({
  logout: jest.fn(),
}));

const mockStore = configureStore([thunk]);
const initialState = {
  auth: {
    token: 'test-token',
    user: { username: 'testuser', userrole: 'admin' },
  },
};
let store;

beforeEach(() => {
  store = mockStore(initialState);
});

const renderWithProviders = (ui) => {
  return render(
    <Provider store={store}>
      <Router>{ui}</Router>
    </Provider>
  );
};

test('renders Dashboard and fetches citations', async () => {
  axios.get.mockResolvedValueOnce({
    data: {
      dpsCitations: [
        {
          _id: '1',
          ticketNumber: '12345',
          licenseNumber: 'A1234567',
          dateApprehended: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), // 8 days ago
          streetApprehended: 'Main St',
          plateNumber: 'ABC123',
          vehicleColor: 'Red',
          apprehendingOfficer: 'Officer A',
          amendStatus: false,
          violations: [
            { _id: 'v1', violation: 'Speeding', amount: 50, remarks: 'Over limit' },
          ],
        },
      ],
      totalPages: 1,
    },
  });

  renderWithProviders(<Dashboard />);

  expect(screen.getByText(/DPS Citation List/i)).toBeInTheDocument();
  await waitFor(() => {
    expect(screen.getByText(/12345/i)).toBeInTheDocument();
    expect(screen.getByText(/A1234567/i)).toBeInTheDocument();
  });

  const row = screen.getByText(/12345/i).closest('tr');
  expect(row).toHaveClass('table-danger');

  const amendButton = screen.getByRole('button', { name: /Amend/i });
  expect(amendButton).toBeInTheDocument();
});

test('displays error on fetch failure', async () => {
  axios.get.mockRejectedValueOnce(new Error('Failed to fetch'));

  renderWithProviders(<Dashboard />);

  await waitFor(() => {
    expect(screen.getByText(/Failed to fetch data. Please try again later./i)).toBeInTheDocument();
  });
});

test('opens and closes modal with citation details', async () => {
  axios.get.mockResolvedValueOnce({
    data: {
      dpsCitations: [
        {
          _id: '1',
          ticketNumber: '12345',
          licenseNumber: 'A1234567',
          dateApprehended: '2023-07-24T00:00:00Z',
          streetApprehended: 'Main St',
          plateNumber: 'ABC123',
          vehicleColor: 'Red',
          apprehendingOfficer: 'Officer A',
          amendStatus: false,
          violations: [
            { _id: 'v1', violation: 'Speeding', amount: 50, remarks: 'Over limit' },
          ],
        },
      ],
      totalPages: 1,
    },
  });

  renderWithProviders(<Dashboard />);

  await waitFor(() => {
    fireEvent.click(screen.getByText(/12345/i));
  });

  await waitFor(() => {
    expect(screen.getByText(/Citation Details/i)).toBeInTheDocument();
    expect(screen.getByText(/Speeding/i)).toBeInTheDocument();
  });

  fireEvent.click(screen.getByRole('button', { name: /Close/i }));

  await waitFor(() => {
    expect(screen.queryByText(/Citation Details/i)).not.toBeInTheDocument();
  });
});

test('logs out and redirects on 401 error', async () => {
  axios.get.mockRejectedValueOnce({ response: { status: 401 } });

  renderWithProviders(<Dashboard />);

  await waitFor(() => {
    expect(logout).toHaveBeenCalled();
  });
});
