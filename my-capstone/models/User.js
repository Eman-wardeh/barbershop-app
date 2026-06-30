import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [ true, 'first name is required' ],
    },
    lastName: {
        type: String,
        required: [ true, 'last name is required' ],
    },
    email:{
        type: String,
        required: [ true, 'Email is required' ],
        unique: true
    },
    phoneNumber: {
        type: String,
        required:[true, 'Phone number is required']
    },
    password:{
        type: String,
        required: [ true, 'Password is required' ]
    },
    isVerified:{
        type: Boolean,
        default: false,
    },
    isAdmin:{
        type: Boolean,
        default: false,
    },
    role:{
        type: String,
        enum: ['customer', 'admin', 'barber'],
        default: 'customer'
    },
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date,
    verifyToken: String,
    verifyTokenExpiry: Date,
}, { timestamps: true });
const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;