var conn=require('./connection');
var mysql = require('mysql'),
connection = mysql.createConnection(
	conn
);
var imagen = {};

//Obtenemos todos los imagens
imagen.getImagensPaginate = function(callback,where,join,on,start,limit)
{
if (connection)
{
    var nestTables = false;
    var sql ='SELECT * FROM imagen ';
    
    if(join!=null&&on!=null){
        nestTables = true;
       sql+= 'inner join '+join+' on imagen.'+on+' ='+join+'.'+on+' '; 
    }
    if(where!=null){
        sql+=' where ? ';
    }
    sql+=" order by id_imagen desc";
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

imagen.getFeedPaginate =  function(callback,where,join,on,limit,join2,on2,id2,multi)
{
if (connection)
{
    var nestTables = false;
    var sql ='SELECT * FROM imagen ';
    
    if(join!=null&&on!=null){
        nestTables = true;
       sql+= 'inner join '+join+' on imagen.'+on+' ='+join+'.'+on+' '; 
    }
    if(join2!=null&&on2!=null){
        nestTables = true;
       sql+= 'inner join '+join2+' on imagen.'+id2+' ='+join2+'.'+on2+' '; 
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
    
    sql+=" group by id_imagen "; 
    sql+=" order by id_imagen desc"; 
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


imagen.getFeedPaginateXD =  function(callback,where,start,limit)
{
if (connection)
{
    var nestTables = false;
    var sql ="Select xd as id,id_usuario,fbi,yti,line,time,siguiendo,contenido,titulo,nombre_usuario,extension,id_imagen_perfil from ( select * from feed_global) results  ";
    
    if(where!=null){
     sql+=' where ? ';
    }
    sql+=" order by time desc"; 
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
//Obtenemos todos los imagens
imagen.getImagens = function(callback,where,join,on,limit,join2,on2,id2)
{
if (connection)
{
    var nestTables = false;
    var sql ='SELECT * FROM imagen ';
    
    if(join!=null&&on!=null){
        nestTables = true;
       sql+= 'inner join '+join+' on imagen.'+on+' ='+join+'.'+on+' '; 
    }
    if(join2!=null&&on2!=null){
        nestTables = true;
       sql+= 'inner join '+join2+' on imagen.'+id2+' ='+join2+'.'+on2+' '; 
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
    
    sql+=" group by id_imagen "; 
    sql+=" order by id_imagen desc"; 
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

//Obtenemos un imagen por su id
imagen.getImagenById = function(id,callback,join,on)
{
if (connection)
{
    var sql = 'SELECT * FROM imagen ';
    if(join!=null&&on!=null){
       sql+= 'inner join '+join+' on imagen.'+on+' ='+join+'.'+on+' '; 
    }
    sql+= ' WHERE imagen.id_imagen = ' + connection.escape(id);
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

//Añadir un nuevo imagen
imagen.insertImagen = function(imagenData,callback)
{
if (connection)
{
connection.query('INSERT INTO imagen SET ?', imagenData, function(error, result)
{
if(error)
{


			//throw error;
                        console.log(error);
                        callback(error, null);
		}
		else
		{
			//devolvemos el id del imagen insertado
			callback(null, result.insertId);
		}
	});
}

}

//Actualizar un imagen
imagen.updateImagen = function(datosImagen, callback)
{


if(connection)
{
	var sql = 'UPDATE imagen SET titulo = ' + connection.escape(datosImagen.titulo)  +' WHERE id_imagen = ' + datosImagen.id_imagen;
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

//Eliminar un imagen por su id
imagen.deleteImagen = function(id, callback)
{
if(connection)
{
var sql = 'DELETE FROM imagen WHERE id_imagen = ' + connection.escape(id);
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




module.exports =imagen;