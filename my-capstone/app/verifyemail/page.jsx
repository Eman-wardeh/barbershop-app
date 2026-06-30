"use client";

import axios from "axios";
import Link from "next/link";
import React, { useState, useEffect } from "react";


export default function verifyEmailPage(){
    const [token, setToken] = useState("");
    //based on it wether verified or not I want to show user message
    const [verified, setVerified] = useState(false);
    const [error, setError] = useState(false);

    const verifyUserEmail = async() =>{
        try{
            await axios.post('/api/users/verifymail', 
            {token});
            setVerified(true);
            setError(false);
        } catch(error){
            setError(true);
            setVerified(false);
            console.log(error.response.data);
            //we use axios and it could throw a response
        }
    }
    //when i want to run this verifyUserEmail func

    //this useEffect is when somebody lands my page, I want to exract this url
    useEffect(()=>{
        const urlToken = window.location.search.split("=")[1];
            setToken(urlToken || "");
        }, []);

    //useEffect is a hook that runs when the first time page load 
    // so i want to depend on [token], means any change on 
    // the token will fire this useEffect
    useEffect(()=>{
        if(token.length > 0 ){
            verifyUserEmail();
        }
    }, [token])
    return(
        <div className="flex flex-col items-center
        justify-center min-h-screen py-2">
            <h1 className="text-4xl">Verify Email</h1>
            <h2 className="p-2 bg-orange-500 text-black">{token ? `${token}` : "No token"}</h2>
            {verified && (
                <div>
                    <h2>Email Verified</h2>
                    <Link href="/login">
                        Login
                    </Link>
                </div>
            )}

            {!verified && error && (
                <div>
                    <h2 className="text-2xl bg-red-500 text-black">
                        Invalid or expired token
                    </h2>
                </div>
)}
        </div>
    )

} 