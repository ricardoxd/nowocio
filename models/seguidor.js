var conn=require('./connection');
var mysql = require('mysql'),
connection = mysql.createConnection(
	conn
);
var seguidor = {};

//Obtenemos todos los seguidors
seguidor.getImagensPaginate = function(callback,where,join,on,start,limit)
{
if (connection)
{
    var nestTables = false;
    var sql ='SELECT * FROM seguidor ';
    
    if(join!=null&&on!=null){
        nestTables = true;
       sql+= 'inner join '+join+' on seguidor.'+on+' ='+join+'.'+on+' '; 
    }
    if(where!=null){
        sql+=' where ? ';
    }
    sql+=" order by id_seguidor desc";
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

//Obtenemos todos los seguidors
seguidor.getSiguiendo = function(callback,where,join,on,limit,seg)
{
if (connection)
{
    var nestTables = false;
    var sql ='SELECT * FROM seguidor ';
    
    if(join!=null&&on!=null){
        nestTables = true;
       sql+= 'inner join '+join+' on seguidor.'+seg+' ='+join+'.'+on+' '; 
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
    sql+=" order by id_seguidor desc"; 
    console.log(limit);
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

//Obtenemos un seguidor por su id
seguidor.getImagenById = function(id,callback,join,on)
{
if (connection)
{
    var sql = 'SELECT * FROM seguidor ';
    if(join!=null&&on!=null){
       sql+= 'inner join '+join+' on seguidor.'+on+' ='+join+'.'+on+' '; 
    }
    sql+= ' WHERE seguidor.id_seguidor = ' + connection.escape(id);
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
//Obtenemos un seguidor por su id
seguidor.getVerificar= function(id,seg,callback,join,on)
{
if (connection)
{
    var sql = 'SELECT * FROM seguidor ';

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
//Añadir un nuevo seguidor
seguidor.insertSeguidor = function(seguidorData,callback)
{
    seguidor.getVerificar(seguidorData.siguiendo,seguidorData.seguido,function (error,data) {
        if(data){
            callback(null, data.seguidor);
        }else{
            if (connection)
            {
            connection.query('INSERT INTO seguidor SET ?', seguidorData, function(error, result)
            {
            if(error)
            {
			//throw error;
                        console.log(error);
                        callback(error, null);
		}
		else
		{
			//devolvemos el id del seguidor insertado
			callback(null, result.insertId);
		}
                        });
                }
        }
    })


}

//Actualizar un seguidor
seguidor.updateImagen = function(datosImagen, callback)
{


if(connection)
{
	var sql = 'UPDATE seguidor SET titulo = ' + connection.escape(datosImagen.titulo)  +' WHERE id_seguidor = ' + datosImagen.id_seguidor;
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

//Eliminar un seguidor por su id
seguidor.delete = function(id, callback)
{
if(connection)
{
var sql = 'DELETE FROM seguidor WHERE id_seguidor = ' + connection.escape(id);
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




module.exports = seguidor;