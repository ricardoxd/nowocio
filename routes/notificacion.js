var express = require('express');
var router = express.Router();
var modeloNotificacion = require('../models/notificacion')
router.get('/', function(req, res, next) {
    
    modeloNotificacion.getPaginate(function (error,imagenes) {
                if(error){
                    console.log(error);
                    res.redirect("/");
                    return;
                }else{
                    //console.log(imagenes);
                    res.render("autenticado/notificacion/index",{imagenes:imagenes});
                }
            },{"seguidor.siguiendo" :req.session.user_id},"usuario","id_usuario",0,10,"seguidor","seguido","id_usuario");
            //[{"notificacion.id_usuario":req.session.user_id}],"usuario","id_usuario",0,5);
});

router.route("/api/:userid")
        .post(function (req,res) {
            var user1 = req.params.userid;
            var user2 = req.session.user_id;
            modeloNotificacion.getMensajesPaginate(function (error,data) {
                res.json(data);
            }," (de='"+user1+"' and a='"+user2+"') or (de='"+user2+"' and a='"+user1+"') ","usuario","id_usuario",null,null,["mensaje.*"]);
                  
        });
module.exports = router;

