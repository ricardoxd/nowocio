var conn=require('./connection');
var mysql = require('mysql'),
connection = mysql.createConnection(
	conn
);
var notificacion = {};

//Obtenemos todos los notificacions
notificacion.getPaginate = function(callback,where,join,on,start,limit,join2,on2,key2)
{
if (connection)
{
    var nestTables = false;
    var sql ='SELECT * FROM notificacion ';
    
    if(join!=null&&on!=null){
        nestTables = true;
       sql+= 'inner join '+join+' on notificacion.'+on+' ='+join+'.'+on+' '; 
    }
    if(join2!=null&&on2!=null){
        nestTables = true;
       sql+= 'inner join '+join2+' on notificacion.'+key2+' ='+join2+'.'+on2+' '; 
    }
    if(where!=null){
        sql+=' where ? ';
    }
    sql+=" order by id_notificacion desc";
    if(limit!=null&&start!=null){
    sql+=" limit "+start+", "+limit; 
    }
    console.log(sql);
     var options = {sql: sql, nestTables: nestTables,values:where};   
    connection.query(options, function(error, rows) {
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

notificacion.getFeedPaginate =  function(callback,where,join,on,limit,join2,on2,id2,multi)
{
if (connection)
{
    var nestTables = false;
    var sql ='SELECT * FROM notificacion ';
    
    if(join!=null&&on!=null){
        nestTables = true;
       sql+= 'inner join '+join+' on notificacion.'+on+' ='+join+'.'+on+' '; 
    }
    if(join2!=null&&on2!=null){
        nestTables = true;
       sql+= 'inner join '+join2+' on notificacion.'+id2+' ='+join2+'.'+on2+' '; 
    }
    
    if(multi!=null){
        if(Array.isArray(multi)){
            for(var i=0;i<multi.length;i++){
               var join= multi[i];
               sql+= ' inner join '+join.join+' on '+join.id+' ='+join.join+'.'+join.on+' '; 
            }
            
        }
    }
    
    if(where!=null){
        if(Array.isArray(where)){
            if(where.length==3){
                sql+=' where ? and ? and ?';
            }else if(where.length==2){
                sql+=' where ? and ?';
            }else {
                sql+=' where ? ';
            }
            
        }else{
            sql+=' where ? ';
        }
    }
    
    sql+=" group by id_notificacion "; 
    sql+=" order by id_notificacion desc"; 
    if(limit!=null){
        sql+=" limit "+limit; 
    }
    console.log(sql);
     var options = {sql: sql, nestTables: nestTables,values:where};   
    connection.query(options, function(error, rows) {
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


notificacion.getFeedPaginateXD =  function(callback,where,start,limit)
{
if (connection)
{
    var nestTables = false;
    var sql ="Select xd as id,id_usuario,line,time,siguiendo,contenido,titulo,nombre_usuario,extension from ( SELECT notificacion.id_notificacion as xd,usuario.id_usuario,'i' as line,notificacion.time as time,siguiendo, notificacion.mensaje as contenido, notificacion.titulo as titulo,usuario.nombre_usuario,notificacion.extension as extension FROM usuario inner join seguidor on usuario.id_usuario =seguidor.seguido left join notificacion on usuario.id_usuario= notificacion.id_usuario union SELECT facebook_feed.id_facebook_feed as xd,usuario.id_usuario,'fb' as line,facebook_feed.created_time as time,siguiendo , facebook_feed.message  as contenido,facebook_feed.story as titulo,usuario.nombre_usuario,'' as extension FROM usuario inner join seguidor on usuario.id_usuario =seguidor.seguido left join facebook_feed on usuario.id_usuario= facebook_feed.id_usuario union SELECT youtube_feed.id_youtube_feed as xd,usuario.id_usuario,'yt' as line,youtube_feed.publishedAt as time,siguiendo , youtube_feed.description as contenido,youtube_feed.title as titulo,usuario.nombre_usuario ,'' as extension FROM usuario inner join seguidor on usuario.id_usuario =seguidor.seguido left join youtube_feed on usuario.id_usuario=youtube_feed.id_usuario ) results  ";
    
    console.log(sql);
    if(where!=null){
     sql+=' where ? ';
    }
    sql+=" order by time desc"; 
    if(limit!=null&&start!=null){
    sql+=" limit "+start+", "+limit; 
    }
     var options = {sql: sql, nestTables: nestTables,values:where};   
    connection.query(options, function(error, rows) {
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
//Obtenemos todos los notificacions
notificacion.getImagens = function(callback,where,join,on,limit,join2,on2,id2)
{
if (connection)
{
    var nestTables = false;
    var sql ='SELECT * FROM notificacion ';
    
    if(join!=null&&on!=null){
        nestTables = true;
       sql+= 'inner join '+join+' on notificacion.'+on+' ='+join+'.'+on+' '; 
    }
    if(join2!=null&&on2!=null){
        nestTables = true;
       sql+= 'inner join '+join2+' on notificacion.'+id2+' ='+join2+'.'+on2+' '; 
    }
    if(where!=null){
        if(Array.isArray(where)){
            if(where.length==3){
                sql+=' where ? and ? and ?';
            }else if(where.length==2){
                sql+=' where ? and ?';
            }else {
                sql+=' where ? ';
            }
            
        }else{
            sql+=' where ? ';
        }
    }
    
    sql+=" group by id_notificacion "; 
    sql+=" order by id_notificacion desc"; 
    if(limit!=null){
        sql+=" limit "+limit; 
    }
    console.log(sql);
     var options = {sql: sql, nestTables: nestTables,values:where};   
    connection.query(options, function(error, rows) {
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

//Obtenemos un notificacion por su id
notificacion.getImagenById = function(id,callback,join,on)
{
if (connection)
{
    var sql = 'SELECT * FROM notificacion ';
    if(join!=null&&on!=null){
       sql+= 'inner join '+join+' on notificacion.'+on+' ='+join+'.'+on+' '; 
    }
    sql+= ' WHERE notificacion.id_notificacion = ' + connection.escape(id);
 var options = {sql: sql, nestTables: true};   
connection.query(options, function(error, row)
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

//Añadir un nuevo notificacion
notificacion.insertImagen = function(notificacionData,callback)
{
if (connection)
{
connection.query('INSERT INTO notificacion SET ?', notificacionData, function(error, result)
{
if(error)
{


			//throw error;
                        console.log(error);
                        callback(error, null);
		}
		else
		{
			//devolvemos el id del notificacion insertado
			callback(null, result.insertId);
		}
	});
}

}

//Actualizar un notificacion
notificacion.updateImagen = function(datosImagen, callback)
{


if(connection)
{
	var sql = 'UPDATE notificacion SET titulo = ' + connection.escape(datosImagen.titulo)  +' WHERE id_notificacion = ' + datosImagen.id_notificacion;
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

//Eliminar un notificacion por su id
notificacion.deleteImagen = function(id, callback)
{
if(connection)
{
var sql = 'DELETE FROM notificacion WHERE id_notificacion = ' + connection.escape(id);
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




module.exports =notificacion;