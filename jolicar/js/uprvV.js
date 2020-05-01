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


//var visita = {};



async function inicio() {

	console.log();
	console.log("inicioV()");
	
	// Comprobación de entidad "urn:ngsi-ld:uprv:Va"...
	console.log("Entidad \"urn:ngsi-ld:uprv:Va\"");
	let va = await visitaActual();
	
	if (!va) {
		console.log("    inicio(): " + va)
		let n = await numVisitas();
		console.log("    num. de visitas: " + n)
		
		let v = await crearVisitaActual(n);
		console.log("    Visita creada: " + v)
	}

	// Desplegable "campus"...
	console.log("Desplegable \"campus\"");
	let r = await desplegableCampus();
	//console.log(r);
	
	// Desplegable "edificios" dado un "Campus"...
	console.log("Desplegable \"edificio\"");
	r = await desplegableEdificioCampus(); // r contiene un vector de edificios
	//console.log(JSON.stringify(r));

	// Deplegable "empresa" dado un "Campus"...
	console.log("Desplegable \"empresa\"");
	r = await desplegableEmpresaCampus(r);  
	//console.log(JSON.stringify(r));

	// Campo "vehiculo"...
	document.getElementById("vehiculo").value   = "";

	// Desplegable "visitas" en curso...
	console.log("Desplegable \"visitas\"");
	await desplegableVisitas();  

}



async function visitaActual() {

	// Comprobar si existe la entidad comodín "urn:ngsi-ld:uprv:Va"...
	
	let promise = new Promise(function(resolve, reject) { 
	
		var xhr = new XMLHttpRequest();

		xhr.open('GET', url+end+"?idPattern=urn:ngsi-ld:uprv:Va", true);
		xhr.send();

		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4 && xhr.status == 200) {
				var json = JSON.parse(xhr.responseText);
				//console.log("visitaActual(): " + json.length + " " + xhr.responseText);
				resolve(json);
			}
		};	
	});

	return(Boolean((await promise).length));

}



