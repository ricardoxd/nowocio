var express = require('express');
var router = express.Router();
var modeloMensaje = require('../models/mensaje')
router.get('/', function(req, res, next) {
    
    modeloMensaje.getMensajesPaginate(function (error,imagenes) {
                if(error){
                    console.log(error);
                    res.redirect("/");
                    return;
                }else{
                    //console.log(imagenes);
                    res.render("autenticado/mensaje/index",{imagenes:imagenes});
                }
            },[{de:req.session.user_id},{a:req.session.user_id}],"usuario","id_usuario",0,10,
            [" CONCAT(IF(mensaje.de > mensaje.a, mensaje.de, mensaje.a), \"XD\",IF(mensaje.a > mensaje.de, mensaje.de, mensaje.a)) as e",
                "(select texto from mensaje as m where (m.de=mensaje.de and m.a=mensaje.a) or (m.a=mensaje.de and m.de=mensaje.a) order by id_mensaje desc limit 1) as texto",
                "(select fecha from mensaje as m where (m.de=mensaje.de and m.a=mensaje.a) or (m.a=mensaje.de and m.de=mensaje.a) order by id_mensaje desc limit 1) as fechaxd",
                "IF(u2.id_usuario = "+req.session.user_id+", usuario.nombre_usuario, u2.nombre_usuario) as con",
                "IF(u2.id_usuario = "+req.session.user_id+", usuario.id_usuario, u2.id_usuario) as id_con",
                "mensaje.*",
                "usuario.*",
                "u2.*"
            ],"fechaxd","e");
});

router.route("/api/:userid")
        .post(function (req,res) {
            var user1 = req.params.userid;
            var user2 = req.session.user_id;
            modeloMensaje.getMensajesPaginate(function (error,data) {
                res.json(data);
            }," (de='"+user1+"' and a='"+user2+"') or (de='"+user2+"' and a='"+user1+"') ","usuario","id_usuario",null,null,["mensaje.*"]);
                  
        });
module.exports = router;

