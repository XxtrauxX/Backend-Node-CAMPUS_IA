const getConfig = (req, res, next) => {
    try {
        const wompiPublicKey = process.env.WOMPI_PUBLIC_KEY;
        if (!wompiPublicKey) {
            throw new Error("WOMPI_PUBLIC_KEY no está configurada en el servidor.");
        }
        res.status(200).json({
            success: true,
            data: {
                wompiPublicKey: wompiPublicKey
            }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { getConfig };