async function numVisitas() {

	// Calcular el número de entidades de tipo "Visita" realizadas en el año en curso...
	
	let promise = new Promise(function(resolve, reject) { 
		
		// Año actual...
		var a = new Date().getFullYear();
	
		var xhr = new XMLHttpRequest();

		xhr.open('GET', url+end+"?limit=1000&type=Visita", true);
		xhr.send();

		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4 && xhr.status == 200) {
				var json = JSON.parse(xhr.responseText);
				//console.log("visitaActual(): " + json.length + " " + xhr.responseText);
				
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

	return(await promise);

}



async function crearVisitaActual (n) {

	let promise = new Promise(function(resolve, reject) { 

		// Año actual...
		var a = new Date().getFullYear();
	
		// Entidad "Va"...
		vaId = a + "-" + ("0000" + n).slice(-4);
	
		var va = {
			"id": "urn:ngsi-ld:uprv:Va:0000",
			"type": "Va",
			"name": {
				"type": "Text",
				"value": "0000"
			},
			"vaId": {
				"type": "Text",
				"value": vaId
			}
		};

		//console.log(JSON.stringify(va, null, 4));

	    var xhr = new XMLHttpRequest();

	    xhr.open("POST", url+end, true);
	    xhr.setRequestHeader("Content-Type", "application/json");
	    xhr.send(JSON.stringify(va));

		xhr.onreadystatechange = function() {
		    if (xhr.readyState == 4 && xhr.status == 201) {
						resolve(true);		    
		    }
		}
		
	});	
	
	return (await promise);
	
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
				var camp  = document.getElementById("campus");
			
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


async function campusMasCercano() {
			
	// Campus más cercano a las coordenadas locales...

}



async function desplegableEdificioCampus() {

	let promise = new Promise(function(resolve, reject) {
	
		// Campus seleccionado en el desplegable...
		var c = document.getElementById("campus").value;

		// Vaciar desplegable "edificio"...
		var edif = document.getElementById("edificio");
		edif.innerHTML = "";
		
		// Añadir entrada "en blanco"...
		var m = document.createElement("option");
		
		m.appendChild(document.createTextNode(""));
		m.value = "urn:ngsi-ld:uprv:Edificio:00";
		edif.appendChild(m);
		
		// Petición HTTP...
		
		var xhr = new XMLHttpRequest();

		xhr.open("GET", url+end+"?orderBy=name&type=Edificio&q=refCampus=="+c, true);
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



async function desplegableEmpresaCampus() {

	let promise = new Promise(function(resolve, reject) {
	
		// Campus seleccionado en el desplegable...
		var c = document.getElementById("campus").value;

		// Vaciar desplegable "empresa"...
		var emp = document.getElementById("empresa"); 
		emp.innerHTML = "";

		// Añadir entrada "en blanco"...
		var m = document.createElement("option");
		
		m.appendChild(document.createTextNode(""));
		m.value = "urn:ngsi-ld:uprv:Empresa:Z00000000";
		emp.appendChild(m);		

		// Petición HTTP...
		var xhr = new XMLHttpRequest();

		xhr.open("GET", url+end+"?limit=1000&orderBy=rs&type=Empresa&q=refCampus~="+c, true);
		xhr.send();

		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4 && xhr.status == 200) {

				// Entidades tipo "Empresa" procedentes de Fiware...
				var ent = JSON.parse(xhr.responseText);
				//console.log(JSON.stringify(ent));
			
				// Añadimos entidades a desplegable...
				for (var e=0; e<ent.length; e++) {
					//console.log(ent[e].rs);
					m = document.createElement("option");

					m.appendChild(document.createTextNode(decodeURIComponent(ent[e].rs.value)));
					m.value = ent[e].id;
					emp.appendChild(m);
					//emp.value = ent[e].id;	
			
				}
			
				// Seleccionamos entrada en blanco...
				emp.value = "urn:ngsi-ld:uprv:Empresa:Z00000000";

				// Salida del objeto Promise...
				resolve(ent);
	
			}
		};

	});

	return (await promise);
		
}



async function desplegableVisitas() {

	let empresa = {};
	
	let pr1 = new Promise(function(resolve, reject) {
	
		// Petición HTTP...
		var xhr = new XMLHttpRequest();

		xhr.open("GET", url+end+"?limit=1000&type=Empresa", true);
		xhr.send();

		xhr.onreadystatechange = function() {
		
			if (xhr.readyState == 4 && xhr.status == 200) {

				// Entidades tipo "Empresa" procedentes de Fiware...
				var ent = JSON.parse(xhr.responseText);
				//console.log("    Empresa: " + ent.length)
				
				for (var e=0; e<ent.length; e++) {

					empresa[ent[e].id] = decodeURIComponent(ent[e].rs.value);
			
				}
				
				resolve();
			}
		};			
	});

	await pr1;

	//console.log(JSON.stringify(empresa));

	let pr2 = new Promise(function(resolve, reject) {

		// Limpiar deslegable "visitas"...
		var vis = document.getElementById("visitas");
		vis.innerHTML = "";			// Petición HTTP...

		// Añadir entrada "en blanco"...
		var v = document.createElement("option");
		
		v.appendChild(document.createTextNode(""));
		v.value = "urn:ngsi-ld:uprv:Visita:0000-0000";
		vis.appendChild(v);	
		
		
		// Petición HTTP...
		var xhr = new XMLHttpRequest();

		xhr.open("GET", url+end+"?limit=1000&orderBy=id&type=Visita", true);
		xhr.send();

		xhr.onreadystatechange = function() {
		
			if (xhr.readyState == 4 && xhr.status == 200) {

				// Entidades tipo "Visita" procedentes de Fiware...
				var ent = JSON.parse(xhr.responseText);
				//console.log(ent.length);
			
				// Añadimos entidades a desplegable...
				for (var e=0; e<ent.length; e++) {
				
					// Comprobar que no tiene clave "salida"...
					if (ent[e].hasOwnProperty("salida")) {
						continue;
					}
					
					//console.log(ent[e].rs);
					v = document.createElement("option");

					v.appendChild(document.createTextNode("["+ent[e].name.value+"] \t " + empresa[ent[e].refEmpresa.value]));
					v.value = ent[e].id;
					vis.appendChild(v);
			
				}
			
				// Seleccionamos entrada en blanco...
				vis.value = "urn:ngsi-ld:uprv:Visita:0000-0000";

				// Salida del objeto Promise...
				resolve(ent);
	
			}
		};
	
	});

	return (await pr2);
}



async function actualizaCampus() {

	// Desplegable "edificio"...
	console.log("Desplegable \"edificio\"");
	let r = await desplegableEdificioCampus(); // r contiene un vector de edificios
	//console.log(JSON.stringify(r));
	
	// Desplegable "empresa"...
	console.log("Desplegable \"empresa\"");
	r = await desplegableEmpresaCampus(r);  
	//console.log(JSON.stringify(r));
	
	// Desplegable "visitas"...
	await desplegableVisitas();
	
}



async function actualizaEmpresa() {

	// Limpiar deslegable "personal"...
	var pers = document.getElementById("personal");
	pers.innerHTML = "";

	// Limpiar lista de Personal autorizado...
	var dni = document.getElementById("dniBox")
	dni.innerHTML = "";
	
	// Limpiar matrícula...
	document.getElementById("vehiculo").value = "";
	
	// Desplegable "edificio" en blanco...
	document.getElementById("edificio").value = "urn:ngsi-ld:uprv:Edificio:00";

	// CIF de la empresa...
	var cif = document.getElementById("empresa").value;
	
	let promise = new Promise(function(resolve, reject) {

		// "personal"" autorizado...
		var xhr = new XMLHttpRequest();

		xhr.open("GET", url+end+"?limit=1000&orderBy=id&type=Personal&q=refEmpresa=="+cif, true);
		xhr.send();

		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4 && xhr.status == 200) {
		
				// Entidades tipo Personal procedentes de Fiware...
				var ent = JSON.parse(xhr.responseText);
				//console.log(ent);
		
				// Desplegable de Personal...
//				var pers  = document.getElementById("personal");
//				var persb = document.getElementById("dni");

				// Eliminamos contenido previo...
//				pers.innerHTML = "";
			
				// Añadimos entrada "en blanco"...
				var c = document.createElement("option");
				
				c.appendChild(document.createTextNode(""));
				c.value = "urn:ngsi-ld:uprv:Personal:Z00000000";
				pers.appendChild(c);
				pers.value = "";

				// Añadimos entidades a desplegable...
				for (var e=0; e<ent.length; e++) {
					//console.log(ent[e].name.value);
					//console.log(ent[e].id);
					
					var c = document.createElement("option");
				
					c.appendChild(document.createTextNode(ent[e].name.value+" - "+ent[e].apellidos.value+', '+ent[e].nombre.value));
					c.value = ent[e].id;
					pers.appendChild(c);
					pers.value = ent[e].id;
		
				}
			
				// Asignamos entrada en blanco...
				pers.value = "urn:ngsi-ld:uprv:Personal:Z00000000"
				
				resolve(ent);
			}
		};
	
	});

	return (await promise);
		
}



async function actualizaDNI() {

	let promise = new Promise(function(resolve, reject) {
	
		var pers = document.getElementById("personal");
		var dni  = document.getElementById("dniBox");
	
		var per = pers.options[pers.selectedIndex].text;
	
		if (per === "") {
			return;
		}
	
		if (dni.innerHTML.includes(per)) {
			return;
		}
	
		dni.innerHTML += per+"<br>";
		
		resolve();
	
	});

	return (await promise);	
}



async function entrada() {

	console.log("entrada():");

	// "Visita" seleccionada en el desplegable...
	v = document.getElementById("visitas").value
	console.log("    entrada(): "+v);
	
	if (v !== "urn:ngsi-ld:uprv:Visita:0000-0000") {
		alert("Limpiar formulario \"VISITAS\"");
		return;
	}
		
	var visita = {};

	// ID...
	visita.id = null;
	visita.type = "Visita";
	visita.name = {"type": "Text", "value": null};
	
	// Campus y empresa...
	visita.refCampus   = {"type": "Relationship", "value": document.getElementById("campus").value};
	visita.refEmpresa  = {"type": "Relationship", "value": document.getElementById("empresa").value};
	
	// Personal...
	pers = document.getElementById("dniBox").innerHTML.split("<br>").filter(Boolean);
	
	visita.refPersonal = {"type": "Relationship", "value": []};
	for (var i=0; i<pers.length; i++){		
		visita.refPersonal.value.push("urn:ngsi-ld:uprv:Personal:" + pers[i].split(" - ")[0])
	}
	
	// Vehículo y edificio...
	visita.vehiculo = {"type": "Text", "value": document.getElementById("vehiculo").value};
	//if (visita.vehiculo.value === "") {visita.vehiculo.value = null}
	
	visita.refEdificio = {"type": "Relationship", "value": document.getElementById("edificio").value};

	// Hora de entrada...
	var h1 = Date.now();
	var h2 = new Date(h1).toISOString();
	
	visita.entrada = {"type": "DateTime", "value": h2};
	
	// Comprobar que el formulario ha sido rellenado...
	if (visita.refCampus.value   === "urn:ngsi-ld:uprv:Campus:00" || 
	    visita.refEmpresa.value === "urn:ngsi-ld:uprv:Empresa:Z00000000" ||
	    visita.refEdificio.value === "urn:ngsi-ld:uprv:Edificio:00" || 
	    visita.refPersonal.value.length === 0) {
	    	alert("Rellenar todos los campos!")
			return;	
	}

	// Última visita 
	let vaId = await ultimaVisita(); // Esta función aumenta el ID de visita y devuelve dicho ID... 
	console.log(vaId);
	
	// Crear nueva entidad "Posicion"...
	console.log("crearPosicion()");
	await crearPosicion(vaId);
	
	// Mostrar ID por pantalla...
	alert("Código: "+vaId);
	
	// Crear nueva visita... (check existing value!!!!!)
	visita.id = "urn:ngsi-ld:uprv:Visita:"+vaId;
	visita.name.value = vaId;
	
	console.log("crearNuevaVisita()")
	await crearNuevaVisita(visita);

	// Desplegable "visitas"...
	desplegableVisitas();
	
	// Limpiar visita (necesario?)...
	visita = {};
	
	// Limpiar formulario...
	document.getElementById("empresa").value    = "urn:ngsi-ld:uprv:Empresa:Z00000000";
	document.getElementById("personal").value   = "urn:ngsi-ld:uprv:Personal:Z00000000";
	document.getElementById("dniBox").innerHTML = "";
	document.getElementById("vehiculo").value   = "";
	document.getElementById("edificio").value   = "urn:ngsi-ld:uprv:Edificio:00";
	document.getElementById("visitas").value    = "urn:ngsi-ld:uprv:Visita:0000-0000";

}



async function ultimaVisita() {

	// Recuperar "Va"...
	let pr1 = new Promise(function(resolve, reject) {
	
		var xhr = new XMLHttpRequest(); 

		xhr.open("GET", url+end+"?idPattern=urn:ngsi-ld:uprv:Va", true);
		xhr.send(); 
		
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4 && xhr.status == 200) { 
				//console.log(xhr.responseText);
				resolve(JSON.parse(xhr.responseText));
			}
		};
	});

	let va = await pr1;
	
	console.log("    va: " + JSON.stringify(va));
	
	let a = parseInt(va[0].vaId.value.split("-")[0]);
	let b = parseInt(va[0].vaId.value.split("-")[1]);
	
	// Año actual...
	var c = new Date().getFullYear();
	
	if (new Date().getFullYear() === a) {
		b += 1;
	} else {
		b = 1;
	}

	vId = a + "-" + ("0000" + b).slice(-4);
	
	// Actualizar "Va"...
	let pr2 = new Promise(function(resolve, reject) {
	
		var xhr = new XMLHttpRequest();

		xhr.open("POST", url+end+"/urn:ngsi-ld:uprv:Va:0000/attrs", true);
		xhr.setRequestHeader("Content-Type", "application/json");
		xhr.send(JSON.stringify({"vaId":{"type": "Text", "value": vId}}));

		xhr.onreadystatechange = function() {
			//console.log(xhr.status);
			if (xhr.readyState == 4 && xhr.status == 204) {
				resolve();				
			}
		}
	});	
	
	await pr2;
	
	return(vId);
}



