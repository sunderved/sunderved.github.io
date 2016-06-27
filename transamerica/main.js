

function Game () {
	this.graph   = {};
	this.players = [];
	this.cplayer = 0;
	this.nround  = 0;
}

var game   = new Game();
var blue   = [];
var orange = [];
var red    = [];
var yellow = [];
var green  = [];
	
function initGame(n)
{
	console.log('initGame '+n);
	document.getElementById('startb').style.visibility='hidden';
	document.getElementById('numpl2').style.visibility='hidden';
	document.getElementById('numpl3').style.visibility='hidden';
	document.getElementById('numpl4').style.visibility='hidden';
	document.getElementById('numpl5').style.visibility='hidden';
	
	game.players.push( new Player('PL0', 0) );
	for (var i=1; i<n; i++) {
		game.players.push( new AI('AI'+i, i) );
	}
	
	initRound();
}

function initRound()
{
	document.getElementById('startb').style.visibility='hidden';
	
	initGraph();
	initMap();
	initCards();
	initPlayers();

	// Randomly choose the first player
	game.cplayer = Math.floor(Math.random() * game.players.length);
	
	// Start Round
	nextPlayer();	
}

function initCards()
{
	blue   = [ 'V25', 'V66', 'V103', 'V21', 'V46', 'V28', 'V51' ];
	orange = [ 'V105', 'V158', 'V195', 'V230', 'V88', 'V53', 'V141' ];
	red    = [ 'V189', 'V203', 'V173', 'V227', 'V165', 'V225', 'V193' ];
	yellow = [ 'V152', 'V80', 'V75', 'V149', 'V119', 'V95', 'V117' ];
	green  = [ 'V108', 'V90', 'V18', 'V54', 'V163', 'V1', 'V182' ];

	if (game.players.length==2) {
		// 2 Player game only: Remove the first 2 tickets from each set
		blue.pop();      blue.pop();  
		orange.pop();    orange.pop();
		red.pop();       red.pop();   
		yellow.pop();    yellow.pop();
		green.pop();	   green.pop();	
	}
			
	// Shuffle the set of cards
	shuffle(blue);
	shuffle(orange);
	shuffle(red);
	shuffle(yellow);
	shuffle(green);	
}

function initPlayer(player)
{
	player.destinations = [];
	player.open = [];
	player.closed = [];
	player.destinations.push(blue.pop());
	player.destinations.push(orange.pop());
	player.destinations.push(red.pop());
	player.destinations.push(yellow.pop());
	player.destinations.push(green.pop());
	
	if (player.id==0) {
		
		showCities(player);
			
	} else {
		
		// copy destinations to list of unconnected cities	
		for (var i=0; i<player.destinations.length; i++) {
			player.open.push( player.destinations[i] );
		}
		
		// shuffle the list of unconnected cities
		shuffle(player.open);
		
		// remove first city from list, and add it to the list of connected cities
		player.closed.push( player.open.pop() );
		 	
		player.selectTarget(); 	
	}		
}

function initPlayers()
{
	for (player of game.players) {
		initPlayer(player);
	}
}

function init()
{
	// Boot
	initGraph();
	createMap();
	
//   if ("ontouchstart" in document.documentElement) {
// 	  info('addEventListener touchstart');
//     document.getElementById('map').addEventListener('touchstart', clickedMap);
//   } else {
// 	  info('addEventListener click');
//     document.getElementById('map').addEventListener('click', clickedMap);
//   }   
	  info('addEventListener click');
    document.getElementById('map').addEventListener('click', clickedMap);
	
	// Hide the Start Round button
	document.getElementById('startb').style.visibility='hidden';
	
	// Wait for user to select 2,3,4 or 5 player game	
}


function nextPlayer()
{
	// check victory condition first
	if ( checkVictory() ) return;

	// if victory condition not met...
	// increment the current player id
	game.cplayer = (game.cplayer+1)%game.players.length;
	
	// display the current player's info
	info('Player\'s Turn: '+current().name);	
	info('');	
	for (player of game.players) {
		str  = player.name;
		str += ' | ';
		if (player.id==current().id)
		str += ' < ';
		info(str, true);	
	}
	
	if (game.cplayer==0) {
		document.getElementById('visor').style.visibility='visible';		
	} else {
		document.getElementById('visor').style.visibility='hidden';		
	}
	
	// start next players turn...
	current().turn();
}

function endRound()
{
	document.getElementById('visor').style.visibility='hidden';		
	document.getElementById('startb').style.visibility='visible';
	
	info('');

	var str, dist;
	for (player of game.players) 
	{
		showCities(player);
		
		dist = remaining_distance(player);

		str  = player.name;
		str += ' | ';
		str += player.score;
		str += ' - ';
		str += dist;
		str += ' = ';		
		player.score -= dist;
		str += player.score;
		
		if (dist==0) {
			str += ' | All cities connected';
		}
		
		info(str, true);	
	}
}


