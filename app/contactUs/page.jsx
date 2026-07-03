"use client";
import Image from "next/image";
export default function ContactUs(){
    return(
        <div className="main-div1">
            
            <div className="contact-container">
                <h1>CONTACT US</h1>
                <p><span>📞</span>Phone Number: (219) 433-1122 </p>
                <p><span>⏰</span> OPEN 7 DAYS A WEEK</p>
                <p><span>📅</span> 10AM - 8PM</p>
                <p><span>📍</span>LOCATION: 5114 E Lincoln Hwy, Merrillville, IN 46410</p>
                <p>FOLLOW US ON <a style={{fontWeight: "bold"}} href="https://www.instagram.com/iron.cuts.barbershop/" target="_blank">INSTAGRAM</a></p>
                <Image
                    src="/image/iron.cuts.barbershop_qr.png"
                    width={120}
                    height={120}
                    alt="QR Code"
                  />
            </div>
            <div>
                
            </div>
            
        </div>
    )
}