// src/routes/inscriptions.routes.js
const express = require("express");
const { body } = require('express-validator');
const { createInscription } = require("../controllers/inscription.controller");
const router = express.Router();

router.post(
    "/register",
    [
        
        
    
        body('product_type').isIn(['MAESTRIA', 'CURSO_EMPRESARIAL', 'CURSO_PREGRABADO', 'CURSO_IA']),

        
        body('product_name').optional().trim().escape(),
        body('name').trim().escape(),
        body('lastname').optional().trim().escape(),
        body('phone').optional().trim().escape(),
        body('document').optional().trim().escape(),

        
        body('email').isEmail().normalizeEmail(),

        
        body('numSeats').optional().isInt({ min: 1 }),
        body('selected_course').optional().isISO8601().toDate(),

        
        body('payment_reference').notEmpty(),
    ],
    createInscription
);

module.exports = router;