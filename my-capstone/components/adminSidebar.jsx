"use client";

import Link from "next/link";
import { useState } from "react";

export default function AdminSidebar() {
    const [openBarbers, setOpenBarbers] = useState(false);
    const [openServices, setOpenServices] = useState(false);
    return (
        <div className="sidebar">
            <h2 >
                Admin Panel
            </h2>

            <ul >

                
                <li style={{ marginBottom: "15px" }}>
                    <Link href="/admin/overview">
                         📊 Dashboard Overview
                    </Link>
                </li>

                
                <li style={{ marginBottom: "15px" }}>
                    <div
                        onClick={() =>
                            setOpenBarbers(!openBarbers)
                        }
                        style={{
                            cursor: "pointer",
                            fontWeight: "bold",
                        }}
                    >
                        💈 Barbers
                    </div>

                    {openBarbers && (
                        <ul className="subList">
                            <li>
                                <Link href="/admin/barbers/allBarbers">All Barbers</Link>
                            </li>

                            <li>
                                <Link href="/signup">Add Barber</Link>
                            </li>
                        </ul>
                    )}
                </li>

                {/* Services */}
                <li >
                    <div onClick={()=>setOpenServices(!openServices)}>
                        ✂️ Services
                    </div>
                    { openServices && (
                        <ul className="subList">
                            <li>
                                <Link href="/admin/services/addService">Add Service</Link>
                            </li>
                            <li>
                                <Link href="/admin/services/allServices">All Services</Link>
                            </li>
                        </ul>
                    )
                    }
                </li>
                <li >
                    <Link href="/admin/appointments">
                        📅 Appointments
                    </Link>
                </li>

                <li >
                    <Link href="/admin/users">
                        👤 Users
                    </Link>
                </li>
                <li >
                    <Link href="/admin/aboutUs">
                        About us
                    </Link>
                </li>
                <li >
                    <Link href="/admin/updateUserRole">
                        Update Role
                    </Link>
                </li>
                
            </ul>
        </div>
    );
}