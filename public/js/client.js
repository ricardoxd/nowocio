var socket = io();

socket.on("new imagen",function (data) {
    console.log(data);
    data = JSON.parse(data);
    newimagen(data);
});
function newimagen(data) {
    var contenedor = document.querySelector("#imagenes");
    var source = document.querySelector("#imagen-template").innerHTML;
    var templante = Handlebars.compile(source);
    var result =templante(data);
    console.log(result);
    first = parseInt(localStorage.getItem("homePaginar"));
    localStorage.setItem("homePaginar",first+1);
    contenedor.innerHTML=result+contenedor.innerHTML;
    comentarios();
}
function scrollimagen(data) {
    console.log('dfdf');
    console.log(data);
    var contenedor = document.querySelector("#imagenes");
    var source = document.querySelector("#imagenes-template").innerHTML;
    var templante = Handlebars.compile(source);
    data.dataimg=$('.opcionbtn').attr('data-img');
    data.dataidp=$('.opcionbtn').attr('data-idp');
    var result =templante(data);
    console.log(result);
    $(contenedor).append(result);
    comentarios();
    cargarcomentarios();
    if(viendo){
          $('.img-contenedor').hide();
          $('.img-contenedor'+'.'+viendo).show();
      }else{
          $('.img-contenedor').show();
      }
    
}
var flag = true,first=0,limit=0,no_data=true;
localStorage.setItem("homePaginar",2);
$(window).scroll(function() {
    if($(window).scrollTop() + $(window).height() > $(document).height()-150){
        console.log("cargando");
        //first = $('#first').val();
        first = localStorage.getItem("homePaginar");
        limit = $('#limit').val();
        no_data = true;
        if(flag && no_data){
            flag = false;
            $.ajax({
                    url : '/imagen/paginar',
                    dataType: "json",
                    method: 'post',
                    data: {
                       start : first,
                       limit : limit,
                       pagina :window.location.pathname
                    },
                    success: function( data )  {
                        if(data.length>0){
                            //first = parseInt($('#first').val());
                            first = parseInt(localStorage.getItem("homePaginar"));
                            limit = parseInt($('#limit').val());
                            //$('#first').val(first+limit);
                            localStorage.setItem("homePaginar",first+limit);
                            
                            $.each(data, function(i, item) {
                                var d = new Date(item.time);

                                item.time = d.getDate()  + "-" + (d.getMonth()+1) + "-" + d.getFullYear() + " " +d.getHours() + ":" + d.getMinutes();
                                console.log(item);
                                console.log(i);
                                scrollimagen(item)
                            });
                            
                            
                            
                            
                        }
                        flag = true;
                        
                        
                    },
                    error: function( data ){
                            flag = true;
                            //$('#loader').hide();
                            no_data = false;
                            //alert('Something went wrong, Please contact admin');
                    }
            });
        }
    }
});

