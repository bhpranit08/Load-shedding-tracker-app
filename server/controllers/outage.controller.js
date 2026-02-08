import asyncHandler from "express-async-handler"
import OutageReport from "../models/outage.model.js"
import User from "../models/user.model.js"

export const get_reports = asyncHandler(async (req, res, next) => {
    const { xCoordinate, yCoordinate, radius = 5000 } = req.query
    
    if (!xCoordinate || !yCoordinate) {
        return res.status(400).json({ message: "x coordinate and y coordinates are required"})
    }

    const longitude = parseFloat(xCoordinate)
    const latitude = parseFloat(yCoordinate)

    const reports = await OutageReport.find({
        location: {
            $near: {
            $geometry: {
                type: 'Point',
                coordinates: [longitude, latitude]
            },
            $maxDistance: parseInt(radius)
            }
        },
        status: { $ne: 'resolved' }
    })
    .populate('userId', 'name')
    .sort({ reportedAt: -1 })
    .limit(100)

    const ownReports = await OutageReport.find({ userId: req.user._id }).populate('userId', 'name').sort({ reportedAt: -1 })

    return res.status(200).json({ reports, ownReports })
})

export const add_report = asyncHandler(async (req, res, next) => {
    const { xCoordinate, yCoordinate, area, description } = req.body.outage
    const userId = req.user._id
    const ipAddress = req.ip || req.headers['x-forwarded-for']?.split(',')[0]


    const userExists = await User.findById(userId).exec()

    if (!userId || !xCoordinate || !yCoordinate || !area, !ipAddress ) {
        return res.status(400).json({ message: "All fields must be filled"})
    }

    if (!userExists) {
        return res.status(400).json({ message: 'Invalid user'})
    }

    const recentReport = await OutageReport.findOne({ userId, reportedAt: { $gte: new Date(Date.now() - 15 * 60 * 1000) } });

    if (recentReport) {
        return res.status(400).json({ message: 'Wait 15 minutes before next report' })
    }

    if (xCoordinate < 80.0 || xCoordinate > 88.2 || yCoordinate < 26.3 || yCoordinate > 30.4) {
        return res.status(400).json({ message: 'Location must be within Nepal' });
    }

    if (description.length > 200) {
        return res.status(400).json({ message: 'Invalid description length' })
    }

    const outage = new OutageReport({
        userId,
        location: {
            coordinates: [xCoordinate, yCoordinate]
        },
        area,
        ipAddress,
        description
    })

    await outage.save()

    userExists.totalReports += 1

    await userExists.save()

    return res.status(201).json({ message: 'Outage added successfully'})
})

export const verify_report = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const { type, xCoordinate, yCoordinate } = req.body.outage
    const userId = req.user._id

    if (!type || !['upvote', 'downvote'].includes(type)) {
        return res.status(400).json({ message: 'Type must be either upvote or downvote'})
    }

    if (!xCoordinate || !yCoordinate || typeof xCoordinate !== 'number' || typeof yCoordinate !== 'number') {
        return res.status(400).json({ error: 'Valid coordinates (lng, lat) are required' });
    }

    const report = await OutageReport.findById(id)

    if(!report) {
        return res.status(400).json({ message: 'Report not found'})
    }

    if (report.status === 'resolved') {
        return res.status(400).json({ message: 'Cannot verify a resolved report'})
    }

    if (report.userId.toString() === userId.toString()) {
        return res.status(400).json({ message: "User can't verify their own report"})
    }

    if (report.verifications.length > 0) {
        const alreadyVerified = report.verifications.find( v => v.userId.toString() === userId.toString())

        if(alreadyVerified) {
            return res.status(400).json({ message: "Can't verify the same report twice"})
        }
    }

    const isNearby = await OutageReport.findOne({
        _id: id,
        location: {
            $near: {
                $geometry: {
                    type: "Point",
                    coordinates: [xCoordinate, yCoordinate]
                },
                $maxDistance: 1000
            }
        }
    })

    if (!isNearby) {
        return res.status(400).json({ message: 'You must be within 1 KM of the reported location to verify it'})
    }

    const existingVerification = report.verifications.find( v => v.userId.toString() === userId.toString() )

    if (existingVerification) {
        existingVerification.type = type
        existingVerification.timestamp = new Date()

        let upvotes = 0
        let downvotes = 0

        report.verifications.forEach(v => {
            if (v.type === 'upvote') upvotes++
            else downvotes++
        })

        report.upvotes = upvotes
        report.downvotes = downvotes

    } else {
        report.verifications.push({
            userId,
            type,
            location: {
                type: 'Point',
                coordinates: [xCoordinate, yCoordinate]
            },
            timestamp: new Date()
        })

        if (type === 'upvote') {
            report.upvotes += 1
        } else {
            report.downvotes += 1
        }
    }

    await report.updateStatus()

    const user = await User.findById(userId)

    if (report.status === 'confirmed' && type == 'upvote') {
        user.credibilityScore = Math.min(100, user.credibilityScore + 2)
        user.accurateReports += 1
        await user.save()
    }

    if (report.status === 'false' && type === 'downvote') {
        user.credibilityScore = Math.min(100, user.credibilityScore + 2)
        user.accurateReports += 1
        await user.save()
    }

    return res.status(201).json({ message: `Report ${type}d successfully`})
})

export const resolve_report = asyncHandler( async (req, res, next) => {
    const { id } = req.params
    const { xCoordinate, yCoordinate } = req.body.outage
    const userId = req.user._id

    const report = await OutageReport.findById(id)

    if(!report) {
        return res.status(400).json({ message: 'Report not found' })
    }

    if (report.status === "resolved") {
        return res.status(400).json({ message: "Report is already resolved" })
    }

    if (!xCoordinate || !yCoordinate) {
        return res.status(400).json({ message: 'Location required'})
    }

    const isNearby = await OutageReport.findOne({
        _id: id,
        location: {
            $near: {
                $geometry: {
                    type: "Point",
                    coordinates: [xCoordinate, yCoordinate]
                },
                $maxDistance: 1000
            }
        }
    })

    if (!isNearby) {
        return res.status(400).json({ message: "You must be within 1 KM to mark as resolved"})
    }

    const isCreator = report.userId.toString() === userId.toString()

    if(isCreator) {
        report.status = 'resolved'
        report.resolvedAt = new Date()
        report.outageDuration = Math.round( (report.resolvedAt - report.reportedAt ) / (1000 * 60) )

        await report.save()

        return res.status(201).json({ message: 'Report marked as resolved' })
    }

    if (!report.resolutionConfirmations) {
        report.resolutionConfirmations = []
    }

    const alreadyConfirmed = report.resolutionConfirmations.find( c => c.userId.toString() === userId.toString() )

    if (alreadyConfirmed) {
        return res.status(400).json({ message: "You already confirmed power is restored"})
    }

    report.resolutionConfirmations.push({
        userId,
        location: { type: "Point", coordinates: [xCoordinate, yCoordinate ]},
        timestamp: new Date()
    })

    if (report.resolutionConfirmations.length >= 3) {
        report.status = 'resolved'
        report.resolvedAt = new Date()
        report.outageDuration = Math.round( (report.resolvedAt - report.reportedAt) / (1000 * 60) )
    }

    await report.save()

    return res.status(201).json({  message: report.status === 'resolved' ? 'Report marked as resolved' : `Power restoration confirmed (${report.resolutionConfirmations.length}/3)` })
})