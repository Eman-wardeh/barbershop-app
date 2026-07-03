import Barber from "@/models/Barber";
import User from "@/models/User";
import Service from "@/models/Service";
import { connectToDb } from "@/dbConfig/dbConfig";
import { NextResponse } from "next/server";

connectToDb();
export async function GET(){
    try{

        const barbers = await Barber.find().populate("user").populate("services");
        return NextResponse.json( {barbers}, {status: 200});
    } catch(err){
        return NextResponse.json({"Error" : err.message});
    }
}  


