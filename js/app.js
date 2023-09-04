/**TO-DO List
 * hacerle Sort al array de los notNulledValues cuando se apreta "KeyD"
 *
 */

let _winningTexts = {"title":"Good Job!",
					 "parr":"That took a while, huh! Remember to brag to your friend and coworkers your of your ingenius tactics from wich you got that score!",
					 "btnReset":"Reset",
					 "btnRank":"Rank your score!"};

let _losingTexts = { "title":"Ups! Seems you lost...",
					 "parr":"You see... every loss leaves a meaningful lesson, sometimes we have to learn to adapt and become better selfs, and sometimes we just suck. I mean ... the score is right there, dude. I don't mean this is an easy game, but people can suck in hardmode too...",
					 "btnReset":"Reset"};

let playerDom = document.getElementById("block");
let intPropertyValue = (target,property) => {
	return parseInt(window.getComputedStyle(target).getPropertyValue(property));
}
function addPositions(arr,arr2){
	let aux = [];
	aux[0] = arr[0]+arr2[0];
	aux[1] = arr[1]+arr2[1];
	return aux;
}
let _nullValue 		= "na";
let _Direccion 		= ["KeyW","KeyA","KeyS","KeyD"];// NO USADO AUN
let _setYOffset 	= 4;
let _GameOverFlag	= false;

let _MessageCounter = 0;
class PlagueDoctor{
	target 	= "";
	constructor(id,title){
		if(!document.querySelector(".operationTable")){
			let operationTable = document.createElement("div");
			operationTable.setAttribute("class","operationTable")
			document.body.appendChild(operationTable);
		}
		let chatWindow = document.createElement("div");
		chatWindow.setAttribute("id",id);
		chatWindow.setAttribute("class","crowChat");
		document.querySelector(".operationTable").appendChild(chatWindow);
		this.target = document.getElementById(id);
		this.addTitle(title,document.getElementById(id));
	}
	addTitle(title,target){
		let h2 = document.createElement("h2");
		h2.textContent = title;
		target.appendChild(h2);
	};
	addMensaje(mensaje,object){
		let p = document.createElement("p");
		let hr = "</hr>";
		let br = "</br>";
		let iter = 0;
		p.innerHTML=`[${_MessageCounter++}]: `+mensaje+br;

		if(typeof object === "object" && object.length > 1){
			object.forEach( obj =>{
				p.innerHTML +=JSON.stringify(obj)+br;
				iter++;
			})
			this.target.appendChild(p);
		}else if(typeof object === "object"){
			p.innerHTML +=JSON.stringify(object)+hr;
			this.target.appendChild(p);
		}else{
			p.innerHTML+=object+hr;
			this.target.appendChild(p);
		}
	}
}

class tile {
  	value;
	position=[]
	index;
  	constructor(position,value = _nullValue){
    	this.value 		= value;
    	this.position 	= position;
  	};
	
	setValue(value)			{ this.value = value; }
	setPosition(position)	{ this.position = position}
	setIndex(i)				{ this.index = i; }

	getValue()				{ return this.value; }
	getIndex()				{ return this.index; }
	getPosition()			{ return this.position; }
	prepareToMove(t){
		this.index = t.getIndex();
		this.position = t.getPosition();
	};
	updateAuxTileByKeyPressed(KeyPressed, path){
		let aux = KeyPressed == "KeyW" ||KeyPressed == "KeyA" ?"KeyW":"KeyS";
		switch (aux) {
			case "KeyW":
				this.index 		= path[0].getIndex();
				this.position 	= path[0].getPosition();
			break;
			case "KeyS":
				this.index 		= path[path.length-1].getIndex();
				this.position 	= path[path.length-1].getPosition();
			break;
			default:
				alert("filtering error. Ups!")
			break;
		}
		return;
	}
}
class tileSet {
	length = 16;
	set = [
		new tile([0,0], ),new tile([0,1], ),new tile([0,2], ),new tile([0,3], ),
		new tile([1,0], ),new tile([1,1], ),new tile([1,2], ),new tile([1,3], ),
		new tile([2,0], ),new tile([2,1], ),new tile([2,2], ),new tile([2,3], ),
		new tile([3,0], ),new tile([3,1], ),new tile([3,2], ),new tile([3,3], ),
	]
	constructor(){
		for(let i=0; i <= this.length-1; i++){
			this.set[i].setIndex(i)
		}
	}
	replaceTile(tile)		{ this.set[ tile.getIndex() ] = tile; };
	getTileIndex(index)		{ return this.set.findIndex( t => t.index == index )};
	getTileByPosition(pos)	{ return this.set.find(t => t.position[0] == pos[0] && t.position[1] == pos[1] )}
	getTile(index)			{ return this.set[ this.getTileIndex(index) ] };

