import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextResponse } from "next/server";
import User from '@/models/User';
import { connectToDb } from "@/dbConfig/dbConfig";

connectToDb();

export async function GET(req){
    try{
        const userId = await getDataFromToken(req);
        const user = await User.findOne({
            _id: userId}).
            select("-password");
        return NextResponse.json({
            message: "User found",
            data: user
        })
    }
    catch(err){
        return NextResponse.json({error: err.message}, 
            {status:500});
    }
}