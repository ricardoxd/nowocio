function cargarChat(id,tipo) {
        var chat="";
        var datai=id.split("_");
        console.log(datai);
        id = datai[0];
        var name =datai[1];
        var idp =datai[2];
               if($('.user_'+id).length<1){
                  chat = "";
                   if(localStorage.getItem('open_chat')!=null){
                       chat = localStorage.getItem('open_chat');
                   }
                   chat = chat.split(',');
                   var ancho =chat.length;
                   if($.inArray( id+'_'+name, chat )<0){
                       chat.push(id+'_'+name+'_'+idp);
                       localStorage.setItem('open_chat',chat.join(','));
                   }else{
                       if(tipo==null){
                           return false;
                       }
                       ancho--;
                   }
                   
                   
                   var c=$('.msg_box_original').clone();
                   c.removeClass( "msg_box_original" );
                   c.addClass('msg_box user_'+id);
                   c.attr('data-id', id);
                   c.attr('data-name', name.slice(0, 20));
                   c.attr('data-idp', idp);
                   if(tipo!=null){
                       ancho=tipo;
                   }
                   var limite=Math.round((window.screen.width/225)-1);
                   if(ancho>limite){
                     ancho=ancho/limite;
                   }
                   /*if((225*parseInt(ancho)+225)>window.screen.width){
                       ancho=ancho-limite;
                   }*/
                   c.css('right',parseInt(ancho) *225+'px');
                   //$('.msg_head')[0].innerHTML=$(this).attr('class')+"<div class='close'>X</div>";
                   $("#chat").append(c);
                   //$("#"+id).attr("data-name",$("#"+id).attr("data-name").slice(0, 19))
                    c.show();
                    c.show();
                    c.children('.msg_head').click(function(){
                        var d= $(this).parent().data( "id" );
                        var open=localStorage.getItem("chat_close_"+d)||false;
                        if(open=="true")open=false;
                        else if(open=="false")open=true;
                        localStorage.setItem("chat_close_"+d,open);
                        $('.user_'+d+' .msg_wrap').slideToggle('slow');
                    });
                    if(localStorage.getItem("chat_close_"+id)==null){
                        localStorage.setItem("chat_close_"+id,false)
                    }
                     var open=localStorage.getItem("chat_close_"+id);
                     if(open=="true"){
                          $('.user_'+id+' .msg_wrap').hide();
                     }
                    //console.log(c.find('.close'));
                    setTituloMsg(id+'_'+name+'_'+idp,'[1]'+name);
                    msg_input(c.find('.msg_input'));
                    
                    /*/mensaje/api/13*/
                    $.ajax({
                    url : '/mensaje/api/'+id,
                    dataType: "json",
                    method: 'post',
                    data: {
                       start : first,
                       limit : limit
                    },
                    success: function( data )  {
                        var datale =data.length;
                        for(var i=0;i<datale;i++){
                            var msg = data[i];
                            var send = "a";
                            if(msg.mensaje.a==id){
                                send = 'b';
                            }
                            
                           var msg_push=$('.user_'+id).find('.msg_push');
                           $('<div class="msg_'+send+'">'+msg.mensaje.texto+'</div>').insertBefore(msg_push); 
                        }
                        var msg_body=$('.user_'+id).find('.msg_body');
                        $(msg_body).scrollTop($(msg_body)[0].scrollHeight);
                        
                    },
                            error: function( data ){
                            }
                    });
                    return true;
               }
    }
    
    function setTituloMsg(userid,titulo) {
        userid =userid.split("_");
        var name=userid[1];
        var idp=userid[2]||0;
        userid=userid[0];
        var id=userid;
        var html ='<div id="'+id+'" class=" user" data-id="'+id+'" data-name="'+name.slice(0, 20)+'" idp="'+idp+'" style="background-image:url('+"'"+'/archivos/imagenes/'+idp+'.jpg'+"'"+')"></div>'; 
        $('.user_'+userid).find('.msg_head').html(html+'</div><div class="close">X</div>');
        $('.user_'+userid).find('.close').click(function(){
                        var d= userid,e=name;
                        $('.user_'+d).remove();
                        var chate = localStorage.getItem('open_chat');
                        
                        localStorage.setItem('open_chat',chate.replace(","+d+"_"+e+"_"+idp,""));
                    });
    }
    
    $(document).ready(function(){
    var messages = [];
    var field = document.getElementById("field");
    var sendButton = document.getElementById("send");
    var content = document.getElementById("content");
    
    socket.on('message', function (data) {
        console.log("llego message");
        console.log(data);
        if(data.message) {
            
            messages.push(data.message);
            /*var html = '';
            for(var i=0; i<messages.length; i++) {
                html += messages[i] + '<br />';
            }
            content.innerHTML = html;*/
            
            
            
            
            
            
            
            var id = data.user.split("_")[0];
            var chatLoad=cargarChat(data.user);
            veronline();
            var msg = data.message;
			if(msg!=''){
                            if(!chatLoad){
                                var msg_push=$('.user_'+id).find('.msg_push');
                                $('<div class="msg_a">'+msg+'</div>').insertBefore(msg_push);
                            //$('.msg_body').scrollTop($('.msg_body')[0].scrollHeight);
                            //setTituloMsg(id+'_'+name,'[1]'+data.user.split("_")[1]);
                            }
                            
                            var msg_body=$('.user_'+id).find('.msg_body');
                            $(msg_body).scrollTop($(msg_body)[0].scrollHeight);
                            
                        }
            
        } else {
            console.log("There is a problem:", data);
        }
    });
    
    socket.on('conected',function (id) {
        var online="";
        var datai= id.split("_");
        var idx = datai[0];
        var name = datai[1];
        var idp = datai[2];
        var cl='.useronline_'+idx;
        if($(cl).length<1){
           

            if(localStorage.getItem('online')!=null){
                    online = localStorage.getItem('online'); 
                }
                online = online.split(',');
                       var anchoo =online.length;
                       if($.inArray( id.toString(), online )<0){
                           online.push(id);
                           localStorage.setItem('online',online.join(','));
                           veronline();
                       }else{
                           return;
                       }

               var lista='<div id="'+idx+'" class="useronline_'+idx+' user" data-id="'+idx+'" data-name="'+name+'" data-idp="'+idp+'" style="background-image:url('+"'"+'/archivos/imagenes/'+idp+'.jpg'+"'"+')"></div>'; 
               $('.chat_body').append(lista);


               //console.log($(cl));    



               $(cl).click(function(){
                   //console.log(this);
                   var id=$(this).attr('data-id');
                   var name=$(this).attr('data-name');
                   var idp=$(this).attr('data-idp');
                   if($('.user_'+id).length<1){
                      cargarChat(id+'_'+name+'_'+idp);
                   }

            });
            veronline();
        }else{
            $(cl).show();
        }    
    });
    
    
    socket.on('o', function (data) {
        console.log("llego"+data);
        var lista ="";
        $('.chat_body')[0].innerHTML="";
        
        
        
           
           var chat="";
           if(localStorage.getItem('open_chat')!=null){
                chat = localStorage.getItem('open_chat');
                chat = chat.split(',');  
                var chatl = chat.length;
                for(var i=1;i<chatl;i++){
                    
                  cargarChat(chat[i],i);
                    
                } 
                veronline();
           }
        
        
        var datal=data.length;
        for (var item=0;item<datal;item++) {
           
           var datai = data[item].split("_");     
           var id = datai[1];
           var name = datai[2];
           var idperfil = datai[3];
           lista+='<div id="'+id+'" class="useronline_'+id+' user" data-id="'+id+'" data-name="'+name+'" data-idp="'+idperfil+'" style="background-image:url('+"'"+'http://localhost:3001/archivos/imagenes/'+idperfil+'.jpg'+"'"+')"></div>'; 
           if(item==datal-1){
               $('.chat_body').append(lista);
           }
            
           
           var cl='.useronline_'+id;
           console.log($(cl));    
           
           
           
          /* $(cl).click(function(){
               console.log(this);
               var id=$(this).attr('data-id');
               var name=$(this).attr('data-name');
               if($('.user_'+id).length<1){
                  
                   
                   
                    cargarChat(id+'_'+name);
                    veronline();
               }
               
	});*/
        }
        $(' .user').click(function(){var id=$(this).attr('data-id');var name=$(this).attr('data-name');var idp=$(this).attr('data-idp');
            cargarChat(id+'_'+name+'_'+idp);veronline();});
       
      // veronline();
       //$('.user').click(function(){var id=$(this).attr('data-id');var name=$(this).attr('data-name');cargarChat(id+'_'+name);veronline();});
    });
    socket.on('desconectado', function (user) {
        console.log(user+"disno");
        var chate = localStorage.getItem('online');
        localStorage.setItem('online',chate.replace(","+user,""));
       $('.useronline_'+user.split("_")[0]).hide();
       veronline();
    });

	$('.chat_head').click(function(){
		$('.chat_body').slideToggle('slow');
	});
	$('.msg_head').click(function(){
		$('.msg_wrap').slideToggle('slow');
	});
	
	$('.close').click(function(){
		$('.msg_box').hide();
	});
	///users online
	$('.user').click(function(){

		$('.msg_wrap').show();
		$('.msg_box').show();
               // var c=$('.msg_box').clone();
               // c.addClass('user49');
                //$("#chat").append(c);
                
	});

	
	
});

var msg_input= function (thisx) {
        $(thisx).keypress(
    function(e){
        if (e.keyCode == 13) {
            e.preventDefault();
            var msg = $(this).val();
			$(this).val('');
			if(msg!=''){
                            var msg_push=$(this).parent().find('.msg_push');
                            $('<div class="msg_b">'+msg+'</div>').insertBefore(msg_push);
                            var target = $(this).parent().parent();
                            console.log({ texto: msg,a:$(target).attr('data-id')+'_'+$(target).attr('data-name') });
                            var idp=0;
                            if("undefined"!=$(target).attr('data-idp')){
                                idp=$(target).attr('data-idp');
                            }
                            socket.emit('send', { texto: msg,a:$(target).attr('data-id')+'_'+$(target).attr('data-name')+'_'+idp });
                            var msg_body=$(this).parent().find('.msg_body');
                            $(msg_body).scrollTop($(msg_body)[0].scrollHeight);
                        }
                        
        }
    });
    };