import AppointmentService from "@/models/AppointmentServices";
import User from "@/models/User";
import Barber from "@/models/Barber";
import Service from "@/models/Service";
import { connectToDb } from "@/dbConfig/dbConfig";
import { NextResponse } from "next/server";

connectToDb();

export async function GET(req){
    try{
        const appointmentData = await AppointmentService.find().populate("service").populate({
        path: "appointment",
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
      });
      return NextResponse.json({appointmentData}, {status: 200});
    } catch(err){
        return NextResponse.json({err}, {status: 500});
    }
}