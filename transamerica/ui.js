
// ------------------------------------------------------------------
// - UI Display Routines 
// ------------------------------------------------------------------

function UI_updateInfo()
{
	document.getElementById('info').style.visibility='hidden';		
	document.getElementById('points').style.visibility='visible';	
	
	for (var i=0; i<5; i++) {
		document.getElementById('p'+i+'points').style.visibility='hidden'; 
	}
		
	for (player of game.players) {
		var el = document.getElementById('p'+player.id+'points'); 
		console.log(player.id);
		console.log(el);
		el.style.visibility='visible';
		el.innerHTML=player.points;
		if (player.id==current().id) {
			el.classList.add('active');
		} else {
			el.classList.remove('active');
		}
	}
		
}

function UI_showMessage(msg)
{
	document.getElementById('info').style.visibility='visible';		
	document.getElementById('info').innerHTML=msg;		
}

function UI_showResults(game)
{
	
	document.getElementById('info').innerHTML='';	
	
	UI_updateInfo();
	
	for (player of game.players) 	{
		UI_showCities(player);
	}
	
	if (game.over) {
		UI_showMessage('GAME OVER');
	}
}	

function UI_showCities(player)
{
	for (city of player.destinations) {
		document.getElementById(city).classList.add('p'+player.id+'color');
	}
}

