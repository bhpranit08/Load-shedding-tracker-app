import express from "express"
import { add_report, get_reports, resolve_report, verify_report } from "../controllers/outage.controller.js"
import protectRoute from "../middlewares/protectRoute.js"

const router = express.Router()

router.get("/nearby", get_reports )

router.post('/', protectRoute, add_report)
router.post("/:id/verify", protectRoute, verify_report)
router.post("/:id/resolve", protectRoute, resolve_report)

export default router