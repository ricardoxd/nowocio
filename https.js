//var ctx = $("#latencyChart").get(0).getContext("2d");

//var socket = io.connect(document.location.host, {'transports': ['websocket', 'polling']});
var socket = io.connect('wss://nowocio.mircloud.us:11097', {'transports': ['websocket', 'polling']});
//var socket = io.connect('https://www.nowocio.com');
var end1=0,end2=0,start1=0,start2=0;
var ends=0;
var interval = 1;
var pingCount = 2000;
var wsPings = [];
var httpPings = [];

socket.on('connect', function() {

    //Listen pong message
    socket.on('pong', function (idx) {
        wsPings[idx.id].stop = new Date().getTime();
      if(idx.id==1000){
                        end2 = new Date().getTime();
        console.log(end2-start2+":socket");
                      }
    });


});

var displayResults = function(wsPings, httpPings){

    var wsLatencies = wsPings.map(function(data){
        return data.stop - data.start;
    });

    var httpLatencies = httpPings.map(function(data){
        return data.stop - data.start;
    });

    var wsMin = wsLatencies.reduce(function(a, b) { return Math.min(a,b); });
    var wsMax = wsLatencies.reduce(function(a, b) { return Math.max(a,b); });
    var wsSum = wsLatencies.reduce(function(a, b) { return a + b; });
    var wsAvg = wsSum / wsLatencies.length;

    var httpMin = httpLatencies.reduce(function(a, b) { return Math.min(a,b); });
    var httpMax = httpLatencies.reduce(function(a, b) { return Math.max(a,b); });
    var httpSum = httpLatencies.reduce(function(a, b) { return a + b; });
    var httpAvg = httpSum / httpLatencies.length;

    console.log('wsMin : ' + wsMin);
    console.log('wsMax : ' + wsMax);
    console.log('wsAvg : ' + wsAvg);

    console.log('httpMin : ' + httpMin);
    console.log('httpMax : ' + httpMax);
    console.log('httpAvg : ' + httpAvg);

    $('#minLatency')[0].innerHTML = 'Min : ' + wsMin + '/' + httpMin;
    $('#maxLatency')[0].innerHTML = 'Max : ' + wsMax + '/' + httpMax;
    $('#avgLatency')[0].innerHTML = 'Average : ' + wsAvg + '/' + httpAvg;

    var i = 1;
    var latenciesData = wsLatencies.map(function(data){
        result = [i, data, httpLatencies[i -1]];
        i++;
        return result;
    });

    g2 = new Dygraph(document.getElementById("graph"),
        latenciesData,
        {
            labels: [ "x", "Websocket latency", "Http latency" ]
        });

};

var runTest = function () {

    $('.btn').prop('disabled', true);
    $('#graph').addClass('hide');
    $("#knob").removeClass('hide');

    wsPings = [];
    httpPings = [];
    var i = 0;

    //Send ping message every 100ms
    var pingInterval = setInterval(function () {

        if (i > pingCount) {
            clearInterval(pingInterval);

            //Wait 1 seconde to get the latest ws response
            setTimeout(function() {
                $('#knob').addClass('hide');
                $('.dial')
                    .val(0)
                    .trigger('change');

                $('#graph').removeClass('hide');

                displayResults(wsPings, httpPings);

                $('.btn').prop('disabled', false);

            },1000);

        }else {

            //Update the progress bar
            var progress = i * 100 / pingCount;
            $('.dial')
                .val(progress)
                .trigger('change');

                if(i>999){
                  if(i==1000){
                    start2 = new Date().getTime();
                  }
                    //Send ping
                    wsPings[i-1000] = {};
                    wsPings[i-1000].start = new Date().getTime();
                    socket.emit('ping', {id:i-1000,header:""});
                  
                }else{
                  if(i==0){
                    start1 = new Date().getTime();
                  }
                    
                    httpPings[i] = {};
                    httpPings[i].start = new Date().getTime();
                    $.get('/ping', { 'index' : i }, function(data){
                      ends++;
                      httpPings[data.index].stop = new Date().getTime();
                      if(ends==999){
                        end1 = new Date().getTime();
                        console.log(end1-start1);
                      }
                    })
                }
            i++;
        }
    }, interval);

}






