"use client";
import { useState, useEffect } from "react";
import axios from "axios";


export default function Appointments(){
    const minutesToTime = (minutes) => {
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;

        return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
    };



    const [appointments, setAppointments] = useState([]);

    useEffect(()=>{
        const fetchAppointments = async()=>{
            try{
                const res = await axios.get('/api/admin/appointmentServices');
                const appointment = res.data.appointmentData;
                
                console.log(appointment);

                setAppointments(appointment);
                
            } catch(err){
                console.log(err);
            }
        }
        fetchAppointments();
    }, []);


    const updateStatus = async( newStatus, appointmentId )=>{
        try{
            await axios.put('/api/admin/appointment',{
                appointmentId,
                status: newStatus
            });
             setAppointments((prev) =>
                prev.map((app) =>
                    app.appointment._id === appointmentId
                        ? {
                            ...app,
                            appointment: {
                                ...app.appointment,
                                status: newStatus,
                            },
                        }
                        : app
                )
            );

        } catch(err){
            console.log(err);
        }
    }
    return(
        <div className="main-div">
            
            <h1>All Appointments</h1>
            <div className="table-wrapper">
                {appointments ? <table className="table">
                <thead>
                    <tr>
                        <th>Customer</th>
                        <th>Email</th>
                        <th>phone Number</th>
                        <th>Barber</th>
                        <th>Date</th>
                        <th>Start Time</th>
                        <th>End Time</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {appointments.map((app)=>{
                        return(
                            <tr key={app._id}>
                                <td>{app.appointment?.customer?.firstName} {" "}  {app.appointment?.customer?.lastName}</td>
                                <td>{app.appointment?.customer?.email}</td>
                                <td>{app.appointment?.customer?.phoneNumber}</td>
                                <td>{app.appointment?.barber?.user.firstName} {" "} {app.appointment?.barber?.user?.lastName}</td>
                                <td>{new Date(app.appointment?.appointmentDate).toDateString()}</td>
                                <td>{minutesToTime(app.appointment.startTime)}</td>
                                <td>{minutesToTime(app.appointment.endTime)}</td>
                                <td>
                                    <select className="status" value={app.appointment?.status}
                                            onChange={(e)=>(updateStatus(e.target.value, app.appointment._id))}>
                                        <option className="booked" value="booked">booked</option>
                                        <option className="completed" value="completed">completed</option>
                                        <option className="cancelled" value="cancelled">cancelled</option>
                                    </select>
                                </td>
                                

                            </tr>

                        )
                    })}
                </tbody>
            </table> :
            <p>No Appointments Yet !</p>
            }
            </div>
            
            
        </div>
    )

}