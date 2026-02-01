import asyncHandler from "express-async-handler"
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import generateTokenAndSetCookie from "../utils/generateToken.js"

export const register = asyncHandler( async (req, res, next) => {
    const { name, email, password, confirmPassword, xCoordinate, yCoordinate } = req.body.user

    if (xCoordinate < 80.0 || xCoordinate > 88.2 || yCoordinate < 26.3 || yCoordinate > 30.4) {
        return res.status(400).json({ message: 'Location must be within Nepal' });
    }

    if(name.length < 3) {
        return res.status(400).json({ message: "Name too short"})
    }

    if (confirmPassword !== password ) {
        return res.status(400).json({ message: "Passwords don't match"})
    }

    const userExists = await User.findOne({ email })

    if(userExists) {
        return res.status(400).json({ message: 'Email already taken' })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const user = new User({
        name,
        email,
        password: hashedPassword,
        homeLocation: {
            coordinates: [xCoordinate, yCoordinate]
        }
    })

    await user.save()

    res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
    })
})

export const login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body.user

    const user = await User.findOne({ email })

    const isPasswordCorrect = await bcrypt.compare(password, user?.password || "")

    if(!user || !isPasswordCorrect) {
        return res.status(400).json({ message: 'Invalid username or password'})
    }

    generateTokenAndSetCookie(user._id, res)

    res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
    })
})

export const me = asyncHandler(async (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' })
    }
    
    const user = req.user

    res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        homeLocation: user.homeLocation,
        credibilityScore: user.credibilityScore,
        totalReports: user.profile?.totalReports,
        accurateReports: user.accurateReports
    })
})