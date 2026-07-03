import BarberTimeOff from "@/models/BarberTimeOff";
import User from "@/models/User";
import {NextResponse} from "next/server";
import {connectToDb} from "@/dbConfig/dbConfig";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import Barber from "@/models/Barber";

connectToDb();

export async function PATCH(req){
    try{
        const userId = await getDataFromToken(req);
        const user = await User.findById(userId);
        if(user.role !== "barber" && user.role !== "admin"){
            return NextResponse.json({message: "Unauthorized"},{status: 403} );
        }
        const body = await req.json();

        const barber = await Barber.findOne({user: userId});


        const { start_date_time, end_date_time, reason} =body;


        if (!start_date_time && !end_date_time) {
            return NextResponse.json(
                { message: "No time off selected" },
                { status: 200 } 
            );
        }
        // await BarberTimeOff.deleteMany({});
        // console.log("time of deleted");

        const newTimeOff = await BarberTimeOff.findOneAndUpdate(
            {barber}, 
            {
                start_date_time,
                end_date_time,
                reason
            },
            {
                new: true,
                upsert: true
            }
        );
        return NextResponse.json({message: "Time off created successfullt", newTimeOff: newTimeOff}, {status: 200})
    }  catch(err){
        return NextResponse.json({message: "Error creating time off request", error: err.message}, {status: 500});
    }
}
export async function GET(req){
    try{
        const userId = await getDataFromToken(req);
        const user = await User.findById(userId);
        if(user.role !== "barber" && user.role !== "admin"){
            return NextResponse.json({message: "Unauthorized"},{status: 403} );
        }
        const barber = await Barber.findOne({user: userId});
        const timeOff = await BarberTimeOff.findOne({barber: barber._id})
        console.log("barber time off:", timeOff);
        return NextResponse.json({timeOff}, {status: 200});
    } catch(err){
        return NextResponse.json({message: err.message}, {status: 500});
    }
}