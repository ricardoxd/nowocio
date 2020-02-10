var express = require('express');
var router = express.Router();
var modeloComentario = require('../models/comentario')
router.post('/list', function(req, res, next) {
    var datax={ id_youtube_feed:req.body.id_youtube_feed,
            id_facebook_feed: req.body.id_facebook_feed,
            id_imagen: req.body.id_imagen,
            id_usuario: req.session.user_id};
        modeloComentario.getPaginate(function (error,data) {
                console.log("result"+error);
                if(data){
                    res.json(data);
                }else{
                    res.status(404);
                }
            },[
                {id_youtube_feed:req.body.id_youtube_feed},
                {id_facebook_feed: req.body.id_facebook_feed},
                {id_imagen: req.body.id_imagen}
            ]);
  //  res.send("mensaje");
});

router.route("/")
        .post(function (req,res) {
            var datax={ id_youtube_feed:req.body.id_youtube_feed,
            id_facebook_feed: req.body.id_facebook_feed,
            id_imagen: req.body.id_imagen,
            id_usuario: req.session.user_id,
            contenido_comentario:req.body.contenido_comentario};
            modeloComentario.insert(datax,function (error,data) {
                console.log("result"+error);
                if(data){
                    res.json({insertado:data});
                }else{
                    res.status(404);
                }
            });
        });
module.exports = router;
