const express = require('express');
const bodyParser = require('body-parser');
var authenticate = require('../authenticate');
const multer = require('multer');
const cors = require('./cors');

var storage = multer.diskStorage({ // usado para configurar as informações do upload (locais de arquivos)
    destination: (req, file, cb) => {
        cb(null, 'public/images'); // Callback: aceita dois parâmetros, o primeiro é o que fazer com erro e o segundo é o destino dos arquivos
    },
    
    filename: (req, file, cb) => {
        cb(null, file.originalname); // necessário para que o multer não coloque um nome no arquivo com string aleatória.
    }
});

const imageFileFilter = (req, file, cb) => {
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('You can upload only image files!'), false);
    }
    cb(null, true);
}

const upload = multer({storage: storage, fileFilter: imageFileFilter});
// upload.single('nome') recebe o nome do campo no qual está a imagem

const uploadRouter = express.Router();

uploadRouter.use(bodyParser.json());

uploadRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403; // Significa que a operação não é suportada
    res.end('GET operation not supported on /dishes');
    
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, upload.single('imageFile'), (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(req.file); // contém o caminho do arquivo enviado
    
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403; // Significa que a operação não é suportada
    res.end('PUT operation not supported on /dishes');
    
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403; // Significa que a operação não é suportada
    res.end('DELETE operation not supported on /dishes');
    
})


module.exports = uploadRouter;