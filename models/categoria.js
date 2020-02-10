var conn=require('./connection');
var mysql = require('mysql'),
connection = mysql.createConnection(
	conn
);
var categoria = {};

//Obtenemos todos los usuarios
categoria.getList = function(callback)
{
if (connection)
{
connection.query('SELECT * FROM categoria', function(error, rows) {
if(error)
{
throw error;
}
else
{
callback(null, rows);
}
});
}
}
//Obtenemos todos los usuarios
categoria.getUserName = function(id,callback)
{
if (connection)
{
connection.query('select * from imagen,categoria where imagen.id_categoria=categoria.id_categoria and imagen.id_usuario='+ connection.escape(id)+' group by  imagen.id_categoria ' , function(error, rows) {
if(error)
{
throw error;
}
else
{
callback(null, rows);
}
});
}
}
module.exports =categoria;