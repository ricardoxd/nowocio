var imagenModel = require('../models/imagen');
var propietarioImagen = require('../middleware/imagen-permission')
module.exports = function (req,res,next) {
            imagenModel.getImagenById(req.params.id,function(error, data)
            {
                if (typeof data !== 'undefined'&&propietarioImagen(data,req,res))
                {
                    res.locals.imagen = data.imagen;
                    res.locals.imagen.usuario = data.usuario;
                    next();
                }
                else
                {
                  res.redirect("/imagen");
                }
            },"usuario","id_usuario");
};