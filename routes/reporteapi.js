var express = require('express');
var router = express.Router();

var reporteModel = require('../models/reporte');

router.route("/")
        .post(function (req,res) {//crear
            
                var datos = {
                id_reporte:null,    
                id_usuario : req.session.user_id,
                texto_reporte : req.body.info,
                id_mensaje : req.body.id,
                id_facebook_feed:req.body.idfb,
                id_youtube_feed:req.body.idyt
                };
                console.log(datos);
                reporteModel.insert(datos,function(error, datos)
                {
                if(datos)
                {
                   // datos.id_usuario = datos;
                   // req.session.user = datosUsuario;
                   // req.session.user_id = datos;
                   // res.redirect("/");
                res.status(200).json({estado:1,"Mensaje":"Insertado "+datos});

                }
                else
                {
                res.status(500).json({estado:-1,"Mensaje":"Error"});
                }
                });
                
            
            
        });





module.exports = router;

