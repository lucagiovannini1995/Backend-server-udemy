var express = require('express')
var rout = express();

var mdAutenticacion = require('../middlewares/auntenticacion');

var Medico = require('../models/medicos');

//===========================
//Obtener Medicos
//===========================

rout.get('/',(req,res)=>{

    var desde = req.query.desde || 0;
    desde = Number(desde);

    var Med = Medico.find({})
    .skip(desde)
    .limit(5)
    .populate('usuario','nombre email')
    .populate('hospital')
    .exec(
    (err,MedObtenidos) => {

        if(err){
            res.status(500).json({
                mensaje:'error al obtener medicos',
                err:err
            });
        }
        Medico.count({},(err, contador)=>{
            res.status(200).json({
                ok: true,
                Medices: MedObtenidos,
                total:contador
            });
        });
      

    });
});


//===========================
//Crear Medico
//===========================

rout.post('/',mdAutenticacion.verificaToken,(req,res,next)=>{

    var body = req.body;
    var med = new Medico({
        nombre: body.nombre,
        img: body.img,
        usuario: req.usuario._id,
        hospital: body.id_hospital
    });

    med.save((err,medGuar) => {

        if(err){
            res.status(500).json({
                ok:false,
                mensaje:'error al crear Medico',
                err:err
            });
        }
        res.status(201).json({
            ok: true,
            Medico: medGuar,
            usuToken: req.usuario
        });
    }); 


});

//===========================
//Actualizar Medico
//===========================


rout.put('/:id',mdAutenticacion.verificaToken,(req,res,next) =>{

    var id = req.params.id;
    var body = req.body;
    Medico.findById(id,(err,medObt)=>{

        if(err){
            res.status(500).json({
                ok:false,
                mensaje:'error al buscar Medico',
                err:err
            });
        }
        if(!medObt){
            return res.status(400).json({
                ok: false,
                mensaje: 'el Medico con el id '+id+' no existe',
                errors: 'no existe un Medico con ese id'
            });
        }

        medObt.nombre = body.nombre;
        medObt.usuario = req.usuario._id; 
        medObt.hospital = body.id_hospital;

        medObt.save((err,med)=>{
            
              
                if(err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'error al actualizar Medico',
                        errors: err
                    });
                }
                res.status(200).json({
                    ok: true,
                    Medico: med
                });
            
        });
    });

});

//===========================
//Borrar Medico
//===========================

rout.delete('/:id',mdAutenticacion.verificaToken,(req,res)=>{

    id = req.params.id;

    Medico.findByIdAndRemove(id,(err,medBorrado)=>{

        if(err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al borrar Medico',
                errors: err
            });
        }

        res.status(200).json({
            ok: true,
            Medico: medBorrado
        });
    });

});


module.exports = rout;