"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import axios from "axios"; 

export default function BarberSidebar() {
     const [barberId, setBarberId] = useState(null);

    useEffect(() => {
        const fetchUserId = async()=>{
            try{
                const res = await axios.get('/api/me');
            setBarberId(res.data.user._id);
            } catch(err){
                console.log(err);
            }
        }

        fetchUserId();
    }, []);

  if (!barberId) return null;

    return (
        <div className="sidebar">
            <h2 >
                Barber Panel
            </h2>
            
                <ul>
                    <li style={{ marginBottom: "15px" }}>
                        <Link href={`/barber/${barberId}`}>
                            📊Barber Profile
                        </Link>
                    </li>
                    <li style={{ marginBottom: "15px" }}>
                        <Link href={`/barber/${barberId}/upcomingApp`}>
                            Upcoming Appointments
                        </Link>
                    </li>
                    <li style={{ marginBottom: "15px" }}>
                    <Link href={`/barber/${barberId}/pastApp`}>
                         Past Appointments
                    </Link>
                </li>
            </ul>
        </div>
    );
}