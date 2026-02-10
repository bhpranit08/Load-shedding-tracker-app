import jwt from "jsonwebtoken"
import User from "../models/user.model.js"

const protectRoute = async (req, res, next) => {
    try {
        // Get token from Authorization header instead of cookies
        const authHeader = req.headers.authorization
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Unauthorized - No token provided' })
        }

        // Extract token (format: "Bearer TOKEN_HERE")
        const token = authHeader.split(' ')[1]

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized - No token provided' })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        
        if (!decoded) {
            return res.status(401).json({ message: 'Unauthorized - Invalid token'})
        }

        const user = await User.findById(decoded.userId).select("-password")
        
        if(!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        req.user = user
        next()

    } catch (err) {
        console.log(`Error in protectRoute: ${err}`)
        
        if(err.name === "TokenExpiredError") {
            return res.status(401).json({ message: 'Unauthorized - Token expired' })
        }
        if(err.name === "JsonWebTokenError") {
            return res.status(401).json({ message: 'Unauthorized - Invalid token' })
        }
        
        res.status(500).json({ message: 'Internal server error' })
    }
}

export default protectRoute