import Appointment from "@/models/Appointment";
import { NextResponse } from "next/server";
import { connectToDb } from "@/dbConfig/dbConfig";
import {getDataFromToken} from "@/helpers/getDataFromToken";
import User from "@/models/User";

connectToDb();

export async function PUT(req){
    try{
        const userId = await getDataFromToken(req);
        const user = await User.findById(userId);
        
        if(user.role !== "admin"){
            return NextResponse.json({message: "unauthorized"}, {status: 403});
        }


        const body = await req.json();
        const {status, appointmentId} = body;
        const validStatuses = [
            "completed",
            "booked",
            "cancelled",
        ];
        if(!validStatuses.includes(status)){
            return NextResponse.json({message: " Not included status"}, {status: 400})
        }
        const updatedStatus = await Appointment.findByIdAndUpdate(
            appointmentId, 
            {status}, 
            {new: true});
            console.log(updatedStatus);
        
        if(!updatedStatus){
            return NextResponse.json({message: "appointment not found"}, {status: 404})
        }
        return NextResponse.json({updatedStatus}, {status: 200});


    } catch(err){
        console.error("PUT appointment error:", err);
        return NextResponse.json({message: err.message}, {status: 500})
    }
    
}

export async function GET(req){
    try{
        
        const userId = await getDataFromToken(req);
        const user = await User.findById(userId);
        if(user.role !== "admin"){
            return NextResponse.json({message: "unauthorized"}, {status: 403});
        }

        const{searchParams} = new URL(req.url);
        const status = searchParams.get("status");

        let filter = {};
        if(status === "upcoming"){
            filter.appointmentDate = {$gt: new Date()};
            filter.status = "booked";
        }
        if(status === "completed"){
            filter.appointmentDate = {$lt: new Date()};
            filter.status = "completed";
        }
        if(status === "cancelled"){
            filter.status = "cancelled";
        }

        const appointments = await Appointment.find(filter).populate("customer").populate({path: "barber", populate: {path: "user"}});
        return NextResponse.json({appointments: appointments}, {status: 200});
    } catch(err){
        return NextResponse.json({message: err.message}, {status: 500});
    }
}