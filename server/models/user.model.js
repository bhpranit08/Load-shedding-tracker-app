import mongoose from "mongoose";
const Schema = mongoose.Schema

const UserSchema = new Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    homeLocation: {
        type: { type: String, default: 'Point' },
        coordinates: { type: [Number], required: true },
        area: { type: String }
    },
    credibilityScore: { type: Number, default: 50, min: 0, max: 100 },
    totalReports: { type: Number, default: 0 },
    accurateReports: { type: Number, default: 0 },
}, { timestamps: true })

UserSchema.index({ homeLocation: '2dsphere' });

const User = mongoose.model('User', UserSchema)
export default User