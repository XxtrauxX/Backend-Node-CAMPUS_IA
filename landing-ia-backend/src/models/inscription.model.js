const db = require("../helpers/database");

const formatDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toISOString().slice(0, 19).replace('T', ' ');
};

const InscriptionModel = {
    save: async (inscriptionData) => {
        const query = `
            INSERT INTO INSCRIPTIONS (
                product_type, product_name, name, lastname, email, phone, document, 
                payment_reference, selected_course, num_seats
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [
            inscriptionData.product_type,
            inscriptionData.product_name,
            inscriptionData.name,
            inscriptionData.lastname,
            inscriptionData.email,
            inscriptionData.phone,
            inscriptionData.document,
            inscriptionData.payment_reference,
            inscriptionData.selected_course,
            inscriptionData.numSeats
        ];
        const [result] = await db.execute(query, values);
        return result;
    },

    updateStatus: async (payment_reference, payment_date, total_paym_value) => {
        const formattedDate = formatDate(payment_date);
        const updateQuery = `
            UPDATE INSCRIPTIONS
            SET status = 'EXITOSO', payment_date = ?, total_paym_value = ?, amount_paid = ?
            WHERE payment_reference = ?
        `;
        await db.execute(updateQuery, [formattedDate, total_paym_value, total_paym_value, payment_reference]);
        
        const selectQuery = `SELECT * FROM INSCRIPTIONS WHERE payment_reference = ?`;
        const [rows] = await db.execute(selectQuery, [payment_reference]);
        return rows[0];
    },

    getAll: async () => {
        const query = `SELECT * FROM INSCRIPTIONS ORDER BY created_at DESC`;
        const [rows] = await db.execute(query);
        return rows;
    },

    getAllByCourseDate: async (courseDate) => {
        const query = `SELECT * FROM INSCRIPTIONS WHERE selected_course = ? ORDER BY created_at DESC`;
        const [rows] = await db.execute(query, [courseDate]);
        return rows;
    },

    getById: async (id) => {
        const query = `SELECT * FROM INSCRIPTIONS WHERE id = ?`;
        const [rows] = await db.execute(query, [id]);
        return rows[0] || null;
    },

    getConfirmedCount: async () => {
        const query = `SELECT COUNT(*) AS total FROM INSCRIPTIONS WHERE status = 'EXITOSO'`;
        const [rows] = await db.execute(query);
        return rows[0] || { total: 0 };
    },

    getConfirmedCountByCourseDate: async (courseDate) => {
        const query = `SELECT COUNT(*) AS total FROM INSCRIPTIONS WHERE status = 'EXITOSO' AND selected_course = ?`;
        const [rows] = await db.execute(query, [courseDate]);
        return rows[0] || { total: 0 };
    }
};

module.exports = InscriptionModel;