//
// UPrV  -  Versión 0.2
//
// uprv.js
//
// Mejoras para la versión 0.3:
//
// - Presentar avisos en caso de horarios o edificos NO autorizados
// - Preparar el sistema para grandes cantidades de datos (no. de entidades > 1000)
// - Elegir el campus más cercano a la posición ofrecida por el geoposicionamiento HTML5
//


var url = 'https://upvusig.car.upv.es/fiware';
var end = '/v2/entities';

async function inicio() {

	console.log("inicio()");
	
	
	// Desplegable "campus"...
	console.log("Desplegable \"autoCampus\"");
	let r = await desplegableCampus();

	
	// Desplegable "edificios" dado un "Campus"...
	console.log("Desplegable \"autoEdificio\"");
	r = await desplegableEdificioCampus(); // r contiene un vector de edificios

	
	// Inicializa el textBox de empresa
	document.getElementById("autoEmpresa").value = "";
	autocompleta();
	


}



async function desplegableCampus() {

	let promise = new Promise(function(resolve, reject) { 

		var xhr = new XMLHttpRequest();

		xhr.open("GET", url+end+"?idPattern=uprv&type=Campus&orderBy=id", true);
		xhr.send();

		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4 && xhr.status == 200) {
		
				// Entidades tipo campus procedentes de Fiware...
				var ent = JSON.parse(xhr.responseText);
				//console.log(ent);
			
				// Añadimos entidades a desplegable...
				var camp  = document.getElementById("autoCampus");
			
				for (var e=0; e<ent.length; e++) {
					//console.log(ent[e].name.value);
					//console.log(ent[e].id);
				
					var c = document.createElement("option");
				
					c.appendChild(document.createTextNode(ent[e].name.value));
					c.value = ent[e].id;
					camp.appendChild(c);
					camp.value = ent[e].id;	
				}
				
				resolve();
			
			}
		};	
	
	});
	
	return (await promise);
	
}


async function desplegableEdificioCampus() {

	let promise = new Promise(function(resolve, reject) {
	
		// Campus seleccionado en el desplegable...
		var c = document.getElementById("autoCampus").value;

		// Vaciar desplegable "edificio"...
		var edif = document.getElementById("autoEdificio");
		edif.innerHTML = "";
		
		// Añadir entrada "en blanco"...
		var m = document.createElement("option");
		
		m.appendChild(document.createTextNode(""));
		m.value = "urn:ngsi-ld:uprv:Edificio:00";
		edif.appendChild(m);
		
		// Petición HTTP...
		
		var xhr = new XMLHttpRequest();

		xhr.open("GET", url+end+"?limit=1000&orderBy=name&type=Edificio&q=refCampus=="+c, true);
		xhr.send();

		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4 && xhr.status == 200) {
		
				// Entidades tipo "Edificio" procedentes de Fiware...
				var ent = JSON.parse(xhr.responseText);
				//console.log(ent);
			
				// Añadimos entidades a desplegable...
				//var edif = document.getElementById("edificio");
			
				for (var e=0; e<ent.length; e++) {
					//console.log(ent[e])
					//console.log(ent[e].name.value);
					//console.log(ent[e].id);
					//console.log(ent[e].description.value);
				
					var nom = ent[e].name.value + " - " + ent[e].description.value;
				
					//console.log(decodeURIComponent(nom));
				
			
					var m = document.createElement("option");
		
					m.appendChild(document.createTextNode(decodeURIComponent(nom)));
					m.value = ent[e].id;
					edif.appendChild(m);
					//emp.value = ent[e].id;	
			
				}
			
				// Seleccionamos entrada en blanco...
				edif.value = "urn:ngsi-ld:uprv:Edificio:00";

				// Salida del objeto Promise...
				resolve(ent);
			
			}
		};

	});
	
	return (await promise);
	
}


async function actualizaCampus() {

	// Desplegable "edificio"...
	console.log("Desplegable \"edificio\"");
	let r = await desplegableEdificioCampus(); // r contiene un vector de edificios
	//console.log(JSON.stringify(r));
	
	
}



async function autocompleta() {

	let promise = new Promise(function(resolve, reject) { 

		var xhr = new XMLHttpRequest();
		
		xhr.responseType = "json";

		xhr.open("GET", url+end+"?limit=1000&orderBy=rs&type=Empresa", true);
		xhr.send();
		
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4 && xhr.status == 200) {

				var empresa = xhr.response;
				
				// Rellenamos las posibles opciones de la lista desplegable...
				
				var ops = "";
				for (var i=0; i<empresa.length; i++) {
					//console.log(empresa[i].rs.value);
					//ops += "\<option value=\"" + empresa[i].name.value + " - " + decodeURIComponent(empresa[i].rs.value) + "\" /\>";
					ops += "\<option value=\"" + decodeURIComponent(empresa[i].rs.value) + "\" /\>";
				}

				document.getElementById("listaEmpresa").innerHTML = ops;
				
				resolve();

			}
		}
	});
	
	await promise;
	

	return;
}


