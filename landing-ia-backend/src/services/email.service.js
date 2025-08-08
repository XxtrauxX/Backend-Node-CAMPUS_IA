const nodemailer = require('nodemailer');



const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});


const formatCourseDate = (dateString) => {
    const date = new Date(dateString);
    
    date.setDate(date.getDate() + 1); 
    return isNaN(date) ? "Fecha no especificada" : date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};


const sendWelcomeEmail = async (email, username, selected_course) => {
    const mailOptions = {
        from: `"Campuslands" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: '🎓 ¡Inscripción Exitosa! Bienvenido al Curso de IA',
        html: `
            <h1>¡Felicidades, ${username}!</h1>
            <p>Tu inscripción al <strong>Curso de Inteligencia Artificial</strong> para el día <strong>${formatCourseDate(selected_course)}</strong> ha sido confirmada.</p>
            <p>Estamos muy emocionados de tenerte con nosotros. Pronto recibirás más detalles sobre el curso.</p>
            <hr>
            <p>Equipo de Campuslands.</p>
        ` 
    };
    await transporter.sendMail(mailOptions);
    console.log(`Correo de bienvenida enviado a: ${email}`);
};


const sendNotificationEmail = async (notificationData) => {
    const { email, username, phone, documentNumber, paymentMethod, amount, contactEmail, selected_course } = notificationData;
    const mailOptions = {
        from: `"Notificaciones Campuslands" <${process.env.EMAIL_USER}>`,
        to: contactEmail, // Email del administrador.
        subject: '✅ Nueva Inscripción Confirmada - Curso de IA',
        html: `
            <h1>Nueva Inscripción Confirmada</h1>
            <p>Se ha registrado y pagado un nuevo participante:</p>
            <ul>
                <li><strong>Nombre:</strong> ${username}</li>
                <li><strong>Email:</strong> ${email}</li>
                <li><strong>Teléfono:</strong> ${phone}</li>
                <li><strong>Documento:</strong> ${documentNumber}</li>
                <li><strong>Curso:</strong> ${formatCourseDate(selected_course)}</li>
                <li><strong>Monto Pagado:</strong> $${amount} COP</li>
                <li><strong>Método de Pago:</strong> ${paymentMethod}</li>
            </ul>
        `
    };
    await transporter.sendMail(mailOptions);
    console.log(`Correo de notificación enviado a: ${contactEmail}`);
};

module.exports = { sendWelcomeEmail, sendNotificationEmail };