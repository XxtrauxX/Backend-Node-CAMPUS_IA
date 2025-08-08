// generateTestChecksum.js
const crypto = require('crypto');
require('dotenv').config(); // Carga las variables de .env

// --- DATOS DEL EVENTO DE PRUEBA (Puedes cambiarlos) ---
const transactionData = {
    id: `trx-test-${Date.now()}`, // ID de transacción único para cada prueba
    amount_in_cents: 9700000,
    reference: "postman_ref_checksum_002",
    status: "APPROVED"
};

const timestamp = Date.now(); // Timestamp en milisegundos
const secret = process.env.WOMPI_EVENTS_SECRET;

// --- LÓGICA EXACTA DE WOMPI PARA CREAR LA CADENA ---
const stringToSign = `${transactionData.id}${transactionData.amount_in_cents}${transactionData.reference}${transactionData.status}${timestamp}${secret}`;

// --- CÁLCULO DEL CHECKSUM ---
const generatedChecksum = crypto.createHash("sha256").update(stringToSign, "utf8").digest("hex");


// --- IMPRIMIR LA INFORMACIÓN PARA POSTMAN ---
console.log("\n✅ ¡Checksum generado! Copia y pega lo siguiente en Postman:\n");
console.log("--- CHECKSUM (para el campo 'checksum') ---");
console.log(generatedChecksum);
console.log("\n--- TIMESTAMP (para el campo 'timestamp') ---");
console.log(timestamp);
console.log("\n--- BODY COMPLETO (para el 'Body' en Postman) ---");

const eventPayload = {
    "event": "transaction.updated",
    "data": {
        "transaction": {
            "id": transactionData.id,
            "status": transactionData.status,
            "reference": transactionData.reference,
            "amount_in_cents": transactionData.amount_in_cents,
            "customer_email": "test.checksum@example.com",
            "payment_method_type": "CARD",
            "finalized_at": new Date().toISOString(),
            "customer_data": {
                "full_name": "Test Checksum",
                "phone_number": "3009998877"
            }
        }
    },
    "signature": {
        "properties": [
            "transaction.id",
            "transaction.amount_in_cents",
            "transaction.reference",
            "transaction.status"
        ],
        "checksum": generatedChecksum 
    },
    "timestamp": timestamp,
    "environment": "test"
};

console.log(JSON.stringify(eventPayload, null, 2));
console.log("\n");