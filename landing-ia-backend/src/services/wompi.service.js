const crypto = require('crypto');
const InscriptionModel = require('../models/inscription.model');
const WebhookLogModel = require('../models/webhooklog.model');
const { sendWelcomeEmail, sendNotificationEmail } = require('./email.service');

class WompiService {
   
    generateSignature(reference, amountInCents, currency) {
        const integrityKey = process.env.WOMPI_INTEGRITY_KEY;
        if (!integrityKey) {
            throw new Error("La clave de integridad de Wompi (WOMPI_INTEGRITY_KEY) no está configurada.");
        }
        const stringToSign = `${reference}${amountInCents}${currency}${integrityKey}`;
        return crypto.createHash('sha256').update(stringToSign, 'utf8').digest('hex');
    }

   
    async processWebhook(event) {
        
        const secret = process.env.WOMPI_EVENTS_SECRET;
        if (!event?.signature?.properties || !event?.timestamp || !event?.signature?.checksum) {
            return { error: true, code: 400, message: "Faltan datos en la firma del webhook." };
        }

        const { properties, checksum: wompiChecksum } = event.signature;
        let concatenatedProperties = "";
        for (const prop of properties) {
            const value = prop.split('.').reduce((o, i) => o?.[i], event.data);
            concatenatedProperties += value;
        }
        const stringToSign = `${concatenatedProperties}${event.timestamp}${secret}`;
        const localChecksum = crypto.createHash("sha256").update(stringToSign, "utf8").digest("hex");

        if (wompiChecksum !== localChecksum) {
            console.warn("ALERTA DE SEGURIDAD: Checksum de webhook inválido.");
            return { error: true, code: 403, message: "Checksum inválido." };
        }

        
        const { id: transactionId, reference, status } = event.data.transaction;
        const existingEvent = await WebhookLogModel.findByTransaction(transactionId, reference);
        if (existingEvent) {
            return { error: true, code: 200, message: "Evento duplicado." };
        }
        
        await WebhookLogModel.create({
            eventType: event.event,
            environment: event.environment,
            transactionId,
            reference,
            status,
            payload: event,
            checksum: wompiChecksum
        });
        
        
        if (status === 'APPROVED') {
            if (reference.startsWith("ia_")) {
                await this.processApprovedIAInscription(event.data.transaction);
            }
        } else {
            console.log(`Webhook recibido para ${reference} con estado ${status}. No se requiere acción.`);
        }

        return { success: true };
    }

   
    async processApprovedIAInscription(transaction) {
        const { reference, finalized_at, amount_in_cents, customer_email, payment_method_type } = transaction;
        
        const updatedInscription = await InscriptionModel.updateStatus(reference, finalized_at, amount_in_cents / 100);

        if (updatedInscription) {
            const { full_name, phone_number } = transaction.customer_data || {};
            await sendWelcomeEmail(customer_email, full_name, updatedInscription.selected_course);

            const notifData = {
                email: customer_email,
                username: full_name,
                phone: phone_number,
                documentNumber: updatedInscription.document,
                paymentMethod: payment_method_type,
                amount: updatedInscription.total_paym_value,
                contactEmail: "admin@tuempresa.com", // Cambiar este correo :)
                selected_course: updatedInscription.selected_course,
            };
            await sendNotificationEmail(notifData);
        }
    }
}


module.exports = new WompiService();