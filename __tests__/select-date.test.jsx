import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import Appointments from "@/app/(admin)/appointments/page";
import axios from "axios";

jest.mock("axios");

describe("Appointments Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockData = [
    {
      _id: "1",
      appointment: {
        _id: "a1",
        status: "booked",
        appointmentDate: "2025-01-01",
        startTime: 600,
        endTime: 660,
        customer: {
          firstName: "John",
          lastName: "Doe",
        },
        barber: {
          user: {
            firstName: "Mike",
            lastName: "Smith",
          },
        },
      },
    },
  ];

  test("fetches and displays appointments", async () => {
    axios.get.mockResolvedValue({
      data: {
        appointmentData: mockData,
      },
    });

    render(<Appointments />);

    expect(await screen.findByText(/john doe/i)).toBeInTheDocument();
    expect(screen.getByText(/mike smith/i)).toBeInTheDocument();
    expect(screen.getByText(/booked/i)).toBeInTheDocument();
  });

  test("updates appointment status", async () => {
    axios.get.mockResolvedValue({
      data: {
        appointmentData: mockData,
      },
    });

    axios.put.mockResolvedValue({});

    render(<Appointments />);

    const select = await screen.findByDisplayValue("booked");

    fireEvent.change(select, {
      target: { value: "completed" },
    });

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith(
        "/api/admin/appointment",
        {
          appointmentId: "a1",
          status: "completed",
        }
      );
    });
  });

  test("renders time correctly", async () => {
    axios.get.mockResolvedValue({
      data: {
        appointmentData: mockData,
      },
    });

    render(<Appointments />);

    // 600 mins = 10:00
    expect(await screen.findByText(/10:00/i)).toBeInTheDocument();
    expect(screen.getByText(/11:00/i)).toBeInTheDocument();
  });
});