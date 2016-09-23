
// ------------------------------------------------------------------
// - Game Constants
// ------------------------------------------------------------------

var SHIP_SECTION_DICE = [
	[ // Ship Section Die 1
		{attack: 6, defense:5, left:2, right:2},  // 0 Dammage
		{attack: 7, defense:6, left:2, right:1},  // 1 Dammage
		{attack: 9, defense:7, left:1, right:0},  // 2 Dammage
		{attack:10, defense:8, left:1, right:0}   // 3 Dammage
	],
	[ // Ship Section Die 2
		{attack: 5, defense:5, left:3, right:3},   // 0 Dammage
		{attack: 6, defense:6, left:2, right:3},   // 1 Dammage
		{attack: 7, defense:7, left:1, right:2},   // 2 Dammage
		{attack: 8, defense:8, left:1, right:1}    // 3 Dammage
	],                                           
	[ // Ship Section Die 3                      
		{repair: 6, defense:5, left:0, right:0},   // 0 Dammage
		{repair: 8, defense:6, left:0, right:0},   // 1 Dammage
		{repair: 9, defense:6, left:0, right:0},   // 2 Dammage
		{repair:11, defense:7, left:0, right:0}    // 3 Dammage
	],                                           
	[ // Ship Section Die 4                      
		{attack: 5, defense:5, left:3, right:3},   // 0 Dammage
		{attack: 7, defense:6, left:3, right:2},   // 1 Dammage
		{attack: 7, defense:7, left:2, right:1},   // 2 Dammage
		{attack: 8, defense:8, left:1, right:1}    // 3 Dammage
	],                                           
	[ // Ship Section Die 5                      
		{attack: 6, defense:5, left:2, right:2},   // 0 Dammage
		{attack: 7, defense:6, left:2, right:1},   // 1 Dammage
		{attack: 9, defense:7, left:0, right:1},   // 2 Dammage
		{attack:10, defense:8, left:0, right:1}    // 3 Dammage
	],	                                         
	[ // Ship Section Die 6                      
		{movement: 5, defense:6, left:0, right:0}, // 0 Dammage 
		{movement: 7, defense:7, left:0, right:0}, // 1 Dammage 
		{movement: 8, defense:8, left:0, right:0}, // 2 Dammage 
		{movement: 9, defense:9, left:0, right:0}  // 3 Dammage
	]		
];

var PIRATE_DICE = [
	{attack: 7, hitpoints: 2},
	{attack: 3, hitpoints: 6},
	{attack: 7, hitpoints: 3},
	{attack: 4, hitpoints: 4},
	{attack: 4, hitpoints: 8},
	{attack: 6, hitpoints: 4}
];

var THE_CAPTAIN       =  1;
var THE_DIPLOMAT      =  2;
var THE_STEAM_WELDER  =  3;
var THE_LIEUTENANT    =  4;
var THE_ENGINEER      =  5;
var THE_ABLE_CREW     =  6;

var ACTION_ATTACK     = 10;
var ACTION_MOVE_UP    = 11;
var ACTION_MOVE_DOWN  = 12;
var ACTION_SKIP       = 13;

var BONUS_MOVEMENT    = 20;
var BONUS_ATTACK      = 21;
var BONUS_DEFENSE     = 22;

var DAMAGE_MAP = [0,0,1,1,1,2,2,2,3,3,3,4];



// ------------------------------------------------------------------
// - Game State 
// ------------------------------------------------------------------

var game = {
	// The ship is an array of 6 values
	// Each of the 6 values corresponds to one of the 6 sections of the ship
	// and indicates the number of dammage taken by that section
	// The attack, defense, range, repair and movement values can be looked up
	// in the SHIP_SECTION_DICE array based on the damage value
	ship: [0,0,0,0,0,0],
	
	// The pirates are an array of 12 arrays
	// Each of the 12 arrays corresponds to one of the 12 positions around the ship
	// (6 to the right and 6 to the left) and keeps track of the potential multiple
	// pirats stacked in that position
	// Each pirate is an object with an attack value and number of hitpoints
	pirates: [[], [], [], [], [], [], [], [], [], [], [], []], 
	
	// The crew is a simple value (1..6) indicating the crew bonus
	crew: 0,
	
	// The various possible dice modifiers based on the crew
	bonus: {attack:0, defense:0, movement:0}
}

// ------------------------------------------------------------------
// - Helper Functions 
// ------------------------------------------------------------------

function playerHasWon()
{
	return (game.destroyed.length==6);
}

