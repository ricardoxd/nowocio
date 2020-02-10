(function() {
    var cx = '015102275056112357372:n7pz5_ycpvy';
    var gcse = document.createElement('script');
    gcse.type = 'text/javascript';
    gcse.async = true;
    gcse.src = (document.location.protocol == 'https:' ? 'https:' : 'http:') +
        '//cse.google.com/cse.js?cx=' + cx;
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(gcse, s);
    
  })();
  
  
  var enableAutoComplete = function() {
    google.search.CustomSearchControl.attachAutoCompletionWithOptions(
      '015102275056112357372:n7pz5_ycpvy',
      document.getElementById('cse-search-input-box-id'),
      'cse-search-box-form-id',
      // set to true to prevent the search box form from being submitted, since
      // the search control displaying the results is on the same page.
      {'preferOnSubmitToSubmit': true});
  };

  var myCallback = function() {
    // Search module is loaded.
    if (document.readyState == 'complete') {
      enableAutoComplete();
    } else {
      google.setOnLoadCallback(enableAutoComplete, true);
    }
  };

  window.__gcse = {
    callback: myCallback
  };
  
  
  
  
  // executeQuery() is only required if the control showing results is on the
  // same page as your searchbox.
  function executeQuery() {
    var input = document.getElementById('cse-search-input-box-id');
    var element = google.search.cse.element.getElement('results');
    if (input.value == '') {
      element.clearAllResults();
    } else {
      element.execute(input.value);
    }
    return false;
  }
  
  $('#cerrar_google').click(function () {
            cerrarGoogle();
        });
        $('#gbuscar').click(function () {
            mostrarGoogle();
        })
                $('#cse-search-input-box-id').keydown(function (e) {
            e.keyCode==13&&mostrarGoogle();
        });
    var mostrarGoogle = function () {
            if($('#cse-search-input-box-id').val()!=""){
                $('#___gcse_0').css('display','block');
                $('#cerrar_google').css('display','block');
            }
            cerrarBuscar();
        }
    var cerrarGoogle = function () {
            if($('#cerrar_google').css('display')=='block'){
                $('#___gcse_0').slideToggle('slow');
                $('#cerrar_google').css('display','none');
            }
            
        }
    var cerrarBuscar = function () {
            if($('#sugerencias ul').css('display')=='table-cell'){
                $('#sugerencias ul').slideToggle('slow');
                $('#sugerencias').css('display','none');
            }
            
        }  
    var mostrarBuscar = function () {
            if($('#sugerencias ul').css('display')=='none'){
                $('#sugerencias ul').slideToggle('slow');
                $('#sugerencias').css('display','table-cell');
            }
            
        }    
        
        $('body').click(function (e) {
            //console.log(e.target.id=='gbuscar');
            if(e.target.id=='gbuscar'){
                
            }else if($('#___gcse_0').find(e.target).length)
            {//click en google result
                
            }else if($('#sugerencias').find(e.target).length)
            {//click en google result
                mostrarBuscar();
            }else{
               cerrarGoogle();
               cerrarBuscar();
            }
        });
        
 
        