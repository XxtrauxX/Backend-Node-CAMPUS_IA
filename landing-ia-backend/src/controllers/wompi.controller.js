const WompiService = require('../services/wompi.service');

class WompiController {
   
    generateSignature(req, res, next) {
        try {
            const { reference, amountInCents, currency } = req.body;
            if (!reference || !amountInCents || !currency) {
                const error = new Error("Faltan datos requeridos para generar la firma.");
                error.statusCode = 400;
                throw error;
            }
            const signature = WompiService.generateSignature(reference, amountInCents, currency);
            res.status(200).json({ signature });
        } catch (error) {
            next(error);
        }
    }

   
    async receiveWebhook(req, res, next) {
        try {
            console.log("Webhook de Wompi recibido...");
            
            const result = await WompiService.processWebhook(req.body);

            if (result.error) {
                return res.status(result.code).json({ message: result.message });
            }

            return res.status(200).json({ received: true, message: "Webhook procesado exitosamente" });

        } catch (error) {
            next(error);
        }
    }
}


module.exports = new WompiController();