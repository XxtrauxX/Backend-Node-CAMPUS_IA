const InscriptionModel = require('../models/inscription.model');

const LandingController = {
    register: async (req, res, next) => {
        try {
            console.log("\n---------- [INICIO] Petición a /register ----------");
            console.log("CUERPO RECIBIDO (req.body):", JSON.stringify(req.body, null, 2));

            const { name, lastname, email, phone, document, payment_reference, selected_course, numSeats } = req.body;
            
            console.log("--- Verificación de campos individuales ---");
            console.log(`name:                 '${name}'`);
            console.log(`lastname:             '${lastname}'`);
            console.log(`email:                '${email}'`);
            console.log(`phone:                '${phone}'`);
            console.log(`document:             '${document}'`);
            console.log(`payment_reference:    '${payment_reference}'`);
            console.log(`selected_course:      '${selected_course}'`);
            console.log("-----------------------------------------");

            if (!name || !lastname || !email || !phone || !document || !payment_reference || !selected_course) {
                console.error("ERROR: La validación falló. Uno o más campos son 'undefined' o vacíos.");
                console.log("---------- [FIN] Petición a /register (CON ERROR) ----------\n");
                
                const error = new Error("Faltan campos obligatorios para el registro.");
                error.statusCode = 400;
                throw error;
            }
            
            console.log("ÉXITO: La validación pasó. Guardando en la base de datos...");
            await InscriptionModel.save({
                name, lastname, email, phone, document, payment_reference, selected_course,
                numSeats: numSeats || 1
            });

            console.log("---------- [FIN] Petición a /register (EXITOSA) ----------\n");
            res.status(201).json({ success: true, message: "Registro pendiente creado exitosamente." });

        } catch (error) {
            next(error); 
        }
    },

    getAllRegistrations: async (req, res, next) => {
        try {
            const { courseDate } = req.query;
            let registrations;
            if (courseDate) {
                registrations = await InscriptionModel.getAllByCourseDate(courseDate);
            } else {
                registrations = await InscriptionModel.getAll();
            }
            res.status(200).json({ success: true, message: "Registros obtenidos exitosamente", data: registrations });
        } catch (error) {
            next(error);
        }
    },
    
    getRegistrationById: async (req, res, next) => {
        try {
            const { id } = req.params;
            const registration = await InscriptionModel.getById(id);
            if (!registration) {
                const error = new Error("Registro no encontrado.");
                error.statusCode = 404;
                throw error;
            }
            res.status(200).json({ success: true, message: "Registro obtenido exitosamente", data: registration });
        } catch (error) {
            next(error);
        }
    },

    getConfirmedCount: async (req, res, next) => {
        try {
            const { courseDate } = req.query;
            let result;
            if (courseDate) {
                result = await InscriptionModel.getConfirmedCountByCourseDate(courseDate);
            } else {
                result = await InscriptionModel.getConfirmedCount();
            }
            res.status(200).json({ success: true, message: "Conteo de registros confirmados obtenido exitosamente", data: result });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = LandingController;