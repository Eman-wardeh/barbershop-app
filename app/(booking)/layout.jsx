"use client";


import { BookingProvider } from "@/context/BookingContext";

export default function Layout({ children }) {
    return (
        <BookingProvider>
            {children}
        </BookingProvider>
    );
}