"use client";
import axios from "axios";
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";  

export default function WriteReview(){
    const params = useParams();
    const appointmentId = params.appointmentId; 
    console.log("appointmentId:", appointmentId);
    const router = useRouter();

    const [review, setReview] = useState(null); 
    const [rating, setRating] =useState(0);
    const [comment, setComment] = useState("");
    const [file, setFile] = useState(null);
    const [imgUrl, setImgUrl] = useState("");

    const uploadImg = async()=>{
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        const res = await axios.post("/api/upload-Img", formData);

        setImgUrl(res.data.url);
        console.log("Uploaded image:", res.data.url);
    }

    const onSubmit = async ()=>{
        try{
            const payload = {
                    appointmentId: appointmentId, 
                    rating, 
                    comment,
                    image : imgUrl || null,
                }
                console.log(payload);
                const res = await axios.post('/api/reviews', payload);
                setReview(res.data.reviewData);
                if(res.status === 201){
                    setTimeout(()=>{
                        router.push('/dashboard')
                    }, 1500)
                }
        } catch(err){
            console.log(err);

        }
    }
    
    return(
        <div>
            <h1>Select Rating</h1>
            <div>
                {[1,2,3,4,5].map((star)=>(
                    <span
                        key={star}
                        onClick={()=> {
                            console.log(star);
                            setRating(star)}}
                        style={{cursor:"pointer", 
                            fontSize: "30px",
                            color: star <= rating ? "gold" : "white"
                    }}>
                    ★
                    </span>
                ))}
            </div>
            <div>
                <label htmlFor="comment">Add a comment </label>
            </div>
            <div>
                <textarea id="comment" rows={5} cols={50} value={comment} onChange={(e)=>setComment(e.target.value)}/>
            </div>

            <div>
                <label>Upload Images:</label>
                <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
                <button onClick={uploadImg}>Upload Image</button>
            </div>
            


            <button onClick={onSubmit}>submit</button>
            {review &&(
                <p>Review submitted successfully!</p>
            )}
        </div>
    )
}