"use client";
import BarberSidebar from "@/components/barberSidebar";

export default function BarberLayout({children}){
    return(
        <div style={{display:"flex"}}>
            <BarberSidebar/>
            <main className="adminContent">
                {children}
            </main>
        </div>
    )
}