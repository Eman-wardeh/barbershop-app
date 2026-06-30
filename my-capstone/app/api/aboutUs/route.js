import AboutUs from "@/models/AboutUs";
import { NextResponse } from "next/server";
import { connectToDb } from "@/dbConfig/dbConfig";

connectToDb();

export async function GET(req){
    try{
        const aboutUs = await AboutUs.findOne();
        return NextResponse.json({aboutUs}, {status: 200})
    } catch(err){
        return NextResponse.json(err.message);
    }
}