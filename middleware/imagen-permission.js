var imagenModel = require('../models/imagen');

module.exports = function (imagen,req,res) {
    //return tiene permiso?
    if(req.method === "GET" && req.path.indexOf("editar")<0){
        return true;
    }
    
    if(imagen.usuario.id_usuario ==res.locals.user.id_usuario){
        return true;
    }
    return false;
};