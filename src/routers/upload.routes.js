const express = require('express');
const router = express.Router();
const { authJwt } = require("../middelware"); // Corregido typo y ruta relativa
const upload = require('../middelware/upload'); // Específico si tienes varios middleware en la carpeta

// Middleware de CORS configurado para más métodos HTTP
router.use(function(req, res, next) {
    res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
    );
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    next();
});

// Rutas con middleware de autenticación y manejo de carga de archivos
router.post('/uploadfile', [authJwt.verifyToken, authJwt.isAdmin, upload.single('file')], (req, res) => {
    if (req.file) {
        res.send("Archivo subido con éxito!");
    } else {
        res.status(400).send("Error: No se pudo subir el archivo. Asegúrate de que sea una imagen o un MP3.");
    }
});

router.post('/uploadmultiple', [authJwt.verifyToken , authJwt.isAdmin, upload.array('files', 5)], (req, res) => {
    if (req.files && req.files.length > 0) {
        res.send("Archivos subidos con éxito!");
    } else {
        res.status(400).send("Error: No se pudieron subir los archivos. Asegúrate de que todos sean imágenes o MP3.");
    }
});

// Exportando las rutas para ser usadas en app.js
module.exports = router;