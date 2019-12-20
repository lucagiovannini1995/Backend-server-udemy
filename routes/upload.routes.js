var express = require('express');

const fileUpload = require('express-fileupload');
var fs = require('fs');

var rout = express();

var Usuario = require('../models/usuario');
var Hospital = require('../models/hospital');
var Medico = require('../models/medicos');


// default options
rout.use(fileUpload());

rout.put('/:tipo/:id',(req, res, next) =>{

var tipo = req.params.tipo;
var id = req.params.id;


  //tipos de coleccion
  var tiposValidos = ['hospitales', 'medicos', 'usuarios'];

  if( tiposValidos.indexOf(tipo) < 0){
      return  res.status(400).json({
          ok: false,
          mensaje: 'Tipo de coleccion no valida no valida',
          errors: 'las colecciones validads son'+ tiposValidos.join(', ')
      });
  }

    if(!req.files){

       return  res.status(400).json({
            ok: false,
            tipo:tipo,
            mensaje: 'no selecciono nada',
            errors: 'debe seleccionar una imagen'
        });
    }
        
    

    //obtener nombre del archivo
    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extensionArch = nombreCortado[nombreCortado.length - 1];

    //Extenciones validas
    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if( extensionesValidas.indexOf(extensionArch) <0){
        return  res.status(400).json({
            ok: false,
            mensaje: 'Extension no valida',
            errors: 'las extensiones validads son'+ extensionesValidas.join(', ')
        });
    }

    //nombre de archivo personalizado
    var nombreArch = `${id}-${new Date().getMilliseconds()}.${extensionArch}`;
    //mover el archivo del temporal a um path 
    var path = `./upload/${tipo}/${nombreArch}`;

    //guardar archivp
    archivo.mv(path,err => {
        if(err){
           return res.status(500).json({
                ok: true,
                mensaje: 'Error al mover archivo',
                errors:err
            });
        }


        subirPorTipo(tipo, id, nombreArch, res);

        
    });

   
});


    function subirPorTipo(tipo, id, nombreArchivo, res){

        if( tipo === 'usuario'){


            Usuario.findById(id,(err, usuario) =>{
                

                if(!usuario){
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'usario no existe',
                        errors:err
                    });
                }

                var pathViejo = './uploads/usuarios/' + usuario.img;

                //si existe elimina la imagen vieja
                if(fs.existsSync(pathViejo)){
                    fs.unlink(pathViejo);
                }

                usuario.img = nombreArchivo;

                usuario.save((err, usuActualizado)=>{

                         return res.status(200).json({
                            ok: true,
                            mensaje: 'imagen de usuario actualizada',
                            usuario: usuActualizado
                        });
                });

            });

        }
        if( tipo === 'medicos'){
            
            Medico.findById(id,(err, medico) =>{


                if(!medico){
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'medico no existe',
                        errors:err
                    });
                }
                var pathViejo = './uploads/medicos/' + medico.img;

                //si existe elimina la imagen vieja
                if(fs.existsSync(pathViejo)){
                    fs.unlink(pathViejo);
                }

                medico.img = nombreArchivo;

                medico.save((err, medActualizado)=>{

                         return res.status(200).json({
                            ok: true,
                            mensaje: 'imagen de medico actualizada',
                            medico: medActualizado
                        });
                });

            });

        }
        if( tipo === 'hospitales'){
             
            Hospital.findById(id,(err, hospital) =>{
                if(!hospital){
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'hospital no existe',
                        errors:err
                    });
                }
                var pathViejo = './uploads/hospitales/' + hospital.img;

                //si existe elimina la imagen vieja
                if(fs.existsSync(pathViejo)){
                    fs.unlink(pathViejo);
                }

                hospital.img = nombreArchivo;

                hospital.save((err, hosActualizado)=>{

                         return res.status(200).json({
                            ok: true,
                            mensaje: 'imagen de hospital actualizada',
                            hospital: hosActualizado
                        });
                });

            });
        }
    }

module.exports = rout;