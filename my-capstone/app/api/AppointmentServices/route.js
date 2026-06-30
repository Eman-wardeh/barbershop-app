import { connectToDb } from "@/dbConfig/dbConfig";
import AppointmentService from "@/models/AppointmentServices";
import Service from "@/models/Service";
import User from "@/models/User";
import Appointment from "@/models/Appointment";
import Barber from "@/models/Barber";
import { NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken";


connectToDb();

export async function POST(req) {
    try {
        const userId = await getDataFromToken(req);
       
        const existredUser = await User.findById(userId);
        if (!existredUser){
            console.log("not existed user", "status: 401");
            return NextResponse.json({message: "not existed user"}, {status: 401});
        }
        const body = await req.json();
        const { appointment, service, price, duration } = body;

        if (!appointment || !service || price == null || duration == null) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        const appointmentDoc = await Appointment.findById(appointment);

        if (!appointmentDoc) {
            return NextResponse.json({ message: "Appointment not found" }, { status: 404 });
        }

        const newAppointmentService = await AppointmentService.create({
            appointment,
            service,
            price,
            duration
        });

        return NextResponse.json(
            { message: "Appointment service created successfully", newAppointmentService },
            { status: 201 }
        );

    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: "Failed to create appointment" }, { status: 500 });
    }
}
