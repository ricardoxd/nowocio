/**
 * Init all modules and servers
 */
var express = require('express'),
    http = require('http'),/*
    https = require('https'),*/
	path = require('path'),
	SocketIO = require('socket.io'),
    fs = require('fs');

/**
 * Init Web Application
 */
var env = process.env.NODE_ENV || 'production';
var serverPort = process.env.PORT || 8080;
var app = express();
/*
var serverPortSSL=8181;
var app2 = express();
app2.set('port', serverPortSSL);
app2.use(express.static(path.join(__dirname, 'app')));
*/
app.set('port', serverPort);
app.use(express.static(path.join(__dirname, 'app')));


var server = http.createServer(app);
server.listen(app.get('port'), function(){
	console.log((new Date()) + " Server is listening on port " + serverPort);
});




/*
    var privateKey  = fs.readFileSync('nowocio.com.key.pem', 'utf8');
    var certificate = fs.readFileSync('nowocio.com.pem', 'utf8');

    var credentials = {key: privateKey, cert: certificate};

var server2 = https.createServer(credentials,app2);
server2.listen(serverPortSSL, function(){
	console.log((new Date()) + " Server is listening on port " + serverPortSSL);
});



var io = SocketIO.listen(server2,{'transports': ['websocket', 'polling']});
//your_IP:port
//io.origins("*");

io.sockets.on('connection', function(socket){

    console.log("Connected with client : " + socket.id );
    //console.log("Transport : " + JSON.stringify(socket.conn.transport));

	socket.on('ping', function(data) {
        if (!socket.upgraded && socket.conn.upgraded){
            socket.upgraded = true;
            console.log("Upgraded : " + socket.conn.upgraded);
        }

        data.header="";
		socket.emit('pong', data);
	});
});
*/
app.get('/ping', function(req, res){
  res.send(req.query);
});








