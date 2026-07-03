"use client";

import { createContext, useContext, useState } from "react";

const BookingContext = createContext();

export function BookingProvider({ children }) {
    const [selectedServices, setSelectedServices] = useState([]);
    const [barbers, setBarbers] = useState([]); // list
    const [selectedBarber, setSelectedBarber] = useState(null); // single one
    const [date, setDate] = useState("");
    const [isSelected, setIsSelected] = useState(false);

    const totalPrice = selectedServices.reduce(
        (sum, s) => sum + Number(s.price),
        0
    );

    const totalDuration = selectedServices.reduce(
        (sum, s) => sum + Number(s.duration),
        0
    );

    return (
        <BookingContext.Provider
            value={{
                selectedServices,
                setSelectedServices,
                totalPrice,
                totalDuration,
                date,
                setDate,
                setSelectedBarber,
                selectedBarber,
                barbers,
                setBarbers,
                isSelected,
                setIsSelected

            }}
        >
            {children}
        </BookingContext.Provider>
    );
}

export function useBooking() {
    return useContext(BookingContext);
}