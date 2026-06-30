import { connectToDb } from "@/dbConfig/dbConfig";
import User from "@/models/User";
import Barber from "@/models/Barber";
import { NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

connectToDb();

export async function POST(request) {
    try {
        const { email, password } = await request.json();
        console.log(email, password);
        const user = await User.findOne({ email });

        if (!user) {
            console.log('email is not found...')
            return NextResponse.json(
            
                { message: "User does not exist" },
                { status: 400 }
            );
        }
        const barber = await Barber.findOne({user : user._id});
        console.log("barber:", barber);

        const isMatch = await bcryptjs.compare(
            password,
            user.password
        );

        if (!isMatch) {
            console.log("incorrect password")
            return NextResponse.json(
                { message: "Incorrect password" },
                { status: 400 }
            );
        }
        console.log(user);
        //create token data
        const tokenData = {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
        };
        //create token
        const token = jwt.sign(
            tokenData,
            process.env.TOKEN_SECRET,
            { expiresIn: "1d" }
        );

        const response = NextResponse.json({
            message: "Login successful",
            success: true,
            tokenData,
            barberId: barber?._id
        });

        response.cookies.set("jwt", token, {
            //httpOnly: true,
            maxAge: 60 * 60 * 24,
            path: "/",
        });
        return response;
    } catch (error) {
        console.log({error: error.message});

        return NextResponse.json(
            {
                message:
                    "An error occurred during login",
            },
            { status: 500 }
        );
    }
}