var express = require('express');
var router = express.Router();
var imagenModel = require('../models/imagen');
var usuarioModel = require('../models/usuario');
var seguidorModel = require('../models/seguidor');
var isMobile = require('ismobilejs');
var validPerfil = require('../middleware/perfil-name')
var request = require('request');
router.use('/:perfil/:pagina',validPerfil);
router.use('/:perfil',validPerfil);

/* GET home page. */
router.get('/:perfil/:pagina', function(req, res, next) {
    var esMovil = isMobile(req.headers['user-agent']).any;
    console.log("es movil"+esMovil);
    if(req.session.user_id){//autenticado
        switch (req.params.pagina) {
            case 'imagenes':
                imagenModel.getImagens(function (error,imagenes) {
                if(error){
                    console.log(error);
                    res.send("404");
                    return;
                }else{
                    if(!esMovil){
                        res.render("autenticado/perfil/imagenes",{imagenes:imagenes});
                        
                        
                        
                    }else{
                        res.render("movil/autenticado/home",{imagenes:imagenes});
                    }
                }
            },{"usuario.id_usuario":req.session.user_id},"usuario","id_usuario",2);
                break;
            case 'videos':
                imagenModel.getImagens(function (error,imagenes) {
                if(error){
                    console.log(error);
                    res.send("404");
                    return;
                }else{
                    if(!esMovil){
                        res.render("autenticado/perfil/imagenes",{imagenes:imagenes});
                        
                        
                        
                    }else{
                        res.render("movil/autenticado/home",{imagenes:imagenes});
                    }
                }
            },{"usuario.id_usuario":req.session.user_id},"usuario","id_usuario",2);
                break;
                
            case 'siguiendo':
                usuarioModel.getUsuarioByNombreUsuario(req.params.perfil,function (errorx,usuario) {
                    seguidorModel.getSiguiendo(function (error,imagenes) {
                        if(error){
                            console.log(error);
                            res.send("404");
                            return;
                        }else{
                            if(!esMovil){
                                console.log(imagenes);
                                res.render("autenticado/perfil/siguiendo",{usuarios:imagenes});



                            }else{
                                res.render("movil/autenticado/home",{imagenes:imagenes});
                            }
                        }
                    },{"siguiendo":usuario.id_usuario},"usuario","id_usuario",10,"seguido");
                });
                
                break;
            case 'seguidores':
                usuarioModel.getUsuarioByNombreUsuario(req.params.perfil,function (errorx,usuario) {
                    seguidorModel.getSiguiendo(function (error,imagenes) {
                        if(error){
                            console.log(error);
                            res.send("404");
                            return;
                        }else{
                            if(!esMovil){
                                console.log(imagenes);
                                res.render("autenticado/perfil/siguiendo",{usuarios:imagenes});



                            }else{
                                res.render("movil/autenticado/home",{imagenes:imagenes});
                            }
                        }
                    },{"seguido":usuario.id_usuario},"usuario","id_usuario",10,"siguiendo");
                });
                
                break; 
                
            default:
                
                if(res.locals.perfilVisitado.categorias){
                    for(var item in res.locals.perfilVisitado.categorias){
                        if(res.locals.perfilVisitado.categorias[item].url_categoria==req.params.pagina){
                            
                            
                            imagenModel.getImagens(function (error,imagenes) {
                                if(error){
                                    console.log(error);
                                    res.send("404");
                                    return;
                                }else{
                                    if(!esMovil){
                                        res.render("autenticado/perfil/blog",{imagenes:imagenes,urlx:"/"+req.params.perfil+"/"+req.params.pagina});



                                    }else{
                                        res.render("movil/autenticado/home",{imagenes:imagenes});
                                    }
                                }
                            },[{"id_usuario":res.locals.perfilVisitado.id_usuario},{"id_categoria":res.locals.perfilVisitado.categorias[item].id_categoria}]);
                           // res.render("autenticado/perfil/blog");
                            return;
                        }
                    }
                    res.send("404");
                     return;
                }else{
                    res.send("404");
                     return;
                }
                
                
                   
                break;
        }
        
            
    }else{
        res.render('perfil/index', { title: 'Index ' });
    }
});
/* GET home page. */
router.get('/:perfil/:pagina/:url', function(req, res, next) {
    var esMovil = isMobile(req.headers['user-agent']).any;
    console.log("es movil"+esMovil);
    if(req.session.user_id){//autenticado
            if(res.locals.perfilVisitado.categorias){
                    for(var item in res.locals.perfilVisitado.categorias){
                        if(res.locals.perfilVisitado.categorias[item].url_categoria==req.params.pagina){
                            
                            
                            imagenModel.getImagens(function (error,imagenes) {
                                if(error){
                                    console.log(error);
                                    res.send("404");
                                    return;
                                }else{
                                    if(!esMovil){
                                        res.render("autenticado/perfil/blogitem",{imagenes:imagenes});



                                    }else{
                                        res.render("movil/autenticado/home",{imagenes:imagenes});
                                    }
                                }
                            },[{"id_usuario":res.locals.perfilVisitado.id_usuario},{"id_categoria":res.locals.perfilVisitado.categorias[item].id_categoria},{"url_titulo":req.params.url}]);
                           // res.render("autenticado/perfil/blog");
                            return;
                        }
                    }
                    res.send("404");
                     return;
                }else{
                    res.send("404");
                     return;
                }
    }else{
        res.render('perfil/index', { title: 'Index ' });
    }
    });
    
