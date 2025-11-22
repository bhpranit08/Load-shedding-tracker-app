import express from "express"
import { login, register, me } from "../controllers/user.controller.js"

const router = express.Router()

router.post("/login", login)
router.post("/register", register)
router.post("/me", me)

export default router