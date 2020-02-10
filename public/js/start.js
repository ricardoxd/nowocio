    var readFile =function (form) {
            form.append("file", new Blob([files[0]], {"type": "image/jpeg"}),'img.jpg');
        
    } 
    var editares=function() {
    $.each($('.editaritem'), function( i, l ){
        if($(l).hasClass( "edt" )){
           return;
       }else{
           $(l).addClass( "edt" );
       }
        $(l).click(function () {
        $(this).find(".opcioned").toggle("slow");


    });
            $(l).find(".eliminario").click(function () {
    var forx=$(this).parent().parent().parent().parent();
    console.log($(forx).attr('data-id'));
    var id=$(forx).attr('data-id');
    if (confirm('Seguro que desea eliminarlo?')) {
        $.ajax({
        url: '/imagen/'+id+'?_method=DELETE',
        type: 'DELETE',
        data: {id_imagen:$(forx).attr('data-id')},
        async: false,
        success: function (data) {
            
            console.log(data);
            if(data.estado>0){
                $(forx).toggle("slow").promise().done(function(){
                    $(forx).remove();
                });
            }
            
        },
        cache: false,
        contentType: false,
        processData: false
    });
        
    }
    
    //$(this).find(".opcioned").toggle("slow");
});

$(l).find(".reportario").click(function () {
    var forx=$(this).parent().parent().parent();
    console.log($(forx).attr('data-id'));
    var id=$(forx).attr('data-id');
    var idfb=$(forx).attr('data-idfb');
    var idyt=$(forx).attr('data-idyt');
    $('#reportariobox').remove();
    $($(this).parent().parent().parent()).append('<div id="reportariobox"><form><textarea id="info" name="info" placeholder="Escriba aqui su reporte" required="true"></textarea><input name="id" type="hidden" value="'+id+'"/><input name="idyt" type="hidden" value="'+idyt+'"/><input name="idfb" type="hidden" value="'+idfb+'"/><button>Cancelar</button><input type="submit" value="Reportar"/></form></div>');
$('#reportariobox form button').click(function (e) {
                e.preventDefault();
                
                $('#reportariobox').toggle("slow").promise().done(function(){
                    $('#reportariobox').remove();
                });
            })
    $('#reportariobox form').submit(function(e){
        e.preventDefault();
        var formData = new FormData($(this)[0]);
        var forx= this;
    readFile(formData);
        $.ajax({
        url: '/api/reporte',
        type: 'POST',
        data: formData,
        async: false,
        success: function (data) {
            
            console.log(data);
            if(data.estado>0){
                alert('Gracias por reportar, Recibimos su mensaje, se revisara');
                $('#reportariobox').toggle("slow").promise().done(function(){
                    $('#reportariobox').remove();
                });
            }
            
        },
        cache: false,
        contentType: false,
        processData: false
    });
        
    });



});
    });
    
}
    var comentarios=function () {
        reacciones();
        editares();
        console.log('xddx');
        
    $.each($('.contenido input[type="text"]'), function( i, l ){

       if($(l).hasClass( "xd" )){
           return;
       }else{
           $(l).addClass( "xd" );
       }
         console.log('xddx'+i);
        console.log( l );
        $(l).keypress(function (e) {
        console.log( e );
  if (e.which == 13&&$(this).val().length>0) {
      console.log("aadddda");
      var datax =$(this).val();
      var este=this;
    $.ajax({
        url: '/api/comentario',
        type: 'POST',
        data: { id_youtube_feed:$(this).parent().parent().parent().data("idyt"),
            id_facebook_feed: $(this).parent().parent().parent().data("idfb"),
            id_imagen: $(this).parent().parent().parent().data("id"),
            contenido_comentario:$(this).val()},
        async: false,
        success: function (data) {
            console.log(data);
            console.log($(este).parent().parent());
            var hace= verhace(new Date());
            $(este).val('');
            $($(este).parent().parent()).find('.listacomentarios').append( '<div>'+datax+' '+hace+'</div>' );//data[i]
        },
    });
    return false;    //<---- Add this line
  }
});  
});    
        
        
       
       
  
};

    var reacciones=function () {
        console.log('xddx');
        
    $.each($('.like'), function( i, l ){

       if($(l).hasClass( "xd" )){
           return;
       }else{
           $(l).addClass( "xd" );
       }
         console.log('like'+i);
        console.log( l );
        $(l).click(function (e) {
        console.log( e );
      console.log("aadddda");
      var datax =$(this).val();
      var este=this;
    $.ajax({
        url: '/api/reaccion',
        type: 'POST',
        data: { id_youtube_feed:$(this).parent().parent().data("idyt"),
            id_facebook_feed: $(this).parent().parent().data("idfb"),
            id_imagen: $(this).parent().parent().data("id"),
            id_tipo:0},
        async: false,
        success: function (data) {
            console.log(data);
            console.log($(este).parent().parent());
            
            if(data.insertado){
                $($(este).parent().parent()).find('.like').css('background-color','#e8e871');//data[i]
                var num =$($(este).parent().parent()).find('.numeros').attr('data-tipo0');
                num=parseInt(num)||0;
                $($(este).parent().parent()).find('.numeros').attr('data-tipo0',num+1);//data[i]
            }else{
                 $($(este).parent().parent()).find('.like').css('background-color','#fff');//data[i]
                var num =$($(este).parent().parent()).find('.numeros').attr('data-tipo0');
                num=parseInt(num)||1;
                 $($(este).parent().parent()).find('.numeros').attr('data-tipo0',num-1);//data[i]
            }
            
        },
    });
    return false;    //<---- Add this line
  
});  
});    
        
        
       
       
  
};
// Recorrer los elementos y hacer que onchange ejecute una funcion para comprobar el valor de ese input
var elementos;
var formulario;
(function() {
if(document.formulario_registro){
  formulario = document.formulario_registro;
    elementos = formulario.elements;

  // Funcion que se ejecuta cuando el evento click es activado

  var validarInputs = function() {
    for (var i = 0; i < elementos.length; i++) {
      // Identificamos si el elemento es de tipo texto, email, password, radio o checkbox
      if (elementos[i].type == "text" || elementos[i].type == "email" || elementos[i].type == "password") {
        // Si es tipo texto, email o password vamos a comprobar que esten completados los input
        if (elementos[i].value.length == 0) {
            //$('label[for="'+$(elementos[i]).attr('id')+'"]');
            if('email'==$(elementos[i]).attr('id')){
                $(elementos[i]).attr('email')
            }
          console.log('El campo ' + elementos[i].name + ' esta incompleto');
          $('label[for="'+$(elementos[i]).attr('id')+'"]').attr("data-error",'El campo esta incompleto');
          elementos[i].className = elementos[i].className + " error";
          return false;
        } else {
          elementos[i].className = elementos[i].className.replace(" error", "");
        }
      }
    }

    // Comprobando que las contraseñas coincidan
  /*  if (elementos.password.value !== elementos.password_confirm.value) {
      elementos.password.value = "";
      elementos.password_confirm.value = "";
      elementos.password.className = elementos.password.className + " error";
      elementos.password_confirm.className = elementos.password_confirm.className + " error";
      $('label[for="password"]').attr("data-error",'Las contraseña no coinsiden');
      $('label[for="password_confirm"]').attr("data-error",'Las contraseña no coinsiden');
    } else {
      elementos.password.className = elementos.password.className.replace(" error", "");
      elementos.password_confirm.className = elementos.password_confirm.className.replace(" error", "");
    }*/

    return true;
  };

  var validarRadios = function() {
    var opciones = document.getElementsByName('sexo'),
      resultado = false;

    for (var i = 0; i < elementos.length; i++) {
      if (elementos[i].type == "radio" && elementos[i].name == "sexo") {
        // Recorremos los radio button
        for (var o = 0; o < opciones.length; o++) {
          if (opciones[o].checked) {
            resultado = true;
            break;
          }
        }

        if (resultado == false) {
          elementos[i].parentNode.className = elementos[i].parentNode.className + " error";
          console.log('El campo sexo esta incompleto');
          $('label[for="mujer"]').attr("data-error",'.    Debe seleccionar una opcion');
          return false;
        } else {
          // Eliminamos la clase Error del radio button
          elementos[i].parentNode.className = elementos[i].parentNode.className.replace(" error", "");
          return true;
        }
      }
    }
  };

  var validarCheckbox = function() {
    var opciones = document.getElementsByName('terminos'),
      resultado = false,
      tiene=false;
    for (var i = 0; i < elementos.length; i++) {
      if (elementos[i].type == "checkbox") {
         tiene=true; 
      }
    }
          if(!tiene){
              return true;
          }
    for (var i = 0; i < elementos.length; i++) {
      if (elementos[i].type == "checkbox") {
        for (var o = 0; o < opciones.length; o++) {
          if (opciones[o].checked||opciones[o].value=="true") {
            resultado = true;
            break;
          }
        }

        if (resultado == false) {
          elementos[i].parentNode.className = elementos[i].parentNode.className + " error";
          console.log('El campo checkbox esta incompleto');
          $('label[for="terminos"]').attr("data-error",'.    Debe aceptar los terminos y condiciones');
          return false;
        } else {
          // Eliminamos la clase Error del checkbox
          elementos[i].parentNode.className = elementos[i].parentNode.className.replace(" error", "");
          return true;
        }
      }
    }
  };

  var enviar = function(e) {
      formulario=e.target;
      elementos=formulario.elements;
      e.preventDefault();
    if (!validarInputs()) {
      console.log('Falto validar los Input');
      
    }else if(formulario.action.indexOf("/usuario/login/recuperar")>-1){
        var formData = new FormData(formulario);
       // var forx= this;
    readFile(formData);
      $.ajax({
                url: '/usuario/login/recuperar',
                type: 'POST',
                dataType: 'json',
                contentType: 'application/json',
                data: JSON.stringify({email:formulario.elements.email.value}),
                async: false,
                success: function (data) {
                    console.log(data);
                    if(data.estado==1){
                        $(e.target).parent().html("Se le ha enviado un enlace a su correo, para recuperar su cuenta");
                    }else{
                            $('label[for="password"]').attr('data-error',':  El correo y la contraseña no coninside');
                            $('label[for="email"]').attr('data-error',':  El correo y la contraseña no coninside');
                         $('#email').attr('class',$('#email').attr('class') + " error"); 
                         $('#password').attr('class',$('#password').attr('class') + " error"); 
                        }
                       // $(e.target).parent().html('<h2 style="color:black">'+data.Mensaje+'</h2>');
                    
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) { 
                    
                    console.log( XMLHttpRequest); 
                },
                cache: false,
                processData: false
            });
    }else if(formulario.action.indexOf("/usuario/login")>-1){
        var formData = new FormData(formulario);
       // var forx= this;
    readFile(formData);
      $.ajax({
                url: '/usuario/login',
                type: 'POST',
                dataType: 'json',
                contentType: 'application/json',
                data: JSON.stringify({email:formulario.elements.email.value,
                                        password:formulario.elements.password.value}),
                async: false,
                success: function (data) {
                    console.log(data);
                    if(data.estado==1){
                        location.href="/";
                    }else{
                            $('label[for="password"]').attr('data-error',':  El correo y la contraseña no coninside');
                            $('label[for="email"]').attr('data-error',':  El correo y la contraseña no coninside');
                         $('#email').attr('class',$('#email').attr('class') + " error"); 
                         $('#password').attr('class',$('#password').attr('class') + " error"); 
                        }
                       // $(e.target).parent().html('<h2 style="color:black">'+data.Mensaje+'</h2>');
                    
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) { 
                    
                    console.log( XMLHttpRequest); 
                },
                cache: false,
                processData: false
            });
    }else if(formulario.action.indexOf("/usuario/cambio/clave")>-1){
        var formData = new FormData(formulario);
       // var forx= this;
    readFile(formData);
      $.ajax({
                url: '/usuario/cambio/clave',
                type: 'POST',
                dataType: 'json',
                contentType: 'application/json',
                data: JSON.stringify({password:formulario.elements.password.value,
                                        recuperar:formulario.elements.recuperar.value}),
                async: false,
                success: function (data) {
                    console.log(data);
                    if(data.estado==1){
                        $(e.target).parent().html("Se ha guardado su nueva contraseña, puede <a href=\"/login\">Entrar</a> con ella");
                    }else{
                            $('label[for="password"]').attr('data-error',':  Parece que ya no es valido el codigo, intente recuperar');
                        $('#password').attr('class',$('#password').attr('class') + " error"); 
                        }
                       // $(e.target).parent().html('<h2 style="color:black">'+data.Mensaje+'</h2>');
                    
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) { 
                    
                    console.log( XMLHttpRequest); 
                },
                cache: false,
                processData: false
            });
    }else if (!validarRadios()) {
      console.log('Falto validar los Radio Button');
      e.preventDefault();
    } else if (!validarCheckbox()) {
      console.log('Falto validar Checkbox');
      e.preventDefault();
    } else {
      console.log('Envia');
      var nu=formulario.elements.nombre.value;
                var nameRegex = /^[a-zA-Z0-9]+$/;
    var validfirstUsername = nu.match(nameRegex);
    if(validfirstUsername == null){
         $('label[for="nombre"]').attr('data-error',':  "Usuario Invalido"');
         $('#nombre').attr('class',$('#nombre').attr('class') + " error");
        return;
    }
      var formData = new FormData(formulario);
       // var forx= this;
    readFile(formData);
      $.ajax({
                url: '/usuario',
                type: 'POST',
                dataType: 'json',
                contentType: 'application/json',
                data: JSON.stringify({email:formulario.elements.email.value,
                                        password:formulario.elements.password.value,
                                        sexo:formulario.elements.sexo.value,
                                        nombre_usuario:formulario.elements.nombre.value}),
                async: false,
                success: function (data) {
                    console.log(data);
                    if(data.estado==1){
                        $(e.target).parent().html("Se te ha enviado un correo electronico que indicaste, para confirmarlo");
                    }else{
                        if(data.Mensaje.code=="ER_DUP_ENTRY"){
                            if(data.Mensaje.campo!="email"){
                                $('label[for="nombre"]').attr('data-error',':  Ya esta en uso');
                                $('#nombre').attr('class',$('#nombre').attr('class') + " error");
                            }else{
                                $('#email').attr('class',$('#email').attr('class') + " error"); 
                                $('label[for="email"]').attr('data-error',':  Ya existe una cuenta con este correo');
                            }
                            
                        }
                       // $(e.target).parent().html('<h2 style="color:black">'+data.Mensaje+'</h2>');
                    }
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) { 
                    
                    console.log( XMLHttpRequest); 
                },
                cache: false,
                processData: false
            });
      
    }
  };

  var focusInput = function() {
    this.parentElement.children[1].className = "label active";
    this.parentElement.children[0].className = this.parentElement.children[0].className.replace("error", "");
  };

  var blurInput = function() {
    if (this.value <= 0) {
      this.parentElement.children[1].className = "label";
      this.parentElement.children[0].className = this.parentElement.children[0].className + " error";
    }
  };

  // --- Eventos ---
  if(formulario.length==2){
      formulario[0].addEventListener("submit", enviar);
      formulario[1].addEventListener("submit", enviar);
      elementos=formulario[0].elements;
      for (var i = 0; i < elementos.length; i++) {
    if (elementos[i].type == "text" || elementos[i].type == "email" || elementos[i].type == "password") {
      elementos[i].addEventListener("focus", focusInput);
      elementos[i].addEventListener("blur", blurInput);
    }
  }
  elementos=formulario[1].elements;
  for (var i = 0; i < elementos.length; i++) {
    if (elementos[i].type == "text" || elementos[i].type == "email" || elementos[i].type == "password") {
      elementos[i].addEventListener("focus", focusInput);
      elementos[i].addEventListener("blur", blurInput);
    }
  }
  }else{
    formulario.addEventListener("submit", enviar);
    for (var i = 0; i < elementos.length; i++) {
    if (elementos[i].type == "text" || elementos[i].type == "email" || elementos[i].type == "password") {
      elementos[i].addEventListener("focus", focusInput);
      elementos[i].addEventListener("blur", blurInput);
    }
  }
  }
  
}
}())


