import mongoose from "mongoose";
const Schema = mongoose.Schema

const UserSchema = new Schema({
    username: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    role: { type: String, required: true, enum: ['admin', 'moderator', 'user'] },
    isDeleted: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    isCreating: { type: Boolean, default: true },
    password: { type: String, required: true },
    phoneNo: { type: String, required: true },
    phoneVerificationToken: { type: String, default: null },
    phoneVerificationTokenExpiry: { type: String, default: null },
    emailVerificationToken: { type: String, default: null },
    emailVerificationTokenExpiry: { type: String, default: null },
    verificationPhone: { type: String, default: 'unverified', enum: ['unverified', 'verified']},
    verificationEmail: { type: String, default: 'unverified', enum: ['verified', 'unverified']}
}, { timestamps: true })

const User = mongoose.model('User', UserSchema)
export default User