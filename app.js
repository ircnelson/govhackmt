
$(document).ready(function(){
    $('#table-reference').hide();
     $('#infos1tr').hide();
     $('#infos2tr').hide();
    var bairrosAgrupados =  'http://felipefontana.com.br:49160/bairros/agrupados';

    $.get(bairrosAgrupados, function(data) {
        var option = '';
        
        for (var i = 0; i < data.length; i++) {
            option += '<option value="'+ data[i]._id +'" data-count="' + data[i].count + '">' + data[i]._id + '</option>';
        }

        $('.selectBairros').append(option);
    });

    var bairrosRank =  'http://felipefontana.com.br:49160/bairros/rank';

    $.get(bairrosRank, function(data) {
        var top10 = '<table class="table table-striped table-bordered"><tr class="header"><td>Ordem</td><td>Nome</td><td>Ocorrências</td></tr>';

        for (var i = 0; i < 10; i++) {
            var y = i+1;
            top10 += '<tr><td>'+ y +'</td><td>'+ data[i]._id +'</td> <td><span style="color:red">'+ data[i].count +'</span></td></tr>';
        }
        
        top10 += '</table>';

        $('#top10').html(top10);
    });

    $('.selectBairros').on('change', function(){
        newPlot();
    });
});

var map, heatmap;

function initMap() {

    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: {lat: -15.587909, lng: -56.111856},
        mapTypeId: google.maps.MapTypeId.MAP
    });

    getPoints(function (data) {
        heatmap = new google.maps.visualization.HeatmapLayer({
            data: data,
            map: map,
            maxIntensity: 8,
        });
    });
}

function getPoints(cb) {
    var arrayPoints= [];

    var url = 'http://felipefontana.com.br:49160/bairros';

    $.get(url, function(data) {
        for (var i = 0; i < data.length; i++) {
            arrayPoints.push(new google.maps.LatLng(data[i].POINTS.lat, data[i].POINTS.lng));
        }

        cb(arrayPoints);
    });
}

function clearSelects()
{
    $('#selectBairros1').val('');

    $('#selectBairros2').val('');

    newPlot();
} 

function newPlot()
{
    var selectBairros1 = $('#selectBairros1');
    var selectBairros1Val = $('#selectBairros1').val();
    var selectBairros2 = $('#selectBairros2');
    var selectBairros2Val = $('#selectBairros2').val();

    if(selectBairros1Val && !selectBairros2Val){
        var bairrosDetail =  'http://felipefontana.com.br:49160/bairros/'+ selectBairros1.val();
    }
    else if(!selectBairros1Val && selectBairros2Val){
        var bairrosDetail =  'http://felipefontana.com.br:49160/bairros/'+ selectBairros2.val();
    }
    else if(selectBairros1Val == '' && selectBairros2Val == ''){
        var bairrosDetail =  'http://felipefontana.com.br:49160/bairros';
    }
    else {
        var bairrosDetail =  'http://felipefontana.com.br:49160/bairros/'+ selectBairros1.val() +','+ selectBairros2.val();
    }
        
    var arrayPoints= [];

    $.get(bairrosDetail, function(data) {
        for (var i = 0; i < data.length; i++) {
            arrayPoints.push(new google.maps.LatLng(data[i].POINTS.lat, data[i].POINTS.lng));
        }

        var self1 = selectBairros1.val();

        if(self1){
            $('#infos1Name').html(self1);
            $('#infos1').html(selectBairros1.find(':selected').data('count') || 0);
            $('#infos1tr').show();
            $('#table-reference').show();
        } else {
            $('#infos1tr').hide();
        }

        var self2 = selectBairros2.val();

        if(self2){
            $('#infos2Name').html(self2);
            $('#infos2').html(selectBairros2.find(':selected').data('count') || 0);
            $('#infos2tr').show();
            $('#table-reference').show();
        } else {
            $('#infos2tr').hide();
        }

        if(!self1 && !self2){
            $('#table-reference').hide();
        }

        $('#infostotal').html(data.length);

        heatmap.setMap(null);

        heatmap = new google.maps.visualization.HeatmapLayer({
            data: arrayPoints,
            map: map,
            maxIntensity: 8,
        });
    });
}
