import { connectToDb } from "@/dbConfig/dbConfig";
import User from "@/models/User";
import Barber from "@/models/Barber";
import Service from "@/models/Service";
import BarberService from "@/models/BarberService"
import {NextRequest, NextResponse} from "next/server";
import bcryptjs from 'bcryptjs';
import {sendEmail} from "@/helpers/mailer"

connectToDb();

export async function POST(req){
    try{
        const body = await req.json();
        const {firstName, lastName, email, password, phoneNumber, role, profilePhoto} = body;
        console.log(`Received data: email=${email}`);
        // Check if the user already exists
        const userExists = await User.findOne({email});

        if(userExists){
            return NextResponse.json({msg: 'User already exists'}, {status: 400});
        }
        // Hash the password
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);
        
        // Create a new user
        console.log("Creating user with email:", email);
        const newUser = await User.create({
            firstName,
            lastName,
            email,
            phoneNumber,
            password: hashedPassword,
            //role: role || "customer",
        });
        // let newBarber = null;
        // if(role === "barber"){
        //     console.log("Creating barber...", role);
        //     newBarber = await Barber.create({
        //         user: newUser._id
        //     });
        //     console.log("Barber created:", newBarber);
        // }
        
            try {
                await sendEmail({
                    email,
                    emailType: "VERIFY",
                    userId: newUser._id
                });
            } catch (err) {
                console.error("Email sending failed:", err.message);
            }

            return NextResponse.json({
                user: newUser,
                // barber: newBarber || null
            }, { status: 201 });

        } catch(error){
            console.log("SIGNUP ERROR:", error);
            return NextResponse.json({msg: 'Error creating user', Error: error.message}, {status: 500});
    }
}


