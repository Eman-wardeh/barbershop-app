"use client";
import axios from "axios";
import { useEffect, useState } from "react";

export default function AboutUs(){

    const [aboutUs, setAboutUs] = useState(null);

    useEffect(()=>{
        const fetchData = async()=>{
            try{
                const res = await axios.get("/api/aboutUs");
                setAboutUs(res.data.aboutUs);

            } catch(err){
                console.log(err);
            }
        }
        fetchData();
    }, []);
    return(
        <div className="main-div1">
            <div className="aboutUs">
                <h1>About US</h1>
                <p>
                    {aboutUs?.content}
                </p>
            </div>
            
        </div>
    )
}