var $btn = $('.wrapper li a');
if($btn){
    $(function(){

      $btn.click(function(e) {
        e.preventDefault();

        updateMenu(e.target);
      });

      $('#seguir').click(function (e) {
        var id=$(e.target).data("id");
        
            $.ajax({
                url: '/seguidor',
                type: 'POST',
                dataType: 'json',
                contentType: 'application/json',
                data: JSON.stringify({seguidou:id}),
                async: false,
                success: function (data) {
                    console.log(data);
                    if(data.estado==1){
                        $(e.target).html("Siguiendo");
                    }else{
                        $(e.target).html("Seguir");
                    }
                },
                cache: false,
                processData: false
            });
    });


    }());

    
}
var viendo=null;
function updateMenu(e) {
      var $this = $(e);
      var id=$this.data("id");
      viendo=id;
      if(id){
          $('.img-contenedor').hide();
          $('.img-contenedor'+'.'+id).show();
      }else{
          $('.img-contenedor').show();
      }
      $btn.removeClass('active');

      $this.addClass('active');
    };
/*post*/

$(function() {
  var postActions = $("#list_PostActions");
  var currentAction = $("#list_PostActions li.active");
  if (currentAction.length === 0) {
    postActions.find("li:first").addClass("active");
  }
  postActions.find("li").on("click", function(e) {
    e.preventDefault();
    var self = $(this);
    if (self === currentAction) {
      return;
    }
    // else
    currentAction.removeClass("active");
    self.addClass("active");
    currentAction = self;
  });
});

