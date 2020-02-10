module.exports = function(server,sessionMiddleware) {
  var io = require('socket.io')(server); 
  var redis = require('redis');
  var client = redis.createClient();
  var client2 = redis.createClient();
  var client3 = redis.createClient();
  var modeloSeg = require('./models/seguidor')
 
 //io.set("store", new io.RedisStore);
 var online = [];
 client.subscribe("images");
 
  io.use(function(socket,next) {
       sessionMiddleware(socket.request,socket.request.res,next); 
    });
    
   client.on("message",function (channel,message) {
       console.log("message"+channel);
       console.log(message);
       if(channel=="images"){
           io.emit("new imagen",message);
       }
    }); 
   io.sockets.on("connection",function (socket) {
       if(!socket.request.session.user_id){
           return; 
       }
        console.log("conectado:"+socket.request.session.user_id);
        console.log(socket.request.session.passport.user);
        var iduser="o_"+socket.request.session.user_id+'_'+socket.request.session.user_name+'_'+socket.request.session.passport.user.id_imagen_perfil;
        client2.get(iduser,function(error,socketlist) {
            var list=[];
                        if(socketlist!=null){
                            try{
                                list=JSON.parse(socketlist);
                            }catch (exception) {

                            }

                        }
                        if(list.length<1){
                            cargarSeguidores(socket.request.session.user_id,socket,onlined,'conected');
                        }
                        list.push(socket.id);
                        client2.set(iduser, JSON.stringify(list), redis.print);
                    });
        
        /*client.getAsync('o').then(function(res) {
            var newuser = {id:socket.request.session.user_id,socketid:socket.id};
            var line = JSON.parse(res);
            line.push(newuser);
            client.set("o", line.toString(), redis.print);
        });*/
       var onlined = socket.request.session.user_id+'_'+socket.request.session.user_name;
       /* client2.keys("o_*_*", function (err, replies) {
            
            var current = replies.indexOf("o_"+onlined); 
            console.log(replies.length + " replies:");
            replies.forEach(function (reply, i) {
                console.log("    " + i + ": " + reply);
            });
            replies.splice(current,1);
            
            console.log(replies.length + " replies:");
            replies.forEach(function (reply, i) {
                console.log("    " + i + ": " + reply);
            });
            socket.emit('o', replies);
        });*/
        socket.on('siguiendo', function (data) {
            data=JSON.parse(data);
            data =data.seguidores;
            var i=0,list=[];
            for(var item=0;item<data.length;item++){
                console.log("o_"+data[item].seguido+"_*_*");
                client2.keys("o_"+data[item].seguido+"_*_*", function (err, replies) {
                    console.log(data);
                    console.log(err);
                    console.log(replies[0]);
                    i++;
                    if(replies[0]!=undefined){
                        list.push(replies[0]);
                        client2.get(replies[0],function(error,socketid) {
                            console.log("online user to "+socketid);

                            if(socketid!=null){//notificar a los que siguo
                             //   socket.broadcast.to(socketid).emit('conected', onlined);
                            }
                        });
                    }
                    if(i==data.length){
                           socket.emit('o', list); 
                        }
                    });
                    
            }
        });
        
        
        //socket.emit('welcome', { message: 'Bienvenido al chat' });
        socket.on('send', function (data) {
            console.log("mensaje a "+'o_'+data.a);
            client2.get('o_'+data.a,function(error,socketid) {
                console.log("enviando a "+socketid);
                
                if(socketid!=null){
                    socketid=JSON.parse(socketid);
                    for(var i=0;i<socketid.length;i++){
                        socket.broadcast.to(socketid[i]).emit('message', {message:data.texto,user:socket.request.session.user_id+'_'+socket.request.session.user_name+'_'+socket.request.session.passport.user.id_imagen_perfil});
                
                    }
                 }
            });
            data.de=socket.request.session.user_id;
            data.a=data.a.split("_")[0]
            client3.publish("mensaje",JSON.stringify(data));
            
            //io.sockets.emit('message', data);
            //socket.broadcast.to(socketid).emit('message', data);
        });
        
        socket.on('disconnect', function() {
            console.log('Got disconnect '+socket.request.session.user_id);
            var desconect = socket.request.session.user_id+'_'+socket.request.session.user_name;
            client2.get("o_"+desconect,function(error,socketlist) {
            var list=[];
                        if(socketlist!=null){
                            try{
                                list=JSON.parse(socketlist);
                            }catch (exception) {

                            }

                        }
                        var index = list.indexOf(socket.id);
                        if (index > -1) {
                            list.splice(index, 1);
                        }
                        if(list.length>0){
                            client2.set(iduser, JSON.stringify(list), redis.print);
                        }else{
                            client2.del("o_"+desconect);
                            cargarSeguidores(socket.request.session.user_id,socket,desconect,'desconectado');
                            //io.sockets.emit('disconnect',desconect);
                        }
                    });
         });
    });
    var cargarSeguidores= function (user_id,socket,onlined,tipo) {
        modeloSeg.getSiguiendo(function (errorx,datax) {
            if(datax){
                for(var i=0;i<datax.length;i++){
                    //data[i].siguiendo
                    client2.get('o_'+datax[i].seguidor.siguiendo+'_'+datax[i].usuario.nombre_usuario,function(error,socketid) {
                        if(socketid!=null){
                            socketid=JSON.parse(socketid);
                            for(var i=0;i<socketid.length;i++){
                                    socket.broadcast.to(socketid[i]).emit(tipo, onlined);
                                }
                        }
                    });
                }
            }else{
                
            }
        },{seguido:user_id},"usuario","id_usuario",null,"siguiendo")
    }
};