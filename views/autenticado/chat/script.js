


$.ajax({
  url: "/seguidor/"+$("#chat").data("userid")+"/5",
  beforeSend: function( xhr ) {
    xhr.overrideMimeType( "text/plain; charset=x-user-defined" );
  }
})
  .done(function( data ) {
    if ( console && console.log ) {
      console.log( "Sample of data:", data.slice( 0, 100 ) );
      socket.emit('siguiendo', data);
      //localstorage
    }
  });
var cargarreacciones= function () {
       $('.img-contenedor').each(function( index ) {
        var este =this;
        if($(este).hasClass( "ra" )){
           return;
       }else{
           $(este).addClass( "ra" );
       }
      $.ajax({
  url: "/api/reaccion/list",
   type: 'POST',
   data:{ id_youtube_feed:$(this).data("idyt"),
            id_facebook_feed: $(this).data("idfb"),
            id_imagen: $(this).data("id")}
})
  .done(function( data ) {
    if ( console && console.log ) {
      console.log( "dddddddd:", data );
      for(var i in data){
          $(este).find('.numeros').attr('data-tipo'+data[i].tipo,data[i].numero);
          if(data[i].user>0&&data[i].tipo==0){//megusta
            $(este).find('.like').css('background-color','#e8e871');//data[i]
          }
      }
    }
  });
  
}); 
}
var cargarcomentarios= function () {
    cargarreacciones();
       $('.img-contenedor').each(function( index ) {
        var este =this;
        if($(este).hasClass( "cm" )){
           return;
       }else{
           $(este).addClass( "cm" );
       }
      $.ajax({
  url: "/api/comentario/list",
   type: 'POST',
   data:{ id_youtube_feed:$(this).data("idyt"),
            id_facebook_feed: $(this).data("idfb"),
            id_imagen: $(this).data("id")}
})
  .done(function( data ) {
    if ( console && console.log ) {
      console.log( "dddddddd:", data );
      for(var i in data){
          var hace= verhace(data[i].time);
          var user ="<div id=\"perfilmini\" style=\"background-image:url('http://localhost:3000/archivos/imagenes/"+data[i].id_imagen_perfil+".jpg');\"><div class=\"left\" style=\"background-image:url('https://icon-icons.com/icons2/860/PNG/512/happy_icon-icons.com_67810.png');\"></div></div>";
          $(este).find('.listacomentarios').append( '<div id="comentarioitem">'+user+'<b>'+data[i].nombre_usuario+'</b> '+data[i].contenido_comentario+' '+hace+'</div>' );//data[i]
      }
    }
  });
  
}); 
}
  cargarcomentarios();
  var verhace= function (time) {
   var tiempo1 = new Date();
            var tiempo2 = new Date(time);
            var dif = tiempo1.getTime() - tiempo2.getTime()
            var Segundos_de_T1_a_T2 = dif / 1000;
            var Segundos_entre_fechas = Math.abs(Segundos_de_T1_a_T2);
            var hace='';
            console.log(Segundos_entre_fechas);
            if(Segundos_entre_fechas<60)
                {hace='hace '+Math.round(Segundos_entre_fechas)+' segundos';}
            else if(Segundos_entre_fechas<3600)
                {hace='hace '+Math.round(Segundos_entre_fechas/60)+' minutos';}
            else if(Segundos_entre_fechas<3600*24)
                {hace='hace '+Math.round(Segundos_entre_fechas/3600)+' horas';}
            else if(Segundos_entre_fechas<((3600*24)*7))
                {hace='hace '+Math.round(Segundos_entre_fechas/(3600*24))+' dias'; }
            else if(Segundos_entre_fechas<((3600*24)*(7*4)))
                {hace='hace '+Math.round(Segundos_entre_fechas/((3600*24)*7))+' semanas'; }
            else if(Segundos_entre_fechas<((3600*24)*((7*4)*12)))
                {hace='hace '+Math.round(Segundos_entre_fechas/(3600*24))+' meses'; }
            else{
                hace='hace '+Math.round(Segundos_entre_fechas/3600*24)+' años';
            }
            return hace;
}

$('#cse-search-input-box-id').keypress(
        
    function(e){
        var este = this;
        var s=e;
        $.ajax({
  url: "/api/usuario/list",
   type: 'POST',
   data:{ nombre_usuario: e.target.value}
})
  .done(function( data ) {
      console.log(data);
          $('#sugerencias').remove();
        var res="";
        for(var i=0;i<data.length;i++){
            res+="<li><a href=\"/"+data[i].nombre_usuario+"\">"+data[i].nombre_usuario+"</a><li>";
        }
        
        $(este).parent().append("<div id=\"sugerencias\"><ul>"+res+"</ul></div>");
        $('#sugerencias').css("height",$('#sugerencias').find('li').length*25+'px');
 
  });
  
     })
     
     setInterval( sugerencias, 30000);
var sugerencias=function(){
        var este = this;
        $.ajax({
  url: "/api/usuario/rand5",
   type: 'POST',
   data:{ }
})
  .done(function( data ) {
      console.log(data);
      var html="";
      var i=0;
      while(true){
          if(data[i]){
          html=html+"<a href=\"/"+data[i].nombre_usuario+"\"><div id=\"cara\"><div id=\"id\" class=\"useronline_"+data[i].id_usuario+" userx\"  data-name=\""+data[i].nombre_usuario+"\"  style=\"background-image:url('/archivos/imagenes/"+data[i].id_imagen_perfil+".jpg')\"></div></div></a>";
        }
      if(i>=data.length){
              break;
          }
          i++;
      }
      $('#sugerencia').html(
            html  
              );
 
  });
  }
        
    sugerencias();
   
     
     $('#editarportada').click(function () {
            
        });
     $('#editarimagenperfil').click(function () {
            
        });   