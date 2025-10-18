import mongoose from "mongoose";
import Joi from "joi";

// ... (All Joi Enums and Sub-Schemas definitions remain unchanged) ...

// Title Job Enum
const titleJobEnum = ["doctor", "engineer", "student"];
const genderEnum = ["male", "female"];
const materialStatusEnum = ["single", "married", "divorced", "widow"];
const menstrualStatusEnum = ["regular", "nonRegular"];
const statureEnum = [
  "Dwarf stature (--)",
  "Short stature (-)",
  "Average stature",
  "Tall stature (+)",
  "Giant stature (++)",
];
const bodyWeightEnum = [
  "Skinny Thin (--)",
  "Under weight (-)",
  "Average weight",
  "Over weight (+)",
  "Obese / Fat (++)",
  "Morbid Obesity (+++)",
];
const bodyBuildEnum = [
  "Meager body build (--)",
  "Weak body build (-)",
  "Average body build",
  "Firm body build (+)",
  "Athlete body build (++)",
];
const generalHealthEnum = [
  "Cachectic health (--)",
  "Sick health (-)",
  "Average health",
  "Vital & Active health (+)",
];
const physiologicalStatusChoices = [
  "Arrogant",
  "Bipolar Manic",
  "Confident",
  "Depressed",
  "Diffident",
  "Hesitant",
  "Obsessed (OCD)",
];

const addressSchemaJoi = Joi.object({
  primary: Joi.object()
    .keys({
      country: Joi.string().required(),
      governrate: Joi.string().when("country", {
        is: "egypt",
        then: Joi.required(),
        otherwise: Joi.optional(),
      }),
      city: Joi.string().required(),
    })
    .optional(),
  secondary: Joi.object()
    .keys({
      country: Joi.string().required(),
      governrate: Joi.string().when("country", {
        is: "egypt",
        then: Joi.required(),
        otherwise: Joi.optional(),
      }),
      city: Joi.string().required(),
    })
    .optional(),
}).optional();

const pregnancySchemaJoi = Joi.object({
  numberOfPregnancies: Joi.number().min(0).integer().optional(),
  numberOfBirths: Joi.number().min(0).integer().optional(),
  livingChildren: Joi.number().min(0).integer().optional(),
}).optional();

// ------------------------------------
// 2. Joi Schema for CREATION (The original patientValidationSchema)
// ------------------------------------
const patientCreationSchema = Joi.object({
  // Required Fields:
  fullName: Joi.string().min(10).required().messages({
    "string.min": "Full name must be at least 10 characters long.",
    "any.required": "Full name is required.",
  }),
  phoneNumbers: Joi.array()
    .items(Joi.string())
    .min(1)
    .max(3)
    .required()
    .messages({
      "array.min": "At least one phone number is required.",
      "any.required": "Phone numbers array is required.",
    }), // Optional Fields:
  titleJob: Joi.string()
    .valid(...titleJobEnum)
    .optional(),
  dateOfBirth: Joi.date().optional(),
  gender: Joi.string()
    .valid(...genderEnum)
    .optional(),
  materialStatus: Joi.string()
    .valid(...materialStatusEnum)
    .optional(),
  nationality: Joi.string().optional(),
  address: addressSchemaJoi,
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .optional(),
  pregnancy: pregnancySchemaJoi.when("gender", {
    is: "female",
    then: Joi.optional(),
    otherwise: Joi.forbidden(),
  }),
  menstrualPeriodStatus: Joi.string()
    .valid(...menstrualStatusEnum)
    .optional(),
  stature: Joi.string()
    .valid(...statureEnum)
    .optional(),
  bodyWeight: Joi.string()
    .valid(...bodyWeightEnum)
    .optional(),
  bodyBuild: Joi.string()
    .valid(...bodyBuildEnum)
    .optional(),
  generalHealth: Joi.string()
    .valid(...generalHealthEnum)
    .optional(),
  physiologicalStatus: Joi.array()
    .items(Joi.string().valid(...physiologicalStatusChoices))
    .optional(),
});

