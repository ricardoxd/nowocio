var conn=require('./connection');
var mysql = require('mysql'),
connection = mysql.createConnection(
	conn
);
var redis = require('redis');
var client = redis.createClient();
client.subscribe("mensaje"); 
var mensaje = {};

mensaje.recibe = function () {
    client.on("message",function (channel,message) {
       console.log("message"+channel);
       console.log(message);
       if(channel=="mensaje"){
           message=JSON.parse(message);
           mensaje.insertImagen(message,function (error,id) {
                console.log("mensaje nuevo"+id);
            });
       }
    }); 
};

//Añadir un nuevo imagen
mensaje.insertImagen = function(imagenData,callback)
{
if (connection)
{
connection.query('INSERT INTO mensaje SET ?', imagenData, function(error, result)
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

//Obtenemos todos los imagens
mensaje.getMensajesPaginate = function(callback,where,join,on,start,limit,select,order,group)
{
if (connection)
{
    var nestTables = false;
    var se='*';
    if(select!=null){
        se=select.join(",")
    }
    var sql ='SELECT '+se+' FROM mensaje ';
    
    if(join!=null&&on!=null){
        nestTables = true;
       sql+= 'inner join '+join+' on mensaje.a ='+join+'.'+on+' '; 
       sql+= 'left join '+join+' as u2 on mensaje.de =u2.'+on+' '; 
    }
    if(where!=null){
        if(typeof where=="string"){
            sql+=' where '+where;
        }else{
            sql+=' where ? or ? ';
        }
    }
    
   /* if(typeof where!="string"){
            sql+=" group by u2.id_usuario,usuario.id_usuario ";
        }*/
        if(group!=null){
            sql+=" group by "+group;
        }
    if(order!=null){
        sql+=" order by "+order+" ";
    }else{
        sql+=" order by id_mensaje ";
    }
    if(typeof where!="string"){
            sql+=" desc ";
        }else{
            sql+=" asc ";
        }
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

    
module.exports =mensaje;