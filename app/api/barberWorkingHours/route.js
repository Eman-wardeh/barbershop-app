import { connectToDb } from "@/dbConfig/dbConfig";
import WorkingHours from "@/models/WorkingHours";
import { NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import User from "@/models/User";
import Barber from "@/models/Barber";

connectToDb();

export async function PATCH(req) {
  try {
    const userId = await getDataFromToken(req);
    const user = await User.findById(userId);

    if (user.role !== "barber" && user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const barber = await Barber.findOne({ user: userId });

    if (!barber) {
      return NextResponse.json({ message: "Barber not found" }, { status: 404 });
    }

    const { dayOfWeek, startTime, endTime } = await req.json();

    const updateData = {};
    if (dayOfWeek !== undefined) updateData.dayOfWeek = dayOfWeek;
    if (startTime !== undefined) updateData.startTime = startTime;
    if (endTime !== undefined) updateData.endTime = endTime;
    // await WorkingHours.deleteMany({});
    // console.log("working hours deleted");

    const workingHours = await WorkingHours.findOneAndUpdate(
      { barber: barber._id },
      updateData,
      { new: true, upsert: true }
    );

    return NextResponse.json(
      { success: true, workingHours },
      { status: 200 }
    );

  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

export async function GET(req){
    try{
        const userId = await getDataFromToken(req);
        const user = await User.findById(userId);
        if (!user) {
          return NextResponse.json({ message: "User not found" }, { status: 404 });
        }
        console.log("barberId: ", userId);

        if(user.role !== "barber" && user.role !== "admin"){
            return NextResponse.json({message: "Unauthorized"},{status: 403} );
        }


        const barber = await Barber.findOne({user: userId});
        if (!barber) {
          return NextResponse.json({ message: "Barber not found" }, { status: 404 });
        }
        const workingHours = await WorkingHours.findOne({barber: barber._id});
        console.log("barber: ", workingHours);
       
        console.log("woking hours:", workingHours);
        return NextResponse.json({workingHours}, {status: 200});
    } catch(err){
        return NextResponse.json({message: err.message}, {status: 500})
    }
}