	spawnTile(){

		let nullValuedSpots = this.getNullValuedSpots(); 	// creamos una tabla de espacios abiertos
		if(nullValuedSpots.length == 0){
			_GameOverFlag = true;
			return
		}
		let randomNumber = Math.random()*(nullValuedSpots.length-1)
		let randomIndex = Math.ceil(randomNumber < 0 ? 0 : randomNumber); 	// creamos un index random que no exeda la cantidad de espacios libres

		let newTile = new tile();
		newTile.prepareToMove(nullValuedSpots[randomIndex]);
		newTile.setValue(2);

		this.replaceTile(newTile)													// Insertamos un espacio abierto random en su lugar correspondiente dentro del set orignial
	};
	killTile(t){
		this.set[t.getIndex()] = t;
	}

	getNullValuedSpots()	{ return this.set.filter(t => t.value == _nullValue) }
	getNotNullValuedSpots()	{ return this.set.filter(t => t.value != _nullValue)	}
}
class UI{
	target = document.querySelector("#canvas");
	block = document.createElement("div");
	constructor(set){
		set.forEach(t =>{
			
			let blockNumber = document.createElement("p");
			let block  = document.createElement("div");
			block.setAttribute("class","grid-block")
			block.setAttribute("id",t.position);
			block.appendChild(blockNumber);
			this.target.appendChild(block)
		})
	};
	updateScore(){
		let currScore = document.querySelector("#currScore>span");
		let highScore = document.querySelector("#highScore>span");
		currScore.innerText = gp.currScore;
		if(currScore.innerText >= gp.highScore) gp.highScore = currScore.innerText
		highScore.innerText = gp.highScore;
	};	
	cerrarModal(){
		document.getElementById("mlBody").parentElement.remove();
	};
	updateSet(set){
		let blockGrid = document.querySelectorAll(".grid-block>p")
		set.forEach(tile =>{
			blockGrid[tile.getIndex()].innerText = tile.getValue()!=_nullValue ? tile.getValue() : "";
			blockGrid[tile.getIndex()].parentNode.setAttribute("class","grid-block");
			blockGrid[tile.getIndex()].parentNode.classList.add("v"+(tile.getValue()!=_nullValue ? tile.getValue() : ""));
		})
	};
	
