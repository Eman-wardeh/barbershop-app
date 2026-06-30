"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";


//to show the barber firstname i need to pass params from the previous page, and then get the info of barber bu using get barber
export default function BarberWorkingHours() {
    const {barberId} = useParams();
    const [barber, setBarber] = useState(null);

    const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ];

    const [selectDays, setSelectDays] = useState([]);

    const [workingHours, setWorkingHours] = useState({
        barber: "",
        startTime: "",
        endTime: ""
    });
    const [timeOff, setTimeOff] = useState({
        barber: "",
        start_date_time: "",
        end_date_time: "",
        reason: ""
    })
    useEffect(()=>{
        const fetchBarber = async()=>{
            try{
                const res = await axios.get(`/api/barbers/${barberId}`);
                setBarber(res.data.barber)
            } catch(err){
                console.log(err.message);
            }
        }
        fetchBarber();
    }, []);

    const submitData = async () => {
        try {
            const response = await axios.post("/api/barberWokingHours", {
                days: selectDays,
                ...workingHours
            });
            console.log(response.data);
            const timeOffRespone = await axios.post("/api/barberTimeOff", {
                ...timeOff
            })
            console.log(timeOffRespone.data);   

        } catch (err) {
            console.log(err);
        }
    };
        

    return (
        <div>
            <h1> {barber ? barber.user.firstName : "Loading"}</h1>

            {/* DAYS */}
            <label>Working Days:</label>
            <div>
                {days.map((day, index) => (
                    <label key={index}>
                        <input
                            type="checkbox"
                            checked={selectDays.includes(index)}
                            onChange={() =>
                                setSelectDays((prev) =>
                                    prev.includes(index)
                                        ? prev.filter((d) => d !== index)
                                        : [...prev, index]
                                )
                            }
                        />
                        {day}
                    </label>
                ))}
            </div>

            {/* TIME INPUTS */}
            <div>
                <h2>Working Hours:</h2>
                <div>
                <label>Start Time:</label>
                <input
                    type="time"
                    value={workingHours.startTime}
                    onChange={(e) =>
                        setWorkingHours({
                            ...workingHours,
                            startTime: e.target.value
                        })
                    }
                />

                <label>End Time:</label>
                <input
                    type="time"
                    value={workingHours.endTime}
                    onChange={(e) =>
                        setWorkingHours({
                            ...workingHours,
                            endTime: e.target.value
                        })
                    }
                />
            </div>
            </div>
            
            <div>
                <h2>Time off:</h2>
                <label>Start Date:</label>
                <input type="date" value={timeOff.start_date_time} onChange={(e) => setTimeOff({...timeOff, start_date_time: e.target.value})} />

                <label>End Date:</label>
                <input type="date" value={timeOff.end_date_time} onChange={(e) => setTimeOff({...timeOff, end_date_time: e.target.value})} />

                <label>reason:</label>
                <input type="text" value={timeOff.reason} onChange={(e) => setTimeOff({...timeOff, reason: e.target.value})}/>
            </div>
            <button onClick={submitData()}>Save</button>
        </div>
    );
}