import express from "express";
import patientRoute from "./api/patientRoute.js";
import bookingRoute from "./api/bookingRoute.js";
import userRoute from "./api/userRoute.js";
import surgeyRoute from "./api/surgeyRoute.js";
const router = express.Router();
// Define Routes
// router.use("/patients", patientRoute);
router.use("/bookings", bookingRoute);
router.use("/patients", patientRoute);
router.use("/user", userRoute);
router.use("/surgey", surgeyRoute);

export default router;
