import express from "express";

// Import the default export from the controller
import patientController from "../../controllers/patientController.js";

const router = express.Router();

// Destructure the individual functions from the imported controller object
const {
  createPatient,
  getAllPatients,
  getPatient,
  updatePatient,
  deletePatient,
} = patientController;

// ------------------------------------------------------------------
// ROUTES FOR COLLECTION (/patients)
// ------------------------------------------------------------------

// GET all patients
router.get("/", getAllPatients);

// POST create a new patient
router.post("/", createPatient);

// ------------------------------------------------------------------
// ROUTES FOR SINGLE RESOURCE (/patients/:id)
// ------------------------------------------------------------------

// GET a specific patient by ID
router.get("/:id", getPatient);

// PATCH (update) a specific patient by ID
router.patch("/:id", updatePatient);

// DELETE a specific patient by ID
router.delete("/:id", deletePatient);

export default router;
