import { connectToDb } from "@/dbConfig/dbConfig";
import { NextResponse } from "next/server";
import BarberService from "@/models/BarberService";
import Barber from "@/models/Barber";
import User from "@/models/User";
await connectToDb(); 

export async function GET() {
    try {
        const res = await BarberService.find({})
            .populate({
                path: "barber",
                populate: { path: "user" }
            })
            .populate("service");

        return NextResponse.json(
            { barberService: res },
            { status: 200 }
        );

    } catch (err) {
        console.error("BarberService GET error:", err);

        return NextResponse.json(
            { message: "failed to fetch barber with service" },
            { status: 500 }
        );
    }
}