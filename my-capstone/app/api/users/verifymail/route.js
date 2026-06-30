import { connectToDb } from "@/dbConfig/dbConfig";
import {  NextResponse } from "next/server";
import User from "@/models/User";
connectToDb();

export async function POST(req){
    try{
        const reqBody = await req.json();
        const {token} = reqBody;
        console.log(token);
        const user = await User.findOne({
            verifyToken: token, 
            verifyTokenExpiry: {$gt: Date.now()}
        });
        if(!user){
            return NextResponse.json({error: "Invalid token"}, {status: 400});
        }
        console.log(user);
 
        user.isVerified = true;
        user.verifyToken = undefined;
        user.verifyTokenExpiry = undefined;
        await user.save();
        
        return NextResponse.json({
            message: "Email verified successfully",
            success: true
        })
    } catch(error){
        
        return NextResponse.json({error: error.message},
            {status: 500}
        )
    }
}