import mongoose, { Schema } from "mongoose";

const appointmentServiceSchema = new Schema({
    appointment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Appointment",
        required: true
    },
    service:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
        required: true
    },
    price: {
        type: Number,
        required: true

    },
    duration:{
        type: Number
    }
}, {timestamps: true});
const AppointmentService = mongoose.models.AppointmentService || mongoose.model("AppointmentService", appointmentServiceSchema);
export default AppointmentService;