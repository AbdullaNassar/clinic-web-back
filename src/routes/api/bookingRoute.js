import express from "express";

// Import the default export (the object containing all the controller methods)
import bookingController from "../../controllers/bookingCotroller.js";

const router = express.Router();

// Destructure the individual functions from the imported controller object
const {
  createBooking,
  getAllBookings,
  getBooking,
  updateBooking,
  deleteBooking,
} = bookingController;

// ------------------------------------------------------------------
// ROUTES FOR COLLECTION (/bookings)
// ------------------------------------------------------------------

// GET all bookings
router.get("/", getAllBookings);

// POST create a new booking
router.post("/", createBooking);

// ------------------------------------------------------------------
// ROUTES FOR SINGLE RESOURCE (/bookings/:id)
// ------------------------------------------------------------------

// GET a specific booking by ID
router.get("/:id", getBooking);

// PATCH (update) a specific booking by ID
router.patch("/:id", updateBooking);

// DELETE a specific booking by ID
router.delete("/:id", deleteBooking);

export default router;
