import mongoose from "mongoose";

const reviewsSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    barber: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Barber",
      required: true,
    },
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
    },
    rating:{
        type: Number,
        min: 1,
        max: 5
    },
    comment: {
      type: String,
    },
    image:{
      type: String, 
    }
  },
  { timestamps: true }
);

const Reviews =
  mongoose.models.Reviews ||
  mongoose.model("Reviews", reviewsSchema);

export default Reviews;