/* GET home page. */
router.get('/:perfil', function(req, res, next) {
    var esMovil = isMobile(req.headers['user-agent']).any;
    console.log("es movil"+esMovil);
    if(req.session.user_id){//autenticado
        
        imagenModel.getImagens(function (error,imagenes) {
                if(error){
                    console.log(error);
                    res.send("404");
                    return;
                }else{
                    if(!esMovil){
                        if(imagenes.length>0){
                            getUserFeed(imagenes[0].usuario,function (feed,type) {
                                var feeds=[];
                                console.log('feed_all');
                                //console.log(feed);
                                if(feed!=null){
                                    feed.nowocio_feed=imagenes;
                                    feeds= sortFeed(feed);
                                    console.log(feeds);
                                }else{
                                    feeds= imagenes;    
                                }
                                res.render("autenticado/perfil/index",{/*imagenes:feeds,*/feed:feeds});
                                
                                
                                if(feed!=null){
                                    if(feed.facebook_feed!=null&&type.indexOf('facebook')>0){
                                        usuarioModel.insertUsuarioFacebookFeed(feed.facebook_feed,function (error,id) {
                                        console.log(id);
                                        },imagenes[0].usuario.id_usuario,imagenes[0].usuario.nombre_usuario);
                                    }
                                    if(feed.youtube_feed!=null&&type.indexOf('youtube')>0){
                                        usuarioModel.insertUsuarioYoutubeFeed(feed.youtube_feed,function (error,id) {
                                        console.log(id);
                                        },imagenes[0].usuario.id_usuario,imagenes[0].usuario.nombre_usuario);
                                    }
                                }
                                            
                                
                            });
                        }else{
                            console.log('rxd');
                            usuarioModel.getUsuarioByNombreUsuario(req.params.perfil,function (error,usuario) {
                                console.log(usuario);
                                getUserFeed(usuario,function (feed,type) {
                                console.log('feed_facebook');
                                console.log(feed);
                                res.render("autenticado/perfil/index",{imagenes:imagenes,feed:feed});
                                if(feed!=null&&type=='facebook'){
                                    usuarioModel.insertUsuarioFacebookFeed(feed,function (error,id) {
                                    console.log(id);
                                    },usuario.id_usuario,usuario.nombre_usuario);
                                }
                                if(feed!=null&&type=='youtube'){
                                    usuarioModel.insertUsuarioYoutubeFeed(feed,function (error,id) {
                                    console.log(id);
                                    },usuario.id_usuario,usuario.nombre_usuario);
                                }
                                            
                                
                            });
                                
                            })
                            
                        }
                    }else{
                        res.render("movil/autenticado/home",{imagenes:imagenes});
                    }
                }
            },{"usuario.nombre_usuario":req.params.perfil},"usuario","id_usuario",2);
            
    }else{
        res.render('perfil/index', { title: 'Index ' });
    }
});
var FACEBOOK_APP_ID = '132971590769160';
var FACEBOOK_APP_SECRET = 'e49721dcb51b17a2abea2dff6d8192b7';
var YOUTUBE_API ='AIzaSyC9wSpKB1w59CiP57lz9zz2KEzh7135AkY';
var getUserFeed = function (usuario,cb) {
    var facebook_id = usuario.facebook_id;
    var youtube_id = usuario.youtube_id;
    var facebook_feed=null;
    var youtube_feed=null;
   // console.log(usuario);
    if(facebook_id!= null){
        
    }else if(youtube_id!=null){
        
    }else{
        return cb(null,'null');
    }
    if(facebook_id!= null){
        usuarioModel.getFacebookFeed(usuario.id_usuario,function (error,data) {
           // console.log(data);
           // console.log(error);
            var urlx ="https://graph.facebook.com/"+facebook_id+"/feed"+"?fields=full_picture,message,story,created_time,id,link&access_token="+FACEBOOK_APP_ID+'|'+FACEBOOK_APP_SECRET;

               console.log(urlx); 
            if(data.length<1){
                var options = {
                                      method: 'get',/*
                                      body: {secret:llave,url:staticserver+"/imagenes/"+id+"."+extension,name:id+"."+extension}, // Javascript object
                                      */json: true, // Use,If you are sending JSON data
                                      url: urlx
                                    };
                                    console.log(options.url);
                                   request( options, function (error, response, body) {

                                         if(error)
                                           return;
                                        if(response.statusCode==200){
                                            var resdata = body;
                                            console.log(resdata.estado+resdata.url);
                                            console.log(body);
                                            facebook_feed=body;
                                            //return cb(body,'facebook');
                                            test('facebook');
                                        }else{
                                            console.log(body);
                                            facebook_feed=body;
                                            //return  cb(body,'facebook');
                                            test('facebook');
                                        }

                                    });
            }else{
                facebook_feed=data;
                //return cb(data,'null');
                test('null');
            }
        });
    }
    if(youtube_id!=null){
        usuarioModel.getYoutubeFeed(usuario.id_usuario,function (error,data) {
           // console.log(data);
           // console.log(error);
            var urlx ="https://www.googleapis.com/youtube/v3/activities?part=id,snippet,contentDetails&channelId="+youtube_id+"&key="+YOUTUBE_API;

               console.log(urlx); 
            if(data.length<1){
                var options = {
                                      method: 'get',/*
                                      body: {secret:llave,url:staticserver+"/imagenes/"+id+"."+extension,name:id+"."+extension}, // Javascript object
                                      */json: true, // Use,If you are sending JSON data
                                      url: urlx
                                    };
                                    console.log(options.url);
                                   request( options, function (error, response, body) {

                                         if(error)
                                           return;
                                        if(response.statusCode==200){
                                            var resdata = body;
                                            console.log(resdata.estado+resdata.url);
                                            console.log(body);
                                            youtube_feed=body;
                                            //return cb(body,'youtube');
                                            test('youtube');
                                        }else{
                                            console.log(body);
                                            youtube_feed=body;
                                            //return  cb(body,'youtube');
                                            test('youtube');
                                        }

                                    });
            }else{
                youtube_feed={items:data};
                //return cb(data,'null');
                test('null');
            }
        });
    }
    
    var test = function (type) {
        var result={};
        var res="";
        if(facebook_id!= null){
            if(youtube_id!=null){
                res+="_"+type;
                if(facebook_feed!=null&&youtube_feed!=null){
                    result.facebook_feed=facebook_feed;
                    result.youtube_feed=youtube_feed;
                    cb(result,res);
                }
            }else{
                if(facebook_feed!=null){
                    result.facebook_feed=facebook_feed;
                    cb(result,type)
                }
            }
        }else if(youtube_id!=null){
            if(youtube_feed!=null){
                result.youtube_feed=youtube_feed;
                    cb(result,type)
            }
        }else{
            return cb(null,'null');
        }
    }
    
    
   // return ;
                           
}

