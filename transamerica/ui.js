
// ------------------------------------------------------------------
// - UI Display Routines 
// ------------------------------------------------------------------

function UI_showInfo()
{
	document.getElementById('info').innerHTML='';	
	
	for (player of game.players) {
		var str  = player.name;
		str += ' | ';
		str += player.points;
		if (player.id==current().id)
		str += ' < ACTIVE ';
		document.getElementById('info').innerHTML+=str;
		document.getElementById('info').innerHTML+='<BR>';
	}
}

function UI_showResults(game)
{
	
	document.getElementById('info').innerHTML='';	
	
	for (player of game.players) 
	{
		UI_showCities(player);
	
		var str = player.name;
		str += ' | ';
		str += player.points + player.score;
		str += ' - ';
		str += player.score;
		str += ' = ';		
		str += player.points;
		
		if (player.score==0) {
			str += ' | All cities connected';
		}
		
		document.getElementById('info').innerHTML+=str;
		document.getElementById('info').innerHTML+='<BR>';
	}
	if (game.over) {
		document.getElementById('info').innerHTML+='GAME OVER';
	}
}	

function UI_showCities(player)
{
	for (city of player.destinations) {
		document.getElementById(city).classList.add('p'+player.id+'color');
	}
}

function UI_placeTrack(va, vb)
{
	// get name of DIV corresponding to arc between a and b
	// find DIV based on the arc name
	// format the DIV
  document.getElementById(arcName(va,vb)).classList.add('trackClicked');				
}

// ------------------------------------------------------------------
// - UI Touch/Click Handlers 
// ------------------------------------------------------------------

var hover = undefined;

function touchedMapEnd(event)
{
	if (hover != undefined) {
		hover.classList.remove('highlight');
	}
	
	clickedMap( event.changedTouches[0] );
}

function touchedMapMove(event)
{
	if (hover != undefined) {
		hover.classList.remove('highlight');
	}
	
	hover = getTrackFromEvent(event.changedTouches[0]);
	
	hover.classList.add('highlight');	
}

function clickedMap(event)
{
	if (game.round==0) return;
	var player = current();	
	if (player.id!=0) return;
		
	var el = getTrackFromEvent(event);
	
	if (el != undefined) 
	{
		placeTrack(player, el.VA, el.VB);
		
		if (player.moves==0) { 
			nextPlayer();
	 	}		
	}
}

function initView()
{
	// center the Container
	centerContainer();	
	
	// Add Event Handlers
  if ("ontouchstart" in document.documentElement) {
		document.addEventListener('touchmove',  function(e){ e.preventDefault(); }); 
		document.addEventListener('touchstart', function(e){ e.preventDefault(); }); 	  
    document.getElementById('map').addEventListener('touchmove', touchedMapMove);
    document.getElementById('map').addEventListener('touchend', touchedMapEnd);
    document.getElementById('numpl2').addEventListener('touchend', function(){ initGame(2); });
    document.getElementById('numpl3').addEventListener('touchend', function(){ initGame(3); });
    document.getElementById('numpl4').addEventListener('touchend', function(){ initGame(4); });
    document.getElementById('numpl5').addEventListener('touchend', function(){ initGame(5); });
    document.getElementById('nextrb').addEventListener('touchend', function(){ initRound(); });
  } else {
    document.getElementById('map').addEventListener('click', clickedMap);
    document.getElementById('numpl2').addEventListener('click', function(){ initGame(2); });
    document.getElementById('numpl3').addEventListener('click', function(){ initGame(3); });
    document.getElementById('numpl4').addEventListener('click', function(){ initGame(4); });
    document.getElementById('numpl5').addEventListener('click', function(){ initGame(5); });
    document.getElementById('nextrb').addEventListener('click', function(){ initRound(); });
  }   
	
	// Hide the Start Round button
	document.getElementById('nextrb').style.visibility='hidden';	
}


// ------------------------------------------------------------------
// - UI Creation and Reinitialization of DIVs 
// ------------------------------------------------------------------

function createArc(va, vb, vw)
{
	var a = vertexId(va);
	var b = vertexId(vb);
	
	if (a<b) {
		var x = a % 18;
		var y = (a-x)/18;
		
		var length = 50;
		var left = x*length+(isEven(y)?0:length/2); // left
		var top  = y*length*(Math.sqrt(3)/2);       // top
		var rot  = '000';                           // rotation 
		
		if (a+1==b) {
			rot = '000';
		} else if (a+17==b) {
			rot = '120';
		} else if (a+19==b) {
			rot = '060';
		} else if (isEven(y)) {
			rot = '060';			
		} else {
			rot = '120';
		}	
		
		var e = createDiv('map', arcName(va, vb), left, top, 'dropzone track track'+vw+' rot'+rot);
		e.VA = va;
		e.VB = vb;
	}
}

