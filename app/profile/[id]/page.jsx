"use client";
import axios from "axios";
import Link from "next/link";
import {useState} from 'react';
import { useRouter, useParams } from "next/navigation";

// import { NextResponse } from "next/server";
//never use this in frontend

export default function UserProfile(){
    const router =  useRouter();
    const params = useParams();

    const[data, setData] = useState(null);

    const getUserDetails = async() =>{
        try{
            const res = await axios.get('/api/users/me');
            console.log(res.data);
            setData(res.data.data)
        } catch(err){
            console.log(err.message);
        }
    }
    const onLogout = async()=>{
        try{
            await axios.get('/api/users/logout');
            router.push('/login')

        } catch(err){
             console.log( err.message)
        }

    }
    return(
        <div className="container ">
            <h1>Profile Page</h1>
            <hr />
            <p> 
                Profile page of <span className="p-2 rounded bg-blue-500 text-white w-full">
                    {params.id}
                    </span>
            </p>
            
            {data ? (
                <div>
                    <h2>{data.firstName} {data.lastName}</h2>
                    <h2>{data.email}</h2>

                    <Link href={`/profile/${data._id}`}>
                        Visit profile
                    </Link>
                </div>
            ) : (
                <h2>NO THING</h2>
            )}
                        
            
            <button
                className="bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4"
                onClick={onLogout}
            >Log out</button>

            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" 
                onClick={getUserDetails}>GetData
            </button>

        </div>
    )
}