function Player(name, id)
{
	this.name = name;
	this.id = id;
	this.destinations = [];
	this.open = [];
	this.closed = [];
	this.moves = 0;
	this.score = 12;
}

function AI(name, id)
{
	this.name = name;
	this.id = id;
	this.destinations = [];
	this.open = [];
	this.closed = [];
	this.moves = 0;
	this.score = 12;
}

Player.prototype.turn = function()
{
	this.moves = 2;
}	

Player.prototype.move = function(va, vb)
{
	var w = game.graph[va][vb];
	
	if (w==0) {
		debug('This segment is already connected, cannot place a track there');
		return;
	}
	
	if (w <= this.moves) {	
		putTrack(va, vb);  
		this.moves -= w;
		debug(this.name+' -> moves remaining: '+this.moves);
	} else {
 	  debug('Not enough moves remaining, cannot place track');
	}

	if (this.moves==0) { 
		nextPlayer();
 	}	
}

function placeTrack(player, va, vb)
{
	var w = game.graph[va][vb];
	
	if (w==0) {
		debug('This segment is already connected, cannot place a track there');
		return;
	}
	
	if (w <= player.moves) {	
		putTrack(va, vb);  
		player.moves -= w;
		debug(player.name+' -> moves remaining: '+player.moves);
	} else {
 	  debug('Not enough moves remaining, cannot place track');
	}
}



AI.prototype.init = function() 
{
	this.destinations = [];
	this.open = [];
	this.closed = [];
	this.destinations.push(blue.pop());
	this.destinations.push(orange.pop());
	this.destinations.push(red.pop());
	this.destinations.push(yellow.pop());
	this.destinations.push(green.pop());
	
	// copy destinations to list of unconnected cities	
	for (var i=0; i<this.destinations.length; i++) {
		this.open.push( this.destinations[i] );
	}
	
	// shuffle the list of unconnected cities
	shuffle(this.open);
	
	// remove first city from list, and add it to the list of connected cities
	this.closed.push( this.open.pop() );
	
 	debug('ai_closed : '+this.closed);	
 	debug('ai_open   : '+this.open);		
 	
	this.selectTarget(); 		
}

AI.prototype.selectTarget = function()
{	
	debug('-- ai_selectTarget');
	
 	if (this.open.length==0) {
// 		info('!!! AI has connected all cities !!!');	
		return;
 	}
	
	// compute the cost from the starting city to all unconnected cities
 	var costs = [];
 	for (var i=0; i<this.open.length; i++) {
	 	costs[i] = cost( shortest(this.closed[0], this.open[i]) );
 	}

 	// find the city with the lowest cost
 	var idx = 0; 
 	for (var i=0; i<costs.length; i++) {
	  idx = costs[i]<costs[idx] ? i : idx;
  }	
 	 	 	 	
  // remove this city from the list of unconnected cities, and put it back at the top of the list
  // this city becomes the new target
  var t = this.open.splice(idx, 1);
  this.open.unshift( t[0] );
  
 	debug('-- ai_closed : '+this.closed);	
 	debug('-- ai_open   : '+this.open);	
 	debug('-- ai_target : '+this.open[0]+' '+cities[this.open[0]]);	 	
}

AI.prototype.updateTarget = function()
{
  // if the placed track connects with the target city, 
  // - remove target city from the list of unconnected and add to the list of connected ones
  // - find the next target city
  if ( cost(shortest(this.closed[0], this.open[0]))==0 ) {
	  debug('-- connected ' + cities[this.open[0]]); 
	  this.closed.push ( this.open.shift() );
	  this.selectTarget();
  } 			
}

AI.prototype.turn = function()
{		
	this.moves = 2;	
	this.updateTarget();
		
	setTimeout(function(ai){ ai.move() }, 1000, this);
	setTimeout(function(ai){ ai.move() }, 2000, this);
	setTimeout(nextPlayer, 								2010);
}

AI.prototype.move = function()
{
	debug('-- ai_move');
	
	// update path from starting city to target city
	var p = shortest(this.closed[0], this.open[0]);
		
	// traverse path until a non-zero weigth is found
	// weigth = 0 means a track is already in place
	// weigth > 0 means a track needs to be plaed
	var i = 0;
	var w = 0;
  for(i=0; i<(p.length-1); i++) {
	  w = game.graph[ p[i] ][ p[i+1] ];
	  if ( w > 0 ) {
		  if (w <= this.moves) {
			  // place track
		 	  placeTrack(this, p[i], p[i+1]);
	 	  } else {
		 	  debug('Not enough moves remaining, cannot place track');
		 	  this.moves = 0;
	 	  }
	 	  break;
 	  }
  }
	debug(this.name+' -> moves remaining: '+this.moves);
	
	this.updateTarget();  	  
}	
	
