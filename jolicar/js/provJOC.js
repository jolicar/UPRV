function start(){
	document.getElementById("startForm").style.display="block";
	document.getElementById("map").style.display="none";
	document.getElementById("autoForm").style.display="none";
}

function map(){
	document.getElementById("startForm").style.display="none";
	document.getElementById("map").style.display="block";
	document.getElementById("autoForm").style.display="none";
}

function auto(){
	document.getElementById("startForm").style.display="none";
	document.getElementById("map").style.display="none";
	document.getElementById("autoForm").style.display="block";
}

function hideBoth(){
	document.getElementById("startForm").style.display="none";
	document.getElementById("map").style.display="none";
	document.getElementById("autoForm").style.display="none";
}
	
function main_init(){
	document.getElementById("buttonStart").addEventListener("click", start);
	document.getElementById("buttonMap").addEventListener("click", map);
	document.getElementById("buttonAuto").addEventListener("click", auto);
	hideBoth();
}	

window.onload=function(){
	main_init();
	
};