import { connectToDb } from "@/dbConfig/dbConfig";
import Appointment from "@/models/Appointment";
import User from "@/models/User";
import Barber from "@/models/Barber";
import { NextResponse } from "next/server";
import {getDataFromToken} from "@/helpers/getDataFromToken";

connectToDb();
export async function GET(req){
    try{
        const userId = await getDataFromToken(req);
        console.log("User ID from token:", userId);
        if(!userId) {
            return NextResponse.json({message: "Unauthorized"}, {status: 401});
        };
        const appointments = await Appointment.find({
            customer: userId
            }).sort({ appointmentDate: 1 }).populate("customer").populate({path: "barber", populate: {path: "user"}});
        const user = await Appointment.findById(userId);

        console.log("Fetched Appointments:", appointments);
        console.log("Fetched user:", user);
        
        return NextResponse.json({ appointments, user }, { status: 200 });
    } catch(err){
        return NextResponse.json({message:"Failed to fetch appointments"}, {status: 500})
    }
}