	endOfGameModal(string){
		let mlShadow 			= document.createElement("div");
		let mlBody 				= document.createElement("div");
		let mlTitle 			= document.createElement("h2");
		let mlParagraph			= document.createElement("p");
		let mlButtonsBar		= document.createElement("div");
		let mlResetBtn			= document.createElement("button");
		
		
		mlTitle.innerText		= string == "win"? _winningTexts.title	: _losingTexts.title;
		mlParagraph.innerText	= string == "win"? _winningTexts.parr	: _losingTexts.parr;
		mlResetBtn.innerText	= _winningTexts.btnReset; // just says reset (gatta move this to a "_generalTexts" or smth)
		
		mlButtonsBar.setAttribute("id","mlBtnBar");
		mlShadow.setAttribute("class","mlShadow");
		mlBody.setAttribute("id","mlBody");
		
		
		mlResetBtn.addEventListener("click",function(){
			/**
			 * Resetear score, painter
			 * Resetear tableSet GP
			*/
			painter.cerrarModal();
			gp.resetBoard();
			painter.updateSet(gp._GPTileSet.set);
		})
		
		document.body.appendChild(mlShadow);		
		mlShadow.appendChild(mlBody);
		mlBody.appendChild(mlTitle);
		mlBody.appendChild(mlParagraph);
		mlBody.appendChild(mlButtonsBar);
		mlButtonsBar.appendChild(mlResetBtn);
		
		if(string == "win"){
			let mlRankBtn			= document.createElement("button");
			mlRankBtn.innerText		= _winningTexts.btnReset;
			mlRankBtn.addEventListener("clik",function(){painter.cerrarModal();});
			mlButtonsBar.appendChild(mlRankBtn);
		}
	}
};
class animator{
	/**
	 * contains an object with the tile original position (v2), and the destination position (v2)
	 */
	_arrAnims = [];
	toRemove = [];
	setAnimationArr(ori,dest,bool = false){
		this._arrAnims.push({origen:ori,dest:dest,bool:bool});
	};
	batchAnimation(){
		this._arrAnims.forEach(an=>{
			let target = document.getElementById(an.origen);
			
			let es_movimiento_horizontal	= an.origen[0]-an.dest[0]==0;
			let es_movimiento_vertical 		= an.origen[1]-an.dest[1]==0;

			if(an.bool == true)
			{ target.classList.add("merge"); }

			if (es_movimiento_horizontal)		
			{ target.classList.add("movement-X"+60*(an.origen[1]-an.dest[1])); 	} 	

			if (es_movimiento_vertical)	
			{ target.classList.add("movement-Y"+60*(an.origen[0]-an.dest[0]));	}
		});
	}
	clearAnimators(){
		this._arrAnims = [];
		
		let aux = document.querySelectorAll(".grid-block");
		aux.forEach(ele=>ele.setAttribute("class","grid-block "+(ele.childNodes[0].innerText!=_nullValue?"v"+ele.childNodes[0].innerText:"na")))
	}
}
class gameplay{
	currScore = 6;
	highScore = 0;
  	_GPTileSet = new tileSet();
  	target = document.getElementById("canvas");
	resetBoard(){
		this._GPTileSet = new tileSet();
		this._GPTileSet.spawnTile();
		this._GPTileSet.spawnTile();
		console.table(this._GPTileSet.set);
	};
	addMergeScore(){
		gp.currScore+=3;
		painter.updateScore()

	}
	getMergeOffsetByKeyPressed(KeyPressed){
		let offset = [0,0];
		switch (KeyPressed) {
			case "KeyW":
				offset = [-1,0];
			break;
			case "KeyS":
				offset= [1,0]
			break;
			case "KeyA":
				offset = [0,-1]
			break;
			case "KeyD":
				offset = [0,1];
			break;

			default:
			break;
		};
		return offset;
	};
	winLoseCondition(){ 
		if(document.querySelectorAll("div.v2048").length > "0" ) { 
			_GameOverFlag=true;
			painter.endOfGameModal(); 

		};	
	};
	filterNullValuedSpotsByKeyPressed(KeyPressed,notNull){
		let nullValuedSpots 	= this._GPTileSet.getNullValuedSpots();

		switch (KeyPressed) {
			case "KeyW":
				nullValuedSpots = nullValuedSpots.filter(nulled => notNull.position[0] > nulled.position[0] && nulled.position[1] == notNull.position[1]);
			break;
			case "KeyS":
				nullValuedSpots = nullValuedSpots.filter( nulled => notNull.position[0] < nulled.position[0] && nulled.position[1] == notNull.position[1]);
			break;
			case "KeyD":
				nullValuedSpots = nullValuedSpots.filter( nulled => notNull.position[1] < nulled.position[1] && nulled.position[0] == notNull.position[0]);
			break;
			case "KeyA":
				nullValuedSpots = nullValuedSpots.filter( nulled => notNull.position[1] > nulled.position[1] && nulled.position[0] == notNull.position[0]);
			break;
			default:
				alert("filtering error. Ups!")
			break;
		}
		return nullValuedSpots
	}
	/**
	 *
	 * @param {Array} notNullValuedSpots
	 * @param {String} KeyPressed
	 */
	procesarKey(notNullValuedSpots,KeyPressed){
		let next = this.getMergeOffsetByKeyPressed(KeyPressed)
		let auxTile ;
		if(KeyPressed == "KeyD" || KeyPressed == "KeyS" )	notNullValuedSpots.reverse();
		notNullValuedSpots.forEach(notNull =>{

			let path 		= this.filterNullValuedSpotsByKeyPressed(KeyPressed,notNull)
			let borrower 	= new tile(notNull.position,_nullValue);
			auxTile 		= notNull;
			borrower.setIndex(notNull.getIndex());

			if( 	this._GPTileSet.getTileByPosition(addPositions(auxTile.position,next))
			&& 	this._GPTileSet.getTileByPosition(addPositions(auxTile.position,next)).value === auxTile.value ) 
			{
				this.mergeTiles(auxTile,next);
				robert.setAnimationArr(auxTile.position, addPositions(auxTile.position,next,true));
				gp.addMergeScore(); // each merge gives "3s"
			}
			if(path.length>0){
				auxTile.updateAuxTileByKeyPressed(KeyPressed,path);
				this._GPTileSet.replaceTile(auxTile);
				robert.setAnimationArr(borrower.position,auxTile.position)
				gp._GPTileSet.killTile(borrower);
			}
		})
	}

	ordernarSet(keyPressed)	{
		let notNullValuedSpots 	= this._GPTileSet.getNotNullValuedSpots();
		this.procesarKey(notNullValuedSpots,keyPressed);
	}
	mergeTiles(tile,next){
		let nextTile = this._GPTileSet.getTileByPosition( addPositions(tile.position,next) );
		nextTile.setValue(nextTile.getValue()*2);
		tile.setValue(_nullValue)
		this._GPTileSet.killTile(tile);
	}
}

/** debuging objects */
let crow 	= new PlagueDoctor("Crow","Movimiento de tiles");
let crow2 	= new PlagueDoctor("Crow2","Cosas especificas");

let gp 		= new gameplay();
let painter = new UI(gp._GPTileSet.set);
let robert 	= new animator();

function unFunctiont(){return};
function runThisOnce(){
	setInterval(()=>{	gp.score--;},1000);
}
let bool = true;
window.addEventListener('load',()=>{
	gp.resetBoard()
	painter.updateSet(gp._GPTileSet.set);
	document.querySelector("#currScore>span").innerText = gp.currScore;
})
document.addEventListener('keydown',(event)=>{
	
	
	let KeyCode = event.code;
	let isWASD = (KeyCode == "KeyD" || KeyCode == "KeyW" || KeyCode == "KeyS" || KeyCode == "KeyA")
	if(isWASD && !_GameOverFlag){
		if(bool){setInterval(()=>{	gp.score--;},1000);}
		
		gp.ordernarSet(KeyCode);
		gp._GPTileSet.spawnTile();
		robert.batchAnimation();
		setTimeout(()=>{
			painter.updateSet(gp._GPTileSet.set)
			robert.clearAnimators();
		},200);
		
		setTimeout(()=>{
			gp.winLoseCondition();
		},400);
	}
})
