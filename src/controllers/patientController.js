import asyncHandler from "express-async-handler";
import Patient, {
  patientCreationSchema, // MUST be exported by the model
  patientUpdateSchema, // MUST be exported by the model
} from "../models/PatientModel.js";

// -----------------------------------------------------------------------------
// CONTROLLER FUNCTIONS - Defined Internally
// -----------------------------------------------------------------------------

/**
 * @desc Create a new Patient (Uses patientCreationSchema)
 * @route POST /api/v1/patients
 */
const createPatient = asyncHandler(async (req, res) => {
  // 1. Joi Validation for Creation
  const { error, value } = patientCreationSchema.validate(req.body);

  if (error) {
    res.status(400); // Bad Request
    throw new Error(
      `Validation failed for creation: ${error.details[0].message}`
    );
  }

  // 2. Database Creation
  const newPatient = await Patient.create(value);

  res.status(201).json({
    status: "success",
    data: { patient: newPatient },
  });
});

// -----------------------------------------------------------------------------

/**
 * @desc Get all Patients
 * @route GET /api/v1/patients
 */
const getAllPatients = asyncHandler(async (req, res) => {
  const patients = await Patient.find();

  res.status(200).json({
    status: "success",
    results: patients.length,
    data: { patients },
  });
});

// -----------------------------------------------------------------------------

/**
 * @desc Get a single Patient by ID
 * @route GET /api/v1/patients/:id
 */
const getPatient = asyncHandler(async (req, res) => {
  const patient = await Patient.findById(req.params.id);

  if (!patient) {
    res.status(404); // Not Found
    throw new Error("No patient found with that ID");
  }

  res.status(200).json({
    status: "success",
    data: { patient },
  });
});

// -----------------------------------------------------------------------------

/**
 * @desc Update a Patient by ID (Uses patientUpdateSchema)
 * @route PATCH /api/v1/patients/:id
 */
const updatePatient = asyncHandler(async (req, res) => {
  // 1. Joi Validation for Update (all fields optional)
  const { error, value } = patientUpdateSchema.validate(req.body);

  if (error) {
    res.status(400); // Bad Request
    throw new Error(
      `Validation failed for update: ${error.details[0].message}`
    );
  }

  // 2. Database Update
  const patient = await Patient.findByIdAndUpdate(req.params.id, value, {
    new: true, // Return the updated document
    runValidators: true, // Run Mongoose validators
  });

  if (!patient) {
    res.status(404); // Not Found
    throw new Error("No patient found with that ID");
  }

  res.status(200).json({
    status: "success",
    data: { patient },
  });
});

// -----------------------------------------------------------------------------

/**
 * @desc Delete a Patient by ID
 * @route DELETE /api/v1/patients/:id
 */
const deletePatient = asyncHandler(async (req, res) => {
  const patient = await Patient.findByIdAndDelete(req.params.id);

  if (!patient) {
    res.status(404); // Not Found
    throw new Error("No patient found with that ID");
  }

  // 204 No Content is the standard response for a successful DELETE
  res.status(204).json({
    status: "success",
    data: null,
  });
});

// -----------------------------------------------------------------------------
// Default Export of an Object containing all controller functions
// -----------------------------------------------------------------------------
export default {
  createPatient,
  getAllPatients,
  getPatient,
  updatePatient,
  deletePatient,
};
