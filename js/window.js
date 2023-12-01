
//Variables
let gp 			        =   new gameplay();
let robert 		        =   new animator();
let painter 	        =   new UI(gp._GPTileSet.set);

let inital_score_flag   =   true;
let mobile_flag         =   window.display;

var touchElement        =   document.getElementById('touchElement');	
var moved               =   false;
var startX, startY, deltaX, deltaY;

//Si entras en la ventana de admin hay ventana de debugeo
if(document.location.search == "?admin"){
	let crow 		    =   new PlagueDoctor("Crow","Movimiento de tiles");
	let crow2 		    =   new PlagueDoctor("Crow2","Cosas especificas");
}

// ciclo principal
window.addEventListener('load',()=>{
	let Mobile          =   document.getElementById("ELSE").classList;
	let PC              =   document.getElementById("PC").classList;
    if('ontouchstart' in window){
		Mobile.toggle("d-none")
		Mobile.toggle("d-flex")
	}else{
		PC.toggle("d-none")
		PC.toggle("d-flex")
	}
	gp.resetBoard()
	painter.updateSet(gp._GPTileSet.set);
	document.querySelector("#currScore>span").innerText = gp.currScore;
})

document.addEventListener('keydown',(event)=>{
	let KeyCode = event.code;
    let isWASD  = (KeyCode == "KeyD"        || KeyCode == "KeyW"    || KeyCode == "KeyS"        || KeyCode == "KeyA")
	let isArrow = (KeyCode == "ArrowRight"  || KeyCode == "ArrowUp" || KeyCode == "ArrowDown"   || KeyCode == "ArrowLeft")
    if(isArrow || isWASD) game_interaction(KeyCode);
})

  	// Evento touchstart
touchElement.addEventListener('touchstart', function(event) {
    // Guarda las coordenadas iniciales del toque
    startX = event.touches[0].clientX;
    startY = event.touches[0].clientY;
},{passive:true});

  // Evento touchmove
touchElement.addEventListener('touchmove', function(event) {
	moved = true;
    // Calcula la distancia horizontal y vertical del desplazamiento
    deltaX = event.touches[0].clientX - startX;
    deltaY = event.touches[0].clientY - startY;
    // Determina la dirección basada en la distancia
    
},{passive:true});

touchElement.addEventListener("touchend",function(event){
	event.preventDefault();
	if(moved){
		if (Math.abs(deltaX) > Math.abs(deltaY)) { //<-- !! chequear compresion
			if (deltaX > 0) {
				game_interaction("KeyD")
			} else {
				game_interaction("KeyA")
			}
		} else {
			if (deltaY > 0) {
				game_interaction("KeyS")
			} else {
				game_interaction("KeyW")
			}
		}
	}
	moved = false;
})
/**
 * Obtiene un string que determina la letra asociada al boton presionado del teclado
 * formato: "Key"+N donde N es la tecla [no especial] presionada.
 * @param {String} KeyCode 
 */
function game_interaction(KeyCode){
	let isWASD = (KeyCode == "KeyD" || KeyCode == "KeyW" || KeyCode == "KeyS" || KeyCode == "KeyA")
	if(isWASD && !_GameOverFlag){
		
		gp.ordernarSet(KeyCode);
		gp._GPTileSet.spawnTile();
		robert.batchAnimation();

		setTimeout(()=>{
			painter.updateSet(gp._GPTileSet.set)
			robert.clearAnimators();
		},200);
		
		if(_GameOverFlag || document.querySelectorAll("div.v2048").length > "0" ) gp.winLoseCondition(); //<--!! chequear si funciona JAJA
	}
}