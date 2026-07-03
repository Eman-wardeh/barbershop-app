"use client";
import axios from "axios";
import { useState, useEffect } from "react";

export default function Overview(){
    const [allBarbers, setAllBarbers] = useState([]);
    const [upcomingCount, setUpcomingCount] = useState(0);
    const [completedCount, setCompletedCount] = useState(0);
    const [cancelledCount, setCancelledCount] = useState(0);
    const [allCustomers, setAllCustomers] = useState(0);
    
    
    useEffect(()=>{
        const fetchData = async()=>{
            try{
                const barberRes = await axios.get("/api/barbers");
                setAllBarbers(barberRes.data.barbers || []);



                //const appointmentRes = await axios.get("/api/admin/appointment?status=upcoming");
                const [upcomingApp, completedApp, cancelledApp] = await Promise.all([
                    axios.get("/api/admin/appointment?status=upcoming"),
                    axios.get("/api/admin/appointment?status=completed"),
                    axios.get("/api/admin/appointment?status=cancelled")
                ]);
                setUpcomingCount((upcomingApp.data.appointments ||[]).length);
                setCompletedCount((completedApp.data.appointments ||[]).length);
                setCancelledCount((cancelledApp.data.appointments || []).length);

                console.log("upcoming appointments:", upcomingApp.data.appointments);
                console.log("completed appointments:", completedApp.data.appointments);
                console.log("cancelled appointments:", cancelledApp.data.appointments);

                const customerData = await axios.get('/api/admin/customers');
                setAllCustomers(customerData.data.customerNum );
                console.log("customers number:", customerData.data.customerNum);
                
            } catch(err){
                console.log(err);
            }
        }
        fetchData();
    }, [])
    return(
        <div className="main-div">
            <h1>Overview</h1>
            <div className="table-wrapper">
                <table className="table">
                <thead>
                    <tr>
                        <th>Barbers</th>
                        <th>Upcoming Appointments</th>
                        <th>Completed Appointments</th>
                        <th>Cancelled Appointments</th>
                        <th>Customers</th>
                        
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{allBarbers.length}</td>
                        
                        <td>{upcomingCount}</td>
                        <td>{completedCount}</td>
                        <td>{cancelledCount}</td>
                        <td>{allCustomers}</td>
                    </tr>
                </tbody>
                </table>
            </div>
            
        </div>
    )
}