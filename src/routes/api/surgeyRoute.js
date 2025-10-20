import express from "express";
import surgeyController from "../../controllers/surgeyController.js";

const router = express.Router();

// CRUD routes
router
  .route("/")
  .post(surgeyController.createSurgery)
  .get(surgeyController.getAllSurgeries);

router.get("/patient/:patientId", surgeyController.getSurgeriesByPatient);
router
  .route("/:id")
  .get(surgeyController.getSurgeryById)
  .patch(surgeyController.updateSurgery)
  .delete(surgeyController.deleteSurgery);

export default router;
