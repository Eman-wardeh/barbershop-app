import mongoose from "mongoose";

const barberServiceSchema = new mongoose.Schema({
    barber: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Barber",
        required: true
    },
    service:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
        required: true
    }
}, {timestamps: true});
const BarberService = mongoose.models.BarberService || mongoose.model("BarberService", barberServiceSchema);
export default BarberService;