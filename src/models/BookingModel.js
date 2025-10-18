import mongoose from "mongoose";
import Joi from "joi";
// Import the constants/enums from the new file
import {
  typeOfBookingEnum,
  sourceOfBookingEnum,
  whereOfBookingEnum,
} from "../utils/constants/enums.js";

// ------------------------------------
// 1. Joi Schema for CREATION
// ------------------------------------
const bookingCreationSchema = Joi.object({
  // Required fields:
  bookingName: Joi.string().min(3).required(),

  phoneNumbers: Joi.array().items(Joi.string()).min(1).max(3).required(),

  dateOfBooking: Joi.date().required(),

  typeOfBooking: Joi.string()
    .valid(...typeOfBookingEnum) // <-- Use constant
    .required(),

  patient: Joi.string().required(), // Optional fields:

  sourceOfBooking: Joi.string()
    .valid(...sourceOfBookingEnum) // <-- Use constant
    .optional(),

  whereOfBooking: Joi.string()
    .valid(...whereOfBookingEnum) // <-- Use constant
    .default("inclinic")
    .optional(),

  isConfirmed: Joi.boolean().default(false).optional(),
});

// ------------------------------------
// 2. Joi Schema for UPDATE
// ------------------------------------
const bookingUpdateSchema = Joi.object({
  bookingName: Joi.string().min(3).optional(),

  phoneNumbers: Joi.array().items(Joi.string()).min(1).max(3).optional(),

  dateOfBooking: Joi.date().optional(),

  typeOfBooking: Joi.string()
    .valid(...typeOfBookingEnum) // <-- Use constant
    .optional(),

  patient: Joi.string().optional(),

  sourceOfBooking: Joi.string()
    .valid(...sourceOfBookingEnum) // <-- Use constant
    .optional(),

  whereOfBooking: Joi.string()
    .valid(...whereOfBookingEnum) // <-- Use constant
    .optional(),

  isConfirmed: Joi.boolean().optional(),
}).unknown(true);

// ------------------------------------
// 3. Mongoose Schema Definition
// ------------------------------------
const bookingSchema = new mongoose.Schema(
  {
    bookingName: { type: String, required: true, minlength: 3, trim: true },
    phoneNumbers: {
      type: [String],
      validate: {
        validator: (v) => Array.isArray(v) && v.length >= 1 && v.length <= 3,
        message: "Phone numbers must be an array of 1 to 3 numbers.",
      },
    },
    sourceOfBooking: {
      type: String,
      enum: sourceOfBookingEnum, // <-- Use constant
    },
    dateOfBooking: { type: Date, required: true },
    typeOfBooking: {
      type: String,
      enum: typeOfBookingEnum, // <-- Use constant
      required: true,
    },
    whereOfBooking: {
      type: String,
      enum: whereOfBookingEnum, // <-- Use constant
      default: "inclinic",
    },
    isConfirmed: { type: Boolean, default: false },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
  },
  { timestamps: true }
);

// ------------------------------------
// 4. Exports
// ------------------------------------
const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
export { bookingCreationSchema, bookingUpdateSchema };
