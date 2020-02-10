var express = require('express');
var router = express.Router();

var usuariosModel = require('../models/usuario');



router.post("/login",function (req,res) {
    usuariosModel.getUsuarioLogin(req.body.email,req.body.password,function (error,data) {
        console.log(data);
        if(typeof data !== 'undefined' ){
            req.session.user_id = data.id_usuario;
            req.session.user_name = data.nombre_usuario;
            req.session.passport={};
            req.session.passport.user=data;
            res.json({estado:1});
        }else{
            res.json({estado:-1});
        }
    })
    
});
router.get("/login/recuperar",function (req,res) {
   res.render('usuario/recuperar',{title: 'Recuperar cuenta Nowocio'});  
});
router.post("/login/recuperar",function (req,res) {
   usuariosModel.getUsuarioByEmail(req.body.email,function (error,data) {
        if(typeof data !== 'undefined' ){
            var recuperar='now'+Math.floor((Math.random()*10000000) + 1)+''+hashCode(data.nombre_usuario)+'ocio';
            req.mailer.send('email/recuperar', {
                                to: data.email, // REQUIRED. This can be a comma delimited string just like a normal email to field.  
                                subject: 'Recuperar cuenta NowOcio para '+data.nombre_usuario, // REQUIRED. 
                                verificacion: recuperar,
                                nombre_usuario:data.nombre_usuario// All additional properties are also passed to the template as local variables. 
                              }, function (err) {
                                if (err) {
                                  // handle error 
                                  console.log(err);
                                  res.json({estado:-1})
                                  return;
                                }else{
                                    usuariosModel.updateUsuario({id_usuario:data.id_usuario,recuperar:
                                            recuperar 
                                    },function (error,datax) {
                                            if(datax){
                                              
                                                res.json({estado:1})
                                                return; 
                                            }else{
                                                            res.json({estado:-1}); 
                                                    }

                                        });
                                }
                              });
            //res.json({estado:1});
        }else{
            res.json({estado:-1,mensaje:"usuario no existe"});
        }
    })
});

router.post("/cambio/clave",function (req,res) {
   
    usuariosModel.updateUsuarioByRecuperar({password:req.body.password,recuperar:
            req.body.recuperar 
    },function (error,datax) {
        console.log(error);
            if(datax){

                res.json({estado:1})
                return; 
            }else{
                            res.json({estado:-1}); 
                    }

        });
                                
            
        
  
});
router.get("/verificacion/:code",function (req,res) {
    console.log('code');
    usuariosModel.getUsuarioByVerificacion(req.params.code,function (error,data) {
        if(typeof data !== 'undefined' ){
            usuariosModel.updateUsuario({id_usuario:data.id_usuario,estado:1},function (error,datax) {
                if(datax){
                  req.session.user = data;
                req.session.user_id = data.id_usuario;
                req.session.user_name = data.nombre_usuario;
                req.session.passport={};
                req.session.passport.user=data;
                res.redirect("/"+req.session.user_name);   
                }else{
                        res.render("mensaje/general",{mensaje:"Error de codigo de actualizacion"}); 
                        }
                
            });
            
        }else{
            res.render("mensaje/general",{mensaje:"Error de codigo"});
        }
    })
    
});
router.get("/recuperacion/:code",function (req,res) {
    console.log('code');
    usuariosModel.getUsuarioByRecuperacion(req.params.code,function (error,data) {
        if(typeof data !== 'undefined' ){
           res.render("usuario/cambio/clave",{recuperar:req.params.code})
            
        }else{
            res.render("mensaje/general",{mensaje:"Error de codigo"});
        }
    })
    
});
/*crud*/
//rud
router.route("/:id")
        .put(function (req,res) {
            
            var datosUsuario = {
            id:req.query.id,
            nombre : req.query.nombre
            };
            usuariosModel.updateUsuario(datosUsuario,function(error, datos)
            {
              //si el usuario se ha actualizado correctamente mostramos un mensaje
              if(datos && datos.mensaje)
              {
                res.status(200).json(datos);
              }
              else
              {
                res.status(500).json({"mensaje":"Error"});

              }
            });

        })
        .delete(function (req,res) {
            var id = req.query.id;
            usuariosModel.deleteUsuario(id,function(error, datos)
            {
            if(datos && datos.mensaje === "Borrado")
            {
            res.status(200).json(datos);
            }
            else
            {
            res.status(500).json({"mensaje":"Error"});
            }
            });
            
        });
//rc
router.route("/")
        .get(function (req,res) {//listar
            usuariosModel.getUsuarios(function(error, data)
            {
            res.status(200).json(data);
            });
        })
        .post(function (req,res) {//crear
                var nu=req.body.nombre_usuario;
                var nameRegex = /^[a-zA-Z0-9]+$/;
                var validfirstUsername = nu.match(nameRegex);
                if(validfirstUsername == null){
                    res.status(200).json({estado:-1,Mensaje:"Usuario Invalido"});
                    return;
                }
                var datosUsuario = {
                id_usuario : null,
                email : req.body.email,
                password : req.body.password,
                genero:req.body.sexo,
                nombre_usuario:req.body.nombre_usuario.substring(0,15),
                verificacion:'now'+Math.floor((Math.random()*10000000) + 1)+''+hashCode(req.body.email)+'ocio' 
                };
                
                
              //if(req.body.confirmado){
                    usuariosModel.insertUsuario(datosUsuario,function(error, datos)
                    {
                    if(datos)
                    {
                        
                        req.mailer.send('email/confirmacion', {
                                to: req.body.email, // REQUIRED. This can be a comma delimited string just like a normal email to field.  
                                subject: 'Verificar cuenta NowOcio para '+datosUsuario.nombre_usuario, // REQUIRED. 
                                verificacion: datosUsuario.verificacion,
                                nombre_usuario:datosUsuario.nombre_usuario// All additional properties are also passed to the template as local variables. 
                              }, function (err) {
                                if (err) {
                                  // handle error 
                                  console.log(err);
                                  res.json({estado:-1})
                                  return;
                                }else{
                                res.json({estado:1})
                                return;
                                }
                              });
                        
                      /*  */
                    //response.status(200).json({"Mensaje":"Insertado"+request.session.user.id_usuario});

                    }
                    else
                    {
                        var campo="";
                        if(error.sqlMessage.indexOf("@")>-1){
                            campo="email";
                        }
                    res.status(200).json({estado:-1,Mensaje:{code:error.code,campo:campo}});
                    }
                    });
             //   }else{
                        
                                
                    
                    
             //   }
            
            
        });


hashCode = function(s){
  return s.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);              
}

module.exports = router;

