import User from "@/models/User";
import Barber from "@/models/Barber";
import { connectToDb } from "@/dbConfig/dbConfig";
import { NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import BarberTimeOff from "@/models/BarberTimeOff";

connectToDb();

export async function PATCH(req){
    try{    
        const adminId = await getDataFromToken(req);
        const admin = await User.findById(adminId); 
        if(admin.role !== "admin"){
            return NextResponse.json({message: "Unauthorized"}, {status: 403});
        }

        const {userId, role} = await req.json();

        console.log("userId:", userId);
        console.log("role:", role);
        const allowedRoles = ['admin', 'barber', 'customer'];
        if(!allowedRoles.includes(role)){
            return NextResponse.json({message: "Role not exist"});
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {role},
            {new : true}
        );
        console.log("updated user", updatedUser);
        if(updatedUser.role === "barber"){
            const existingBarber = await Barber.findOne({
                user: userId
            })
            if(!existingBarber){
                await Barber.create({user: userId});
            }
        }



        return NextResponse.json({updatedUser}, {status: 200});

    } catch(err){
        return NextResponse.json({message: err.message}, {status: 500});
    }
}