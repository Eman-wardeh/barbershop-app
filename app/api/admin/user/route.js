import User from "@/models/User";
import { connectToDb } from "@/dbConfig/dbConfig";
import { NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken";

connectToDb();

export async function GET(req){
    try{    
        const adminId = await getDataFromToken(req);
        const admin = await User.findById(adminId); 
        if(admin.role !== "admin"){
            return NextResponse.json({message: "Unauthorized"}, {status: 403});
        }

        const allUsers = await User.find();
        console.log("allUsers", allUsers);
        return NextResponse.json({allUsers}, {status: 200});

    } catch(err){
        return NextResponse.json({message: err.message}, {status: 500});
    }
}