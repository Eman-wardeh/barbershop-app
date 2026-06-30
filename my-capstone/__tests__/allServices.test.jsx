import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AllServices from '@/app/(booking)/AllServices/page'; 
import axios from 'axios';
import { useBooking } from '@/context/BookingContext';
import { useRouter } from 'next/navigation';

jest.mock('axios');

// MOCK router
const pushMock = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

// MOCK booking context
jest.mock('@/context/BookingContext', () => ({
  useBooking: jest.fn(),
}));

describe('AllServices', () => {
  const setSelectedServicesMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    useBooking.mockReturnValue({
      selectedServices: [],
      setSelectedServices: setSelectedServicesMock,
      totalPrice: 0,
      totalDuration: 0,
    });
  });

  test('fetches and displays services', async () => {
    axios.get.mockResolvedValue({
      data: {
        services: [
          { _id: '1', name: 'Haircut', price: 20, duration: 30 },
          { _id: '2', name: 'Shave', price: 10, duration: 15 },
        ],
      },
    });

    render(<AllServices />);

    expect(await screen.findByText('Haircut')).toBeInTheDocument();
    expect(screen.getByText('Shave')).toBeInTheDocument();
  });

  test('selects a service when clicked', async () => {
    axios.get.mockResolvedValue({
      data: {
        services: [
          { _id: '1', name: 'Haircut', price: 20, duration: 30 },
        ],
      },
    });

    useBooking.mockReturnValue({
      selectedServices: [],
      setSelectedServices: setSelectedServicesMock,
      totalPrice: 0,
      totalDuration: 0,
    });

    render(<AllServices />);

    const button = await screen.findByRole('button', { name: /select/i });

    fireEvent.click(button);

    expect(setSelectedServicesMock).toHaveBeenCalled();
  });

  test('shows proceed button when service selected', () => {
    useBooking.mockReturnValue({
      selectedServices: [{ _id: '1', name: 'Haircut' }],
      setSelectedServices: setSelectedServicesMock,
      totalPrice: 20,
      totalDuration: 30,
    });

    axios.get.mockResolvedValue({
      data: { services: [] },
    });

    render(<AllServices />);

    expect(screen.getByText(/proceed/i)).toBeInTheDocument();
  });

  test('navigates on proceed click', () => {
    useBooking.mockReturnValue({
      selectedServices: [{ _id: '1', name: 'Haircut' }],
      setSelectedServices: setSelectedServicesMock,
      totalPrice: 20,
      totalDuration: 30,
    });

    axios.get.mockResolvedValue({
      data: { services: [] },
    });

    render(<AllServices />);

    fireEvent.click(screen.getByText(/proceed/i));

    expect(pushMock).toHaveBeenCalledWith('/barberService');
  });
});