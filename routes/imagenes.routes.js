var express = require('express');
var rout = express();

const path = require('path');
const fs = require('fs');


rout.get('/:tipo/:img',(req, res, next) =>{


    var img = req.params.img;
    var tipo = req.params.tipo;

    var pathImagen = path.resolve(__dirname,`../uploads/${tipo}/${img}`);
    
  
    if(fs.existsSync(pathImagen)){
        res.sendFile(pathImagen);
    }else{
        var pathNoImagen = path.resolve(__dirname,'../assets/._no-img.jpg');
        res.sendFile(pathNoImagen);
    }

 
});

module.exports = rout;