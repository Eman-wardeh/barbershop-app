"use client"
import Link from "next/link";
import { useState, useEffect } from "react";
import {useRouter} from "next/navigation";
import axios from "axios";

export default function AddService(){
    const router = useRouter();
    const [service, setService] = useState({
        name: "",
        price: "",
        duration: "",
    });
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (
            service.name.trim() &&
            service.price &&
            service.duration
        ) {
            setButtonDisabled(false);
        } else {
            setButtonDisabled(true);
        }
    }, [service]);
    const onSaveBtn = async ()=>{
        try{
            setLoading(true);
            const response = await axios.post('/api/services',{...service});
            console.log(response);
            router.push('/admin/services/allServices')
        } catch(err){
            console.log(err.message);
        }
        finally{
            setLoading(false);
        }
    }
    return(
        <div className="main-div">
            <h1>{loading ? 'Loading...' : 'Add New Service'}</h1>
            <label htmlFor="name">Service: </label>
            <input id="name" type="text" value={service.name} onChange={(e)=> setService({...service, name: e.target.value})} 
                placeholder="add new service" required />

            <label htmlFor="price">Price: </label>
            <input id="price" type="number" value={service.price} onChange={(e)=> setService({...service, price: e.target.value})} 
                placeholder="add price" required />

            <label htmlFor="duration">Duration: </label>
            <input id="duration" type="number" value={service.duration} onChange={(e)=> setService({...service, duration: e.target.value})} 
            placeholder="add duration" required />

            <button onClick={onSaveBtn} disabled={buttonDisabled}>
                {buttonDisabled ? "FILL ALL FIELDS" : "SAVE"}
            </button>       
        </div>
    )
}

