var imagenModel = require('../models/imagen');
var FacebookStrategy = require('passport-facebook').Strategy;
var FACEBOOK_APP_ID = '132971590769160';
var FACEBOOK_APP_SECRET = 'e49721dcb51b17a2abea2dff6d8192b7';
var express = require('express');
var router = express.Router();
var http = require('https');
var fs = require('fs');

var usuariosModel = require('../models/usuario');
module.exports.estrategy = function () {
             return   new FacebookStrategy({
                clientID: FACEBOOK_APP_ID,
                clientSecret: FACEBOOK_APP_SECRET,
                callbackURL: "http://localhost:3000/auth/facebook/callback",
              profileFields: ['id',  'name', 'displayName', 'photos', 'email','gender']
              },
              function(accessToken, refreshToken, profile, cb) {
                  
                  console.log(profile);
                //  console.log(refreshToken);
                 // console.log(accessToken);
                  //console.log(cb);
                  
                  usuariosModel.getUsuarioLogin(profile.emails[0].value,profile.id,function (error,data) {
                    //    console.log(data);
                        if(typeof data !== 'undefined' ){
                            console.log('facebook existe');
                            data.accessToken=accessToken;
                            return cb(error,data);
                        }else{
                            console.log('facebook no existe');
                            var datosUsuario = {
                            id_usuario : null,
                            email : profile.emails[0].value,
                            facebook_id : profile.id,
                            nombre_usuario:'fb@'+validarNombre(profile.displayName),
                            genero:profile.gender
                            };
                           usuariosModel.insertUsuario(datosUsuario,function(error, datos)
                            {
                                if(datos)
                                {
                                    datosUsuario.id_usuario=datos;
                                    guardarImagenPerfil(profile.photos[0].value,datos,function (guardado) {
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
                        
                    },'facebook_id');
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
router.get('/auth/facebook',
  passport.authenticate('facebook',{ scope: ['user_friends','email','public_profile','user_posts'] }));

router.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) { 
    var data = req.session.passport.user;
    console.log(data);
    if(data.facebook_id.length>5){
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