async function crearNuevaVisita(visita) {

	//console.log("crearNuevaVisita(): " + JSON.stringify(visita));
	
	let promise = new Promise(function(resolve, reject) {

			var xhr = new XMLHttpRequest();

			xhr.open("POST", url+end, true);
			xhr.setRequestHeader("Content-Type", "application/json");
			xhr.send(JSON.stringify(visita));

			xhr.onreadystatechange = function() {
				//alert(xhr.status);
				if (xhr.readyState == 4 && xhr.status == 201) {
				//if (xhr.status > 200 && xhr.status < 300) {
					//alert("resolve(Visita)");
					resolve();				
				}
			};
	});
	
	await promise;
	
	return;
}



async function crearPosicion(vaId) {

	// Añadir entidad "Posicion"...
	var pos = {
		"id": "urn:ngsi-ld:uprv:Posicion:" + vaId,
		"type": "Posicion",
		"name": {"type": "Text", "value": vaId},
		"estado": {"type": "Text", "value": "libre"},
		"pos": {"type":"geo:json","value":{"type":"Point","coordinates":[0.0,0.0]}}
	};
		
	let promise = new Promise (function(resolve, reject) {

		var xhr = new XMLHttpRequest();

		xhr.open("POST", url+end, true);
		xhr.setRequestHeader("Content-Type", "application/json");
		xhr.send(JSON.stringify(pos));

		xhr.onreadystatechange = function() {
			//alert(xhr.status);
			if (xhr.readyState == 4 && xhr.status == 201) {
				console.log("    resolve(Pos): " + xhr.status);
				resolve();				
			}
		}
	});	

	await promise;
	
	return;
}



