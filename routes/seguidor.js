var express = require('express');
var router = express.Router();
var seguidorModel = require('../models/seguidor');
var isMobile = require('ismobilejs');
var usuarioModel = require('../models/usuario');

//rc
router.route("/")
        .get(function (req,res) {//listar
    var esMovil = isMobile(req.headers['user-agent']).any;
    console.log("es movil"+esMovil+' '+req.session);
    console.log(req.session);
    if(req.session.user_id){//autenticado
        seguidorModel.getImagens(function (error,seguidores) {
                if(error){
                    console.log(error);
                    res.send("404");
                    return;
                }else{
                    if(!esMovil){
                        res.render("autenticado/home",{seguidores:seguidores});
                    }else{
                        res.render("movil/autenticado/home",{seguidores:seguidores});
                    }
                }
            },null,"usuario","id_usuario",4);
        
        /*
        var time1 = new Date().getTime();
        res.render('autenticado/home', { title: 'Home ' });
        var time = new Date().getTime();
        console.log(time-time1);
        console.log(time);*/
    }else{
        res.render('index', { title: 'Index ' });
    }   
        })
        .post(function (req,res) {//crear
            var seguido ='';
                
                if(req.body.seguidou){
                   usuarioModel.getUsuarioByNombreUsuario(req.body.seguidou,function (errorx,usuario) {
                       if(usuario){
                           seguir(usuario.id_usuario,req,res)
                       }
                    
                    
                    }); 
                }else{
                    seguir(req.body.seguido,req,res);
                }
                
                
            
            
        });
        
router.route("/:id")
        .get(function (req,res) {//listar
    var esMovil = isMobile(req.headers['user-agent']).any;
    console.log("es movil"+esMovil+' '+req.session);
    console.log(req.session);
    if(req.session.user_id){//autenticado
        seguidorModel.getSiguiendo(function (error,seguidores) {
                if(error){
                    console.log(error);
                    res.send("404");
                    return;
                }else{
                    res.json({seguidores});
                }
            },[{siguiendo:req.session.user_id}]);
        
    }else{
        res.send('error')
    }   
        });        
router.route("/:id/:limit")
        .get(function (req,res) {//listar
    var esMovil = isMobile(req.headers['user-agent']).any;
    console.log("es movil"+esMovil+' '+req.session);
    console.log(req.session);
    if(req.session.user_id){//autenticado
        seguidorModel.getSiguiendo(function (error,seguidores) {
                if(error){
                    console.log(error);
                    res.send("404");
                    return;
                }else{
                    res.json({seguidores});
                }
            },[{siguiendo:req.params.id}],null,null,req.params.limit);
        
    }else{
        res.send('error')
    }   
        });             
        
var seguir= function (seguido,req,res) {
    var datosUsuario = {
                id_seguidor : null,
                siguiendo : req.session.user_id,
                seguido : seguido
                };
                if(datosUsuario.siguiendo==datosUsuario.seguido){
                    res.status(500).json({"Mensaje":"Error siguiendo"});
                    return;
                }
                seguidorModel.insertSeguidor(datosUsuario,function(error, datos)
                {
                if(datos)
                {
                    if(datos>0){
                        res.status(200).json({estado:1,"Mensaje":"Seguido "+datos});
                    }else{
                        seguidorModel.delete(datos.id_seguidor,function () {
                            res.status(200).json({estado:2,"Mensaje":"Des-seguido "+datos});
                        })
                    }

                }
                else
                {
                    res.status(500).json({"Mensaje":"Error siguiendo"});
                }
                });
}
module.exports = router;