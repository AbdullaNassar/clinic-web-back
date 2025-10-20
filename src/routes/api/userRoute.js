import express from "express";
import patientController from "../../controllers/patientController.js";
import userController from "../../controllers/userController.js";
const router = express.Router();
router.post("/login", patientController.createPatient);
router.post("/login", userController.login);
export default router;
