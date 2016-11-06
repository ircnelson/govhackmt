var fs = require('fs');
var request = require('sync-request');

const GOOGLE_API_KEY = 'AIzaSyDJANTKRX1FwDk736OMe3-z6JFIJ9Yp0hw';

var list;
var GOOGLE_API = (address) => `https://maps.google.com/maps/api/geocode/json?key=${GOOGLE_API_KEY}&address=${encodeURI(address)}`;

var sleep = () => console.log('zzzzz');

fs.readFile('dados.json', 'utf8', function(err, data) {
    if (err) throw err;

    list = JSON.parse(data);
	
	//list = list.slice(0, 1);

	for (var i in list) {

		var item = list[i];
		var address = `${item["NM_BAIRRO"]}, ${item["NM_LOGRADO"]}, ${item["NU_NUMERO"]}, Cuiabá, MT`;

		var rawData = '';

		var uri = GOOGLE_API(address);
		console.log(uri);

		var response = request('GET', uri);

		if (response) {
			var data = JSON.parse(response.getBody());

			var firstResult = data.results[0];

			if (!firstResult) { console.log("empty result.\n item: " + i); }

			else if (!firstResult.geometry || !firstResult.geometry.location) { console.log("nao foi possivel obter a lat e lng"); }
			else {
				var latLng = firstResult.geometry.location;

				item["POINTS"] = latLng;
				item["RESULT"] = data.results || {};

				console.log("item:", i);
				fs.appendFileSync("dados_lat_long.json", JSON.stringify(item) + ",\n");				
				console.log("The file was saved!", i);
			}
		}
	}
});
