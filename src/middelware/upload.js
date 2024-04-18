const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${getFileExtension(file.originalname)}`);
    }
});

function getFileExtension(filename) {
    return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
}

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'audio/mp3' || 
        file.mimetype === 'audio/mpeg' ||  // Esto es para MP3
        file.mimetype === 'image/png' ) {   
        cb(null, true);
    } else {
        cb(new Error('Tipo de archivo no soportado'), false);
    }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });


module.exports = upload;