"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useBooking } from "@/context/BookingContext";
import Link from "next/link";

export default function BarberService() {

    const { selectedServices, setSelectedBarber, totalDuration, totalPrice, isSelected  } = useBooking();
    
    const [ barbers, setBarbers ] = useState([]);
    useEffect(() => {

        const fetchBarbers = async () => {
            try {
                const res = await axios.get("/api/barbers");

                console.log("FULL RESPONSE:", res.data);

                const data = res.data?.barbers || [];

                setBarbers(data);

            } catch (err) {
                console.log(err);
            }
        };

        fetchBarbers();

    }, []);

    return (
        <div className="container">
            
            <aside className="sidebar">
                <h2>Total Price: ${totalPrice}</h2>
                <h2>Total Duration: {totalDuration} </h2>
                {
                    (isSelected) &&(
                        <div>
                            <h2>Selected Services:</h2>
                            <ul>{selectedServices.map((service)=>(
                                <li key={service._id}>{service.name}</li>
                            ))}</ul>
                        </div>
                    )
                        
                }
            </aside>

                
            
            <div className="main-div-no-center">
                <h1>Available Barbers</h1>
                <div className="content-minicards">
                {barbers?.map((item) => (
                    <Link href="/select-date" key={item._id} className="mini-cards"   onClick={() => setSelectedBarber(item)}>
                        <h2>
                            {item.user?.firstName} {item.user?.lastName}
                        </h2>
                    </Link>
                ))}
                </div>
            </div>
            
            
        </div>
    );
}