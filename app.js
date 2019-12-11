//1 requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

//importar rutas
var usuRout = require('./routes/usuario.routes');
var appRout = require('./routes/app.routes');
var loginROut = require('./routes/login.routes'); 
//2 inicializar variables
var app = express();

//Body Parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//5 conexion a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {
    if( err ) throw err;
    console.log('Base de Datos: \x1b[32m%s\x1b[0m','Online');
});
/*
mongoose.connect('mongodb://localhost:27017/hospitalDB',{useNewUrlParser: true })
.then(() => console.log('Base de Datos: \x1b[32m%s\x1b[0m','Online') )
.catch(err => console.log(err));
*/
//4 Rutas
app.use('/', appRout);
app.use('/usuario', usuRout);
app.use('/login', loginROut);

//3 Escuchar peticiones
app.listen(3000, () => {
    console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m','Online');
});