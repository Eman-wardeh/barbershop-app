import AboutUs from "@/models/AboutUs";
import User from "@/models/User";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextResponse } from "next/server";
import { connectToDb } from "@/dbConfig/dbConfig";
connectToDb();

export async function POST(req) {
    try{
        const userId = await getDataFromToken(req);
        const user = await User.findById(userId);
        
        if(user.role !== "admin"){
            return NextResponse.json({message: "Unauthorized"}, {status: 403});
        }
        const body = await req.json();
        const{content} = await body;
        const aboutUs = await AboutUs.create({content});
        console.log("about Us", aboutUs);
        return NextResponse.json({aboutUs}, {status: 201});
    } catch(err){
        return NextResponse.json({Error: err.message}, {status: 500});
    }
}