var files=[];
var act=0;
var editarimagenperfil_c="",editarportada_c="";
/*upload*/
(function () {
    Handlebars.registerHelper('ifEquals', function(arg1, arg2, options) {
    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});
Handlebars.registerHelper('ifNotEquals', function(arg1, arg2, options) {
    return (arg1 != arg2) ? options.fn(this) : options.inverse(this);
});
   comentarios();
    
    
    /*
    $('.contenido input[type="text"]').keypress(function (e) {
  if (e.which == 13) {
      console.log("aadddda");
    //$('form#login').submit();
    $.ajax({
        url: '//localhost:3000/api/comentario',
        type: 'POST',
        data: { id_youtube_feed:$(this).parent().parent().parent().data("idyt"),
            id_facebook_feed: $(this).parent().parent().parent().data("idfb"),
            id_imagen: $(this).parent().parent().parent().data("id"),
            contenido_comentario:$(this).val()},
        async: false,
        success: function (data) {
            console.log(data);
        },
    });
    return false;    //<---- Add this line
  }
});*/
    $("#entrada form").submit(function(){

    var formData = new FormData(this);
    readFile(formData);
    
    $.ajax({
        url: $(this).attr('action'),
        type: 'POST',
        data: formData,
        async: false,
        success: function (data) {
            console.log(data);
            if(data.estado>0){
                //window.location.replace("/imagen/"+data.id);
                $('#titulo').val('');
                $('#title').val('');
                $('#img-result').css('background','');
                $('#image').attr('src','');
                $('#img-result').attr('class','no-image');
            }
        },
        cache: false,
        contentType: false,
        processData: false
    });

    return false;
});

$('#editarimagenperfil_c').click(function () {
        
    $('#editarimagenperfil').show();
    $('#editarimagenperfil_g').hide();
    $('#editarimagenperfil_c').hide();
     $('#perfil').css('background-image',editarimagenperfil_c);
    });
$('#editarportada_c').click(function () {
        
    $('#editarportada').show();
    $('#editarportada_g').hide();
    $('#editarportada_c').hide();
     $('#portada').css('background-image',editarportada_c);
    });    
 $('#editarimagenperfil_g').click(function () {
  
    var formData = new FormData($('#perfil form')[0]);
    readFile(formData);
     $.ajax({
        url: '/imagen',
        type: 'POST',
        data: formData,
        async: false,
        success: function (data) {
            if(data!=null){
                $('#editarimagenperfil').show();
                $('#editarimagenperfil_g').hide();
                $('#editarimagenperfil_c').hide();
            }
            console.log(data);
        },
        cache: false,
        contentType: false,
        processData: false
    });
    });   
    $('#editarportada_g').click(function () {
  
    var formData = new FormData($('#portada form')[0]);
    readFile(formData);
     $.ajax({
        url: '/imagen',
        type: 'POST',
        data: formData,
        async: false,
        success: function (data) {
            if(data!=null){
                $('#editarportada').show();
                $('#editarportada_g').hide();
                $('#editarportada_c').hide();
            }
            console.log(data);
        },
        cache: false,
        contentType: false,
        processData: false
    });
    });   
    

    
    
    $('#img-result').click(function (e) {
        e.preventDefault();
    });
    
 var uploader = document.createElement('input'),
 uploader2 = document.createElement('input'),
    image = document.getElementById('img-result'),
    imageport = document.getElementById('editarportada'),
    imageper = document.getElementById('editarimagenperfil');
  
  uploader.type = 'file';
  uploader.name = 'filex';
  uploader.accept = 'image/*';
  uploader.style = 'display: none;';
  
  uploader2.type = 'file';
  uploader2.name = 'filex2';
  uploader2.accept = 'image/*';
  uploader2.style = 'display: none;';
  if(image!=null){
  image.onclick = function() {
    uploader.click();
  }
  }
  
  $('#upload_imagen').append(uploader);
  
  if(imageport!=null){
      imageport.onclick = function() {
          act=1;
          console.log(act);
          editarportada_c=$('#portada').css('background-image');
        uploader.click();
    }
    
  }

  $('#editarportada').append(uploader);
  
    if(imageper!=null){
      imageper.onclick = function() {
        act=2;
          console.log(act);
          editarimagenperfil_c=$('#perfil').css('background-image');
        uploader2.click();
        
    }
  }
  $('#editarimagenperfil').append(uploader2);
  
  var changeImage = function (img,width,result) {
    if (img.width > width) {
              var oc = document.createElement('canvas'), octx = oc.getContext('2d');
              oc.width = img.width;
              oc.height = img.height;
              octx.drawImage(img, 0, 0);
              while (oc.width * 0.5 > width) {
                oc.width *= 0.5;
                oc.height *= 0.5;
                octx.drawImage(oc, 0, 0, oc.width, oc.height);
              }
              oc.width = width;
              oc.height = oc.width * img.height / img.width;
              octx.drawImage(img, 0, 0, oc.width, oc.height);
              var dataurl = oc.toDataURL("image/jpeg");
              document.getElementById(result).src = dataurl;
                fetch(dataurl)
                .then(res => res.blob())
                .then(function (blob) {
                    console.log(blob);
                    files.push(blob);
                }
                )
            } else {
              document.getElementById(result).src = img.src;
              fetch(img.src)
                .then(res => res.blob())
                .then(function (blob) {
                    console.log(blob);
                    files.push(blob);
                }
                )
            }
            
            //var dataurl = oc.toBlob(blobCallback("img"), "image/jpeg", 0.7);
            //return dataurl;
}
  
   var changeimg =function() {
    var reader = new FileReader();
    reader.onload = function(evt) {
        console.log(evt.target);
        var imgsrc='';
        if(image){
            imgsrc='image';
      image.classList.remove('no-image');
      image.style.backgroundImage = 'url(' + evt.target.result + ')';
        }else if(act==1){
             imgsrc='portada';
             //imageport.classList.remove('no-image');
      document.getElementById('portada').style.backgroundImage = 'url(' + evt.target.result + ')';
      act=0;
        }else{
            imgsrc='perfil';
      document.getElementById('perfil').style.backgroundImage = 'url(' + evt.target.result + ')';
      act=0;
        }

      var img = new Image();
      img.onload = function () {
        changeImage(img,1000,imgsrc);  
      }
      img.src=evt.target.result;
      
      
  //$('#upload_imagen').append(img);
    }
    if(uploader.files[0]!=null){
        reader.readAsDataURL(uploader.files[0]);
    }else{
        reader.readAsDataURL(uploader2.files[0]);
    }
    $('#editarportada').hide();
    $('#editarportada_g').show();
    $('#editarportada_c').show();
  }
   var changeimg2 =function() {
    var reader = new FileReader();
    reader.onload = function(evt) {
        console.log(evt.target);
        var imgsrc='';
        if(image){
            imgsrc='image';
      image.classList.remove('no-image');
      image.style.backgroundImage = 'url(' + evt.target.result + ')';
        }else{
            imgsrc='perfil';
      document.getElementById('perfil').style.backgroundImage = 'url(' + evt.target.result + ')';
      act=0;
        }

      var img = new Image();
      img.onload = function () {
        changeImage(img,150,imgsrc);  
      }
      img.src=evt.target.result;
      
      
  //$('#upload_imagen').append(img);
    }
        reader.readAsDataURL(uploader2.files[0]);
    
    $('#editarimagenperfil').hide();
    $('#editarimagenperfil_g').show();
    $('#editarimagenperfil_c').show();
    
  }
  
  uploader2.onchange = changeimg2;
  uploader.onchange = changeimg;
  
  
 
})();


