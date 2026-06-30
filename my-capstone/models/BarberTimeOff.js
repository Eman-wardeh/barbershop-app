import mongoose, { Schema } from "mongoose";

const barberTimeOffSchema = new Schema({
    barber:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Barber",
        required: true
    },
    start_date_time:{
        type: Date
    },
    end_date_time:{
        type: Date
    },
    reason: {
        type: String
    }
},{timestamps: true});
const BarberTimeOff= mongoose.models.BarberTimeOff || mongoose.model("BarberTimeOff", barberTimeOffSchema);
export default BarberTimeOff;