async function autocompletaCif() {
	
	var empresaSeleccionada = document.getElementById("autoEmpresa").value.trim();
	
	console.log("autocompletaCif");
	
	if (empresaSeleccionada === "") {
		console.log("autocompletaCif No seleccionada");
		return;
	}
	

	let promise = new Promise(function(resolve, reject) { 

		var xhr = new XMLHttpRequest();
		
		xhr.responseType = "json";

		xhr.open("GET", url+end+"?type=Empresa&q=rs=="+empresaSeleccionada, true);
		xhr.send();
		
		console.log("autocompletaCif-GET1");
		
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4 && xhr.status == 200) {

				var empresaS = xhr.response;
				console.log("autocompletaCif-GET2");
				console.log(typeof(empresaS));
				console.log(empresaS[0].name.value);

				document.getElementById("autoCif").value = decodeURIComponent(empresaS[0].name.value);
				
				resolve();

			}
		};
	});
	
	await promise;

	return;
}



async function procesamiento() {

	// Aquí iría todo tu procesamiento: POST, limpiar formulario, ...
	
	
	// Para recuperar todos los datos de esa empresa haces una historia (5 pasos))...
	
	// 1. Obtienes el valor seleccionado en la lista  
	
	var empresaSeleccionada = document.getElementById("autoEmpresa").value.trim();
	
	console.log(empresaSeleccionada);
	
	if (empresaSeleccionada === "") {
		return;
	}
	
	// 2. Obtienes todas las empresas (otra vez)...
	
	let promise = new Promise(function(resolve, reject) { 

		var xhr = new XMLHttpRequest();
		
		xhr.responseType = "json";

		xhr.open("GET", url+end+"?limit=1000&orderBy=rs&type=Empresa", true);
		xhr.send();
		
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4 && xhr.status == 200) {

				resolve(xhr.response);

			}
		}
	});
	
	let empresa = await promise;
	
	//console.log(JSON.stringify(empresa));
	
	// 3. Buscas la empresa seleccionada en la lista de empresas...
	
	empresaJSON = null;
	for (var i=0; i<empresa.length; i++) {
		//console.log(empresaSeleccionada + "  " + decodeURIComponent(empresa[i].rs.value));
		
		if (empresaSeleccionada === decodeURIComponent(empresa[i].rs.value)) {
			empresaJSON = empresa[i];
			break;
		}
	}
	
	// 4. Envías la información a Fiware...
	
	if (empresaJSON === null) {

		// Si la empresa NO existe, la das de alta junto con el personal, horario, etc. que habrá
		// en alguna parte del formulario...
		 var chkEmpresa, chkPersonal, chkAcceso;
		 
		chkEmpresa=altaEmpresa();
		chkPersonal=altaPersonal();
		chkAcceso=altaAcceso();
	
	} else {
	
		// Si la empresa existe, no la das de alta. Darás de alta al personal, horario, etc. que habrá
		// en alguna parte del formulario...
		var chkEmpresa, chkPersonal, chkAcceso;
		
		chkEmpresa=true;
		chkPersonal=altaPersonal();
		chkAcceso=altaAcceso();
		console.log(chkPersonal);
		// console.log(chkAcceso);
		
	}


	// 5. Al final se limpia tu formulario...
	if ( chkEmpresa==true && chkPersonal==true && chkAcceso==true){
		borrarFormulario();
	}
	// Limpiar otras casillas del formulario...
	
}



async function altaEmpresa() {
	
	console.log("altaEmpresa():");
	
	var empresa = {};

	// id y type...
	empresa.id = "urn:ngsi-ld:uprv:Empresa:"+document.getElementById("autoCif").value.trim().toUpperCase();
	empresa.type = "Empresa";
	
	// name...
		
	empresa.name  = {"type": "Text", "value": document.getElementById("autoCif").value.trim().toUpperCase()};
	
	// Campus...
	
	empresa.refCampus = {"type": "Relationship", "value": document.getElementById("autoCampus").value.trim()};
	
	// rs...
	
	empresa.rs = {"type": "Text", "value": document.getElementById("autoEmpresa").value.trim()};
	
	
	// Comprobar que el formulario ha sido rellenado...
	if (empresa.id.value   === "urn:ngsi-ld:uprv:Empresa:" || 
		empresa.name.value.length === 0 ||
	    empresa.refCampus.value === "urn:ngsi-ld:uprv:Campus:00" ||
	    empresa.rs.value.length === 0 ){
	    	alert("Rellenar todos los campos!")
			return false;	
	}
	
	await crearElementos(empresa);

	// Limpiar dicc (necesario?)...
	empresa = {};
	return true;

}


