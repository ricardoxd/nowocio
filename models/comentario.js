var conn=require('./connection');
var mysql = require('mysql'),
connection = mysql.createConnection(
	conn
);
var comentario = {};

//Obtenemos todos los comentarios
comentario.getPaginate = function(callback,where,join,on,start,limit)
{
if (connection)
{
    var nestTables = false;
    var sql ='SELECT * FROM comentario_usuario ';
    
    if(join!=null&&on!=null){
        nestTables = true;
       sql+= 'inner join '+join+' on comentario.'+on+' ='+join+'.'+on+' '; 
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
    sql+=" order by time asc";
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

//Obtenemos todos los comentarios
comentario.getSiguiendo = function(callback,where,join,on,limit,seg)
{
if (connection)
{
    var nestTables = false;
    var sql ='SELECT * FROM comentario ';
    
    if(join!=null&&on!=null){
        nestTables = true;
       sql+= 'inner join '+join+' on comentario.'+seg+' ='+join+'.'+on+' '; 
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
    sql+=" order by id_comentario desc"; 
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

//Obtenemos un comentario por su id
comentario.getImagenById = function(id,callback,join,on)
{
if (connection)
{
    var sql = 'SELECT * FROM comentario ';
    if(join!=null&&on!=null){
       sql+= 'inner join '+join+' on comentario.'+on+' ='+join+'.'+on+' '; 
    }
    sql+= ' WHERE comentario.id_comentario = ' + connection.escape(id);
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
//Obtenemos un comentario por su id
comentario.getVerificar= function(id,seg,callback,join,on)
{
if (connection)
{
    var sql = 'SELECT * FROM comentario ';

    sql+= ' WHERE siguiendo = ' + connection.escape(id)+ ' and seguido = ' + connection.escape(seg);
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
//Añadir un nuevo comentario
comentario.insert = function(comentarioData,callback)
{
 
            if (connection)
            {
            connection.query('INSERT INTO comentario SET ?', comentarioData, function(error, result)
            {
            if(error)
            {
			//throw error;
                        console.log(error);
                        callback(error, null);
		}
		else
		{
			//devolvemos el id del comentario insertado
			callback(null, result.insertId);
		}
                        });
                }
        }





//Actualizar un comentario
comentario.updateImagen = function(datosImagen, callback)
{


if(connection)
{
	var sql = 'UPDATE comentario SET titulo = ' + connection.escape(datosImagen.titulo)  +' WHERE id_comentario = ' + datosImagen.id_comentario;
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

//Eliminar un comentario por su id
comentario.deleteImagen = function(id, callback)
{
if(connection)
{
var sql = 'DELETE FROM comentario WHERE id_comentario = ' + connection.escape(id);
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




module.exports = comentario;