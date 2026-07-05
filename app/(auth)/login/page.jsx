"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function LoginPage() {
    const router = useRouter();
    const [user, setUser] = useState({
        email: "",
        password: ""
    });
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user.email.length > 0 && user.password.length > 0) {
            setButtonDisabled(false);
        } else {
            setButtonDisabled(true);
        }
    }, [user]);

    const onLogin = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            const response = await axios.post(
                "/api/users/login",
                user
            );

            const loggedInUser = response.data.tokenData;
            
            console.log("logged in user:", loggedInUser);
            console.log("User ID: ",loggedInUser.id);
            console.log("user name", loggedInUser.firstName);

            if(loggedInUser.role === "barber"){
                
                router.push(`/barber/${response.data.barberId}`);

            } else if(loggedInUser.role === "customer"){
                router.push("/customerDashboard");
            } else if(loggedInUser.role === "admin"){
                router.push("/admin");
            }

        } catch (error) {
            console.error("Login error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="main-div">
            <form onSubmit={onLogin}>
                <h1>{loading ? "Logging in..." : "Log in"}</h1>

                <label htmlFor="email">Email:</label>
                <input id="email" type="email" value={user.email} 
                    onChange={(e) =>
                        setUser({
                            ...user,
                            email: e.target.value,
                        })
                    }
                    placeholder="Email"
                    required
                />

                <div className="email error"></div>
                <label htmlFor="password">Password:</label>
                <input id="password" type="password" value={user.password} onChange={(e) =>
                        setUser({
                            ...user,
                            password: e.target.value,
                        })
                    }
                    placeholder="Password"
                    required
                />
                <div className="password error"></div>
                <button disabled={buttonDisabled}>{buttonDisabled ? "Fill all fields" : "Log in"}
                </button>
                <div>
                    <Link href="/signup">
                        Visit signup page
                    </Link>
                </div>
            </form>
        </div>
    );
}