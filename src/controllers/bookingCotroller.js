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
    data: booking,
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
    data: booking,
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

const getBookingsByDate = asyncHandler(async (req, res) => {
  try {
    const { date } = req.body;
    console.log(date);

    if (!date) {
      return res.status(400).json({
        status: "Failed",
        message: "Please provide a date (YYYY-MM-DD)",
      });
    }

    const targetDate = new Date(date);
    if (isNaN(targetDate.getTime())) {
      return res.status(400).json({
        status: "Failed",
        message: "Invalid date format. Use YYYY-MM-DD.",
      });
    }

    // Get start & end of that day (for all bookings on that date)
    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

    const bookings = await Booking.find({
      dateOfBooking: { $gte: startOfDay, $lte: endOfDay },
    })
      .populate("patient", "name phone") // optional
      .sort({ dateOfBooking: 1 });

    res.status(200).json({
      status: "Success",
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    console.error("Error fetching bookings by date:", error);
    res.status(500).json({
      status: "Failed",
      message: "Server error while fetching bookings",
    });
  }
});

export default {
  createBooking,
  getAllBookings,
  getBooking,
  updateBooking,
  deleteBooking,
  getBookingsByDate,
};
