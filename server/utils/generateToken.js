import jwt from "jsonwebtoken"

const generateTokenAndSetCookie = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '7d',
    })

    // res.cookie("jwt", token, {
    //     maxAge: 7 * 24 * 60 * 60 * 1000,
    //     httOnly: true,
    //     samesite: "strict",
    //     secure: process.env.NODE_ENV === 'production'
    // })

    res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', 
        sameSite: 'none', 
        maxAge: 7 * 24 * 60 * 60 * 1000
    });
}

export default generateTokenAndSetCookie