const express = require('express');
const cors = require('cors');
const app = express();

const whitelist = ['http://localhost:3000', 'https://localhost:3443']; // a whitelist define a lista de origens aceitáveis
var corsOptionsDelegate = (req, callback) => {
    var corsOptions;
    
    if(whitelist.indexOf(req.header('Origin')) !== -1 ) { // Checa se a origem da requisição está na whitelist
        corsOptions = { origin: true }; // origin: true indica ao módulo cors que está td ok
    }
    else {
        corsOptions = { origin: false };
    }
    callback(null, corsOptions);
}

exports.cors = cors(); 
exports.corsWithOptions = cors(corsOptionsDelegate);