function playerHasLost()
{
	var cnt = 0;
	for (s in game.ship) {
		if (game.ship[s]==3) cnt++;
	}
	return (cnt>=4);
}


function damageShipSection(sectionId) {
	if (game.ship[sectionId]<3) 
		game.ship[sectionId]+=1;
}

function getSectionId(pirate)
{
	return (pirate.position<6)?pirate.position:(11-pirate.position);
}	

function getPirateSequence()
{
	var pirates = [];
	for (var pos=0; pos<12; pos++) {
		for (var p in game.pirates[pos]) {
			pirates.push(game.pirates[pos][p]);			
		}
	}
	return pirates;	
}

function getSectionById(id)
{
	return SHIP_SECTION_DICE[id][game.ship[id]];
}

function getPirateById(id)
{
	for (var pos=0; pos<12; pos++) {
		for (var p in game.pirates[pos]) {
			if (game.pirates[pos][p].id==id) {
				return game.pirates[pos][p];
			}
		}
	}
	return undefined;
}


function removePirate(pirate)
{
	if (pirate.position!==undefined) {
		var idx = game.pirates[pirate.position].indexOf(pirate);
		if (idx>=0) {
			game.pirates[pirate.position].splice(idx,1)[0];
		} else {
			console.log(' ### ERROR: removePirate '+pirate);
		}
	}
}

function setPiratePosition(pirate, pos)
{
	removePirate(pirate);
	pirate.position = pos;
	game.pirates[pos].push(pirate);
}

function destroyPirate(pirate)
{
	removePirate(pirate);
	game.destroyed.push(pirate);
}

function getAttackingSection()
{
	return (game.attackround<6)?game.attackround:(11-game.attackround);
}

function pirateAttackSuccessful(d12, pirate) 
{
	if ( d12>pirate.attack ) {
		console.log('pirate '+pirate.id+' attack successful / '+d12+' >= '+pirate.attack);					
		return true;
	} else {
		console.log('pirate '+pirate.id+' attack not successful / '+d12+' < '+pirate.attack);	
		return false;
	}
}

function sectionDefenseSuccessful(d12, sectionId) 
{
	if ((d12 + game.bonus.defense)>getSectionById(sectionId).defense) {
		console.log('section defenses hold. no damage incurred / '+d12+'+'+game.bonus.defense+' > '+getSectionById(sectionId).defense);	
		return true;
	} else {
		console.log('section defenses fail. damage is incurred / '+d12+'+'+game.bonus.defense+' <= '+getSectionById(sectionId).defense);	
		return false;
	}
}


function sectionAttackSuccessful(d12, sectionId) 
{
	return ( (d12+game.bonus.attack) > getSectionById(sectionId).attack );
}

function movementRollSuccessful(d12)
{
	return ( (d12 + game.bonus.movement) > getSectionById(5).movement );	
} 

function repairRollSuccessful(d12)
{
	return ( d12 > getSectionById(2).repair );	
} 

function repairSection(sectionId) 
{
	game.ship[sectionId]-=1;	
}

function repairPossible()
{
	var hits = 0;
	for (var i=0; i<6; i++) hits += game.ship[i];
	return (hits>0);
}


function getTargets(sectionId, side)
{
	if ((side!='left') && (side!='right')) return [];
	if ((sectionId<0) || (sectionId>5)) return [];
	
	var targets = [];	
		
	if (side=='right') {
		var range = getSectionById(sectionId).right;
		for (var pos=sectionId-range; pos<sectionId+range; pos++) {
			if (pos<0) continue;
			if (pos>5) continue;		
			var distance = Math.abs(sectionId-pos);				
			for (var p in game.pirates[pos]) {
				distance++;
				if (distance<=range) {
					targets.push(game.pirates[pos][p].id);
				} else {
					break;
				}
			}
		}
	}
	if (side=='left') {
		var range = getSectionById(sectionId).left;
		for (var pos=11-sectionId-range; pos<11-sectionId+range; pos++) {
			if (pos< 6) continue;
			if (pos>11) continue;		
			var distance = Math.abs(11-sectionId-pos);			
			for (var p in game.pirates[pos]) {
				distance++;
				if (distance<=range) {
					targets.push(game.pirates[pos][p].id);
				} else {
					break;
				}
			}
		}
	}	
	return targets;
}


function canAttack()
{
	return (game.has_attacked==false);
	
}
function canMoveShipDown()
{
	return ((game.has_moved==false) && (game.pirates[0].length==0) && (game.pirates[11].length==0));
}

function canMoveShipUp()
{
	return ((game.has_moved==false) && (game.pirates[5].length==0) && (game.pirates[6].length==0));
}