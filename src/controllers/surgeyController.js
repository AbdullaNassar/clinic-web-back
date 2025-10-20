import asyncHandler from "express-async-handler";
import Surgery, {
  surgeryCreationSchema,
  surgeryUpdateSchema,
} from "../models/SurgeyModel.js";

// -----------------------------------------------------
// @desc    Create a new surgery
// @route   POST /api/surgeries
// @access  Private
// -----------------------------------------------------
const createSurgery = asyncHandler(async (req, res) => {
  const { error } = surgeryCreationSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      status: "Failed",
      message: error.details[0].message,
    });
  }

  const surgery = await Surgery.create(req.body);

  res.status(201).json({
    status: "Success",
    data: surgery,
  });
});

// -----------------------------------------------------
// @desc    Get all surgeries (with filters)
// @route   GET /api/surgeries
// @access  Private
// -----------------------------------------------------
const getAllSurgeries = asyncHandler(async (req, res) => {
  const { status, patient } = req.query;

  const filter = {};
  if (status) filter.status = status;
  if (patient) filter.patient = patient;

  const surgeries = await Surgery.find(filter)
    .populate("patient", "name phone")
    .sort({ createdAt: -1 });

  res.status(200).json({
    status: "Success",
    count: surgeries.length,
    data: surgeries,
  });
});

// -----------------------------------------------------
// @desc    Get a single surgery by ID
// @route   GET /api/surgeries/:id
// @access  Private
// -----------------------------------------------------
const getSurgeryById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const surgery = await Surgery.findById(id).populate("patient", "name phone");

  if (!surgery) {
    return res.status(404).json({
      status: "Failed",
      message: "Surgery not found",
    });
  }

  res.status(200).json({
    status: "Success",
    data: surgery,
  });
});

// -----------------------------------------------------
// @desc    Update a surgery
// @route   PUT /api/surgeries/:id
// @access  Private
// -----------------------------------------------------
const updateSurgery = asyncHandler(async (req, res) => {
  const { id } = req.params;
  console.log("*********");
  console.log(id);
  console.log("*********");

  const { error } = surgeryUpdateSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      status: "Failed",
      message: error.details[0].message,
    });
  }

  const surgery = await Surgery.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!surgery) {
    return res.status(404).json({
      status: "Failed",
      message: "Surgery not found",
    });
  }

  res.status(200).json({
    status: "Success",
    data: surgery,
  });
});

// -----------------------------------------------------
// @desc    Delete a surgery
// @route   DELETE /api/surgeries/:id
// @access  Private
// -----------------------------------------------------
const deleteSurgery = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const surgery = await Surgery.findByIdAndDelete(id);

  if (!surgery) {
    return res.status(404).json({
      status: "Failed",
      message: "Surgery not found",
    });
  }

  res.status(200).json({
    status: "Success",
    message: "Surgery deleted successfully",
  });
});

const getSurgeriesByPatient = asyncHandler(async (req, res) => {
  const { patientId } = req.params;
  const surgeries = await Surgery.find({ patient: patientId });

  //   if (!surgeries || surgeries.length === 0) {
  //     return res
  //       .status(404)
  //       .json({ message: "No surgeries found for this patient" });
  //   }

  res.status(200).json({ message: "success", data: surgeries });
});
export default {
  createSurgery,
  getAllSurgeries,
  deleteSurgery,
  updateSurgery,
  getSurgeryById,
  getSurgeriesByPatient,
};
