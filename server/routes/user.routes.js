import express from "express"
import { login, register, me } from "../controllers/user.controller.js"
import protectRoute from "../middlewares/protectRoute.js"

const router = express.Router()

router.post("/login", login)
router.post("/register", register)
router.post("/me", protectRoute, me)

export default router