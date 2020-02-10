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
}
function scrollimagen(data) {
    var contenedor = document.querySelector("#imagenes");
    var source = document.querySelector("#imagenes-template").innerHTML;
    var templante = Handlebars.compile(source);
    var result =templante(data);
    console.log(result);
    contenedor.innerHTML+=result;
}
var flag = true,first=0,limit=0,no_data=true;
localStorage.setItem("homePaginar",2);
$(window).scroll(function() {
    if($(window).scrollTop() + $(window).height() == $(document).height()){
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
                       limit : limit
                    },
                    success: function( data )  {
                        if(data.length>0){
                            //first = parseInt($('#first').val());
                            first = parseInt(localStorage.getItem("homePaginar"));
                            limit = parseInt($('#limit').val());
                            //$('#first').val(first+limit);
                            localStorage.setItem("homePaginar",first+limit);
                            
                            $.each(data, function(i, item) {
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
/* scroll event */
/*
$(document).on("scrollstop", function (e) {
    console.log(e);
    
    var activePage = $.mobile.pageContainer.pagecontainer("getActivePage"),
        screenHeight = $.mobile.getScreenHeight(),
        contentHeight = $(".ui-content", activePage).outerHeight(),
        header = $(".ui-header", activePage).outerHeight() - 1,
        scrolled = $(window).scrollTop(),
        footer = $(".ui-footer", activePage).outerHeight() - 1,
        scrollEnd = contentHeight - screenHeight + header + footer;
    $(".ui-btn-left", activePage).text("Scrolled: " + scrolled);
    $(".ui-btn-right", activePage).text("ScrollEnd: " + scrollEnd);
    if (activePage[0].id == "home" && scrolled >= scrollEnd) {
        console.log("adding...");
        addMore(activePage);
    }
    
});*/
/*
$(document).bind("mobileinit", function(){
    console.log("mobilinit");
  $.mobile.ajaxEnabled = false;
});*/