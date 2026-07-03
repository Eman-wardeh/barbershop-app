import { render, screen } from "@testing-library/react";
import Overview from "@/app/admin/overview/page";
import axios from "axios";

jest.mock("axios");

describe("Overview Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("fetches and displays dashboard counts", async () => {
    axios.get
      .mockResolvedValueOnce({
        data: { barbers: [{ _id: "b1" }, { _id: "b2" }] },
      })
      .mockResolvedValueOnce({
        data: { appointments: [{}, {}] }, // upcoming
      })
      .mockResolvedValueOnce({
        data: { appointments: [{}] }, // completed
      })
      .mockResolvedValueOnce({
        data: { appointments: [] }, // cancelled
      });

    render(<Overview />);

    const twos = await screen.findAllByText("2");
    expect(twos).toHaveLength(2);

    expect(screen.getByText("1")).toBeInTheDocument(); // completed
    expect(screen.getByText("0")).toBeInTheDocument(); // cancelled
  });
});