function blobCallback(iconName) {
  return function(b) {
    var a = document.createElement("a");
    a.textContent = "Download";
    document.body.appendChild(a);
    a.style.display = "block";
    a.download = iconName + ".ico";
    a.href = window.URL.createObjectURL(b);
  }
}


/*menu*//*
$(".opcionbtn").click(function () {
    $(this).find(".opcion").toggle("slow");
});*/


/*imge resize*//*
$(document).ready(function(){
    var input = document.getElementsByName('file')[0];
    input.onclick = function () {
        this.value = null;
    };
    input.onchange = function() {
            resizeImageToSpecificWidth(150,this);
    };

    function resizeImageToSpecificWidth(width,imgthis) {
      if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function(event) {
          var img = new Image();
          img.onload = function() {
            if (img.width > width) {
              var oc = document.createElement('canvas'), octx = oc.getContext('2d');
              oc.width = img.width;
              oc.height = img.height;
              octx.drawImage(img, 0, 0);
              while (oc.width * 0.5 > width) {
                oc.width *= 0.5;
                oc.height *= 0.5;
                octx.drawImage(oc, 0, 0, oc.width, oc.height);
              }
              oc.width = width;
              oc.height = oc.width * img.height / img.width;
              octx.drawImage(img, 0, 0, oc.width, oc.height);
             // document.getElementById('great-image').src = oc.toDataURL();
            } else {
              //document.getElementById('small-image').src = img.src;
            }
            var dataurl = oc.toDataURL("image/jpeg");
         //   imgthis.value=img;
          console.log(dataurl);
          };
          //document.getElementById('original-image').src = event.target.result;
          img.src = event.target.result;

        };
        reader.readAsDataURL(input.files[0]);

      }
    }

});*/
    
