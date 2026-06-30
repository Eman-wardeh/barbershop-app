"use client";

import Link from "next/link";
import axios from "axios";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function Navbar() {
    const [role, setRole] = useState(null);
    
    useEffect(()=>{
        const fetchRole = async()=>{
            try{
                const res = await axios.get('/api/me');
                console.log("The role is:", res.data.user.role)
                setRole(res.data.user.role);
            } catch(err){
                if (err.response?.status === 401) {
                setRole(null); // guest user
                } else {
                    console.log(err);
                }
            }
        }
        fetchRole();
    }, []);


    
    return (
        <nav>
            <ul>
                <li><Link className="title" href="/">Iron Cuts</Link></li>
                <Image
                    src="/image/barber-shop10.png"
                    width={70}
                    height={70}
                    alt="Iron Cuts Logo"
                    />
                <li><Link href="/aboutUs">About Us</Link></li>
                <li><Link href="/allServices">Book Now</Link></li>
                <li><Link href="/reviews">Reviews</Link></li>
                <li><Link href="/contactUs">Contact Us </Link></li>
                <li><Link href="/gallery">Gallery </Link></li>
                {(role === "admin")&&(
                    <li>
                        <Link href="/admin">Managemant Dashboard</Link>
                    </li>
                 )}
                 {(role === "barber")&&(
                    <li>
                        <Link href="/barber">Barber Dashboard</Link>
                    </li>
                 )}


                <li className="right">
                    <Link href="/api/users/logout">Log out</Link>
                </li>
                <li><Link href="/login">Log In</Link></li>
                <li><Link className="signup-btn" href="/signup">Sign Up</Link></li>
                
            </ul>
        </nav>
    );
}