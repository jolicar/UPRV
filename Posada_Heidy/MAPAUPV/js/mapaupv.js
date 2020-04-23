// Global variables...

var url = 'https://upvusig.car.upv.es/fiware';
var end = '/v2/entities';
var map = L.map("map");
var marker = null;
var locText = document.getElementById("locText");

var markerOptions = {
	radius: 4,
	color: "black",
	fillColor: '#fff',
	fillOpacity: 0.8
};
var dataJSON;
var pointLtd = null; // Latitud del punto de ubicación
var pointLng = null; // Longitud del punto de ubicación
var myArraymin = [];

var options = {
	enableHighAccuracy: true, // highest accuracy
	timeout: 6000             // milliseconds
};

// MAPA

async function onDeviceReady() {
	
	let promise = new Promise(function(resolve, reject) { 
		
	map.setView([39.481000,  -0.341000], 16);
		var tiles = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
		attribution: "&copy; <a href=\"http://osm.org/copyright\">OpenStreetMap</a> contributors"
	}).addTo(map);

    var xhr = new XMLHttpRequest()
	xhr.open("GET", url+end+"?limit=1000&type=Edificio", true);
	xhr.send();
	
	xhr.onreadystatechange = function() {
		if (xhr.readyState ==4 && xhr.status==200){
			var jsonData = xhr.responseText;
			dataJSON = JSON.parse(jsonData);
			for (var i=0; i<dataJSON.length; i++) {
				//console.log(dataJSON[i].location.value.coordinates);
				var latpto = dataJSON[i].location.value.coordinates[1]
				var lonpto = dataJSON[i].location.value.coordinates[0]
				
				var markID = L.circle([latpto, lonpto], markerOptions)
				markID.addTo(map);
			resolve(dataJSON);
			}
		} else {
					// Normalmente error porque el servidor no existe o no se encuentra...
			resolve([]);
			}
		}
	});
};
	
	/*for (var i=0; i<pos.length; i++) 

			/*
			n = dataJSON.pos.;
			console.log(n);
			
			for (var i=0; i<n; i++){
				var latpto = dataJSON.features[i].geometry.coordinates[1]
				var lonpto = dataJSON.features[i].geometry.coordinates[0]
				var precio = dataJSON.features[i].properties.Precio
				
				var markID = L.circle([latpto, lonpto], markerOptions)
				markID.addTo(map);
				markID.bindPopup('<p>Price: '+ precio +'</p>').openPopup();
			}
			
					
		}
	};
	
	// LAYERS

	var PNOA = L.tileLayer.wms("http://www.ign.es/wms-inspire/pnoa-ma", {
		layers: 'OI.OrthoimageCoverage', // Capa o capas separadas por coma. Consultar los metadatos del servicio
		format: 'image/png',
		transparent: true,
		maxZoom: 20,
		attribution: '<a href="http://www.ign.es/ign/main/index.do" target="_blank">© Instituto Geográfico Nacional de España</a>',
	}).addTo(map);
	
	var baseLayers = {
	"Image IGN": PNOA,
	"OpenStreetMap": tiles,
	};

	var overlayMaps =[];

	L.control.layers(baseLayers, overlayMaps, {position: 'bottomright'}).addTo(map);
}
*/

function openNav() {
  document.getElementById("mySidebar").style.width = "250px";
  document.getElementById("main").style.marginLeft = "250px";
}

/* Set the width of the sidebar to 0 and the left margin of the page content to 0 */

function closeNav() {
  document.getElementById("mySidebar").style.width = "0";
  document.getElementById("main").style.marginLeft = "0";
} 