// --- Game routines ---

function remaining_distance(player)
{

  /* 
  Note: 
  still BROKEN if there are multiple unconnected cities 
  and when the best path to one of the cities involves 
  connecting to another city first
  */
	
	var dist = 0;
	var gclone = clone(game.graph);
		
	for (var j=1; j<5; j++) {	
		var p = shortestPath(gclone, player.destinations[0], player.destinations[j]).concat([player.destinations[0]]).reverse();
		for (var i=0; i<(p.length-1); i++) {
			dist += gclone[ p[i] ][ p[i+1] ];
			gclone[ p[i] ][ p[i+1] ] = 0;	 	
			gclone[ p[i+1] ][ p[i] ] = 0;	 	
	 	}
 	}
  	
	return dist;
}	

function current()
{
	return game.players[game.cplayer];
}
	
function showCities(player)
{
	for (city of player.destinations) {
		document.getElementById(city).classList.add('p'+player.id+'color');
	}
}


function checkVictory()
{
	var costs = [];
	var done = false;
	
	for (player of game.players) {
		if ( remaining_distance(player) == 0 )
			done = true;
	}
			
	if (done==true) 
	{
		endRound();
	} 
	
	return done;
}


function shortest(a,b)
{
	return shortestPath(game.graph, a, b).concat([a]).reverse();
}

function cost(p)
{
	var cost = 0;
	for (var i=0; i<(p.length-1); i++) {
		cost += game.graph[ p[i] ][ p[i+1] ];	 	
 	}
	return cost;
}

function vertexId(v)
{
	// Vertex ID is a string formatted as : V<id>
	// First remove the character (V)
	// Then convert the <id> from string to integer
	return parseInt( v.slice(-(v.length-1)) );	 
}

function arcName(a,b)
{
	// return string corresponding to the div ID of the arc between vertex a and b

	var str='';
	str+='arc'
	str+='-';
	
	if (vertexId(a)<vertexId(b)) {
		str+=a;
		str+='-';
		str+=b;
	} else {
		str+=b;
		str+='-';
		str+=a;
	}
		
	return str;		
}

function putTrack(a,b)
{
	debug('-- putTrack '+a+' '+b);
		
	// set the weight of the arc between a and b to 0
	game.graph[a][b]=0;
	game.graph[b][a]=0;
	
	// get name of DIV corresponding to arc between a and b
	var arc = arcName(a,b);
	
	// format the DIV as necessary
  document.getElementById(arc).classList.add('trackClicked');			
}

function clickedCity(event)
{
//	debug('clicked '+event.target.id + ' '+cities[event.target.id]);	
}

function clickedTrack(event)
{
//	selectTrack(event.target);
}

function clickedMap(event)
{
	info('clickedMap');
	var x = event.x-60;
  var y = event.y-40; 
	//console.log(event);
	console.log('click: '+x + ' '+y);   
	selectTrackFromXY(x, y);
}


function selectTrack(target)
{
	debug('clicked '+target.id + ' ' + target.VA + ' ' + target.VB);
	
	var player = current();
	
	if (player.id!=0) return;
	
//	current().move(target.VA, target.VB);
	
	placeTrack(player, target.VA, target.VB);
	
	if (player.moves==0) { 
		nextPlayer();
 	}	
}


function isEven(n) {
  return n == parseFloat(n)? !(n%2) : void 0;
}

function clone(obj) {
	return JSON.parse(JSON.stringify(obj));	
}

function shuffle(array) {
  var m = array.length, t, i;
  // While there rehand elements to shuffle
  while (m) {
    // Pick a rehanding element
    i = Math.floor(Math.random() * m--);
    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }  
  return array;
} 

function info(str, append)
{
	console.log(str);

	if (append!=true) {		
		document.getElementById('info').innerHTML=str;	
	} else {
		document.getElementById('info').innerHTML+='<BR>';
		document.getElementById('info').innerHTML+=str;
	}
}

function debug(str)
{
// 	console.log('   '+str);
}

// When the manifest file has changed and the browser has updated the files, 
// it won’t use them for the current session. The application must be reloaded 
window.applicationCache.addEventListener('updateready', function(e) {
	if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
	  // A changed manifest file has been found and downloaded by
	  // the browser. Swap cache and reload the page to use the new files.
	  console.log('A changed manifest file has been found and downloaded. Reloading app');
	  window.applicationCache.swapCache();
	  window.location.reload();
	}
}, false);



