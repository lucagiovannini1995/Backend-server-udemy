var express = require('express')
var rout = express();

var mdAutenticacion = require('../middlewares/auntenticacion');

var Hospital = require('../models/hospital');

//===========================
//Obtener Hospitales
//===========================

rout.get('/',(req,res)=>{

    var desde = req.query.desde || 0;
    desde = Number(desde);

    var hos = Hospital.find({})
    .skip(desde)//para mostrar a partir de cierta registro
    .limit(5)//para limitar los registros que muestra una pagina
    .populate('usuario','nombre email')
    .exec(
    (err,hospObtenidos) => {

        if(err){
            res.status(500).json({
                mensaje:'error al obtener hospitales',
                err:err
            });
        }
        Hospital.count({},(err, contador)=>{
        res.status(200).json({
            ok: true,
            hospitales: hospObtenidos,
            total:contador
        });
        });
    });
});


//===========================
//Crear Hospitales
//===========================

rout.post('/',mdAutenticacion.verificaToken,(req,res,next)=>{

    var body = req.body;
    var hos = new Hospital({
        nombre: body.nombre,
        img: body.img,
        usuario: req.usuario._id
    });

    hos.save((err,hosGuar) => {

        if(err){
            res.status(500).json({
                ok:false,
                mensaje:'error al crear hospital',
                err:err
            });
        }
        res.status(201).json({
            ok: true,
            hospital: hosGuar,
            usuToken: req.usuario
        });
    }); 


});

//===========================
//Actualizar Hospitales
//===========================


rout.put('/:id',mdAutenticacion.verificaToken,(req,res,next) =>{

    var id = req.params.id;
    var body = req.body;
    Hospital.findById(id,(err,hospObt)=>{

        if(err){
            res.status(500).json({
                ok:false,
                mensaje:'error al buscar hospital',
                err:err
            });
        }
        if(!hospObt){
            return res.status(400).json({
                ok: false,
                mensaje: 'el hospital con el id '+id+' no existe',
                errors: 'no existe un hospital con ese id'
            });
        }

        hospObt.nombre = body.nombre;
        hospObt.usuario = req.usuario._id; 

        hospObt.save((err,hos)=>{
            
              
                if(err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'error al actualizar hospital',
                        errors: err
                    });
                }
                res.status(200).json({
                    ok: true,
                    hospital: hos
                });
            
        });
    });

});

//===========================
//Borrar Hospital
//===========================

rout.delete('/:id',mdAutenticacion.verificaToken,(req,res)=>{

    id = req.params.id;

    Hospital.findByIdAndRemove(id,(err,hosBorrado)=>{

        if(err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al borrar hospital',
                errors: err
            });
        }

        res.status(200).json({
            ok: true,
            hospital: hosBorrado
        });
    });

});


module.exports = rout;