async function salida() {

	// "Visita" seleccionada en el desplegable...
	v = document.getElementById("visitas").value
	console.log("    salida(): "+v);
	
	if (v === "urn:ngsi-ld:uprv:Visita:0000-0000") {
		alert("Seleccionar un valor en el formulario \"VISITAS\"");
		return;
	}
	
	// Entidad visita...
	var vId = await comprobarID(v);
	
	if (vId) {
		await finalizarVisita(v);
	}
	
	console.log(vId);

	var pId = await comprobarID(v.replace("Visita", "Posicion"));
	
	if (pId) {
		console.log("posicion");
		await eliminarPosicion(v.replace("Visita", "Posicion"));
	}
	
	// Limpiar formulario...
	document.getElementById("empresa").value    = "urn:ngsi-ld:uprv:Empresa:Z00000000";
	document.getElementById("personal").value   = "urn:ngsi-ld:uprv:Personal:Z00000000";
	document.getElementById("dniBox").innerHTML = "";
	document.getElementById("vehiculo").value   = "";
	document.getElementById("edificio").value   = "urn:ngsi-ld:uprv:Edificio:00";
	document.getElementById("visitas").value    = "urn:ngsi-ld:uprv:Visita:0000-0000";	
	
	// Refrescar visitas...
	await desplegableVisitas(); 
}



