var express = require('express');
var router = express.Router();
var imagenModel = require('../models/imagen');
var isMobile = require('ismobilejs');
var perfil = require('./perfil');

/* GET home page. */
router.get('/', function(req, res, next) {
    var esMovil = isMobile(req.headers['user-agent']).any;
    console.log("es movil"+esMovil+' '+req.session);
    console.log(req.session);
    if(req.session.user_id){//autenticado
        imagenModel.getImagens(function (error,imagenes) {
                if(error){
                    console.log(error);
                    res.send("404");
                    return;
                }else{
                    if(!esMovil){
                        res.render("autenticado/home",{imagenes:imagenes,title: 'Nowocio. Todo en un solo sitio de ocio'});
                    }else{
                        res.render("movil/autenticado/home",{imagenes:imagenes,title: 'Nowocio. Todo en un solo sitio de ocio'});
                    }
                }
            },{siguiendo :req.session.user_id},"usuario","id_usuario",4,"seguidor","seguido","id_usuario");
        
        /*
        var time1 = new Date().getTime();
        res.render('autenticado/home', { title: 'Home ' });
        var time = new Date().getTime();
        console.log(time-time1);
        console.log(time);*/
    }else{
        res.render('index', { title: 'Nowocio. Todo en un solo sitio de ocio' });
    }
});

router.use('/',perfil);

module.exports = router;
