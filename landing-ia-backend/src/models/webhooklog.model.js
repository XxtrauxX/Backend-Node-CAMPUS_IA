// src/models/webhooklog.model.js
const db = require("../helpers/database");

class WebhookLogModel {
    // Crear un nuevo log de webhook
    static async create(logData) {
        const connection = await db.getConnection(); 
        try {
            await connection.beginTransaction();

            const query = `
                INSERT INTO WEBHOOK_LOG (
                    event_type, environment, transaction_id, reference, 
                    status, payload, checksum, received_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
            `;
            const params = [
                logData.eventType,
                logData.environment,
                logData.transactionId,
                logData.reference,
                logData.status,
                JSON.stringify(logData.payload), 
                logData.checksum
            ];

            const [result] = await connection.execute(query, params);
            await connection.commit();

            return { id: result.insertId, ...logData };
        } catch (error) {
            await connection.rollback();
            console.error("Error en la transacción de WebhookLogModel.create:", error);
            throw error;
        } finally {
            if (connection) connection.release();
        }
    }

    
    static async findByTransaction(transactionId, reference) {
        const query = `
            SELECT * FROM WEBHOOK_LOG
            WHERE transaction_id = ? AND reference = ?
        `;
        const [rows] = await db.execute(query, [transactionId, reference]);
        return rows[0] || null;
    }

    
    static async findAll() {
        const query = `SELECT * FROM WEBHOOK_LOG`;
        const [rows] = await db.execute(query);
        return rows;
    }
    
    
    static async findById(id) {
        const query = "SELECT * FROM WEBHOOK_LOG WHERE id = ?";
        const [rows] = await db.execute(query, [id]);
        return rows[0] || null;
    }

    static async update(id, webhookData) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            const updateFields = Object.keys(webhookData).map(field => `${field} = ?`).join(', ');
            const query = `UPDATE WEBHOOK_LOG SET ${updateFields} WHERE id = ?`;
            const values = [...Object.values(webhookData), id];

            await connection.execute(query, values);
            await connection.commit();

            return await this.findById(id);
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            if (connection) connection.release();
        }
    }

    static async delete(id) {
       const connection = await db.getConnection();
        try {
            await connection.beginTransaction();
            await connection.execute('DELETE FROM WEBHOOK_LOG WHERE id = ?', [id]);
            await connection.commit();
            return true;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            if (connection) connection.release();
        }
    }
}

module.exports = WebhookLogModel;