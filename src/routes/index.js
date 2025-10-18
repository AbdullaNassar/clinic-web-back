import express from "express";
import patientRoute from "./api/patientRoute.js";
import bookingRoute from "./api/bookingRoute.js";
const router = express.Router();
// Define Routes
// router.use("/patients", patientRoute);
router.use("/bookings", bookingRoute);
router.use("/patients", patientRoute);

export default router;
