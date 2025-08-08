require("dotenv").config();

const express = require("express");
const cors = require("cors");
const rateLimit = require('express-rate-limit');

const corsOptions = require('./src/config/corsOptions');
const landingRoutes = require('./src/routes/landing.routes');
const wompiRoutes = require('./src/routes/wompi.routes');
const configRoutes = require('./src/routes/config.routes');
const inscriptionRoutes = require('./src/routes/inscription.routes');
const errorHandler = require('./src/middlewares/errorHandler');

const app = express();

app.set('trust proxy', 1);

app.use(cors(corsOptions));

app.use(express.json());

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100, 
    standardHeaders: true,
    legacyHeaders: false,
    message: "Demasiadas peticiones desde esta IP, por favor intente de nuevo en 15 minutos."
});
app.use(apiLimiter);


app.use('/api/inscriptions', inscriptionRoutes); 
app.use('/api/config', configRoutes); 
app.use('/api/landing-ia', landingRoutes);
app.use('/api/wompi', wompiRoutes);

app.get('/health', (req, res) => res.status(200).send('OK'));

app.use(errorHandler);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`✅ Servidor iniciado en modo ${process.env.NODE_ENV || 'development'}`);
    console.log(`🚀 Escuchando en el puerto ${PORT}`);
});