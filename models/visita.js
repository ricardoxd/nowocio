var conn=require('./connection');
var mysql = require('mysql'),
connection = mysql.createConnection(
	conn
);
var visita = {};

//Obtenemos todos los visitas
visita.getImagensPaginate = function(callback,where,join,on,start,limit)
{
if (connection)
{
    var nestTables = false;
    var sql ='SELECT * FROM visita ';
    
    if(join!=null&&on!=null){
        nestTables = true;
       sql+= 'inner join '+join+' on visita.'+on+' ='+join+'.'+on+' '; 
    }
    if(where!=null){
        sql+=' where ? ';
    }
    sql+=" order by id_visita desc";
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

//Obtenemos todos los visitas
visita.getSiguiendo = function(callback,where,join,on,limit,seg)
{
if (connection)
{
    var nestTables = false;
    var sql ='SELECT * FROM visita ';
    
    if(join!=null&&on!=null){
        nestTables = true;
       sql+= 'inner join '+join+' on visita.'+seg+' ='+join+'.'+on+' '; 
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
    sql+=" order by id_visita desc"; 
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

//Obtenemos un visita por su id
visita.getImagenById = function(id,callback,join,on)
{
if (connection)
{
    var sql = 'SELECT * FROM visita ';
    if(join!=null&&on!=null){
       sql+= 'inner join '+join+' on visita.'+on+' ='+join+'.'+on+' '; 
    }
    sql+= ' WHERE visita.id_visita = ' + connection.escape(id);
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
//Obtenemos un visita por su id
visita.getVerificar= function(id,seg,callback,join,on)
{
if (connection)
{
    var sql = 'SELECT * FROM visita ';

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
//Añadir un nuevo visita
visita.insertVisita = function(visitaData,callback)
{
 
            if (connection)
            {
            connection.query('INSERT INTO visita SET ?', visitaData, function(error, result)
            {
            if(error)
            {
			//throw error;
                        console.log(error);
                        callback(error, null);
		}
		else
		{
			//devolvemos el id del visita insertado
			callback(null, result.insertId);
		}
                        });
                }
        }





//Actualizar un visita
visita.updateImagen = function(datosImagen, callback)
{


if(connection)
{
	var sql = 'UPDATE visita SET titulo = ' + connection.escape(datosImagen.titulo)  +' WHERE id_visita = ' + datosImagen.id_visita;
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

//Eliminar un visita por su id
visita.deleteImagen = function(id, callback)
{
if(connection)
{
var sql = 'DELETE FROM visita WHERE id_visita = ' + connection.escape(id);
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




module.exports = visita;