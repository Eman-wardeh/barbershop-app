"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function UpdateRole(){
    const router = useRouter();
    const [users, setUsers] = useState([]);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get("/api/admin/user");
                console.log(res.data);
                setUsers(res.data.allUsers);

            } catch (err) {
                console.log(err);
            }
        };

        fetchData();
    }, []);
    const onUpdateRole = async(userId, role)=>{
        try{
                const updatedUser = await axios.patch('/api/admin/user/updateUserRole',
                    {
                        userId,
                        role
                    }
                );
                console.log("updated user:", updatedUser);
                router.push("/admin/updateUserRole")

            } catch(err){
                console.log(err);
            }
    }
    return(
        <div>
            <h1>Update Role</h1>
            <div className="table-wrapper">
                <table>
                <thead>
                    <tr>
                        <td>First Name</td>
                        <td>Last Name</td>
                        <td>Email</td>
                        <td>Role</td>
                        <td>Status</td>
                    </tr>
                </thead>
                <tbody>
                {users.map((user) => (
                    <tr key={user._id}>
                    <td>{user.firstName}</td>
                    <td>{user.lastName}</td>
                    <td>{user.email}</td>
                    <td>
                        <select
                        value={user.role}
                        onChange={(e) =>
                            onUpdateRole(user._id, e.target.value)
                        }
                        >
                            <option value="customer">Customer</option>
                            <option value="barber">Barber</option>
                            <option value="admin">Admin</option>
                        </select>
                    </td>
                    <td>{user.role}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
            
        </div>
    )
}