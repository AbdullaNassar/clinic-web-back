import asyncHandler from "express-async-handler";
import Booking, {
  bookingCreationSchema,
  bookingUpdateSchema,
} from "../models/BookingModel.js";

const createBooking = asyncHandler(async (req, res) => {
  // 1. Joi Validation for Creation
  const { error, value } = bookingCreationSchema.validate(req.body);

  if (error) {
    res.status(400); // Bad Request
    throw new Error(
      `Validation failed for creation: ${error.details[0].message}`
    );
  }

  // 2. Database Creation
  const newBooking = await Booking.create(value);

  res.status(201).json({
    status: "success",
    data: newBooking,
  });
});

const getAllBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find().populate("patient");

  res.status(200).json({
    status: "success",
    results: bookings.length,
    data: bookings,
  });
});

const getBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id).populate("patient");

  if (!booking) {
    res.status(404); // Not Found
    throw new Error("No booking found with that ID");
  }

  res.status(200).json({
    status: "success",
    data: { booking },
  });
});

const updateBooking = asyncHandler(async (req, res) => {
  // 1. Joi Validation for Update (all fields optional)
  const { error, value } = bookingUpdateSchema.validate(req.body);

  if (error) {
    res.status(400); // Bad Request
    throw new Error(
      `Validation failed for update: ${error.details[0].message}`
    );
  } // 2. Database Update

  const booking = await Booking.findByIdAndUpdate(req.params.id, value, {
    new: true, // Return the updated document
    runValidators: true, // Run Mongoose validators
  });

  if (!booking) {
    res.status(404); // Not Found
    throw new Error("No booking found with that ID");
  }

  res.status(200).json({
    status: "success",
    data: { booking },
  });
});

const deleteBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findByIdAndDelete(req.params.id);

  if (!booking) {
    res.status(404); // Not Found
    throw new Error("No booking found with that ID");
  } // 204 No Content is the standard response for a successful DELETE

  res.status(204).json({
    status: "success",
    data: null,
  });
});

export default {
  createBooking,
  getAllBookings,
  getBooking,
  updateBooking,
  deleteBooking,
};
