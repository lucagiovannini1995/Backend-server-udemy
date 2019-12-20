//1 requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var fileUpload = require('express-fileupload');// libreria par guardar archivs en el servidor

// default options


//importar rutas
var usuRout = require('./routes/usuario.routes');
var appRout = require('./routes/app.routes');
var loginROut = require('./routes/login.routes'); 
var hostialesRout = require('./routes/hospitales.routes');
var medicosRout = require('./routes/medicos.routes');
var busquedaRout = require('./routes/busqueda.routes');
var uploadRout = require('./routes/upload.routes');
var imgRout = require('./routes/imagenes.routes');

//2 inicializar variables
var app = express();

app.use(fileUpload());
//Body Parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//5 conexion a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB',{ useNewUrlParser: true,useUnifiedTopology: true }, (err, res) => {
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
app.use('/hospitales', hostialesRout);
app.use('/medicos', medicosRout);
app.use('/busqueda',busquedaRout);
app.use('/upload', uploadRout);
app.use('/img',imgRout);

//3 Escuchar peticiones
app.listen(3000, () => {
    console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m','Online');
});