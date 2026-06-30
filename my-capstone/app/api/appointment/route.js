import Appointment from "@/models/Appointment";
import User from "@/models/User";
import { connectToDb } from "@/dbConfig/dbConfig";
import { NextResponse } from "next/server";
import  {getDataFromToken} from "@/helpers/getDataFromToken";

connectToDb();

export async function POST(req){
    try{
        const userId= getDataFromToken(req);
        const existredUser = await User.findById(userId);
        if (!existredUser){
            console.log("not existed user", "status: 401");
            return NextResponse.json({message: "Not existed user"}, {status: 401});
        }
        const {barber, appointmentDate, startTime, endTime} = await req.json();
        if(!barber || !appointmentDate || !startTime || !endTime){
            console.log("Missing required fields");
            return NextResponse.json({message: "Missing required fields"}, {status: 400});
        }
        //checking overlapping appointments for the same barber at the same time
        const conflict = await Appointment.findOne({
            barber,
            appointmentDate,
            startTime: { $lt: endTime },
            endTime: { $gt: startTime }
        });
        if(conflict){
            console.log("slot already booked:")
            return NextResponse.json({message: "slot already booked"}, {status: 400});
        }
        const newAppointment = await Appointment.create({
            customer: userId,
            barber,
            appointmentDate,
            startTime,
            endTime,
            status: "booked"
        });
        console.log("New appointment created:", newAppointment);
        return NextResponse.json({newAppointment: newAppointment, message: "Appointment created successfully"}, {status: 201});
    } catch (error) {
        console.error(error);
        return NextResponse.json({message: "Error creating appointment"}, {status: 500});
    }
}