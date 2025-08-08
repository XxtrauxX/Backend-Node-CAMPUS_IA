const express = require("express");
const WompiController = require("../controllers/wompi.controller");
const router = express.Router();

router.post("/generate-signature", WompiController.generateSignature);

router.post("/webhook", WompiController.receiveWebhook);

router.post("/debug-webhook", (req, res) => {
    console.log("\n--- INICIO DE DEPURACIÓN DE WEBHOOK ---");
    console.log("==> HEADERS RECIBIDOS:");
    console.log(JSON.stringify(req.headers, null, 2));
    console.log("\n==> BODY RECIBIDO:");
    console.log(JSON.stringify(req.body, null, 2));
    console.log("--- FIN DE DEPURACIÓN ---\n");

    res.status(200).json({
        message: "Datos recibidos en el endpoint de depuración. Revisa la consola del servidor.",
        body_recibido: req.body
    });
});

module.exports = router;