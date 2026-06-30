"use client"
import Link from "next/link";
import  { useState, useEffect } from "react";
import {useRouter} from "next/navigation";
import axios from "axios";
import {toast} from "react-hot-toast";

export default function SignupPage(){
    const router = useRouter();
    const [user, setUser] = useState({
        firstName: "",
        lastName:"",
        email: "",
        password: "",
        phoneNumber:"",
        profilePhoto:"",
    });
    const [buttonDisabled, setButtonDisabled] = useState(false);   
    const [loading, setLoading] = useState(false);
    

    useEffect(()=>{
        if(user.email.length > 0 && user.password.length > 0 && user.firstName.length > 0 && user.lastName.length > 0 && user.phoneNumber.length > 0){
            setButtonDisabled(false);
        }
        else{
            setButtonDisabled(true);
        }
    }, [user]);

   const onSubmit = async (e) => {
    e.preventDefault();

    try {
        setLoading(true);

        const response = await axios.post("/api/users/signup", {
            ...user,
        });
          console.log("SIGNUP RESPONSE:", response.data);
        const createdUser = response.data.user;
        //const createdBarber = response.data.barber;

        
        //if (role === "barber") {
            //router.push(`/barberProfile/${createdBarber._id}`);
            //router.push("/barberWokingHours");
        //} else {
            router.push("/login");
        // }

    } catch (err) {
        toast.error(err.message);
    } finally {
        setLoading(false);
    }
};
    // //toggle function related to services array
    // const toggleSelectService = (id) => {
    //     if (services.includes(id)) {
    //         setServices(services.filter(s => s !== id));
    //     } else {
    //         setServices([...services, id]);
    //     }
    // };

    return(
        <div className="main-div">
            <form onSubmit={onSubmit}>
                <h1>{loading ? 'Signing up...' : 'Sign Up'}</h1>
                <label htmlFor="firstName">First Name: </label>
                <input id="firstName" type="text" value={user.firstName} onChange={(e)=> setUser({...user, firstName: e.target.value})} 
                    placeholder="First Name" required />
                <div className="lastName error"></div>

                <label htmlFor="lastName">Last Name: </label>
                <input id="lastName" type="text" value={user.lastName} onChange={(e)=> setUser({...user, lastName: e.target.value})} 
                    placeholder="Last Name" required />
                <div className="lastName error"></div>

                <label htmlFor="email">Email: </label>
                <input id="email" type="email" value={user.email} onChange={(e)=> setUser({...user, email: e.target.value})} 
                placeholder="Email"
                required />
                <div className="email error"></div>

                <label htmlFor="phoneNumber">Phone Number: </label>
                <input id="phoneNumber" type="text" value={user.phoneNumber} onChange={(e)=> setUser({...user, phoneNumber: e.target.value})} 
                    placeholder="Phone Number" required />
                <div className="phoneNumber error"></div>

                
                <label htmlFor="password">Password: </label>
                <input id="password" type="password" value={user.password} onChange={(e)=> setUser({...user, password: e.target.value})} 
                placeholder="Password"
                required />
                <div className="password error"></div>

                {/* <label htmlFor="role">Role: </label>
                <select id="role"name="role"value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="customer">Customer</option>
                    <option value="barber">Barber</option>
                    <option value="admin">Admin</option>
                </select> */}
                <button disabled={buttonDisabled}>{buttonDisabled ? 'Fill all fields' :' Sign UP'}</button>

                <div>
                    <Link href="/login">visit login page</Link>
                </div>
            </form>
            
        </div>
    )
}