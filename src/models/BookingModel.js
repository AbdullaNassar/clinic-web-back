import mongoose from "mongoose";
import Joi from "joi";
import {
  typeOfBookingEnum,
  sourceOfBookingEnum,
  whereOfBookingEnum,
} from "../utils/constants/enums.js";

// Define status enum
const statusEnum = ["pending", "completed", "cancelled"];

// ------------------------------------
// 1. Joi Schema for CREATION
// ------------------------------------
const bookingCreationSchema = Joi.object({
  bookingName: Joi.string().min(3).required(),

  phoneNumbers: Joi.array()
    .items(Joi.string().trim().min(5))
    .min(1)
    .max(3)
    .required()
    .messages({
      "array.min": "At least one phone number is required",
    }),

  dateOfBooking: Joi.date().required(),

  typeOfBooking: Joi.string()
    .valid(...typeOfBookingEnum)
    .required(),

  patient: Joi.string().allow(null).optional(),

  sourceOfBooking: Joi.string()
    .valid(...sourceOfBookingEnum)
    .optional(),

  whereOfBooking: Joi.string()
    .valid(...whereOfBookingEnum)
    .default("inclinic")
    .optional(),

  isConfirmed: Joi.boolean().default(false).optional(),

  // ✅ Add status validation
  status: Joi.string()
    .valid(...statusEnum)
    .default("pending")
    .optional(),
});

// ------------------------------------
// 2. Joi Schema for UPDATE
// ------------------------------------
const bookingUpdateSchema = Joi.object({
  bookingName: Joi.string().min(3).optional(),

  phoneNumbers: Joi.array()
    .items(Joi.string().trim().min(5))
    .min(1)
    .max(3)
    .required()
    .messages({
      "array.min": "At least one phone number is required",
    }),

  dateOfBooking: Joi.date().optional(),

  typeOfBooking: Joi.string()
    .valid(...typeOfBookingEnum)
    .optional(),

  patient: Joi.string().allow(null).optional(),

  sourceOfBooking: Joi.string()
    .valid(...sourceOfBookingEnum)
    .optional(),

  whereOfBooking: Joi.string()
    .valid(...whereOfBookingEnum)
    .optional(),

  isConfirmed: Joi.boolean().optional(),

  // ✅ Allow status update
  status: Joi.string()
    .valid(...statusEnum)
    .optional(),
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
      enum: sourceOfBookingEnum,
    },

    dateOfBooking: { type: Date, required: true },

    typeOfBooking: {
      type: String,
      enum: typeOfBookingEnum,
      required: true,
    },

    whereOfBooking: {
      type: String,
      enum: whereOfBookingEnum,
      default: "inclinic",
    },

    isConfirmed: { type: Boolean, default: false },

    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: false,
    },

    // ✅ Add status to Mongoose schema
    status: {
      type: String,
      enum: statusEnum,
      default: "pending",
    },
  },
  { timestamps: true }
);

// ------------------------------------
// 4. Exports
// ------------------------------------
const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
export { bookingCreationSchema, bookingUpdateSchema, statusEnum };