async function finalizarVisita(v) {

	let promise = new Promise(function(resolve, reject) {

		// Hora de salida...
		var h1 = Date.now();
		var h2 = new Date(h1).toISOString();
	
		var xhr = new XMLHttpRequest();

		xhr.open("POST", url+end+"/"+v+"/attrs", true);
		xhr.setRequestHeader("Content-Type", "application/json");
		xhr.send(JSON.stringify({"salida":{"type": "DateTime", "value": h2}}));

		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4 && xhr.status == 204) {
				console.log(xhr.status);
				resolve();				
			}
		}
	});	
	
	await promise;
	
	return;
}



async function eliminarPosicion(p) {

	console.log(JSON.stringify(p));
	
	let promise = new Promise(function(resolve, reject) {

		var xhr = new XMLHttpRequest();

		xhr.open("DELETE", url+end+"/"+p, true);
		xhr.send();

		xhr.onreadystatechange = function() {
			console.log(xhr.status);
			if (xhr.readyState == 4 && xhr.status == 204) {
				console.log(xhr.status);
				resolve();				
			}
		}

	});	
	
	await promise;
	
	return;
}



async function actualizaVisitas() {

	// "Visita" seleccionada en el desplegable...
	v = document.getElementById("visitas").value
	//console.log("    actualizaVisitas(): "+v);
	
	if (v === "urn:ngsi-ld:uprv:Visita:0000-0000") {
	
		await desplegableVisitas();
		
		// Limpiar formulario...
		document.getElementById("empresa").value    = "urn:ngsi-ld:uprv:Empresa:Z00000000";
		document.getElementById("personal").value   ="urn:ngsi-ld:uprv:Personal:Z00000000";
		document.getElementById("dniBox").innerHTML = "";
		document.getElementById("vehiculo").value   = "";
		document.getElementById("edificio").value   = "urn:ngsi-ld:uprv:Edificio:00";
		
	} else {

		let pr1 = new Promise (function(resolve, reject) {

			var xhr = new XMLHttpRequest();

			xhr.open("GET", url+end+"?id="+v, true);
			xhr.send(); 
		
			xhr.onreadystatechange = function() {
				if (xhr.readyState == 4 && xhr.status == 200) { 
					//console.log(xhr.responseText);
					resolve(JSON.parse(xhr.responseText));
				}
			};

		});	

		let vis = await pr1;
		
		if (vis.length !== 1) {
			return;
		}
		
		console.log("actualizaVisitas():");
		console.log(JSON.stringify(vis));
		
		// Seleccionar "Campus"...
		document.getElementById("campus").value = vis[0].refCampus.value;
		console.log(JSON.stringify(vis[0].refCampus.value));
		
		// Desplegables...
		await desplegableEdificioCampus();
		await desplegableEmpresaCampus();
		
		// Seleccionar empresa, ...
		document.getElementById("empresa").value = vis[0].refEmpresa.value;
		//console.log(vis[0].refEmpresa.value);

		// Desplegable de personal...
		await actualizaEmpresa();

		// Personal autorizado...
		//console.log(vis[0].refPersonal.value);
		
		let pr2 = new Promise (function(resolve, reject) {
		
			var pers = vis[0].refPersonal.value.join();
			
			var dni  = document.getElementById("dniBox");
			dni.innerHTML = "";
			
			//console.log(pers);
			var xhr = new XMLHttpRequest();

			xhr.open("GET", url+end+"?id="+pers, true);
			xhr.send(); 
		
			xhr.onreadystatechange = function() {
				if (xhr.readyState == 4 && xhr.status == 200) { 
					var ent = JSON.parse(xhr.responseText);
					//console.log(ent.length);
					//console.log(ent);
					
					for (var i=0; i<ent.length; i++) {
						//console.log(ent[i].name.value + " - " + ent[i].apellidos.value + ", " + ent[i].nombre.value);
						dni.innerHTML += ent[i].name.value + " - " + ent[i].apellidos.value + ", " + ent[i].nombre.value+"<br>";
					}
					
					resolve();
				}
			};		
		});	
		
		await pr2;
		
		// Campo "vehiculo"...
		document.getElementById("vehiculo").value = vis[0].vehiculo.value;
		
		// Desplegable "edificio"...		
		document.getElementById("edificio").value = vis[0].refEdificio.value;
	}
}



async function comprobarID(id) {

	let promise = new Promise (function(resolve, reject) {

		var xhr = new XMLHttpRequest();

		xhr.open("GET", url+end+"?id="+id, true);
		xhr.send(); 
		
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4 && xhr.status == 200) { 
				resolve(Boolean(JSON.parse(xhr.responseText).length));
			}
		};

	});	
		
	return(await promise);
}




