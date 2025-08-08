const express = require("express");
const LandingController = require("../controllers/landing.controller");
const { protectAdmin } = require("../middlewares/auth.middleware");
const router = express.Router();

// Ruta para el formulario de la landing
router.post("/register", LandingController.register);

// Rutas para el panel de administración
router.get("/registros", protectAdmin, LandingController.getAllRegistrations);
router.get("/registros/confirmed", protectAdmin, LandingController.getConfirmedCount);
router.get("/registros/:id", protectAdmin, LandingController.getRegistrationById);

module.exports = router;