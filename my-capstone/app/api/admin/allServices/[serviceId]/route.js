import axios from "axios";
import { NextResponse } from "next/server";
import { connectToDb } from "@/dbConfig/dbConfig";
import Service from "@/models/Service";

connectToDb();


export async function PATCH(req, {params}){
    try{
        const {serviceId} = await params;
        console.log(serviceId);

        const body = await req.json();
        
        const updatedService = await Service.findByIdAndUpdate(
            serviceId,
            {isActive: body.isActive},
            {new: true}
        );
        console.log("updatedService:", updatedService );
        if(!updatedService){
            return NextResponse.json({message: "Service is not found"}, {status: 404})
        }
        return NextResponse.json({success: true, updatedService: updatedService}, {status: 200})
    } catch(err){
        return NextResponse.json({message: err.message}, {status: 500});
    }
}