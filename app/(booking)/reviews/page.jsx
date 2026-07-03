"use client";
import axios from "axios";
import { useEffect, useState } from "react";

export default function ReviewsPage(){
    const [reviews, setReviews] = useState([]);
    useEffect(()=>{
        const fetchReviews = async () =>{
            try{
                const response = await axios.get("/api/reviews");
                console.log(response.data.reviewsData);
                setReviews(response.data.reviewsData);
            } catch(err){
                console.log(err)
            }
        }
        fetchReviews();
    }, []);
    return(
        <div className="main-div">
            <h1>Reviews</h1>
            <p>({reviews.length})</p>
            <div>
                {reviews.length === 0 ?
                <p>No Reviews Yet !</p>
                : reviews.map((review)=>(
                    <div key={review._id} className="review-Cards">
                            {[1,2,3,4,5].map((star)=>(
                            <span
                                key={star}
                                style={{cursor:"pointer", 
                                    fontSize: "30px",
                                    color: star <= review.rating ? "gold" : "lightgray"
                            }}>
                            ★
                            </span>
                    ))}
                    <div style={{fontSize: "12px"}}>
                        {new Date(review.createdAt).toLocaleString()}
                    </div>
                                <h2>{review.customer?.firstName} {review.customer?.lastName}</h2>
                                <p>{review.comment}</p>
                                {review.image && (
                                    <img
                                        src={review.image}
                                        alt="review image"
                                        style={{
                                            width: "100px",
                                            height: "100px",
                                            objectFit: "cover",
                                            borderRadius: "10px",
                                            marginTop: "10px"
                                        }}
                                    />
                                )}
                            </div>
                    ))}
            </div>
        </div>
    )
}