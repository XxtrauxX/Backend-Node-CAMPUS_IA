const { validationResult } = require('express-validator');
const InscriptionModel = require('../models/inscription.model');

const createInscription = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    try {
        const { 
            product_type, 
            product_name, 
            name, 
            lastname, 
            email, 
            phone, 
            document, 
            payment_reference, 
            numSeats, 
            selected_course 
        } = req.body;

        const inscriptionData = {
            product_type,
            product_name: product_name || null,
            name: name || 'N/A',
            lastname: lastname || 'N/A',
            email,
            phone: phone || 'N/A',
            document: document || 'N/A',
            payment_reference,
            numSeats: numSeats || 1,
            selected_course: selected_course || null
        };
        
        await InscriptionModel.save(inscriptionData);

        res.status(201).json({ success: true, message: "Registro pendiente creado exitosamente." });
    } catch (error) {
        next(error);
    }
};

module.exports = { createInscription };