import express from "express"
import { login, register, me, logout } from "../controllers/user.controller.js"
import protectRoute from "../middlewares/protectRoute.js"

const router = express.Router()

router.get("/me", protectRoute, me)

router.post("/logout", protectRoute, logout)
router.post("/login", login)
router.post("/register", register)

export default router