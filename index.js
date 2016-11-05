var fs = require('fs');
var request = require('request');

const GOOGLE_API_KEY = 'AIzaSyAvNHqD6-r7wB6_MCEdcOcyuH4JNosSjlM';

var list;
var GOOGLE_API = (address) => `https://maps.google.com/maps/api/geocode/json?key=${GOOGLE_API_KEY}&address=${encodeURI(address)}`;

fs.readFile('dados.json', 'utf8', function (err, data) {
	if (err) throw err;
	list = JSON.parse(data);

	list = list.slice(0, 10);

	for (var i in list) {

		let item = list[i];
		let address = `${item["NM_BAIRRO"]}, ${item["NM_LOGRADO"]}, ${item["NU_NUMERO"]}, Cuiabá, MT`;
		
		let rawData = '';
		
		var uri = GOOGLE_API(address);
		console.log(uri);

		request(uri, (error, res, body) => {
			if (error != null) {
				console.log('error', error);
			}

			var data = JSON.parse(body);
			
			item["POINTS"] = data.results[0].geometry.location;

			fs.writeFile("dados_lat_long.json", JSON.stringify(item) + ", ", function(err) {
				
				if (err) { return console.log(err); }

				console.log("The file was saved!");
			});
		});
	}
});