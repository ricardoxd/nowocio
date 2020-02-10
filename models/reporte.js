var conn=require('./connection');
var mysql = require('mysql'),
connection = mysql.createConnection(
	conn
);
var reporte = {};

//Obtenemos todos los reportes
reporte.getUsuarios = function(callback)
{
if (connection)
{
connection.query('SELECT * FROM reporte', function(error, rows) {
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
//Obtenemos todos los reportes
reporte.getBuscar = function(callback,id)
{
if (connection)
{
    var sql ="SELECT * FROM reporte ";
    //id=connection.escape(id);
    if(id!=null){
        sql+=" where (nombre_reporte like '%"+id+"%' or nombre_reporte like '"+id+"%' or nombre_reporte like '%"+id+"')";
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
//Obtenemos un reporte por su id
reporte.getUsuarioById = function(id,callback,join,on,seg)
{
if (connection)
{
var sql = 'SELECT * FROM reporte ';


if(join!=null&&on!=null){
       sql+= 'inner join '+join+' on reporte.'+seg+' ='+join+'.'+on+' '; 
    }

    sql+=' WHERE id_reporte = '+ connection.escape(id);

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
//Obtenemos un reporte por su id
reporte.getUsuarioByNombreUsuario = function(id,callback)
{
if (connection)
{
var sql = 'SELECT * FROM reporte WHERE nombre_reporte = ' + connection.escape(id);
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
reporte.getSeguidores = function (id,callback,data) {
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
//Añadir un nuevo reporte
reporte.insert = function(reporteData,callback)
{
if (connection)
{
    var sql =" INSERT INTO reporte SET ? ";
   
connection.query(sql, reporteData, function(error, result)
{
if(error)
{


			//throw error;
                        console.log(error);
                        callback(error, null);
		}
		else
		{
			//devolvemos el id del reporte insertado
			callback(null, result.insertId);
		}
	});
}

}

//Actualizar un reporte
reporte.updateUsuario = function(datosUsuario, callback)
{


if(connection)
{
	var sql = 'UPDATE reporte SET nombre = ' + connection.escape(datosUsuario.nombre)  +' WHERE id_reporte = ' + datosUsuario.id;
	connection.query(sql, function(error, result) 
	{
		if(error)
		{
			throw error;
		}
		else
		{
			callback(null,{"mensaje":"Actualizado"});
		}
	});
}

}

//Eliminar un reporte por su id
reporte.deleteUsuario = function(id, callback)
{
if(connection)
{
var sql = 'DELETE FROM reporte WHERE id = ' + connection.escape(id);
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

//Obtenemos un reporte por su id
reporte.getUsuarioLogin = function(user,pass,callback,type)
{
if (connection)
{
    if(type==undefined){
        type='password';
    }
var sql = 'SELECT * FROM reporte WHERE email = ' + connection.escape(user)+' and '+type+' = '+connection.escape(pass);
if(type=='null'){
    sql = 'SELECT * FROM reporte WHERE email = ' + connection.escape(user)+' ';
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

reporte.getFacebookFeed= function(id,callback)
{
if (connection)
{
var sql = 'SELECT * FROM facebook_feed WHERE id_reporte = ' + connection.escape(id);
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
reporte.getYoutubeFeed= function(id,callback)
{
if (connection)
{
var sql = 'SELECT * FROM youtube_feed WHERE id_reporte = ' + connection.escape(id);
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
reporte.insertUsuarioFacebookFeed = function(Data,callback,id,nombre)
{
if (connection)
{
    console.log(Data);
    for(var i=0; i<Data.length;i++){
        var sql =" INSERT INTO facebook_feed SET ? ";
        // if(reporteData.facebook_id){
        //     sql+=" ON DUPLICATE KEY UPDATE  `facebook_id` = '"+reporteData.facebook_id+"'";
       //  }
       Data[i].id_reporte=id;
       Data[i].nombre_reporte=nombre;
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
			//devolvemos el id del reporte insertado
			callback(null, result.insertId);
		}
	});
    }
    
}

}

reporte.insertUsuarioYoutubeFeed = function(Data,callback,id,nombre){
if (connection)
{
    console.log(Data);
    if(!Data.items){
        return null;
    }
    for(var i=0; i<Data.items.length;i++){
        var sql =" INSERT INTO youtube_feed SET ? ";
        // if(reporteData.facebook_id){
        //     sql+=" ON DUPLICATE KEY UPDATE  `facebook_id` = '"+reporteData.facebook_id+"'";
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
           id_reporte:id,
           nombre_reporte:nombre
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
			//devolvemos el id del reporte insertado
			callback(null, result.insertId);
		}
	});
    }
    
}

}
module.exports =reporte;