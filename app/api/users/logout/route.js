import { NextResponse } from "next/server";

export async function GET(req) {
    try {

        const response = NextResponse.redirect(new URL("/login", req.url));
        //new URL(
        // "/log_In",
        // "http://localhost:3000/api/users/logout"
        // )
        response.cookies.set("jwt", "", {
            expires: new Date(0),
            path: "/",
        });

        return response;
    } catch (err) {

        return NextResponse.json(
            { error: err.message },
            { status: 500 }
        );
    }
}