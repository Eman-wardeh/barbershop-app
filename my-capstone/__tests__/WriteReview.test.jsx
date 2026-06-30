import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import WriteReview from '@/app/reviews/page';
import axios from 'axios';
import { useRouter, useParams } from 'next/navigation';

jest.mock('axios');

// MOCK router
const pushMock = jest.fn();

// MOCK next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
  useParams: jest.fn(),
}));

describe('WriteReview', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useParams.mockReturnValue({
      appointmentId: '123',
    });
  });

  test('renders rating stars', () => {
    render(<WriteReview />);

    expect(screen.getAllByText('★').length).toBe(5);
  });

  test('allows user to select rating', () => {
    render(<WriteReview />);

    const stars = screen.getAllByText('★');

    fireEvent.click(stars[3]); // 4th star

    expect(screen.getByText(/select 4/i)).toBeInTheDocument();
  });

  test('allows user to type comment', () => {
    render(<WriteReview />);

    fireEvent.change(screen.getByLabelText(/add a comment/i), {
      target: { value: 'Great service' },
    });

    expect(screen.getByDisplayValue('Great service')).toBeInTheDocument();
  });

  test('submits review and redirects', async () => {
    axios.post.mockResolvedValue({
      status: 201,
      data: {
        reviewData: { id: 'r1' },
      },
    });

    render(<WriteReview />);

    // select rating
    const stars = screen.getAllByText('★');
    fireEvent.click(stars[4]); // 5 stars

    // enter comment
    fireEvent.change(screen.getByLabelText(/add a comment/i), {
      target: { value: 'Amazing!' },
    });

    // submit
    fireEvent.click(screen.getByText(/submit/i));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('/api/reviews', {
        appointmentId: '123',
        rating: 5,
        comment: 'Amazing!',
      });

      expect(pushMock).toHaveBeenCalledWith('/dashboard');
    });
  });
});