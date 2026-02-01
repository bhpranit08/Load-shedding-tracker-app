import mongoose from "mongoose";
const Schema = mongoose.Schema

const OutageReportSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    location: {
        type: { type: String, default: 'Point' },
        coordinates: { type: [Number], required: true }
    },
    area: { type: String, required: true },
    ipAddress: { type: String, required: true },
    status: { type: String, enum: ['unverified', 'likely', 'confirmed', 'resolved', 'false'], default: 'unverified' },
    verifications: [{
        userId: { type: Schema.Types.ObjectId, ref: "User" },
        type: { type: String, enum: ['upvote', 'downvote'] },
        location: {
            type: { type: String, default: 'Point' },
            coordinates: [Number]
        },
        timestamp: { type: Date, default: Date.now }
    }],

    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },

    reportedAt: { type: Date, default: Date.now },

    resolutionConfirmations: [{
        userId: { type: Schema.Types.ObjectId, ref: "User" },
        location: {
            type: { type: String, default: "Point" },
            coordinates: [Number]
        },
        timestamp: { type: Date, default: Date.now }
    }],

    resolvedAt: { type: Date },

    outageDuration: { type: Number },

    description: { type: String, maxLength: 200 }
}, { timestamps: true })

OutageReportSchema.index({ location: '2dsphere' })
OutageReportSchema.index({ reportedAt: -1 })
OutageReportSchema.index({ status: 1 })

OutageReportSchema.methods.updateStatus = function() {
    if (this.downvotes >= 3 && this.downvotes > this.upvotes) {
        this.status = 'false'
    } else if (this.upvotes >= 4) {
        this.status = 'confirmed'
    } else if (this.upvotes >= 2) {
        this.status = 'likely'
    } else {
        this.status = 'unverified'
    }
    return this.save()
}

const OutageReport = mongoose.model("OutageReport", OutageReportSchema)
export default OutageReport