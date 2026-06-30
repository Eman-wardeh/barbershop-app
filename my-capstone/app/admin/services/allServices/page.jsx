"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AllServices() {
    const [allServices, setAllServices] = useState([]);
    const router = useRouter();

    useEffect(() => {
        const fetchServices = async () => {
            const res = await axios.get("/api/admin/allServices");
            setAllServices(res.data.services);
        };

        fetchServices();
    }, []);

    const handleActivate = async(serviceId, status) => {
        try{
            await axios.patch(`/api/admin/allServices/${serviceId}`,{
                isActive: !status, 
            });
            setAllServices((prev)=>(
                prev.map((service)=>(
                    service._id === serviceId ? { ...service, isActive: !status} : service
                )))
            )
        } catch(err){
            console.log(err);
        }
    };

    return (
        <div className="main-div">
            <h1>All Services</h1>
            <div className="table-wrapper">
                <table className="table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Duration</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {allServices.map((s)=>{
                        return(
                            <tr key={s._id}>
                                <td>{s.name}</td>
                                <td>${s.price}</td>
                                <td>{s.duration} mins</td>
                                <td>{s.isActive ? "Active" : "Inactive"}</td>
                                <td>
                                    <button onClick={() => handleActivate(s._id, s.isActive)}>
                                        {s.isActive ? "Deactivate" : "Activate"}
                                    </button>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            </div>
            
        </div>
    );
}