var express = require('express');
//var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

var rout = express();
var Usuario = require('../models/usuario');

rout.post('/',(req,res)=>{

    var body = req.body;

    Usuario.findOne({email: body.email}, (err, usuBD)=>{


        if(err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al buscar usuario',
                errors: err
            });
        }
        if(!usuBD) {
            return res.status(400).json({
                ok: false,
                mensaje: 'credenciales incorrectas - email',
                errors: err
            });
        }

      /*  if(!bcrypt.compareSync( body.password, usuBD.password)){
            return res.status(400).json({
                ok: false,
                mensaje: 'credenciales incorrectas - password',
                errors: err
            });
        }*/
        if(body.password != usuBD.password){
            return res.status(400).json({
                ok: false,
                mensaje: 'credenciales incorrectas - password',
                errors: err
            }); 
        }


        //crear token
        usuBD.password=':)';
        var token = jwt.sign({ usuario: usuBD}, SEED,{ expiresIn:14000});

        res.status(200).json({
            ok: true,
            usuario: usuBD,
            token: token,
            id: usuBD._id
        });
    });
    
});


module.exports = rout;