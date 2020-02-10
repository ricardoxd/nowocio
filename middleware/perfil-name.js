var usuarioModel = require('../models/usuario');
var seguidorModel = require('../models/seguidor');
var categoriaModel = require('../models/categoria');
module.exports = function (req,res,next) {
            usuarioModel.getUsuarioByNombreUsuario(req.params.perfil,function(error, data)
            {
                if (typeof data !== 'undefined')
                {
                    seguidorModel.getVerificar(req.session.user_id,data.id_usuario,function (error,sigue) {
                        if(sigue){
                           data.siguiendo=true; 
                        }else{
                            data.siguiendo=false; 
                        }
                        categoriaModel.getUserName(data.id_usuario,function (error,datas) {
                            data.categorias=datas;
                            res.locals.perfilVisitado= data;
                                next();
                        });
                        
                        
                        
                    })
                    
                }
                else
                {
                  res.redirect("/");
                }
            },"usuario","id_usuario");
};