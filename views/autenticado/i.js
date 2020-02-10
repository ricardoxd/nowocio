{{#ifEquals line "i"}}
<div class="img-contenedor nowocio" data-idyt="" data-idfb="" data-id="{{id}}">
        {{/ifEquals}}
{{#ifEquals line "fb"}}
<div class="img-contenedor facebook" data-idyt="" data-idfb="{{id}}" data-id="">
        {{/ifEquals}}
{{#ifEquals line "yt"}}
<div class="img-contenedor youtube" data-idyt="{{id}}" data-idfb="" data-id="">
        {{/ifEquals}} 
            
<a href="/{{nombre_usuario}}">
<div id="perfilmini" style="background-image:url('http://localhost:3001/archivos/imagenes/{{id_imagen_perfil}}.jpg');">
    <div class="left" style="background-image:url('https://icon-icons.com/icons2/860/PNG/512/happy_icon-icons.com_67810.png');">

    </div>
    {{#ifNotEquals yti null}}
<div class="right" style="background-image:url('/archivos/imagenes/logo/yt.png');"></div>
        {{/ifNotEquals}} 
            {{#ifNotEquals fbi null}}
<div class="right" style="background-image:url('/archivos/imagenes/logo/fb.png');"></div>
        {{/ifNotEquals}} 
    <div class="nombre">{{nombre_usuario}}</div>

</div></a>
<div id="fecha">
                         {{time}}
            </div>
<div class="editaritem"> :::
                        <ul class="opcioned">
                        {{#ifEquals id_usuario dataidp}}
                        {{#ifEquals line "i"}}
                            <li>
                                    <div class="editario">
                                    <a href="/imagen/{{id}}/editar"> Editar</a>
                                    </div>
                                        </li>
                            
        {{/ifEquals}}
                     <li>
                                    <div class="eliminario">
                                    Eliminar
                                    </div>
                                        </li>
                            <li>
            {{/ifEquals}}
                    
            {{#ifNotEquals id_usuario dataidp}}
                    
                                    <div class="reportario">
                                     Reportar
                                    </div>
                                        </li>
        {{/ifNotEquals}}
            </ul></div>                  
            
            
<h4>
{{#ifEquals line "i"}}
{{contenido}}{{titulo}}
        {{/ifEquals}}
{{#ifEquals line "fb"}}
{{contenido}}{{titulo}}
        {{/ifEquals}}
{{#ifEquals line "yt"}}
{{contenido}}{{titulo}}
        {{/ifEquals}} 


</h4>
<a href="/imagen/{{id}}">
    <img src="/archivos/imagenes/{{id}}.jpg">
</a>            
            
<div id="megusta">
    <div class="like">Me gusta</div>
    <div class="numeros"><img src="/archivos/imagenes/like.svg"></div>
</div>

    <div id="comentario">
    <div class="listacomentarios">
        </div>
        
    <div id="perfilmini" style="background-image:url('{{dataimg}}');">
        <div class="left" style="background-image:url('https://icon-icons.com/icons2/860/PNG/512/happy_icon-icons.com_67810.png');"></div>
        
   
       
        
    
    </div>
    <div class="contenido"><input type="text" placeholder="Escribe un comentario aqui..."></div>

    </div>
</div>