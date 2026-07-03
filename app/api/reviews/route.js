import { connectToDb } from "@/dbConfig/dbConfig";
import Reviews from "@/models/Reviews";
import User from "@/models/User";
import Appointment from "@/models/Appointment";
import Barber from "@/models/Barber";
import { NextResponse } from "next/server";
import {getDataFromToken} from "@/helpers/getDataFromToken";

connectToDb();

export async function GET(req){
    try{
        // const userId = await getDataFromToken(req);
        // console.log("the customer is", userId)
        const reviewsData = await Reviews.find().populate("customer").populate({path:"appointment",
            populate:{
                path:"barber",
                populate: {
                    path:"user",
                }
            }
        });
        console.log(reviewsData);
        return NextResponse.json({reviewsData}, {status: 200});
    } catch(err){
        return NextResponse.json({message: err.message}, {status: 500});
    }
}

export async function POST(req) {
    try {
        const userId = await getDataFromToken(req);

        const body = await req.json();
        const { appointmentId, rating, comment, image } = body;

        const appointment = await Appointment.findById(
            appointmentId
        );

        if (!appointment) {
            return NextResponse.json(
                { message: "Appointment not found" },
                { status: 404 }
            );
        }

        if (
            appointment.customer.toString() !==
            userId.toString()
        ) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 403 }
            );
        }

        // if (appointment.status !== "completed") {
        //     return NextResponse.json(
        //         { message: "Service not completed" },
        //         { status: 400 }
        //     );
        // }

        const existingReview = await Reviews.findOne({
            appointment: appointmentId,
        });

        if (existingReview) {
            return NextResponse.json(
                { message: "Review already submitted" },
                { status: 400 }
            );
        }

        const reviewData = await Reviews.create({
            customer: userId,
            barber: appointment.barber,
            appointment: appointment._id,
            rating,
            comment,
            image 
        });

        return NextResponse.json(
            { reviewData },
            { status: 201 }
        );
    } catch (err) {
        console.log("🔥 REVIEW ERROR:", err);
        return NextResponse.json(
            { message: err.message },
            { status: 500 }
        );
    }
}