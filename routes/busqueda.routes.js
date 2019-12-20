var express = require('express');
var rout = express();
var Hospital = require('../models/hospital');
var Medico = require('../models/medicos');
var Usuario = require('../models/usuario');



//===========================
//Busqueda por COleccion
//===========================
 rout.get('/coleccion/:tabla/:busqueda', (req, res, next) => {

    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda,'i');

    var tabla = req.params.tabla;

    var promesa;

   switch(tabla){
       case 'medico':
            promesa = buscarMedicos(busqueda,regex);
       break;

       case 'hospitales':
            promesa = buscarHospitales(busqueda,regex);
       break;

       case 'usuarios':
            promesa = buscarUsuario(busqueda,regex);
       break;

       default:  
                res.status(400).json({
                    ok: false,
                    mensaje: 'error en la ruta',
                    error: 'la coleccion indicada no existe'
                });
   }
        promesa.then( data => {
            res.status(200).json({
                ok: true,
                [tabla]: data
            });
        });
   
 });



//===========================
//Busqueda General
//===========================

rout.get('/todo/:busqueda',(req, res, next) =>{

    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda,'i');


    Promise.all([
         buscarHospitales(busqueda, regex),
        buscarMedicos(busqueda, regex),
        buscarUsuario(busqueda,regex)
        ])
        .then(respuesta => {
            res.status(200).json({
                ok: true,
                hospital: respuesta[0],
                medicos: respuesta[1],
                usuarios: respuesta[2]
            });
        });


   
});

function buscarHospitales(busqueda, regex){
    return new Promise((res,rej)=>{

        Hospital.find({nombre:regex})
        .populate('usuario','nombre email')
        .exec((err,hos)=>{
            if(err){
                rej('error al cargar hospitales',err);
            }else{
                res(hos);
            }
            
    });
    });
}


function buscarMedicos(busqueda, regex){
    return new Promise((res,rej)=>{

        Medico.find({nombre:regex})
            .populate('usuario','nombre email')
            .populate('hospital')
            .exec((err,med)=>{
            if(err){
                rej('error al cargar medicos',err);
            }else{
                res(med);
            }
            
    });
    });
}

function buscarUsuario(busqueda, regex){
    return new Promise((res,rej)=>{

    Usuario.find({},'nombre email role')
        .or({nombre:regex}, {'email':regex})
        .exec((err,usu)=>{
            if(err){
                rej('error al cargar usuarios',err);
            }else{
                res(usu);
            }
        });
            
    });

}

module.exports = rout;