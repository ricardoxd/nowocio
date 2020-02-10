var express = require('express');
var router = express.Router();
var modeloMegusta = require('../models/megusta')
router.post('/list', function(req, res, next) {
    var datax={ id_youtube_feed:req.body.id_youtube_feed,
            id_facebook_feed: req.body.id_facebook_feed,
            id_imagen: req.body.id_imagen,
            id_usuario: req.session.user_id};
        modeloMegusta.getList(function (error,data) {
                console.log("result"+error);
                if(data){
                    res.json(data);
                }else{
                    res.status(404);
                }
            },[
                {id_youtube_feed:req.body.id_youtube_feed},
                {id_facebook_feed: req.body.id_facebook_feed},
                {id_imagen: req.body.id_imagen},
                {id_usuario:req.session.user_id},
                {id_youtube_feed:req.body.id_youtube_feed},
                {id_facebook_feed: req.body.id_facebook_feed},
                {id_imagen: req.body.id_imagen}
            ]);
  //  res.send("mensaje");
});

router.route("/")
        .post(function (req,res) {
            var key ='i'+req.body.id_imagen+'yt'+req.body.id_youtube_feed+'fb'+req.body.id_facebook_feed+'u'+req.session.user_id+'t'+req.body.id_tipo;
            var datax={ id_youtube_feed:req.body.id_youtube_feed,
            id_facebook_feed: req.body.id_facebook_feed,
            id_imagen: req.body.id_imagen,
            id_tipo : req.body.id_tipo,
            id_usuario: req.session.user_id,
            id_key:key};
            modeloMegusta.insert(datax,function (error,data) {
                console.log("result"+error);
                if(error){
                    modeloMegusta.delete(key,function (error2) {
                        if(error2){
                            res.status(404)
                        }else{
                            res.json({eliminado:"1"});
                        }
                    })
                }else if(data){
                    res.json({insertado:data});
                }else{
                    res.status(404);
                }
            });
        });
module.exports = router;