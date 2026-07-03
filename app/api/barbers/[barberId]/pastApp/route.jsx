import AppointmentService from "@/models/AppointmentServices";
import Appointment from "@/models/Appointment";
import Barber from "@/models/Barber";
import Service from "@/models/Service";
import { NextResponse } from "next/server";
import { connectToDb } from "@/dbConfig/dbConfig";

connectToDb();

export async function GET(req, { params }) {
    try {
        const { barberId } = await params; // this is actually the User ID

        console.log("userId:", barberId);

        const currBarber = await Barber.findOne({
            user: barberId
        });
        console.log("barberId:", barberId);

        if (!currBarber) {
            return NextResponse.json(
                { message: "Barber not found" },
                { status: 404 }
            );
        }

        const now = new Date();

        const pastApps = await AppointmentService.find()
            .populate("service")
            .populate({
                path: "appointment",
                populate: [
                    { path: "barber" },
                    { path: "customer" }
                ]
            });

        const currBarberPastApp = pastApps.filter((app) => {
            const appointment = app.appointment;

            if (!appointment) return false;

            return (
                appointment.barber?._id?.toString() ===
                    currBarber._id.toString() &&
                appointment.appointmentDate < now
            );
        });
        console.log("Past Apps:", currBarberPastApp);
        return NextResponse.json(
            { currBarberPastApp },
            { status: 200 }
        );

    } catch (err) {
        console.error(err);

        return NextResponse.json(
            { message: err.message },
            { status: 500 }
        );
    }
}