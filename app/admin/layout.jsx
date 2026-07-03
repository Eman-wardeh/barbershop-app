"use client";
import AdminSidebar from  "@/components/adminSidebar";

export default function AdminLayout({children}){
    return(
        <div style={{display:"flex"}}>
            <AdminSidebar/>
            <main className="adminContent">
                {children}
            </main>
        </div>
    )
}