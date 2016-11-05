var fs = require('fs');
var request = require('request');

const GOOGLE_API_KEY = 'AIzaSyAvNHqD6-r7wB6_MCEdcOcyuH4JNosSjlM';

var list;
var GOOGLE_API = (address) => `https://maps.google.com/maps/api/geocode/json?key=${GOOGLE_API_KEY}&address=${encodeURI(address)}`;

fs.readFile('dados.json', 'utf8', function (err, data) {
	if (err) throw err;
	
	list = JSON.parse(data);

	for (var y = 1; y <= 6; y++) {	

		list = list.slice(0 , 500);

		for (var i in list) {

			var item = list[i];
			var address = `${item["NM_BAIRRO"]}, ${item["NM_LOGRADO"]}, ${item["NU_NUMERO"]}, Cuiabá, MT`;
			
			var rawData = '';
			
			var uri = GOOGLE_API(address);
			console.log(uri);

			request(uri, (error, res, body) => {
				if (error != null) {
					console.log('error', error);
				}

				var data = JSON.parse(body);

				var firstResult = data.results[0];

				if (firstResult == null) { console.log("empty result.\n item: " + i);  }

				else if (!firstResult.geometry || !firstResult.geometry.location) { console.log("nao foi possivel obter a lat e lng"); }
				else {
	 				var latLng = firstResult.geometry.location;

					item["POINTS"] = latLng;

					fs.appendFile("dados_lat_long.json", JSON.stringify(item) + ",\n", function(err) {
					
						if (err) { return console.log(err); }

						console.log("item:", i);
						console.log("The file was saved!");
					});
				}
			});
		}
	}	
});
