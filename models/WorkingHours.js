import mongoose from "mongoose";

const workingHoursSchema = new mongoose.Schema(
  {
    barber: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Barber",
      required: true,
    },

    dayOfWeek: [{
      type: Number,
      required: true,
      min: 0, 
      max: 6, 
    }],

    startTime: {
      type: String,
      required: true,
    },

    endTime: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const WorkingHours =
  mongoose.models.WorkingHours ||
  mongoose.model("WorkingHours", workingHoursSchema);

export default WorkingHours;