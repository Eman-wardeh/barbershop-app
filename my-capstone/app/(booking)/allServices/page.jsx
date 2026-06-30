"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useBooking } from "@/context/BookingContext";
import { useRouter } from "next/navigation";

export default function AllServices() {
    const [allServices, setAllServices] = useState([]);
    
    const { selectedServices, setSelectedServices, totalPrice, totalDuration, isSelected, setIsSelected } = useBooking();
    const router = useRouter();

    useEffect(() => {
        const fetchServices = async () => {
            const res = await axios.get("/api/services");
            
            setAllServices(res.data.services);
        };

        fetchServices();
    }, []);

    const handleSelect = (service) => {
        setIsSelected(true);
        const exists = selectedServices.find(s => s._id === service._id);

        if (exists) {
            setSelectedServices(
                selectedServices.filter(s => s._id !== service._id)
                
            );
            setIsSelected(false);
        } else {
            setSelectedServices([...selectedServices, service]);
        }
    };

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
            <div className="main-div">
                <h1>Services</h1>
                <div>
                        {selectedServices.length > 0 && (
                        <button
                            onClick={() => router.push("/barberService")}
                        >
                            PROCEED
                        </button>
                        )}
                    </div>
                
                    
                    {allServices.map((s) => (
                    <div key={s._id} className="cards">
                        <p>{s.name}</p>
                        <p>Price: ${s.price}</p>
                        <p>Duration: {s.duration} mins</p>

                        <button onClick={() => handleSelect(s)}>
                            {selectedServices.find(x => x._id === s._id)
                                ? "Remove"
                                : "Select"}
                        </button>
                    </div>
                ))}
                    
                    
                    
                  
            </div>
            
        </div>
    );
}