var imagenModel = require('../models/imagen');
var YoutubeV3Strategy = require('passport-youtube-v3').Strategy;
var YOUTUBE_APP_ID = '518257884073-qed897jp4kjjsdctjr6f69dsd1tutrmn.apps.googleusercontent.com';
var YOUTUBE_APP_SECRET = 'zXBVZBcC4zOWhS_56EqF1gpo';
var express = require('express');
var router = express.Router();
var http = require('https');
var fs = require('fs');
var request = require('request');

var usuariosModel = require('../models/usuario');
module.exports.estrategy = function () {
             return   new YoutubeV3Strategy({
                clientID: YOUTUBE_APP_ID,
                clientSecret: YOUTUBE_APP_SECRET,
                callbackURL: "http://localhost:3000/auth/youtube/callback",
                scope: ['https://www.googleapis.com/auth/youtube.force-ssl','https://www.googleapis.com/auth/plus.profile.emails.read','https://www.googleapis.com/auth/youtube.readonly','https://www.googleapis.com/auth/userinfo.email','snippet','thumbnails']
              },
              function(accessToken, refreshToken, profile, cb) {
                  
                  console.log(profile);
                  console.log(refreshToken);
                  console.log(accessToken);
                  console.log(cb);
                  var options = {
                                  method: 'get',/*
                                  body: {secret:llave,url:staticserver+"/imagenes/"+id+"."+extension,name:id+"."+extension}, // Javascript object
                                  */json: true, // Use,If you are sending JSON data
                                  url: 'https://www.googleapis.com/oauth2/v1/userinfo?access_token='+accessToken
                                };
                  request( options, function (error, response, body) {
                                  
                                     if(error)
                                       return;
                                    if(response.statusCode==200){
                                        usuariosModel.getUsuarioLogin(body.email,profile.id,function (error,data) {
                                                //    console.log(data);
                                                    if(typeof data !== 'undefined' ){
                                                        console.log('youtube existe');
                                                        data.accessToken=accessToken;
                                                        return cb(error,data);
                                                    }else{
                                                        console.log('yt no existe');
                                                        var datosUsuario = {
                                                        id_usuario : null,
                                                        email : body.email,
                                                        youtube_id : profile.id,
                                                        nombre_usuario:'yt@'+validarNombre(profile.displayName),
                                                        genero:body.gender
                                                        };
                                                       usuariosModel.insertUsuario(datosUsuario,function(error, datos)
                                                        {
                                                            if(datos)
                                                            {
                                                                datosUsuario.id_usuario=datos;
                                                                guardarImagenPerfil(body.picture,datos,function (guardado) {
                                                                    console.log(guardado);
                                                                    datosUsuario.accessToken = accessToken;
                                                                    return cb(error,datosUsuario);
                                                                });


                                                            }else
                                                            {
                                                                console.log(error);
                                                                //if(error.code)


                                                                return cb('error datos'+error,datos);
                                                            }
                                                        });
                                                    }

                                                },'youtube_id');
                                    }else{
                                        console.log(body);
                                        //return  cb(body,'facebook');
                                    }
                                    
                                });
                  
                //User.findOrCreate({ facebookId: profile.id }, function (err, user) {
                  
                //});
              }
            );
           /* imagenModel.getImagenById(req.params.id,function(error, data)
            {
                if (typeof data !== 'undefined'&&propietarioImagen(data,req,res))
                {
                    res.locals.imagen = data.imagen;
                    res.locals.imagen.usuario = data.usuario;
                    next();
                }
                else
                {
                  res.redirect("/imagen");
                }
            },"usuario","id_usuario");*/
};

module.exports.urls = function (passport,app) {
    passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(user, done) {
  done(null, user);
});
router.get('/auth/youtube',
  passport.authenticate('youtube',{scope:['https://www.googleapis.com/auth/youtube.force-ssl','https://www.googleapis.com/auth/plus.profile.emails.read','https://www.googleapis.com/auth/youtube.readonly','https://www.googleapis.com/auth/userinfo.email']}));

router.get('/auth/youtube/callback',
  passport.authenticate('youtube', { failureRedirect: '/login' }),
  function(req, res) { 
    var data = req.session.passport.user;
    console.log(data);
    if(data.youtube_id.length>5){
        req.session.user_id = data.id_usuario;
        req.session.user_name = data.nombre_usuario;
        req.session.accessToken = data.accessToken;
        
        // Successful authentication, redirect home.
        res.redirect('/');  
    }else{
        res.redirect('/login'); 
    }
    
    
  });
return router;
};
var guardarImagenPerfil = function (url,user_id,callback) {
    var file = fs.createWriteStream("public/perfil/"+user_id+'.jpg');
    var file2 = fs.createWriteStream("public/perfil/icono/"+user_id+'.jpg');
        var request = http.get(url, function(response) {
          response.pipe(file);
          response.pipe(file2);
          return callback(true);
        });
       request.on('error', function(e) {
            console.log('ERROR: ' + e.message);
            return callback(false);
          }); 
}

var validarNombre = function (name) {
    return name.split(" ").join("");
}