var veronline= function () {
    //$( '#vero' ).remove();
    //var css = '<style id="vero">.user::before{display: none !important;}</style>';
      //  document.head.insertAdjacentHTML( 'beforeEnd', css );
      $.each($('.user'), function( i, l ){
          if(localStorage.online)
          if(localStorage.online.indexOf($(this).attr('data-name'))<0){
              $(this).addClass('vero')};
      });
}    
    
    
    
    	var recognition;
	var recognizing = false;
	if (!('webkitSpeechRecognition' in window)||(
                //location.host.indexOf('localhost')<0
                location.protocol === 'http:'&&location.host.indexOf('localhost')<0)
               //||(location.protocol === 'http:')
               ) {
		console.log("¡API no soportada!");
                document.getElementById("procesar").style.display='none';
	} else {

		recognition = new webkitSpeechRecognition();
		recognition.lang = "es-VE";
		recognition.continuous = true;
		recognition.interimResults = true;

		recognition.onstart = function() {
			recognizing = true;
			console.log("empezando a eschucar");
		}
		recognition.onresult = function(event) {

		 for (var i = event.resultIndex; i < event.results.length; i++) {
			if(event.results[i].isFinal)
				document.getElementById("title").value += event.results[i][0].transcript;
		    }
			
			//texto
		}
		recognition.onerror = function(event) {
		}
		recognition.onend = function() {
			recognizing = false;
			document.getElementById("procesar").innerHTML = "Escribir con voz";
			console.log("terminó de eschucar, llegó a su fin");

		}

	}

	function procesar() {

		if (recognizing == false) {
			recognition.start();
			recognizing = true;
			document.getElementById("procesar").innerHTML = "Escuchando... puede hablar al microfono: Detener";
                        document.getElementById("procesar").style.backgroundColor="red"
                        
		} else {
			recognition.stop();
			recognizing = false;
			document.getElementById("procesar").innerHTML = "Escribir con voz";
                        document.getElementById("procesar").style.backgroundColor="white";
                        document.getElementById("procesar").style.color="black"
		}
	}