function UI_hideCities(player)
{
	for (city of player.destinations) {
		document.getElementById(city).classList.remove('p'+player.id+'color');
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

var selectedTrack = undefined;

function touchedMapEnd(event)
{		
	document.getElementById('info').style.visibility='hidden';		
	
	clickedMap( event.changedTouches[0] );
}

function touchedMapMove(event)
{	
	document.getElementById('info').style.visibility='hidden';		
	
	if (selectedTrack != undefined) {
		selectedTrack.classList.remove('highlight');
	}
	
	selectedTrack = getTrackFromEvent(event.changedTouches[0]);	
	selectedTrack.classList.add('highlight');	
}



function clickedMap(event)
{
	document.getElementById('info').style.visibility='hidden';		
	
	if (game.round==0) return;
	var player = current();	
	if (player.id!=0) return;

	if (selectedTrack != undefined) {
		selectedTrack.classList.remove('highlight');
	}

	selectedTrack = getTrackFromEvent(event);
		
	if (player.startpoint != undefined) {
		console.log(isConnected(player, selectedTrack.VA, selectedTrack.VB));
		if ( isConnected(player, selectedTrack.VA, selectedTrack.VB) == false ) {
	 	  UI_showMessage('Track must connect to your network');
	 	  return;
		}
	}
			
	selectedTrack.classList.add('highlight');	
	
	if (selectedTrack != undefined) {
		document.getElementById('confirm').style.visibility='visible';
	}		
}

function confirmSelection()
{	
	var player = current();	
	
	if (selectedTrack != undefined) 
	{
		document.getElementById('confirm').style.visibility='hidden';
		if (selectedTrack != undefined) {
			selectedTrack.classList.remove('highlight');
		}
		
		placeTrack(player, selectedTrack.VA, selectedTrack.VB);
		
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
    document.getElementById('confirm').addEventListener('touchend', function(){ confirmSelection(); });
  } else {
    document.getElementById('map').addEventListener('click', clickedMap);
    document.getElementById('numpl2').addEventListener('click', function(){ initGame(2); });
    document.getElementById('numpl3').addEventListener('click', function(){ initGame(3); });
    document.getElementById('numpl4').addEventListener('click', function(){ initGame(4); });
    document.getElementById('numpl5').addEventListener('click', function(){ initGame(5); });
    document.getElementById('nextrb').addEventListener('click', function(){ initRound(); });
    document.getElementById('confirm').addEventListener('click', function(){ confirmSelection(); });
  }   
	
	// Hide the Start Round button
	document.getElementById('nextrb').style.visibility='hidden';	
	
	// Hide the Confirm button
	document.getElementById('confirm').style.visibility='hidden';

	// Hide the Point counters	
	document.getElementById('points').style.visibility='hidden';	
	document.getElementById('p0points').visibility='hidden'; 
	document.getElementById('p1points').visibility='hidden'; 
	document.getElementById('p2points').visibility='hidden'; 
	document.getElementById('p3points').visibility='hidden'; 
	document.getElementById('p4points').visibility='hidden'; 
}


// ------------------------------------------------------------------
// - UI Creation and Reinitialization of DIVs 
// ------------------------------------------------------------------

var HMAX = 18;
var VMAX = 13;

var hstep = 55;
var vstep = hstep * Math.sqrt(3) / 2;

var radius = 18;

// These should be automatically derived based on HMAX and hstep
var mapOffsetX = 30;
var mapOffsetY = 20;

function createArc(va, vb, vw)
{
	var a = vertexId(va);
	var b = vertexId(vb);
	
	if (a<b) {
		var x = a % HMAX;
		var y = (a-x)/HMAX;
		
		var left = x*hstep+(isEven(y)?0:hstep/2); 
		var top  = y*vstep;                       
		var rot  = '000';                         
		
		if (a+1==b) {
			rot = '000';
		} else if (a+HMAX-1==b) {
			rot = '120';
		} else if (a+HMAX+1==b) {
			rot = '060';
		} else if (isEven(y)) {
			rot = '060';			
		} else {
			rot = '120';
		}	
		
		var e = createDiv('map', arcName(va, vb), left, top, 'dropzone track track'+vw+' rot'+rot);
		e.VA = va;
		e.VB = vb;
		e.style.width = hstep;
	}
}

function createCity(city)
{
	var a = vertexId(city);
	
	var x = a % HMAX;
	var y = (a-x)/HMAX;
	
	var left = x*hstep + (isEven(y)?0:hstep/2) - radius/2;
	var top  = y*vstep - radius/2;                      
	
	var e = createDiv('map', city, left, top, 'city');
	
	e.style.width        = radius+'px';
	e.style.height       = radius+'px';
	e.style.borderRadius = radius+'px';	
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
	document.getElementById(city).classList.remove('p0color');	
	document.getElementById(city).classList.remove('p1color');	
	document.getElementById(city).classList.remove('p2color');	
	document.getElementById(city).classList.remove('p3color');	
	document.getElementById(city).classList.remove('p4color');	
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
	//debugGetTrack(event);
	
	var x = event.clientX-mapOffsetX-parseFloat(document.getElementById('container').style.left || 0 );
  var y = event.clientY-mapOffsetY-parseFloat(document.getElementById('container').style.top  || 0 ); 
  
	//debugGetTrack(event);
	//debugGetTrack('click: '+x + ' '+y);   
	return getTrackFromXY(x, y);
}

function getTrackFromXY(x, y)
{	
	var A, B;
	
  debugGetTrack(x+' '+y);	    
  	    
  if ( isEven( Math.round((2*y)/vstep)) ) {
    y = Math.round( y/vstep );
	  x = (x/hstep) - 0.5;		    
	  if (isEven(y) == false) x = x-0.5;
	  x = Math.round(x);
		A = (y*HMAX+x);
		B = (y*HMAX+x+1);
    debugGetTrack('H Move: '+'V'+A+' -> '+'V'+B);	
  } else {
    y = Math.round(  (y/vstep) - 0.5 );
	  x = Math.round((2*x/hstep) - 0.5 );	
	  debugGetTrack(x+' '+y);	    
	  if (isEven(y)) {
    	if (isEven(x)) {	
	    	x = Math.round(x/2);
				A = (y*HMAX+x);
				B = ((y+1)*HMAX+x);
	    	debugGetTrack('D EE \\ Move: '+x+','+y+' -> '+x+','+(y+1));	
    		debugGetTrack('D EE \\ Move: '+'V'+A+' -> '+'V'+B);	
    	} else {
	    	x = Math.round(x/2);
				A = (y*HMAX+x);
				B = ((y+1)*HMAX+x-1);
	    	debugGetTrack('D EO / Move: '+x+','+y+' -> '+(x-1)+','+(y+1));	
    		debugGetTrack('D EO / Move: '+'V'+A+' -> '+'V'+B);	
    	}
	  } else {
    	if (isEven(x)) {	
	    	x = Math.round(x/2);
				A = (y*HMAX+x);
				B = ((y+1)*HMAX+x);
	    	debugGetTrack('D OE / Move: '+x+','+y+' -> '+x+','+(y+1));	
    		debugGetTrack('D OE / Move: '+'V'+A+' -> '+'V'+B);	
    	} else {
	    	x = Math.round(x/2);
				A = (y*HMAX+x-1);
				B = ((y+1)*HMAX+x);
	    	debugGetTrack('D OO \\ Move: '+(x-1)+','+y+' -> '+x+','+(y+1));	
    		debugGetTrack('D OO \\ Move: '+'V'+A+' -> '+'V'+B);	
    	}
	  }
  }
  if ((x>=0) && (x<HMAX)&& (y>=0) && (y<VMAX)) 
  {		    
		var el = document.getElementById( arcName('V'+A,'V'+B) );
		if (el != undefined) {					    
  		return el;
  	} else {
	    debugGetTrack('No arc there');
    }
  } else {
    debugGetTrack('OOB '+x+', '+y);
  }	
}

function debugGetTrack(str)
{
//	console.log(str);
}