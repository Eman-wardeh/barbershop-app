import { connectToDb } from "@/dbConfig/dbConfig";
import Service from "@/models/Service";
import { NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import User from "@/models/User";


connectToDb();

export async function GET() {
    try {
        const services = await Service.find({});

        return NextResponse.json({ services}, { status: 200 });

    } catch (err) {

        return NextResponse.json({
            error: err.message
        }, { status: 500 });

    }

}
export async function POST(req) {

    try {
        const userId = getDataFromToken(req);
        const user = await User.findById(userId);
        if(user.role !== "admin"){
            return NextResponse.json({message: "Unauthorized"}, {status: 403})
        }

        const reqBody = await req.json();

        const { name, price, duration } = reqBody;
        const findService = await Service.findOne({ name });

        if (findService) {

            return NextResponse.json(
                { message: `${name} already exists` },
                { status: 400 }
            );
        }
        if (!name || !price || !duration) {

            return NextResponse.json(
                { message: "Fill all inputs" },
                { status: 400 }
            );
        }
        
        const newService = await Service.create({
            name,
            price,
            duration
        });

        return NextResponse.json(
            {
                message: "Service created successfully",
                service: newService
            },
            { status: 201 }
        );

    } catch (err) {

        return NextResponse.json(
            { message: err.message },
            { status: 500 }
        );
    }
}