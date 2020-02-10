var usuarioModel = require('../models/usuario');
 var visitaModel = require('../models/visita');
module.exports = function (req,res,next) {

    if(!req.session.user_id){//esta fuera
        //si es de facebook
        if(!req.url.indexOf("/auth/facebook/callback")==-1||!req.url.indexOf("/auth/facebook")==-1){
             next();
        }else if(!(req.url.indexOf("/usuario/verificacion/")==-1)
                ||!(req.url.indexOf("/usuario/recuperacion/")==-1)
                ||!(req.url.indexOf("/usuario/cambio/clave")==-1)){//validar correo
             next();
        }else if(req.url.indexOf("/login")==-1//sitios sin seguridad
            &&(req.url!='/usuario'
            &&req.url!='/registrar'
            &&req.url!='/')
            ||(req.url=='/usuario'&&req.method=='GET')){
            res.redirect("/login");
        }else{
                next();
        }
    }else{//esta dentro
        if(req.url=='/login'||req.url=='/registrar'){
            res.redirect("/");
        }else if(req.url.indexOf("/api")>-1){//la api
            next();
        }else if(req.session.user_id){//siemplemente entra
            usuarioModel.getUsuarioById(req.session.user_id,function (error,user) {
                if(error){
                    console.log(error);
                    next();
                }else{
                    res.locals = {user : user };
                    visita(user,req);
                    next();
                }
            });
        }else{
                next();
        }  
    }
    
    
    
    /*
    if(!req.session.user_id
            &&(!req.url.indexOf("/auth/facebook/callback")==-1)||!req.url.indexOf("/auth/facebook")==-1){
        next();
    }else if(!req.session.user_id
            &&req.url.indexOf("/login")==-1
            &&req.url!='/usuario'
            &&req.url!='/registrar'
            &&req.url!='/'){
        res.redirect("/login");
    }else if(req.session.user_id
                &&(req.url=='/login'||req.url=='/registrar')){
            res.redirect("/")
    }else if(req.session.user_id
                &&req.url.indexOf("/api")>-1){
            console.log('ss');
            next();
    }else if(req.session.user_id){
            usuarioModel.getUsuarioById(req.session.user_id,function (error,user) {
                if(error){
                    console.log(error);
                }else{
                    res.locals = {user : user };
                    visita(user,req);
                    next();
                }
            });
    }else{
            next();
    }  */
};


var visita= function(user,req) {
        
  setTimeout ( function() {
    registar(user,req);
  }, 0);
        
}

var registar = function (user,req) {
    //console.log(req);
    visitaModel.insertVisita({id_usuario:user.id_usuario,url:req.originalUrl},function (error,data) {
        console.log(data);
    });
}
