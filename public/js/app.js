var socket = io();

//MODELA MENSAJE

function Message(item){
	this.username = item.username;
	this.body = item.body;

}

//CHAT VIEWMODEL

function ChatViewModel(){

	var self = this;

	//ATRIBUTOS

	self.messages = ko.observableArray([]);
	self.newUsername = ko.observable('');
	self.newMessage = ko.observable('');

	//ENVIAR NUEVO MENSAJE

	self.sendMessage = function(){

		var message = new Message({

			username: self.newUsername(),
			body: self.newMessage()

		});

		//ENVIAR MENSAJE AL SERVIDOR

		socket.emit('new message', message);
		self.newMessage('');//LIMPIAR MENSAJE

	}

	//RECIBIR NUEVO MENSAJE

	socket.on('new message', function(message){

		var message = new Message(message);
		self.messages.push(message);


	});

	//CARGAR LOS MENSAJES DEL SERVIDOR

	$.get('/messages', function(messages){
		$.map(messages, function(msg){
			self.messages.push(new Message(msg));
		});
	});

}

ko.applyBindings(new ChatViewModel());