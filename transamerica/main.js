var blue   = [ 'V25', 'V66', 'V103', 'V21', 'V46', 'V28', 'V51' ];
var orange = [ 'V105', 'V158', 'V195', 'V230', 'V88', 'V53', 'V141' ];
var red    = [ 'V189', 'V203', 'V173', 'V227', 'V165', 'V225', 'V193' ];
var yellow = [ 'V152', 'V80', 'V75', 'V149', 'V119', 'V95', 'V117' ];
var green  = [ 'V108', 'V90', 'V18', 'V54', 'V163', 'V1', 'V182' ];


var players = [];

function init()
{
	createMap();
		
	players.push( new Player('Player 1', 1) );
	players.push( new AI('Player 2', 2) );
	players.push( new AI('Player 3', 3) );
	players.push( new AI('Player 4', 4) );
	
	if (players.length==2) {
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
	
	for (pl of players) {
		pl.init();
	}

	shuffle(players);
		
	players[0].turn();
}

function nextPlayer()
{
	// remove player[0] from the list of players and put it at the back of the queue
	players.push(players.shift());
	
	// player[0] is now the new current player
	// start his turn...
	players[0].turn();
}


function Player(name, id)
{
	this.name = name;
	this.id = id;
	this.destinations = [];
	this.startpoint = undefined;
	this.moves = 0;
}
	
Player.prototype.init = function() 
{
	this.destinations.push(blue.pop());
	this.destinations.push(orange.pop());
	this.destinations.push(red.pop());
	this.destinations.push(yellow.pop());
	this.destinations.push(green.pop());		
	
	showcities(this);	
}

Player.prototype.turn = function()
{
	if ( checkvictory() ) return;	
	info(this.name+' -> start of turn');
	this.moves = 2;
}	

function AI(name, id)
{
	this.name = name;
	this.id = id;
	this.destinations = [];
	this.startpoint = undefined;
	this.open = [];
	this.closed = [];
	this.moves = 0;
}

AI.prototype.init = function() 
{
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
	this.startpoint = this.closed[0];
	
 	debug('ai_closed : '+this.closed);	
 	debug('ai_open   : '+this.open);		
 	
	this.select_target(); 		
}

AI.prototype.select_target = function()
{	
	debug('-- ai_select_target');
	
 	if (this.open.length==0) {
		info('!!! AI has connected all cities !!!');	
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

AI.prototype.turn = function()
{
	if ( checkvictory() ) return;
	
	info(this.name+' -> start of turn');
	
	this.moves = 2;
	
	
  // if the placed track connects with the target city, 
  // - remove target city from the list of unconnected and add to the list of connected ones
  // - find the next target city
  if ( cost(shortest(this.closed[0], this.open[0]))==0 ) {
	  debug('-- connected ' + cities[this.open[0]]); 
	  this.closed.push ( this.open.shift() );
	  this.select_target();
  } 		
	
	this.move();
	
  if ( cost(shortest(this.closed[0], this.open[0]))==0 ) {
	  debug('-- connected ' + cities[this.open[0]]); 
	  this.closed.push ( this.open.shift() );
	  this.select_target();
  } 		
  	
	this.move();
	
  if ( cost(shortest(this.closed[0], this.open[0]))==0 ) {
	  debug('-- connected ' + cities[this.open[0]]); 
	  this.closed.push ( this.open.shift() );
	  this.select_target();
  } 		
	
  nextPlayer();
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
	  w = g.vertices[ p[i] ][ p[i+1] ];
	  if ( w > 0 ) {
		  if (w <= this.moves) {
			  // place track
		 	  putTrack(p[i], p[i+1]);
		 	  this.moves -= w;
	 	  } else {
		 	  debug('Not enough moves remaining, cannot place track');
	 	  }
	 	  break;
 	  }
  }
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


	/*
	if (player.startpoint==undefined) 
		return Infinity;
	
	var c = 0;
	for (city of player.destinations) {
		c += cost( shortest(player.startpoint, city) );
	}

	return c;	
	*/
	
	var dist = 0;
	var gclone = new Graph();
	for (v in g.vertices)	{
		gclone.addVertex(v, clone(g.vertices[v]));
	}
		
	for (var j=1; j<5; j++) {	
		var p = gclone.shortestPath(player.destinations[0], player.destinations[j]).concat([player.destinations[0]]).reverse();
		for (var i=0; i<(p.length-1); i++) {
			dist += gclone.vertices[ p[i] ][ p[i+1] ];
			gclone.vertices[ p[i] ][ p[i+1] ] = 0;	 	
			gclone.vertices[ p[i+1] ][ p[i] ] = 0;	 	
	 	}
 	}
  	
	return dist;
}	
	
function showcities(player)
{
	for (city of player.destinations) {
		document.getElementById(city).classList.add('p'+player.id+'color');
	}
}


function checkvictory()
{
	var costs = [];
	var done = false;
	
	for (player of players) {
		if ( remaining_distance(player) == 0 )
			done = true;
	}
			
	if (done==true) 
	{
 		info('');
		for (player of players) {
			showcities(player);
			var dist = remaining_distance(player)
			if ( dist == 0 ) {
				info(player.name+' has connected all his cities', true)	
			} else {
				info(player.name+' remaining distance: '+dist, true)
			}
		}
// 		info('----------------------------------', true);		
	} 
	
	return done;
}


function shortest(a,b)
{
	return g.shortestPath(a, b).concat([a]).reverse();
}

function cost(p)
{
	var cost = 0;
	for (var i=0; i<(p.length-1); i++) {
		cost += g.vertices[ p[i] ][ p[i+1] ];	 	
 	}
	return cost;
}

function vertexid(v)
{
	// Vertex ID is a string formatted as : V<id>
	// First remove the character (V)
	// Then convert the <id> from string to integer
	return parseInt( v.slice(-(v.length-1)) );	 
}

function arcname(a,b)
{
	// return string corresponding to the div ID of the arc between vertex a and b

	var str='';
	str+='arc'
	str+='-';
	
	if (vertexid(a)<vertexid(b)) {
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
	g.vertices[a][b]=0;
	g.vertices[b][a]=0;
	
	// get name of DIV corresponding to arc between a and b
	var arc = arcname(a,b);
	
	// format the DIV as necessary
  document.getElementById(arc).classList.add('trackClicked');			
}

function clickedCity(event)
{
	debug('clicked '+event.target.id + ' '+cities[event.target.id]);	
}

function clickedTrack(event)
{
	debug('clicked '+event.target.id + ' ' + event.target.VA + ' ' + event.target.VB);
	
	var w = g.vertices[event.target.VA][event.target.VB];
	
	if (w==0) {
		info('This segment is already connected, cannot place a track there');
		return;
	}

	if (players[0].startpoint==undefined) {
		players[0].startpoint = event.target.VA;  
	} 
	
	if (w <= players[0].moves) {	
		putTrack(event.target.VA, event.target.VB);  
		players[0].moves -= w;
		info(players[0].name+' -> moves remaining: '+players[0].moves);
	} else {
 	  info('Not enough moves remaining, cannot place track');
	}

	if (players[0].moves==0) { 
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




