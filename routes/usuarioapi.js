var express = require('express');
var router = express.Router();

var usuariosModel = require('../models/usuario');

router.post("/list",function (req,res) {
    usuariosModel.getBuscar(function (error,data) {
        console.log(data);
        if(typeof data !== 'undefined' ){
            res.json(data);
        }else{
            res.render("login");
        }
    },req.body.nombre_usuario)
    
});
router.post("/rand5",function (req,res) {
    usuariosModel.getUsuariosSugeridosRand(function (error,data) {
        console.log(data);
        if(typeof data !== 'undefined' ){
            res.json(data);
        }else{
            res.json({estado:-1})
        }
    },req.body.nombre_usuario)
    
});


/*crud*/
//rud
router.route("/:id")
        .get(function (req,res) {//getid
            var id = req.params.id;
            usuariosModel.getUsuarioById(id,function(error, datos)
            {
                if (typeof datos !== 'undefined' && datos.length > 0)
                {
                  res.status(200).json(datos);
                }
                else
                {
                  res.status(404).json({"Mensaje":"No existe"});
                }
            });
        })
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
            if(req.body.password!==req.body.password_confirm){
                res.status(500).json({"Mensaje":"Error"});
                res.end();
            }else{
                var datosUsuario = {
                id_usuario : null,
                email : req.body.email,
                password : req.body.password
                };
                usuariosModel.insertUsuario(datosUsuario,function(error, datos)
                {
                if(datos)
                {
                    datosUsuario.id_usuario = datos;
                    req.session.user = datosUsuario;
                    req.session.user_id = datos;
                    res.redirect("/");
                //response.status(200).json({"Mensaje":"Insertado"+request.session.user.id_usuario});

                }
                else
                {
                res.status(500).json({"Mensaje":"Error"});
                }
                });
                
            }
            
        });





module.exports = router;

