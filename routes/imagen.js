var express = require('express');
var router = express.Router();
var imagenGetById = require('../middleware/imagen-get-by-id')
var imagenModel = require('../models/imagen');
 var fs = require('fs');
 var redis = require('redis');
 var request = require('request');
 var imageserver1 = "http://localhost:3001"
 var client = redis.createClient();
 var llave = "nowociollavesecreta1XD";
 var staticserver ="http://localhost:3000/archivos";
 
router.get("/nueva",function (req,res) {
   res.render("autenticado/imagen/nueva"); 
});

router.post("/paginar",function (req,res) {
    console.log('test '+req.body.pagina);
    switch (req.body.pagina) {
        case '/':
            console.log('xd21');
            imagenModel.getFeedPaginateXD(function (error,imagenes) {
                if(error){
                    console.log(error);
                    res.send("404");
                    return;
                }else{
                     res.json(imagenes);
                }
            },{siguiendo :req.session.user_id},req.body.start,req.body.limit);
            
            /*
            imagenModel.getImagensPaginate(function (error,datos) {
                        if(error){
                            console.log(error);
                            res.status(404);
                            return;
                        }else{
                            res.json(datos);
                        }
                    },null,"usuario","id_usuario",req.body.start,req.body.limit);*/

            break;
        case '/'+req.session.user_name:
            console.log('xd21');
            imagenModel.getFeedPaginateXD(function (error,imagenes) {
                if(error){
                    console.log(error);
                    res.send("404");
                    return;
                }else{
                     res.json(imagenes);
                }
            },{nombre_usuario :req.body.pagina.substr(1,req.body.pagina.lenght)},req.body.start,req.body.limit);
            
            /*
            imagenModel.getImagensPaginate(function (error,datos) {
                        if(error){
                            console.log(error);
                            res.status(404);
                            return;
                        }else{
                            res.json(datos);
                        }
                    },null,"usuario","id_usuario",req.body.start,req.body.limit);*/

            break;
        default:
            console.log('xd21');
            imagenModel.getFeedPaginateXD(function (error,imagenes) {
                if(error){
                    console.log(error);
                    res.send("404");
                    return;
                }else{
                     res.json(imagenes);
                }
            },{nombre_usuario :req.body.pagina.substr(1,req.body.pagina.lenght)},req.body.start,req.body.limit);
            

            break;
    }
   });


router.all("/:id*",imagenGetById);

router.get("/:id/editar",function (req,res) {
                  res.render("autenticado/imagen/editar");   
});

router.route("/:id")
        .get(function (req,res) {
                  res.render("autenticado/imagen/mostrar");
        })
        .put(function (req,res) {
                    res.locals.imagen.titulo = req.body.title;
                    imagenModel.updateImagen(res.locals.imagen,function (error,datos2) {
                        if(error){
                            console.log(error);
                            res.json({estado:-1});
                            return;
                        }else{
                            res.json({estado:1,id:req.params.id});
                        }
                    });
        })
        .delete(function (req,res) {
            imagenModel.deleteImagen(req.params.id,function (error,datos) {
                if(error){
                    console.log(error);
                    res.json({estado:-1});
                    return;
                }else{
                    res.json({estado:1});
                     return;
                }
            });
        });

router.route("/")
        .get(function (req,res) {
            imagenModel.getImagens(function (error,imagenes) {
                if(error){
                    console.log(error);
                    res.redirect("/");
                    return;
                }else{
                    res.render("autenticado/imagen/index",{imagenes:imagenes});
                }
            },{id_usuario:req.session.user_id});
        })
        .post(function (req,res) {
            //console.log(req);
            var extension="";
            if(req.body.file){
               extension  = req.body.file.name.split(".").pop();
                
            }
                //console.log(req.body.file);
                var mensaje="";
                if(req.body.mensaje!=undefined){
                    mensaje=req.body.mensaje;
                }
                var datos = {
                id_imagen : null,
                mensaje: req.body.mensaje,
                titulo:req.body.titulo||mensaje.substring(0,60),
                extension : extension,
                id_usuario :req.session.user_id,
                id_tipo:req.body.tipo||0,
                id_categoria:req.body.id_categoria||0,
                url_titulo:amigable(req.body.titulo||req.body.mensaje.substring(0,30))+'-'+hashCode(req.body.id_categoria+''+req.session.user_id+new Date().toDateString())
                };
                imagenModel.insertImagen(datos,function(error, id)
                {
                if(id)
                {
                    datos.id_imagen =id;
                    if(req.body.file){
                        
                           fs.rename(req.body.file.path,"public/imagenes/"+id+"."+extension,function () {
                               var options = {
                                  method: 'post',
                                  body: {secret:llave,url:staticserver+"/imagenes/"+id+"."+extension,name:id+"."+extension}, // Javascript object
                                  json: true, // Use,If you are sending JSON data
                                  url: imageserver1+"/new"
                                };
                               request( options, function (error, response, body) {
                                  
                                    console.log('error:', error); // Print the error if one occurred
                                    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
                                    console.log('body:', body); // Print the HTML for the Google homepage.
                                     if(error)
                                       return;
                                    if(response.statusCode==200){
                                        var resdata = body;
                                        console.log(resdata.estado+resdata.url);
                                        datos.url=resdata.url;
                                        client.publish("images",JSON.stringify(datos)); 
                                        res.json({estado:1,url_imagen:datos.url});
                                        res.end();
                                        return;
                                        
                                    }
                                    
                                });
                            
                        }) 
                            
                    
                    }else{
                        res.json({estado:1});
                        res.end();
                        return;
                    }
                    
                    
                    
                    
                
                }
                else
                {
                res.status(500).json({"Mensaje":"Error"});
                }
                });
                
            
        });


var amigable 	=function(url) {
        
  // make the url lowercase         
  var encodedUrl = url.toString().toLowerCase(); 

  // replace & with and           
  encodedUrl = encodedUrl.split(/\&+/).join("-and-")

  // remove invalid characters 
  encodedUrl = encodedUrl.split(/[^a-z0-9]/).join("-");       

  // remove duplicates 
  encodedUrl = encodedUrl.split(/-+/).join("-");

  // trim leading & trailing characters 
  encodedUrl = encodedUrl.trim('-'); 

  return encodedUrl; 
}
hashCode = function(s){
  return s.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);              
}

module.exports = router;


