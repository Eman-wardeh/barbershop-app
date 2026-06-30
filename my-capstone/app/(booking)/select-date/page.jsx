"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useBooking } from "@/context/BookingContext";
import {useRouter} from "next/navigation";
import Link from "next/link";


export default function SelectDate() {
    const router = useRouter();
    const { selectedServices, selectedBarber, setSelectedBarber, totalDuration, totalPrice, isSelected  } = useBooking();
    const [date, setDate] = useState("");
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [booked, setBooked] = useState(false);
    const [isAuthorized, setIsAuthorized] = useState(false);

    console.log("selectedBarber", selectedBarber);




    useEffect(() => {
        const fetchSlots = async () => {
            if (!date || !selectedBarber?._id) return;

            setLoading(true);
            
            try {
                const res = await axios.get("/api/availability", {
                    params: {
                        barberId: selectedBarber._id,
                        date,
                        duration: totalDuration
                    },
                    
                });
                console.log("Available slots:", res.data);
                console.log("selected Barber:" , selectedBarber._id);   
                setSlots(res.data.slots || []);
            } catch (err) {
                console.error(err);
                setSlots([]);
            } finally {
                setLoading(false);
            }
        };

        fetchSlots();
    }, [date, selectedBarber, totalDuration]);
    
    const submitData = async () => {
        try {
          setIsAuthorized(false);
          if (!selectedSlot || !selectedBarber || !date) return;

          const timeToMinutes = (time) => {
            if (!time) return null;
            const [h, m] = time.split(":").map(Number);
            return h * 60 + m;
          };

          const payload = {
            barber: selectedBarber._id,
            appointmentDate: date,
            startTime: timeToMinutes(selectedSlot.start),
            endTime: timeToMinutes(selectedSlot.end),
          };

          console.log("PAYLOAD:", payload);

          const response = await axios.post("/api/appointment", payload);
          setBooked(true);

          const appointmentId = response.data.newAppointment._id;

          // create appointment services AFTER appointment is created
          await axios.post("/api/AppointmentServices", {
            appointment: appointmentId,
            service: selectedServices[0]._id,
            price: totalPrice,
            duration: totalDuration,
          });
          if (response.status === 201) {
            router.push("/dashboard");
          }


        } catch (err) {
          console.error("Error creating appointment:", err);
          if (err.response?.status === 401){
            setIsAuthorized(true);
          }
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
        <h2>Selected Barber: {selectedBarber?.user?.firstName} {selectedBarber?.user?.lastName}</h2>
        <div>
          {date && (
            <h2> Date: {new Date(date).toDateString()}</h2>
            )}
        </div>
        <div>{(selectedSlot)&&
                  <h2>Slot: {selectedSlot.start} - {selectedSlot.end} </h2>
                  }
              </div>
      </aside>

      <div className="content">
        <h1>Select Date</h1>
        <div>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)}/>
            {date && (
            <p>Selected Date: {new Date(date).toDateString()}</p>
            )}
        </div>
        <div>
            <h2>Available Slots</h2>

            {loading && <p>Loading slots...</p>}

            {!loading && slots.length === 0 && (
            <p>No available slots</p>
            )}

            <div className="grid">
              {slots.map((slot, index) => (
                  <button key={index}
                      onClick={() => setSelectedSlot(slot)}

                      className={`slot ${
                          selectedSlot?.start === slot.start ? "active" : ""
                      
                  }`}
                  >
                  {slot.start} - {slot.end}
                  </button>
              ))}
            <div>
              <div>{(selectedSlot)&&
                  <p>Selected Slot: {selectedSlot.start} - {selectedSlot.end} </p>
                  }
              </div>
            <button disabled={!selectedSlot} onClick={() => submitData()}>
                Book Now
            </button>

            </div>
            <div>{booked && <p>Your Appointment is scheduled.</p> }
                  
            {isAuthorized && (
              <div>
                <p>You must be logged in to book an appointment.</p>
                <Link href="/log_In">Log in</Link>
              </div>
              )}
             </div>
        </div>
        </div>
        
      </div>
    </div>
  );
}