import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import AllBarbers from "@/app/admin/barbers/allBarbers/page";
import axios from "axios";
import { useRouter } from "next/navigation";

jest.mock("axios");

const pushMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

describe("AllBarbers Page", () => {
  const mockBarbers = [
    {
      _id: "b1",
      user: { firstName: "John", lastName: "Doe" },
      services: [{ _id: "s1", name: "Haircut" }],
      isActive: true,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    axios.get.mockResolvedValue({
      data: { barbers: mockBarbers },
    });
  });

  test("renders barbers list", async () => {
    render(<AllBarbers />);

    expect(await screen.findByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Haircut")).toBeInTheDocument();
    expect(screen.getByText("Status: true")).toBeInTheDocument();
  });

  test("toggles barber status", async () => {
    axios.patch.mockResolvedValue({});

    render(<AllBarbers />);

    const button = await screen.findByText("Deactivate");

    fireEvent.click(button);

    await waitFor(() => {
      expect(axios.patch).toHaveBeenCalledWith(
        "/api/barbers/b1",
        { isActive: false }
      );
    });
  });

  test("navigates to edit page", async () => {
    render(<AllBarbers />);

    const editBtn = await screen.findByText("Edit");

    fireEvent.click(editBtn);

    expect(pushMock).toHaveBeenCalledWith("/barberProfile/b1");
  });
});