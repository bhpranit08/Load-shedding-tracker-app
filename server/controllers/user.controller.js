import asyncHandler from "express-async-handler"
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import generateTokenAndSetCookie from "../utils/generateToken.js"

export const register = asyncHandler( async (req, res, next) => {
    console.log('hello')
    const { username, firstName, lastName, email, phoneNo, password, confirmPassword } = req.body.user

    if(firstName.length < 3) {
        return res.status(400).json({ error: "First Name too short"})
    }

    if(lastName.length < 3) {
        return res.status(400).json({ error: "Last Name too short"})
    }

    if (confirmPassword !== password ) {
        return res.status(400).json({ error: "Passwords don't match"})
    }

    const userExists = await User.findOne({ username, phoneNo, email })

    if(userExists) {
        return res.status(400).json({ message: 'Email/phone/username already taken' })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const user = new User({
        username,
        email,
        phoneNo,
        password: hashedPassword,
        firstName,
        lastName,
        role: 'admin',
        isCreating: false,
    })

    await user.save()

    res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
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

    res.status(200).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
    })
})

export const me = asyncHandler(async (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' })
    }
    
    const user = req.user

    res.status(200).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        company: user.company,
        permissions: user.permissions,
        avatar: user.profile?.avatar,
        plan: user.plan
    })
})