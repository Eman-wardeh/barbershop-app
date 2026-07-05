"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Dashboard(){
    
    const [customer, setCustomer] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [appWithReview, setAppWithReview] = useState([false]);
    const [pastAppointments, setPastAppointments] = useState([]);
    useEffect( ()=>{
        const fetchAppointments = async() =>{
            try{
                const res = await axios.get('/api/dashboard/appointment_services');
                //const { appointmentsAndServices, user } = res.data;
                setAppointments(res.data.appointmentsAndServices || null);
                setCustomer(res.data.user || null);
                setAppWithReview(res.data.appointmentsWithReviewStatus || []);
                setPastAppointments(res.data.pastAppointments || []);

            } catch(err){
                console.error("Error fetching appointments:", err);
            }
        } 
        fetchAppointments();
    }, [])
    const reviewMap = new Map(
        (appWithReview || [])
            .filter((item) => item?.appointment?._id)
            .map((item) => [
            item.appointment._id.toString(),
            item.hasReview,
            ])
        );

    return(
        <div className="main-div">
            <h1>Dashboard</h1>
                <hr />
                <h1>Welcome {customer?.firstName} {customer?.lastName} </h1>

                {customer?.role === "admin" ?(
                    <Link href={"/admin"}>
                        Admin Dashboard
                    </Link>
                ): (
                <div className="flex gap-4 flex-wrap">
                    <div >
                    <h1>Your Upcoming Appointments:</h1>
                    {appointments.length === 0 ? (
                        <h1>No appointments yet!</h1>
                    ): (
                        <div>
                            {appointments.map((data) => {
                            const hasReview = reviewMap.get(data.appointment._id);

                            return (
                                <div key={data._id} className="apps-cards">
                                <div>

                                    <p>
                                    your next appointment on {new Date(data.appointment?.appointmentDate).toLocaleDateString()}{" "}
                                        with {data.appointment?.barber?.user?.firstName}{" "}
                                        {data.appointment?.barber?.user?.lastName}
                                    </p>
                                </div>
                                <div>
                                    <p>Status: {data.appointment?.status}</p>
                                </div>
                                <div>
                                    {data.appointment?.status === "completed" &&
                                        (hasReview ? (
                                        <p style={{ color: "green" }}>✅ Review Submitted</p>
                                        ) : (
                                        <Link href={`/reviews/${data.appointment._id}`}>
                                            Write a review
                                        </Link>
                                        ))}
                                </div>
                                </div>
                            );
                            })}
                        </div>
                    )
                    }
                    </div>
                    <div>
                        <h1>Your Past Appointments:</h1>
                        {pastAppointments.length === 0 ? (
                            <h1>No past appointments yet!</h1>
                        ): (
                            <div>
                                {pastAppointments.map((data) => {
                                const hasReview = reviewMap.get(data.appointment._id);

                                return (
                                    <div key={data._id} className="apps-cards">
                                    <div>

                                        <p>
                                        your past appointment was on {new Date(data.appointment?.appointmentDate).toLocaleDateString()}{" "}
                                            with {data.appointment?.barber?.user?.firstName}{" "}
                                            {data.appointment?.barber?.user?.lastName}
                                        </p>
                                    </div>
                                    <div>
                                        <p>Status: {data.appointment?.status}</p>
                                    </div>
                                    <div>
                                        {data.appointment?.status === "completed" &&
                                            (hasReview ? (
                                            <p style={{ color: "green" }}>✅ Review Submitted</p>
                                            ) : (
                                            <Link href={`/reviews/${data.appointment._id}`}>
                                                Write a review
                                            </Link>
                                            ))}
                                    </div>
                                    </div>
                                );
                                })}
                            </div>
                        )
                        }
                        
                    </div>


                </div>
                )
                }
        </div>
    )
}