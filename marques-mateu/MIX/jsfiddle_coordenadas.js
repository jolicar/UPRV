var url = "https://upvusig.car.upv.es/fiware";
var end = "/v2/entities";

// Proyecto UPrV
// Como obtener coordenadas desde Fiware

async function coordenadas() {
	
	let promise = new Promise(function(resolve, reject) { 

		// Recuperación de la entidad de tipo "Posicion"...
		var xhr = new XMLHttpRequest(); 

		xhr.open("GET", url+end+"?limit=1000&type=Posicion&q=estado==uso", true);
		xhr.send(); 
		
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4) {  
				if (xhr.status == 200) {
					// Petición correcta...
					var p = JSON.parse(xhr.responseText);
					resolve(p);				
				} else {
					// Normalmente error porque el servidor no existe o no se encuentra...
					resolve([]);
				}
			}
		}; 
	}); 
  
	// La variable pos es una lista con entidades "Posicion"...
	let pos = await promise;
  
	// Iterar sobre todas las posiciones y dibujarlas sobre el mapa...
	for (var i=0; i<pos.length; i++) {
		// Aqui debéis poner vuestro código...
		alert(JSON.stringify(pos[i], null, 4)); 
	}
}

// Desde el código que gestiona el mapa hay que llamar a lafunción coordenadas()
// regularmente, p.ej. cada 5 segundos...
coordenadas();

