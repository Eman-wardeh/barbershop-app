import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AddService from "@/app/admin/services/addService/page";
import axios from "axios";
import { useRouter } from "next/navigation";

jest.mock("axios");

const pushMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

describe("AddService Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders form inputs", () => {
    render(<AddService />);

    expect(screen.getByPlaceholderText(/add new service/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/add price/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/add duration/i)).toBeInTheDocument();
  });

  test("button is disabled initially", () => {
    render(<AddService />);

    const button = screen.getByText(/fill all fields/i);
    expect(button).toBeDisabled();
  });

  test("enables button when form is filled", () => {
    render(<AddService />);

    fireEvent.change(screen.getByPlaceholderText(/add new service/i), {
      target: { value: "Haircut" },
    });

    fireEvent.change(screen.getByPlaceholderText(/add price/i), {
      target: { value: "20" },
    });

    fireEvent.change(screen.getByPlaceholderText(/add duration/i), {
      target: { value: "30" },
    });

    const button = screen.getByText(/save/i);
    expect(button).not.toBeDisabled();
  });

  test("submits form and redirects", async () => {
    axios.post.mockResolvedValue({ data: { success: true } });

    render(<AddService />);

    fireEvent.change(screen.getByPlaceholderText(/add new service/i), {
      target: { value: "Haircut" },
    });

    fireEvent.change(screen.getByPlaceholderText(/add price/i), {
      target: { value: "20" },
    });

    fireEvent.change(screen.getByPlaceholderText(/add duration/i), {
      target: { value: "30" },
    });

    fireEvent.click(screen.getByText(/save/i));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith("/api/services", {
        name: "Haircut",
        price: "20",
        duration: "30",
      });

      expect(pushMock).toHaveBeenCalledWith("/admin/services/allServices");
    });
  });
});