function createCity(city)
{
	var a = vertexId(city);
	
	var x = a % 18;
	var y = (a-x)/18;
	
	var length = 50;
	var left = x*length+(isEven(y)?0:length/2); // left
	var top  = y*length*(Math.sqrt(3)/2);       // top
	
	createDiv('map', city, left-7, top-7, 'city');
}

function createMap()
{
	for (va in game.graph) {
		for (vb in game.graph[va]) {
			createArc(va, vb, game.graph[va][vb]);
		}
	}
		
	for (c in cities) {
		createCity(c);
	}	
}

function initArc(va, vb, vw)
{
	document.getElementById(arcName(va, vb)).classList.remove('trackClicked');	
	document.getElementById(arcName(va, vb)).classList.add('track'+vw);	
}

function initCity(city)
{
	document.getElementById(city).classList = 'city';	
}

function initMap()
{
	for (va in game.graph) {
		for (vb in game.graph[va]) {
			initArc(va, vb, game.graph[va][vb]);
		}
	}
	
	for (c in cities) {
		initCity(c);
	}	
}

function createDiv(container, id, x, y, style, f) 
{
  var el;
  el = document.createElement('div');
  el.id=id;
  el.className=style;
  el.style.left = x+'px';
  el.style.top = y+'px';
  if (f!=undefined) {
	  if ("ontouchstart" in document.documentElement) {
	    el.addEventListener('touchstart', f);
	  } else {
	    el.addEventListener('click', f);
	  }   
  }        
  document.getElementById(container).appendChild(el);
  return el;
}   


// ------------------------------------------------------------------
// - UI Get DIV from Event and Coordinates 
// ------------------------------------------------------------------

function getTrackFromEvent(event)
{
	var x = event.clientX-60-parseFloat(document.getElementById('container').style.left || 0 );
  var y = event.clientY-40-parseFloat(document.getElementById('container').style.top  || 0 ); 
  
	//console.log(event);
	//console.log('click: '+x + ' '+y);   
	return getTrackFromXY(x, y);
}

function getTrackFromXY(x, y)
{	
	var A, B;
  	    
  if (isEven( Math.round((2*y)/43.3013)) ) {
    y = Math.round( y/43.3013 );
	  x = (x-25)/50;		    
	  if (isEven(y) == false) x = x-0.5;
	  x = Math.round(x);
		A = (y*18+x);
		B = (y*18+x+1);
//     console.log('H Move: '+'V'+A+' -> '+'V'+B);	
  } else {
    y = Math.round( (y-21.65)/43.3013 );
	  x = Math.round((x-12.5)/25);		    
	  if (isEven(y)) {
    	if (isEven(x)) {	
	    	x = Math.round(x/2);
				A = (y*18+x);
				B = ((y+1)*18+x);
// 	    	console.log('D EE \\ Move: '+x+','+y+' -> '+x+','+(y+1));	
//     		console.log('D EE \\ Move: '+'V'+A+' -> '+'V'+B);	
    	} else {
	    	x = Math.round(x/2);
				A = (y*18+x);
				B = ((y+1)*18+x-1);
// 	    	console.log('D EO / Move: '+x+','+y+' -> '+(x-1)+','+(y+1));	
//     		console.log('D EO / Move: '+'V'+A+' -> '+'V'+B);	
    	}
	  } else {
    	if (isEven(x)) {	
	    	x = Math.round(x/2);
				A = (y*18+x);
				B = ((y+1)*18+x);
// 	    	console.log('D OE / Move: '+x+','+y+' -> '+x+','+(y+1));	
//     		console.log('D OE / Move: '+'V'+A+' -> '+'V'+B);	
    	} else {
	    	x = Math.round(x/2);
				A = (y*18+x-1);
				B = ((y+1)*18+x);
// 	    	console.log('D OO \\ Move: '+(x-1)+','+y+' -> '+x+','+(y+1));	
//     		console.log('D OO \\ Move: '+'V'+A+' -> '+'V'+B);	
    	}
	  }
  }
  if ((x>=0) && (x<=17)&& (y>=0) && (y<=12)) 
  {		    
// 		info(arcName('V'+A,'V'+B), true);	  
		var el = document.getElementById( arcName('V'+A,'V'+B) );
		if (el != undefined) {					    
  		return el;
  	} else {
// 			info('No arc there', true);	  
// 	    console.log('No arc there');
    }
  } else {
//     console.log('OOB '+x+', '+y);
  }	
}