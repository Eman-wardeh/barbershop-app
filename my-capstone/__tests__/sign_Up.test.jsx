import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignupPage from '@/app/(auth)/sign_Up/page';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

jest.mock('axios');
jest.mock('react-hot-toast');

const pushMock = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

describe('SignupPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders signup form inputs', () => {
    render(<SignupPage />);

    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  test('button is disabled initially', () => {
    render(<SignupPage />);

    expect(screen.getByRole('button')).toBeDisabled();
  });

  test('enables button when all fields are filled', () => {
    render(<SignupPage />);

    fireEvent.change(screen.getByLabelText(/first name/i), {
      target: { value: 'John' },
    });

    fireEvent.change(screen.getByLabelText(/last name/i), {
      target: { value: 'Doe' },
    });

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'john@test.com' },
    });

    fireEvent.change(screen.getByLabelText(/phone number/i), {
      target: { value: '1234567890' },
    });

    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: '123456' },
    });

    expect(screen.getByRole('button')).not.toBeDisabled();
  });

  test('submits signup form and redirects for customer', async () => {
    axios.post.mockResolvedValue({
      data: {
        user: { _id: '123' },
        barber: { _id: '999' },
      },
    });

    render(<SignupPage />);

    fireEvent.change(screen.getByLabelText(/first name/i), {
      target: { value: 'John' },
    });

    fireEvent.change(screen.getByLabelText(/last name/i), {
      target: { value: 'Doe' },
    });

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'john@test.com' },
    });

    fireEvent.change(screen.getByLabelText(/phone number/i), {
      target: { value: '1234567890' },
    });

    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: '123456' },
    });

    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('/api/users/signup', expect.any(Object));

      expect(pushMock).toHaveBeenCalledWith('/log_In');
    });
  });
});