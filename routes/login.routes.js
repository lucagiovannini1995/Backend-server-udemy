var express = require('express');
//var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

var rout = express();
var Usuario = require('../models/usuario');


//google
var CLIENT_ID = require('../config/config').CLIENT_ID;
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);



//=========================
//Autenticacion por google
//=========================
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
   // const userid = payload['sub'];
    // If request specified a G Suite domain:
    //const domain = payload['hd'];

    return{
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    };
  }




rout.post('/google', async(req,res)=>{

    var token = req.body.token;

    var googleUser = await verify(token)
    .catch(e => {
        return res.status(403).json({
            ok: false,
            mensaje: 'token no valido',
            errors: e
        });
    });

    Usuario.findOne({email:googleUser.email}, (err,usuDB)=>{
        if(err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al buscar usuario',
                errors: err
            });
        }
        if(usuDB){
            if(usuDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Debe usar tu autenticacion normal',
                    errors: err
                });
            }else{
                var token = jwt.sign({ usuario: usuDB}, SEED,{ expiresIn:14000});

                    res.status(200).json({
                        ok: true,
                        usuario: usuDB,
                        token: token,
                        id: usuDB._id
                    });
            }
        }else{
            //El usuario no xiste ..hay que crearlo
            var usuario = new Usuario();

            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)';

            usuario.save((err,u)=>{

                var token = jwt.sign({ usuario: u}, SEED,{ expiresIn:14000});

                res.status(200).json({
                    ok: true,
                    usuario: u,
                    token: token,
                    id: usuDB._id
                });
            });
             

        }

    });

 /*   return res.status(500).json({
        ok: true,
        mensaje: 'tb',
        googleUser: googleUser
    });*/

});



//=========================
//Autenticacion normal
//=========================
rout.post('/',(req,res)=>{

    var body = req.body;

    Usuario.findOne({email: body.email}, (err, usuDB)=>{


        if(err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al buscar usuario',
                errors: err
            });
        }
        if(!usuDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'credenciales incorrectas - email',
                errors: err
            });
        }

      /*  if(!bcrypt.compareSync( body.password, usuDB.password)){
            return res.status(400).json({
                ok: false,
                mensaje: 'credenciales incorrectas - password',
                errors: err
            });
        }*/
        if(body.password != usuDB.password){
            return res.status(400).json({
                ok: false,
                mensaje: 'credenciales incorrectas - password',
                errors: err
            }); 
        }


        //crear token
        usuDB.password=':)';
        var token = jwt.sign({ usuario: usuDB}, SEED,{ expiresIn:14000});

        res.status(200).json({
            ok: true,
            usuario: usuDB,
            token: token,
            id: usuDB._id
        });
    });
    
});


module.exports = rout;