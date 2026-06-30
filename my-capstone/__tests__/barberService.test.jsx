import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import BarberService from '@/app/(booking)/BarberService/page';
import axios from 'axios';
import { useBooking } from '@/context/BookingContext';

jest.mock('axios');

// MOCK booking context
jest.mock('@/context/BookingContext', () => ({
  useBooking: jest.fn(),
}));

describe('BarberService', () => {
  const setSelectedBarberMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    useBooking.mockReturnValue({
      selectedServices: [
        { _id: '1', name: 'Haircut' },
      ],
      selectedBarber: null,
      setSelectedBarber: setSelectedBarberMock,
      totalPrice: 50,
      totalDuration: 40,
    });
  });

  test('fetches and displays barbers', async () => {
    axios.get.mockResolvedValue({
      data: {
        barbers: [
          {
            _id: 'b1',
            user: { firstName: 'John', lastName: 'Doe' },
          },
          {
            _id: 'b2',
            user: { firstName: 'Mike', lastName: 'Smith' },
          },
        ],
      },
    });

    render(<BarberService />);

    expect(await screen.findByText(/john doe/i)).toBeInTheDocument();
    expect(screen.getByText(/mike smith/i)).toBeInTheDocument();
  });

  test('calls setSelectedBarber when barber is clicked', async () => {
    axios.get.mockResolvedValue({
      data: {
        barbers: [
          {
            _id: 'b1',
            user: { firstName: 'John', lastName: 'Doe' },
          },
        ],
      },
    });

    render(<BarberService />);

    const barber = await screen.findByText(/john doe/i);

    fireEvent.click(barber);

    expect(setSelectedBarberMock).toHaveBeenCalledWith(
      expect.objectContaining({
        _id: 'b1',
      })
    );
  });

  test('renders selected services in sidebar', () => {
    axios.get.mockResolvedValue({
      data: { barbers: [] },
    });

    render(<BarberService />);

    expect(screen.getByText(/haircut/i)).toBeInTheDocument();
    expect(screen.getByText(/total price/i)).toBeInTheDocument();
    expect(screen.getByText(/total duration/i)).toBeInTheDocument();
  });
});