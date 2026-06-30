"use client"
import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

export default function UpcomingApp(){
    const {barberId} = useParams();
    console.log("barberIddd:", barberId);
    const [appointments, setAppointments] = useState([]);
    useEffect(()=>{
        const fetchApp = async()=>{
            try{
                if(!barberId) return;
                const res = await axios.get(`/api/barbers/${barberId}/upcomingApp`);
                setAppointments(res.data.currBarberUpApp);
                console.log(res.data.currBarberUpApp);
            } catch(err){
                console.log(err);
            }
        }
        fetchApp();

    }, [barberId]);
    return(
        <div>
            <h1>Your Upcoming Appointments</h1>
            <h3>The number of appointments: {appointments.length}</h3>
            <table>
                <thead>
                    <tr>
                        <td>
                            Appointment Date
                        </td>
                        <td>
                            Appointment Time
                        </td>
                        <td>
                            Customer 
                        </td>
                        <td>
                            Phone Number
                        </td>
                        <td>
                            Services
                        </td>
                    </tr>
                    
                </thead>
                <tbody>
                    {appointments.map((app)=>{
                        return(
                        <tr key={app._id}>
                            <td>{new Date(app.appointment?.appointmentDate).toLocaleDateString()}</td>
                            <td>{new Date(app.appointment?.startTime).toLocaleTimeString()}</td>
                            <td>{app.appointment?.customer?.firstName} {" "} {app.appointment?.customer?.lastName}</td>
                            <td>{app.appointment?.customer?.phoneNumber}</td>
                            <td>{app.service?.name}</td>
                        </tr>
                    )})}
                    
                </tbody>
            </table>
        </div>
    )
}