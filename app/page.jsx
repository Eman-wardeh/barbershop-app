"use client";
import Image from "next/image";

export default function Home() {
  return (
    <div className="main-div1">
        <div className="flyerSides">
            <div>Men's Haircut</div>
                <div>Kid's Haircut</div>
                <div>Fades</div>
                <div>Tapers</div>
        </div>
        <div className="flyer">
            <Image
                className="homePageImg"
                src="/image/barber-shop10.png"
                width={300}
                height={300}
                alt="Iron Cuts Logo"
            />
            <p className="title-In-flyer">Iron Cuts</p>
            <div className="details">
                <p><span>📞</span>Phone Number: (219) 433-1122 </p>
                <p><span>⏰</span> OPEN 7 DAYS A WEEK</p>
                <p><span>📅</span> 10AM - 8PM</p>
                <p><span>📍</span>LOCATION: 5114 E Lincoln Hwy, Merrillville, IN 46410</p>
            </div>
        </div>
        <div className="flyerSides">
            <div>Line Ups</div>
            <div>Waxing</div>
            <div>Skin Care</div>
            <div>Hair Coloring</div>
        </div>
    </div>
    
  
  );
}