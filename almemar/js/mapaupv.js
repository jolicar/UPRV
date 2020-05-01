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

<<<<<<< HEAD:almemar/js/mapaupv.js
    var xhr = new XMLHttpRequest() //objeto petición;
	var t = xhr.open("GET", url+end+"?limit=1000&type=Visita",true);
=======
    var xhr = new XMLHttpRequest()
	xhr.open("GET", url+end+"?limit=1000&type=Edificio", true);
>>>>>>> c9348f579c416fc02db5e7fad924fec1b59aaade:Posada_Heidy/MAPAUPV/js/mapaupv.js
	xhr.send();
	
	xhr.onreadystatechange = function() {
		if (xhr.readyState ==4 && xhr.status==200){
<<<<<<< HEAD:almemar/js/mapaupv.js
			var jsonData = JSON.parse(xhr.responseText); //to text
			for (var i=0; i<jsonData.length; i++){
				var edificio = jsonData[i].refEdificio.value
				var entrada = jsonData[i].entrada.value
				var exit = jsonData[i].salida.value
				//se interrumpe el bucle...(necesairio un if... ¿Donde abordarlos?)
			}
			
=======
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
			
					
>>>>>>> c9348f579c416fc02db5e7fad924fec1b59aaade:Posada_Heidy/MAPAUPV/js/mapaupv.js
		}
	};
	console.log(entrada);
	
	
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

async function coordenadas() {
	
	let promise = new Promise(function(resolve, reject) { 

		// Recuperación de la entidad de tipo "Posicion"...
		var xhr = new XMLHttpRequest(); 
		var pueba = xhr.open("GET", url+end+"?limit=1000&type=Posicion&q=estado==uso", true);
	
		xhr.send();
		
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4) {  
				if (xhr.status == 200) {
					// Petición correcta...	
					var p = JSON.parse(xhr.responseText);
					//console.log(p);
					resolve(p);
				} else {
					// Normalmente error porque el servidor no existe o no se encuentra...
					resolve([]);
				}
			}
		}; 	
	});
}

async function realTime() {
	
	
	
	
}

async function numVisitas() {

	// Calcular el número de entidades de tipo "Visita" realizadas en el año en curso...
	
	let promise = new Promise(function(resolve, reject) { 
		
		// Año actual...
		var a = new Date().getFullYear();
	
		var xhr = new XMLHttpRequest();

		var t = xhr.open('GET', url+end+"?limit=1000&type=Visita", true);
		xhr.send();

		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4 && xhr.status == 200) {
				var json = JSON.parse(xhr.responseText);
				console.log("visitaActual(): " + json.length + " " + xhr.responseText);
				
				var n = 0;
				
				for (var e=0; e<json.length; e++) {
					var b = json[e].name.value.split("-")[0];
										
					if (a == b) {
						n++;
					}
				}
				
				resolve(n);
			}
		};
		
	});	

		
}