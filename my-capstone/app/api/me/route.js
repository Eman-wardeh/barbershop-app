import { NextResponse } from "next/server";
import User from "@/models/User";
import { connectToDb } from "@/dbConfig/dbConfig";
import {getDataFromToken} from "@/helpers/getDataFromToken"

connectToDb();
export async function GET(req) {
    try {
        const userId = await getDataFromToken(req);

        if (!userId) {
            return NextResponse.json(
                { message: "Unauthorized - no token" },
                { status: 401 }
            );
        }

        const user = await User.findById(userId);

        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ user }, { status: 200 });

    } catch (err) {
        console.log("API /me error:", err);

        return NextResponse.json(
            { message: err.message },
            { status: 500 }
        );
    }
}