var conn=require('./connection');
var mysql = require('mysql'),
connection = mysql.createConnection(
	conn
);
var usuario = {};

//Obtenemos todos los usuarios
usuario.getUsuarios = function(callback)
{
if (connection)
{
connection.query('SELECT * FROM usuario', function(error, rows) {
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
usuario.getUsuariosSugeridosRand = function(callback)
{
if (connection)
{
connection.query('SELECT * FROM usuario ORDER BY RAND() LIMIT 5', function(error, rows) {
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
usuario.getBuscar = function(callback,id)
{
if (connection)
{
    var sql ="SELECT * FROM usuario ";
    //id=connection.escape(id);
    if(id!=null){
        sql+=" where (nombre_usuario like '%"+id+"%' or nombre_usuario like '"+id+"%' or nombre_usuario like '%"+id+"')";
    }
    sql+=" limit 10"
connection.query(sql, function(error, rows) {
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
//Obtenemos un usuario por su id
usuario.getUsuarioById = function(id,callback,join,on,seg)
{
if (connection)
{
var sql = 'SELECT * FROM usuario ';


if(join!=null&&on!=null){
       sql+= 'inner join '+join+' on usuario.'+seg+' ='+join+'.'+on+' '; 
    }

    sql+=' WHERE id_usuario = '+ connection.escape(id);

connection.query(sql, function(error, row)
{
if(error)
{
throw error;
}
else
{
callback(null, row[0]);
}
});
}
}
//Obtenemos un usuario por su id
usuario.getUsuarioByNombreUsuario = function(id,callback)
{
if (connection)
{
var sql = 'SELECT * FROM usuario WHERE nombre_usuario = ' + connection.escape(id);
connection.query(sql, function(error, row)
{
if(error)
{
throw error;
}
else
{
callback(null, row[0]);
}
});
}
}
//Obtenemos un usuario por su id
usuario.getUsuarioByEmail = function(id,callback)
{
if (connection)
{
var sql = 'SELECT * FROM usuario WHERE estado =1 and email = ' + connection.escape(id);
connection.query(sql, function(error, row)
{
if(error)
{
throw error;
}
else
{
callback(null, row[0]);
}
});
}
}
//Obtenemos un usuario por su id
usuario.getUsuarioByVerificacion = function(id,callback)
{
if (connection)
{
var sql = 'SELECT * FROM usuario WHERE estado =0 and verificacion = ' + connection.escape(id);
connection.query(sql, function(error, row)
{
if(error)
{
throw error;
}
else
{
callback(null, row[0]);
}
});
}
}
//Obtenemos un usuario por su id
usuario.getUsuarioByRecuperacion = function(id,callback)
{
if (connection)
{
var sql = 'SELECT * FROM usuario WHERE recuperar = ' + connection.escape(id);
connection.query(sql, function(error, row)
{
if(error)
{
throw error;
}
else
{
callback(null, row[0]);
}
});
}
}
usuario.getSeguidores = function (id,callback,data) {
    if (connection)
{
var sql = 'SELECT * FROM seguidor WHERE siguiendo = ' + connection.escape(id);
connection.query(sql, function(error, rows)
{
if(error)
{
throw error;
}
else
{
    data.seguidores=rows;
callback(null, data);
}
});
}
}
//Añadir un nuevo usuario
usuario.insertUsuario = function(usuarioData,callback)
{
if (connection)
{
    var sql =" INSERT INTO usuario SET ? ";
    if(usuarioData.facebook_id){
        sql+=" ON DUPLICATE KEY UPDATE  `facebook_id` = '"+usuarioData.facebook_id+"'";
    }
    if(usuarioData.youtube_id){
        sql+=" ON DUPLICATE KEY UPDATE  `youtube_id` = '"+usuarioData.youtube_id+"'";
    }
connection.query(sql, usuarioData, function(error, result)
{
if(error)
{


			//throw error;
                        console.log(error);
                        callback(error, null);
		}
		else
		{
			//devolvemos el id del usuario insertado
			callback(null, result.insertId);
		}
	});
}

}

//Actualizar un usuario
usuario.updateUsuario = function(datosUsuario, callback)
{


if(connection)
{
	var sql = 'UPDATE usuario SET ? WHERE id_usuario = ' + datosUsuario.id_usuario;
	connection.query(sql,datosUsuario, function(error, result) 
	{
		if(error)
		{
			callback(error,null);
		}
		else
		{
			callback(null,{"mensaje":"Actualizado"});
		}
	});
}

}
//Actualizar un usuario
usuario.updateUsuarioByRecuperar = function(datosUsuario, callback)
{


if(connection)
{
    var re=datosUsuario.recuperar;
    datosUsuario.recuperar='recuperado';
	var sql = "UPDATE usuario SET ? WHERE recuperar = " +  connection.escape(re);
	connection.query(sql,datosUsuario, function(error, result) 
	{
		if(error)
		{
			callback(error,null);
		}
		else
		{
			callback(null,{"mensaje":"Actualizado"});
		}
	});
}

}

//Eliminar un usuario por su id
usuario.deleteUsuario = function(id, callback)
{
if(connection)
{
var sql = 'DELETE FROM usuario WHERE id = ' + connection.escape(id);
connection.query(sql, function(error, result)
{
if(error)
{
throw error;
}
else
{
callback(null,{"mensaje":"Borrado"});
}
});
}


}

//Obtenemos un usuario por su id
usuario.getUsuarioLogin = function(user,pass,callback,type)
{
if (connection)
{
    if(type==undefined){
        type='password';
    }
var sql = 'SELECT * FROM usuario WHERE email = ' + connection.escape(user)+' and '+type+' = '+connection.escape(pass);
if(type=='null'){
    sql = 'SELECT * FROM usuario WHERE email = ' + connection.escape(user)+' ';
    }
console.log(sql);
connection.query(sql, function(error, row)
{
if(error)
{
throw error;
}
else
{
callback(null, row[0]);
}
});
}
}

usuario.getFacebookFeed= function(id,callback)
{
if (connection)
{
var sql = 'SELECT * FROM facebook_feed WHERE id_usuario = ' + connection.escape(id);
connection.query(sql, function(error, row)
{
if(error)
{
throw error;
}
else
{
callback(null, row);
}
});
}
}
usuario.getYoutubeFeed= function(id,callback)
{
if (connection)
{
var sql = 'SELECT * FROM youtube_feed WHERE id_usuario = ' + connection.escape(id);
connection.query(sql, function(error, row)
{
if(error)
{
throw error;
}
else
{
callback(null, row);
}
});
}
}
usuario.insertUsuarioFacebookFeed = function(Data,callback,id,nombre)
{
if (connection)
{
    console.log(Data);
    for(var i=0; i<Data.length;i++){
        var sql =" INSERT INTO facebook_feed SET ? ";
        // if(usuarioData.facebook_id){
        //     sql+=" ON DUPLICATE KEY UPDATE  `facebook_id` = '"+usuarioData.facebook_id+"'";
       //  }
       Data[i].id_usuario=id;
       Data[i].nombre_usuario=nombre;
     connection.query(sql, Data[i], function(error, result)
     {
     if(error)
     {


			//throw error;
                        console.log(error);
                        callback(error, null);
		}
		else
		{
			//devolvemos el id del usuario insertado
			callback(null, result.insertId);
		}
	});
    }
    
}

}

usuario.insertUsuarioYoutubeFeed = function(Data,callback,id,nombre){
if (connection)
{
    console.log(Data);
    if(!Data.items){
        return null;
    }
    for(var i=0; i<Data.items.length;i++){
        var sql =" INSERT INTO youtube_feed SET ? ";
        // if(usuarioData.facebook_id){
        //     sql+=" ON DUPLICATE KEY UPDATE  `facebook_id` = '"+usuarioData.facebook_id+"'";
       //  }
       var vid='';
       if(Data.items[i].contentDetails.upload!=null){
           vid=Data.items[i].contentDetails.upload.videoId;
       }
       
       var datos ={
           id_youtube_feed:null,
           title:Data.items[i].snippet.title,
           channelId:Data.items[i].snippet.channelId,
           description:Data.items[i].snippet.description,
           publishedAt:Data.items[i].snippet.publishedAt,
           high_url:Data.items[i].snippet.thumbnails.high.url,
           videoId:vid,
           id_usuario:id,
           nombre_usuario:nombre
       };
     connection.query(sql, datos, function(error, result)
     {
     if(error)
     {


			//throw error;
                        console.log(error);
                        callback(error, null);
		}
		else
		{
			//devolvemos el id del usuario insertado
			callback(null, result.insertId);
		}
	});
    }
    
}

}
module.exports =usuario;