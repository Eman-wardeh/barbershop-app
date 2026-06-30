import { connectToDb } from "@/dbConfig/dbConfig";
import Barber from "@/models/Barber";
import { NextResponse } from "next/server";
import User from "@/models/User";
import { getDataFromToken } from "@/helpers/getDataFromToken";
connectToDb();

export async function GET(req, {params}){
    //The name inside the dynamic folder must match the name you read from params.
    try{
        const {barberId} =  await params; // <= this is user id
        console.log("user Id:", barberId)
        
        const barber = await Barber.findById(barberId).populate("user").populate("services");
        console.log("barber Id:",barber);
        return NextResponse.json({barber}, {status: 200})
    } catch(err){
        return NextResponse.json({error: err.message}, {status: 500});
    }
}


export async function PATCH(req, { params }) {
    try {
        const userId = await getDataFromToken(req);
        if (!userId) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        const user = await User.findById(userId);
        if(user.role !== "barber" && user.role !== "admin"){
            return NextResponse.json({message: "Unauthorized"},{status: 403} );
        }
        const { barberId } = await params;
        const body = await req.json();
        if (user.role === "barber") {
            const myBarber = await Barber.findOne({ user: userId });

            if (!myBarber || myBarber._id.toString() !== barberId) {
                return NextResponse.json(
                    { message: "Forbidden" },
                    { status: 403 }
                );
            }
        }
        const updatedData = {};
        if(body.services){
            updatedData.services = body.services;
        }

        if(body.isActive !== undefined){
            updatedData.isActive = body.isActive;
        }
        const updatedBarber = await Barber.findByIdAndUpdate(
            barberId,
            updatedData,
            {new: true}
        );

        if (!updatedBarber) {
            return NextResponse.json(
                { success: false, message: "Barber not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            barber: updatedBarber
        });

    } catch (err) {
        return NextResponse.json({
            success: false,
            error: err.message
        }, { status: 500 });
    }
}