var sortFeed = function (list) {
    var  keys = [],types=[],
    k, i, len,t;
    if(list.nowocio_feed){
        for(var x=0;x<list.nowocio_feed.length;x++){
            if(list.nowocio_feed[x]){
                            keys.push(date_and_time(list.nowocio_feed[x].imagen.time,'Z')+'_now');
                            types.push(list.nowocio_feed[x]);     
            }
        }
    }
        if(list.youtube_feed&&list.youtube_feed.items){
            for(var x=0;x<list.youtube_feed.items.length;x++){
                if(list.youtube_feed.items[x].snippet){
                        if(list.youtube_feed.items[x].snippet.hasOwnProperty('publishedAt')){//yt
                                keys.push(list.youtube_feed.items[x].snippet.publishedAt+'_yt');
                                types.push(list.youtube_feed.items[x]);

                        }
                }else{
                                keys.push(list.youtube_feed.items[x].publishedAt+'_yt');
                                types.push(list.youtube_feed.items[x]);
                }

            }
        }
        if(list.facebook_feed){
            for(var x=0;x<list.facebook_feed.length;x++){
             if(list.facebook_feed[x]){
                            keys.push(list.facebook_feed[x].created_time+'_fb');
                            types.push(list.facebook_feed[x]);
                }
            }
        }
    
    if(list.facebook_feed&&list.facebook_feed.data){
                for(var y=0;y<list.facebook_feed.data.length;y++){
                        keys.push(date_and_time(list.facebook_feed[x].data[y].created_time,'')+'_fb');
                        types.push(list.facebook_feed.data[y]);
                    }
            }
    keys.sort();
    len = keys.length;
    var final =[];
    for (var i = len-1; i > 0; i--) {
        k = keys[i];
        t = types[i];
        var c = k.split('_');
        switch (c[1]) {
            case 'yt':
                for(var f=0;f<len;f++){
                    if(types[f].snippet){
                        if(types[f].snippet.publishedAt==c[0]){
                            console.log( keys[i]);
                            final.push(types[f]);
                        } 
                    }else{
                        if(types[f].publishedAt==c[0]){
                            console.log( keys[i]);
                            final.push(types[f]);
                        }
                    }
            }
                
                break;
            case 'now':
                for(var f=0;f<len;f++){
                    
                   if(types[f].imagen){ 
                        if(date_and_time(types[f].imagen.time,'Z')==c[0]){
                            console.log( keys[i]);
                            final.push(types[f]);
                        } 
                    }
                }
                break;
            case 'fb':
                for(var f=0;f<len;f++){
                    if(types[f].created_time){
                        var fecha =types[f].created_time;
                        if(fecha==c[0]){
                            console.log( keys[i]);
                            final.push(types[f]);
                        } 
                    }
                }
                break;  
            default:break;
        }
    }
    return final;
}
function date_and_time(time,adicional) {
    var date = new Date(time);
    //zero-pad a single zero if needed
    var zp = function (val){
        return (val <= 9 ? '0' + val : '' + val);
    }

    //zero-pad up to two zeroes if needed
    var zp2 = function(val){
        return val <= 99? (val <=9? '00' + val : '0' + val) : ('' + val ) ;
    }

    var d = date.getDate();
    var m = date.getMonth() + 1;
    var y = date.getFullYear();
    var h = date.getHours();
    var min = date.getMinutes();
    var s = date.getSeconds();
    var ms = date.getMilliseconds();
    return '' + y + '-' + zp(m) + '-' + zp(d) + 'T' + zp(h) + ':' + zp(min) + ':' + zp(s) + '.' + zp2(ms)+adicional;
}
module.exports = router;
