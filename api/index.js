var express = require('express');
var app = express();

var MongoClient = require('mongodb').MongoClient;

var places;

MongoClient.connect('mongodb://felipefontana.com.br:27017/hotzii', function (err, database) {

    if (err) {
        throw err;
    }

    places = database.collection('places');
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.get('/', function (req, res) {

    var message = `<p>Obter todos os bairros: <a href="/bairros/">/bairros/</a></p>` +
                  `<p>Obter rank dos bairros: <a href="/bairros/rank">/bairros/rank</a></p>` +
                  `<p>Obter bairros agrupados: <a href="/bairros/agrupados">/bairros/agrupados</a></p>` +
                  `<p>Obter bairros específicos: <a href="/bairros/pedra 90 i,cpa 3">/bairros/pedra 90 i,cpa 3</a></p>`;
    
    res.send(message);
});

app.get('/bairros/rank', function (req, res) {

    console.log('obtendo rank de bairros.');

    var result = places.aggregate([{ $group: { "_id": "$NM_BAIRRO", 'count': { $sum: 1 } } }, { $sort: { 'count': -1, '_id': 1 } }]);
    
    result.toArray(function (err, r) {
        return res.json(r);
    });    
});

app.get('/bairros/agrupados', function (req, res) {

    console.log('obtendo bairros agrupados por nome.');

    var result = places.aggregate([{ $group: { "_id": "$NM_BAIRRO", 'count': { $sum: 1 } } }, { $sort: { '_id': 1 } }]);
    
    result.toArray(function (err, r) {
        return res.json(r);
    });    
});

app.get('/bairros/:bairros?', function (req, res) {

    console.log('obtendo bairros.');

    var select = req.params.bairros || '' ;

    console.log(req.params);

    var where = {};

    if (select != '') {
        var bairros = select.toUpperCase().split(',');

        where = { 'NM_BAIRRO': { $in: bairros } };
    }

    var result = places.find(where, { 'RESULT': 0 });
    
    result.toArray(function (err, r) {
        
        return res.json(r);
    });
});



app.listen(8080, function () {
    console.log('Example app listening on port 8080!');
});
