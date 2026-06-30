"use client";


import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";


//to show the barber firstname i need to pass params from the previous page(sign-up), and then get the info of barber bu using get barber
export default function BarberWorkingHours() {
    const router = useRouter();
    const {barberId} = useParams(); //to read the barberId from the url, and then use it to get the barber info
    console.log("barberId from URL:",barberId);

    const [barber, setBarber] = useState(null);
    const [services, setServices] = useState([]);
    const [allServices, setAllServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [savedData, setSavedData] = useState(false);
    const [getWorkingHours, setGetWorkingHours] = useState(null);
    const [getTimeoff, setGetTimeoff] = useState(null);
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
    const [timeOff, setTimeOff] = useState({
            barber: "",
            start_date_time: "",
            end_date_time: "",
            reason: ""
        })
    const [workingHours, setWorkingHours] = useState({
        barber: "",
        dayOfWeek: "",
        startTime: "",
        endTime: ""
    });
    
    useEffect(()=>{
        const fetchBarber = async()=>{
            try{
                if(!barberId) return;
                const res = await axios.get(`/api/barbers/${barberId}`);
                console.log("barberId:", barberId);
                setBarber(res.data.barber)
                console.log("The user is:", res.data.barber);

                const workingHoursRes = await axios.get("/api/barberWorkingHours")
                setGetWorkingHours(workingHoursRes.data.workingHours);
                console.log("get working hours:", workingHoursRes.data.workingHours);

                const timeOffRes = await axios.get("/api/barberTimeOff")
                setGetTimeoff(timeOffRes.data.timeOff);
                console.log("get time off:", timeOffRes.data.timeOff);

            } catch(err){
                console.log(err.message);

            } finally{
                setLoading(false);
            }


        }
        fetchBarber();
    }, [barberId]);

    useEffect( ()=>{
            const fetchData = async ()=>{
                try{
                const response = await axios.get("/api/services");
    
                setAllServices(response.data?.services || []);
                } catch(err){
                    console.log(`the error is ${err.message}`);
                }
            }
            fetchData();
        },[])
const submitData = async () => {

    if (
        services.length === 0 ||
        selectDays.length === 0 ||
        !workingHours.startTime ||
        !workingHours.endTime
    ) {
        alert("Please fill all fields");
        return;
    }

    try {
        await axios.patch(`/api/barbers/${barberId}`,
            {
                services
            }
        );
        await axios.patch("/api/barberWorkingHours",
            {
                barber: barberId,
                dayOfWeek: selectDays.map(Number),
                startTime: workingHours.startTime,
                endTime: workingHours.endTime
            }
        );
        setSavedData(true);
        
        if (
            timeOff.start_date_time &&
            timeOff.end_date_time
        ) {
            await axios.patch("/api/barberTimeOff", 
                {
                    barber: barberId,
                    start_date_time: timeOff.start_date_time,
                    end_date_time: timeOff.end_date_time,
                    reason: timeOff.reason
                }
            );
        }
        const res = await axios.get('/api/me');
        if(res.data.user.role === "admin"){
            router.push('/admin/barbers/allBarbers');
            console.log(res.data.user.role);
        }
        } catch (err) {

            console.log(err.response?.data || err);
        }
    };
    //toggle function related to services array
        const toggleSelectService = (id) => {
            if (services.includes(id)) {
                setServices(services.filter(s => s !== id));
            } else {
                setServices([...services, id]);
            }
        };

    return (
        <div className="main-div">
            <h1>🧔 {barber?.user?.firstName} {" "} {barber?.user?.lastName}</h1>
            {loading && (<h2>Loading...</h2>) }
            <div className="main-div2">

            <div className="wkBox">
                <h1>Your working Hours:</h1>
                <p><span>Days of week: </span>{getWorkingHours?.dayOfWeek?.map((d)=>days[d]).join(", ")}</p>
                <p><span>Working hours a day: </span> {getWorkingHours?.startTime} - {getWorkingHours?.endTime}</p>
                <h1>Your Time off:</h1>
                <p><span>Start: </span> {new Date(getTimeoff?.start_date_time).toDateString()} </p>
                <p><span>End: </span> {new Date(getTimeoff?.end_date_time).toDateString()} </p>
                <p>Reason: {getTimeoff?.reason}</p>
                
            </div>
            <hr style={{ border: "1px solid black", margin: "10px 0" }}  />
            <h1>Update Your Profile</h1>

            <div>
                <label>Services:</label>
                {allServices?.map((service) => (
                    <span key={service._id}>
                        <label>
                            <input
                                type="checkbox"
                                checked={services.includes(service._id)}
                                onChange={() => toggleSelectService(service._id)}
                            />
                            {service.name}
                        </label>
                    </span>
                ))}
            </div>
            <div>
                <label>Working Days:</label>
                {days.map((day, index) => (
                    <label key={index}>
                        <input type="checkbox" checked={selectDays.includes(index)}
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
                
            <div>
                <label>Working hours:</label>
                
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
            <div>
                <label>Time off:</label>
                <div>
                    <label>Start Day:</label>
                    <input type="date" value={timeOff.start_date_time} onChange={(e) => setTimeOff({...timeOff, start_date_time: e.target.value})} />
                </div>
                <div>
                    <label>End Day:</label>
                    <input type="date" value={timeOff.end_date_time} onChange={(e) => setTimeOff({...timeOff, end_date_time: e.target.value})} />
                </div>
                <div>
                    <label>reason:</label>
                    <input type="text" value={timeOff.reason} onChange={(e) => setTimeOff({...timeOff, reason: e.target.value})}/>
                </div>
            </div>
            <div>
                <button onClick={submitData}>Save</button>
            </div>
            {savedData && <p>Your Data saved </p>}
            </div>
        </div>
    );
}