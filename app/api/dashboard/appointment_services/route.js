import { connectToDb } from "@/dbConfig/dbConfig";
import AppointmentService from "@/models/AppointmentServices";
import User from "@/models/User";
import Reviews from "@/models/Reviews";
import { NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken";

connectToDb();

export async function GET(req) {
  try {
    const userId = await getDataFromToken(req);

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const appointmentsAndServices = await AppointmentService.find()
      .populate({
        path: "appointment",
        match: { customer: userId },
        populate: [
          {
            path: "customer",
          },
          {
            path: "barber",
            populate: {
              path: "user",
            },
          },
        ],
      })
      .populate("service")
      .sort({ createdAt: 1 });

    const filteredAppointments = appointmentsAndServices.filter(
      (item) => item.appointment
    );

    // Get all appointment IDs
    const apps = filteredAppointments.map(
      (item) => item.appointment._id
    );

    const pastApp = filteredAppointments.filter(
      (item) => new Date(item.appointment.appointmentDate) < new Date()
    );


    // Find reviews for those appointments
    const reviews = await Reviews.find({
      appointment: { $in: apps },
    });

    // Store reviewed appointment IDs
    const reviewedAppointments = new Set(
      reviews.map((review) => review.appointment.toString())
    );

    // Add hasReview to each appointment
    const appointmentsWithReviewStatus = filteredAppointments.map((item) => ({
      ...item.toObject(),
      hasReview: reviewedAppointments.has(
        item.appointment._id.toString()
      ),
    }));

    const user = await User.findById(userId);

    return NextResponse.json(
      {
        appointmentsWithReviewStatus: appointmentsWithReviewStatus,
        user,
        appointmentsAndServices: filteredAppointments,
        pastAppointments: pastApp
      },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { message: "Failed to fetch appointments" },
      { status: 500 }
    );
  }
}