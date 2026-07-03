"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function AllBarbers() {
    const router = useRouter();
    const [barbers, setBarbers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBarbers = async () => {
            try {
                const response = await axios.get("/api/barbers");
                setBarbers(response.data.barbers || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBarbers();
    }, []);

    const handleActivate = async(barberId, status) => {
        try{
             await axios.patch(`/api/barbers/${barberId}`,{
                isActive: !status
            });
            //I want to update isActive inside setBarbers array
            setBarbers((prev)=>(
                prev.map((barber) =>(
                    barber._id === barberId ? {
                        ...barber,
                        isActive: !status
                    } : 
                    barber
                ))
            ))
        } catch(err){
            console.log(err)
        }
         
    }

    if (loading) return <p>Loading barbers...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="main-div">
            <h1>All Barbers</h1>
            <div>
                {barbers.map((barber) => (
                <div key={barber._id} className="cards" >
                    <div>
                        <h2>
                        {barber.user?.firstName} {barber.user?.lastName}
                        </h2>
                    </div>
                    <div>
                        <h2>
                        {barber.user?.email} 
                        </h2>
                    </div>
                    <div>
                        <h3 >Services:</h3>
                        <ul>
                            {barber.services?.map((s) => (
                                <li key={s._id}>{s.name}</li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <p>Status: {barber.isActive}</p>
                    </div>
                    <div>
                        <button  onClick={()=>router.push(`/admin/barbers/barberProfile/${barber._id}`)}>Edit</button>
                    </div>
                    <div>
                        <button onClick={()=>handleActivate(barber._id, barber.isActive)}>{barber.isActive ? "Deactivate" : "Activate"}</button>
                    </div>
                    
                </div>
            ))}
            </div>
            
        </div>
    );
}