var express = require('express');
var rout = express();


rout.get('/',(req, res, next) =>{
    res.status(200).json({
        ok: true,
        mensaje: 'Peticion realizada con exito'
    });
});

module.exports = rout;