//DEPENDENCIAS

var express = require('express');
var http = require ('http');
var socket = require('socket.io');
var mysql = require('mysql');

//CONFIGURACION DE BD

var connection = mysql.createConnection({

	host:'localhost',
	user:'root',
	password:'',
	database:'chat_simple'



});

//CREAR APLICACION

var app = express();
var server = http.createServer(app);
var io = socket(server);

//CONFIGURACION DE PLANTILLAS

app.set('views',__dirname + '/app/views');
app.set('view engine', 'jade');
app.locals.pretty = true; //NO COMPRIME EL CODIGO

//CONFIGURACION ARCHIVOS ESTATICOS
app.use(express.static(__dirname + '/public'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));

//CONFIGUCION RUTAS DE APLICACION

app.get('/', function(req,res){

	res.render('index');

});

app.get('/messages', function(req,res){

	//LEER LOS MENSAJES DESDE LA BD
	var query = 'SELECT * FROM regischat';

	connection.query(query, function(err, messages){

		res.header('Content-Type', 'application/json');
		res.send(messages);

	});


});


//CONFIGURACION DE SOCKET.IO PARA ESCUCHAR EVENTOS DESDE EL CLIENTE

io.on('connection', function(socket){
	console.log('usuario conectado');

	//LLEGA UN NUEVO MENSAJE
	socket.on('new message', function(message){
		//GUARDAR MENSAJE BD
		var query = 'INSERT INTO regischat SET ?';

		connection.query(query, message, function(err, result){
			io.emit('new message', message);//EMITIR MENSAJE

		});
		
	})

	socket.on('disconnect', function(){
		console.log('usuario desconectado');
	});
});

//INICIAR EL SERVIDOR

server.listen(3000,function(){

	console.log('Servidor iniciado...');

});