// ------------------------------------
// 3. Joi Schema for UPDATE (All fields optional)
// ------------------------------------
const patientUpdateSchema = Joi.object({
  fullName: Joi.string().min(10).optional(),
  titleJob: Joi.string()
    .valid(...titleJobEnum)
    .optional(),
  dateOfBirth: Joi.date().optional(),
  gender: Joi.string()
    .valid(...genderEnum)
    .optional(),
  phoneNumbers: Joi.array().items(Joi.string()).min(1).max(3).optional(),
  materialStatus: Joi.string()
    .valid(...materialStatusEnum)
    .optional(),
  nationality: Joi.string().optional(),
  address: addressSchemaJoi,
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .optional(),
  pregnancy: pregnancySchemaJoi.when("gender", {
    is: "female",
    then: Joi.optional(),
    otherwise: Joi.forbidden(),
  }),
  menstrualPeriodStatus: Joi.string()
    .valid(...menstrualStatusEnum)
    .optional(),
  stature: Joi.string()
    .valid(...statureEnum)
    .optional(),
  bodyWeight: Joi.string()
    .valid(...bodyWeightEnum)
    .optional(),
  bodyBuild: Joi.string()
    .valid(...bodyBuildEnum)
    .optional(),
  generalHealth: Joi.string()
    .valid(...generalHealthEnum)
    .optional(),
  physiologicalStatus: Joi.array()
    .items(Joi.string().valid(...physiologicalStatusChoices))
    .optional(),
}).unknown(true); // Allow unknown fields for robust partial updates

// ------------------------------------
// 4. Mongoose Schema Definition (Unchanged)
// ------------------------------------
const patientSchema = new mongoose.Schema(
  {
    // ... (Mongoose schema definition is unchanged)
    fullName: { type: String, required: true, minlength: 10, trim: true },
    titleJob: { type: String, enum: titleJobEnum },
    dateOfBirth: { type: Date },
    gender: { type: String, enum: genderEnum },
    phoneNumbers: {
      type: [String],
      validate: {
        validator: (v) => Array.isArray(v) && v.length >= 1 && v.length <= 3,
        message: "Phone numbers must be an array of 1 to 3 numbers.",
      },
    },
    materialStatus: { type: String, enum: materialStatusEnum },
    nationality: { type: String },
    email: { type: String, lowercase: true, trim: true },
    address: {
      primary: {
        country: { type: String },
        governrate: { type: String },
        city: { type: String },
      },
      secondary: {
        country: { type: String },
        governrate: { type: String },
        city: { type: String },
      },
    },
    pregnancy: {
      numberOfPregnancies: { type: Number, min: 0 },
      numberOfBirths: { type: Number, min: 0 },
      livingChildren: { type: Number, min: 0 },
    },
    menstrualPeriodStatus: { type: String, enum: menstrualStatusEnum },
    stature: { type: String, enum: statureEnum },
    bodyWeight: { type: String, enum: bodyWeightEnum },
    bodyBuild: { type: String, enum: bodyBuildEnum },
    generalHealth: { type: String, enum: generalHealthEnum },
    physiologicalStatus: { type: [String], enum: physiologicalStatusChoices },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ------------------------------------
// 5. Mongoose Virtual Property (Age Calculation - Unchanged)
// ------------------------------------
patientSchema.virtual("age").get(function () {
  // ... (Age calculation logic is unchanged)
  if (this.dateOfBirth) {
    const today = new Date();
    const birthDate = new Date(this.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  }
  return null;
});

// ------------------------------------
// 6. Exports (FIXED)
// ------------------------------------
const Patient = mongoose.model("Patient", patientSchema);

export default Patient;
// Export both schemas using the names the controller expects
export { patientCreationSchema, patientUpdateSchema };
