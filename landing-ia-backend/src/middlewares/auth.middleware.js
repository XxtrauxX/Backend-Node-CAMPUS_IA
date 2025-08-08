const protectAdmin = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];

    if (!apiKey || apiKey !== process.env.ADMIN_API_KEY) {
        const error = new Error("Acceso no autorizado. Clave de API inválida o no proporcionada.");
        error.statusCode = 403; // Forbidden
        return next(error);
    }

    next();
};

module.exports = { protectAdmin };