import mongoose from "mongoose";

const barberSchema =new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:true
    },
    services:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service"

    }],
    profilePhoto:{
        type: String
    },
    isActive:{
        type: Boolean,
        default: true,
    }
},{ timestamps: true })
const Barber = mongoose.models.Barber || mongoose.model("Barber", barberSchema);
export default Barber;