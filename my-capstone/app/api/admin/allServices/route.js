import { connectToDb } from "@/dbConfig/dbConfig";
import Service from "@/models/Service";
import { NextResponse } from "next/server";

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
