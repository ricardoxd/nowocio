var conn=require('./connection');
var mysql = require('mysql'),
connection = mysql.createConnection(
	conn
);
var megusta = {};

//Obtenemos todos los megustas
megusta.getPaginate = function(callback,where,join,on,start,limit)
{
if (connection)
{
    var nestTables = false;
    var sql ='SELECT * FROM megusta ';
    
    if(join!=null&&on!=null){
        nestTables = true;
       sql+= 'inner join '+join+' on megusta.'+on+' ='+join+'.'+on+' '; 
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
//Obtenemos todos los megustas
megusta.getList = function(callback,where,join,on,start,limit)
{
if (connection)
{
    var nestTables = false;
    var sql ='SELECT count(id_megusta) as numero,id_tipo as tipo,(SELECT count(id_megusta) FROM megusta ';
    var sql2 =') as user FROM megusta ';
    
    if(join!=null&&on!=null){
        nestTables = true;
       sql+= 'inner join '+join+' on megusta.'+on+' ='+join+'.'+on+' '; 
    }
    if(where!=null){
        if(Array.isArray(where)){
            if(where.length==7){
                sql+=' where ? and ? and ? and ? and `id_tipo` = tipo ';
                sql2+=' where ? and ? and ? ';
            }else if(where.length==3){
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
    sql=sql+sql2;
    
    sql+=" group by id_tipo";
    if(limit!=null&&start!=null){
    sql+=" limit "+start+", "+limit; 
    }
    console.log(sql);
    
var sqlog = mysql.format(sql, where);

    console.log(sqlog);
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
//Obtenemos todos los megustas
megusta.getSiguiendo = function(callback,where,join,on,limit,seg)
{
if (connection)
{
    var nestTables = false;
    var sql ='SELECT * FROM megusta ';
    
    if(join!=null&&on!=null){
        nestTables = true;
       sql+= 'inner join '+join+' on megusta.'+seg+' ='+join+'.'+on+' '; 
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
    sql+=" order by id_megusta desc"; 
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

//Obtenemos un megusta por su id
megusta.getImagenById = function(id,callback,join,on)
{
if (connection)
{
    var sql = 'SELECT * FROM megusta ';
    if(join!=null&&on!=null){
       sql+= 'inner join '+join+' on megusta.'+on+' ='+join+'.'+on+' '; 
    }
    sql+= ' WHERE megusta.id_megusta = ' + connection.escape(id);
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
//Obtenemos un megusta por su id
megusta.getVerificar= function(id,seg,callback,join,on)
{
if (connection)
{
    var sql = 'SELECT * FROM megusta ';

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
//Añadir un nuevo megusta
megusta.insert = function(megustaData,callback)
{
 
            if (connection)
            {
                
                var sqlog = mysql.format('INSERT INTO megusta SET ?', megustaData);
                console.log(sqlog);
                connection.query('INSERT INTO megusta SET ?', megustaData, function(error, result)
            {
            if(error)
            {
			//throw error;
                        console.log(error);
                        callback(error, null);
		}
		else
		{
			//devolvemos el id del megusta insertado
			callback(null, result.insertId);
		}
                        });
                }
        }





//Actualizar un megusta
megusta.updateImagen = function(datosImagen, callback)
{


if(connection)
{
	var sql = 'UPDATE megusta SET titulo = ' + connection.escape(datosImagen.titulo)  +' WHERE id_megusta = ' + datosImagen.id_megusta;
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

//Eliminar un megusta por su id
megusta.delete = function(id, callback)
{
if(connection)
{
var sql = 'DELETE FROM megusta WHERE id_key = ' + connection.escape(id);
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




module.exports = megusta;