var activas = [];


var usr = 'g0a';

var url = 'https://upvusig.car.upv.es/fiware';
var end = '/v2/entities';


function entrada() {

	// Empresa, matrícula y edificio...
	var empresa  = document.getElementById("empresa").value;
	var vehiculo = document.getElementById("vehiculo").value;
	
	var edif  = document.getElementById("edificio");
	
	var edID = edif.value;
	var edTx = edif.text;
	
	// Comprobación de cadenas vacías...
	// TODO...
	
	// Hora de entrada...
	var h1 = Date.now();
	var h2 = (new Date(h1).toISOString()).split('.')[0]+'Z';
	
	// Entidad Fiware...
	var fiwareID = 'urn:ngsi-ld:upv:' + empresa + ':' + vehiculo + ':' + h2 + ':' + edID;
	
	var entidad = {
		'id': fiwareID,
		'name': edID,
		'entrada': h2,
		'salida': null
	} 
	
	activas.push(entidad); // Eliminar en versión final...
	
	// El POST para enviar a Fiware no funciona de momento!!!
	//var data = {
    //    'type': 'Dummy',
    //    'id': 'urn:ngsi-ld:' + usr + ':Dummy:A',
    //    'name': {'type': 'Text', 'value': 'A'}
    //}

    //alert(JSON.stringify(data));

    //var xhr = new XMLHttpRequest();

    //xhr.open("POST", url+end, true);
    //xhr.setRequestHeader('Content-Type', 'application/json');
    //xhr.send(JSON.stringify(data));

    //xhr.onreadystatechange = function() {
    //    alert(xhr.status)
    //}
	
	//alert(empresa);
	//alert(vehiculo);
	
	//alert(edID);
	//alert(edTx);
	
	//alert(JSON.stringify(entidad));
	console.log(JSON.stringify(entidad, null, 4));
	
	// Actualizar lista de visitas...
	var visitas = document.getElementById('visitas');
	
	var v = document.createElement('option');
	
	v.appendChild(document.createTextNode(empresa + ' [' + vehiculo + '] [' + edID + '] [' + h2 + ']'));
	v.value = fiwareID;
	
	visitas.appendChild(v);
	
	visitas.value = fiwareID;
	 
	//v = empresa + ' [' + vehiculo + '] [' + h2 + ']';
	//console.log(v);
	
	
	// Borrar datos de la última visita...
	//edif.value = '00';

}


function salida () {

	// Hora de salida...
	h1 = Date.now();
	h2 = (new Date(h1).toISOString()).split('.')[0]+'Z';
	
}

function actualiza() {

}

function limpia() {

}