async function altaPersonal() {
	
	console.log("altaPersonal():");
	
	var personal = {};

	// id y type...
	personal.id = "urn:ngsi-ld:uprv:Personal:"+document.getElementById("autoDni").value.trim().toUpperCase();
	personal.type = "Personal";
	
	// apellidos...
		
	personal.apellidos  = {"type": "Text", "value": document.getElementById("autoSubname").value.trim().toUpperCase()};
	
	// name...
		
	personal.name  = {"type": "Text", "value": document.getElementById("autoDni").value.trim().toUpperCase()};
	
	// nombre...
		
	personal.nombre  = {"type": "Text", "value": document.getElementById("autoName").value.trim().toUpperCase()};
	
	// refAcceso...
		
	personal.refAcceso  = {"type": "Relationship", "value": "urn:ngsi-ld:uprv:Acceso:"+document.getElementById("autoDni").value.trim().toUpperCase()};

	// refCampus...
	
	personal.refCampus = {"type": "Relationship", "value":document.getElementById("autoCampus").value.trim()};
	
	// refEmpresa...
		
	personal.refEmpresa  = {"type": "Relationship", "value": "urn:ngsi-ld:uprv:Empresa:"+document.getElementById("autoCif").value.trim().toUpperCase()};
	
	
	//Comprobar que el formulario ha sido rellenado...
	if (personal.id.value   === "urn:ngsi-ld:uprv:Personal:" || 
		personal.apellidos.value.length === 0 ||
		personal.name.value.length === 0 ||
		personal.nombre.value.length === 0 ||
		personal.refAcceso.value === "urn:ngsi-ld:uprv:Acceso:" ||
		personal.refCampus.value === "urn:ngsi-ld:uprv:Campus:00" ||
		personal.refEmpresa.value === "urn:ngsi-ld:uprv:Empresa:" ){
			alert("Rellenar todos los campos!");
			return false;
	}
	
	
	await crearElementos(personal);
	
	// Limpiar dicc (necesario?)...
	personal = {};
	return true;

}


async function altaAcceso() {
	
	console.log("altaAcceso():");
	
	var acceso = {};

	// id y type...
	acceso.id = "urn:ngsi-ld:uprv:Acceso:"+document.getElementById("autoDni").value.trim().toUpperCase();
	acceso.type = "Acceso";
	
	// fin...
		
	acceso.fin  = {"type": "DateTime", "value": document.getElementById("outDate").value.trim()};
	
	// horario...
		
	acceso.horario  = {"type": "Text", "value": document.getElementById("inTime").value.trim()+"-"+document.getElementById("outTime").value.trim()};
	
	// inicio...
		
	acceso.inicio  = {"type": "DateTime", "value": document.getElementById("inDate").value.trim()};
	
	// refEdificio...
	
	acceso.refEdificio = {"type": "Relationship", "value":document.getElementById("autoEdificio").value.trim()};
	
	
	
	// Comprobar que el formulario ha sido rellenado...
	if (acceso.id.value   === "urn:ngsi-ld:uprv:Acceso:" || 
		acceso.fin.value.length === 0 ||
		acceso.horario.value.length === 0 ||
		acceso.inicio.value.length === 0 ||
		acceso.refEdificio.value === "urn:ngsi-ld:uprv:Edificio:00" ){
	    	alert("Rellenar todos los campos!")
			return false;	
	}
	
	await crearElementos(acceso);

	// Limpiar dicc (necesario?)...
	acceso = {};
	return true;

}


async function crearElementos(jsonA) {

	console.log("crearElementos(): " + JSON.stringify(jsonA,null,4));
	
	let promise = new Promise(function(resolve, reject) {

			var xhr = new XMLHttpRequest();

			xhr.open("POST", url+end, true);
			xhr.setRequestHeader("Content-Type", "application/json");
			xhr.send(JSON.stringify(jsonA));

			xhr.onreadystatechange = function() {
				//alert(xhr.status);
				if (xhr.readyState == 4 && xhr.status == 201) {
				//if (xhr.status > 200 && xhr.status < 300) {
					alert("resolve(Elemento)");
					resolve();				
				}
			};
	});
	
	await promise;
	
	return;
}


async function borrarFormulario() {
	// Limpiar formulario... 
	
	console.log("borrarElementos()")
	
	document.getElementById("autoCampus").value   = "urn:ngsi-ld:uprv:Campus:00";
	document.getElementById("autoEdificio").value   = "urn:ngsi-ld:uprv:Edificio:00";
	document.getElementById("autoEmpresa").value    = "";
	document.getElementById("autoCif").value = "";
	document.getElementById("autoName").value= "";
	document.getElementById("autoSubname").value = "";
	document.getElementById("autoDni").value = "";
	document.getElementById("inDate").value = "";
	document.getElementById("outDate").value = "";
	document.getElementById("inTime").value = "";
	document.getElementById("outTime").value = "";

}
