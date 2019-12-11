var express = require('express');
//var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var mdAutenticacion = require('../middlewares/auntenticacion');


var rout = express();

var Usuario = require('../models/usuario');

//===========================
//Obtener Usuario
//===========================
rout.get('/',(req, res, next) =>{
  
    var usu = Usuario.find({},'nombre email img role password')
    .exec(
    (err, usu) => {

        if(err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error cargando usuario',
                errors: err
            });
        }


        

        res.status(200).json({
            ok: true,
            usuarios: usu
        });
    });
/*
    usuario.find()
    .then((usu) => res.status(200).json({
        ok: true,
        usuarios: usu
       }))
    .catch((err) => res.status(500).json({
            mensaje: 'error cargando usuario',
            errors: err
        }));
        */
});




//===========================
//Actualizr Usuario
//===========================

rout.put('/:id',mdAutenticacion.verificaToken,(req,res) => {
    var id = req.params.id;
    var body = req.body;

    Usuario.findById(id, (err, usu)=>{
        if(err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al buscar usuario',
                errors: err
            });
        }
        if(!usu) {
            return res.status(400).json({
                ok: false,
                mensaje: 'el usuario con el id '+id+' no existe',
                errors: 'no existe un usuario con ese id'
            });
        }else{
            usu.nombre = body.nombre;
            usu.email = body.email;
            usu.role = body.role;

            usu.save((err, usuAct) => {
              
                if(err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'error al actualizar usuario',
                        errors: err
                    });
                }
                res.status(200).json({
                    ok: true,
                    usuario: usuAct
                });
            });

        }
    });

        //otra forma findByIdAndUpdate
      /*  Usuario.findById(id, (err, usu)=>{
            if(err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'error al buscar usuario',
                    errors: err
                });
            }
            if(!usu) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'el usuario con el id '+id+' no existe',
                    errors: 'no existe un usuario con ese id'
                });
            }
            usu.nombre = body.nombre;
            usu.email = body.email;
            usu.role = body.role;

            Usuario.findByIdAndUpdate(id,{$set:usu})
            .then(()=> res.status(200).json({
                ok: true,
                usuario: usu
            })
            ).catch((err)=> res.send('error al actualizar ususario:'+err));
        
        });
    **/
    
});


//===========================
//Crear Usuario
//===========================
rout.post('/',mdAutenticacion.verificaToken,(req, res) => {

    var body = req.body;

    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: /*bcrypt.hashSync(/**/body.password/*, 10)*/,
        img: body.img,
        role: body.role
    }); 

    usuario.save( ( err, usuGuardado ) =>{
        if(err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'error al crear usuario',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            usuario: usuGuardado,
            usuToken: req.usuario
        });
    });


 
});





//===========================
//Borrar Usuario
//===========================

rout.delete('/:id',mdAutenticacion.verificaToken,(req,res)=>{

    var id = req.params.id;

    Usuario.findByIdAndRemove(id,(err,usuBorrado) => {
        if(err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al borrar usuario',
                errors: err
            });
        }
        res.status(200).json({
            ok: true,
            usuario: usuBorrado
        });
    });

});

module.exports = rout;