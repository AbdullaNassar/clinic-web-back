import mongoose from "mongoose";
import Joi from "joi";
import {
  countryEnum,
  getBetterEnum,
  painPlaceEnum,
  spinePlaceEnum,
  surgeonEnum,
  surgeryTypeEnum,
} from "../utils/constants/enums.js";

// ------------------------------------
// MONGOOSE SCHEMA
// ------------------------------------
const surgerySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: surgeryTypeEnum,
      required: true,
    },
    // Non-Spine
    name: {
      type: String,
      required: function () {
        return this.type === "Non-Spine Surgery";
      },
      trim: true,
    },
    // Spine
    place: {
      type: String,
      enum: spinePlaceEnum,
      required: function () {
        return this.type === "Spine Surgery";
      },
    },
    painPlace: {
      type: String,
      enum: painPlaceEnum,
      required: function () {
        return this.type === "Spine Surgery";
      },
    },
    combinations: {
      type: Boolean,
      default: false,
    },
    getBetter: {
      type: String,
      enum: getBetterEnum,
      default: "Maybe",
    },
    surgeon: {
      type: String,
      enum: surgeonEnum,
      default: "Other",
    },
    country: {
      type: String,
      enum: countryEnum,
      default: "Egypt",
    },
    pain: {
      type: Boolean,
      default: false,
    },
    date: {
      type: Date,
      required: true,
    },
    details: {
      type: String,
      trim: true,
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
  },
  { timestamps: true }
);

// ------------------------------------
// JOI VALIDATION SCHEMAS
// ------------------------------------
const surgeryCreationSchema = Joi.object({
  type: Joi.string()
    .valid(...surgeryTypeEnum)
    .required(),

  // Non-Spine
  name: Joi.when("type", {
    is: "Non-Spine Surgery",
    then: Joi.string().min(3).required(),
    otherwise: Joi.forbidden(),
  }),

  // Spine
  place: Joi.when("type", {
    is: "Spine Surgery",
    then: Joi.string()
      .valid(...spinePlaceEnum)
      .required(),
    otherwise: Joi.forbidden(),
  }),
  painPlace: Joi.when("type", {
    is: "Spine Surgery",
    then: Joi.string()
      .valid(...painPlaceEnum)
      .required(),
    otherwise: Joi.forbidden(),
  }),

  combinations: Joi.boolean().default(false),
  getBetter: Joi.string()
    .valid(...getBetterEnum)
    .default("Maybe"),
  surgeon: Joi.string()
    .valid(...surgeonEnum)
    .default("Other"),
  country: Joi.string()
    .valid(...countryEnum)
    .default("Egypt"),
  pain: Joi.boolean().default(false),

  date: Joi.date().required(),
  details: Joi.string().allow("").optional(),

  // ✅ Make patient required
  patient: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "any.required": "Patient ID is required",
      "string.pattern.base": "Patient must be a valid MongoDB ObjectId",
    }),
});

const surgeryUpdateSchema = surgeryCreationSchema.fork(
  Object.keys(surgeryCreationSchema.describe().keys),
  (schema) => schema.optional()
);

// ------------------------------------
// EXPORTS
// ------------------------------------
const Surgery = mongoose.model("Surgery", surgerySchema);

export default Surgery;
export { surgeryCreationSchema, surgeryUpdateSchema };
