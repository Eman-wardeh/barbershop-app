import AppointmentService from "@/models/AppointmentServices";
import Appointment from "@/models/Appointment";
import User from "@/models/User";
import Barber from "@/models/Barber";
import Service from "@/models/Service";
import { connectToDb } from "@/dbConfig/dbConfig";
import { NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken";  

connectToDb();

export async function GET(req){
    try{
        const userId = await getDataFromToken(req);
        const user = await User.findById(userId);
        
        if(user.role !== "admin"){
            return NextResponse.json({message: "unauthorized"}, {status: 403});
        }
        const customers= await Appointment.distinct("customer", {status: "completed"});
        const customerNum = customers.length;

        console.log("customers num:", customerNum);
      return NextResponse.json({customerNum}, {status: 200});
    } catch(err){
        return NextResponse.json({Error: err.message}, {status: 500});
    }
}