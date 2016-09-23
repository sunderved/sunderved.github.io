
var pirateAttackFSM = (function(id)
{	
	function waitForNewPirateAttackPhase() {
		if (game.crew == THE_DIPLOMAT) {
	  	UI_info('The Diplomat: select a pirate');
		  UI_showDiplomatTargets();
			next = waitForSelectedPirate;
		} else {
			getListOfAttackingPirates();
		}
	}
	function waitForSelectedPirate(id) {
	  console.log('DIPLOMAT: pirate '+id+' won\'t attack next turn');
	  getPirateById(id).can_attack = false;
		getListOfAttackingPirates();
  };
	function getListOfAttackingPirates() {
		// Get the list of all the pirates
		var tmp = getPirateSequence();
		// Only keep the ones which can attack
		while (tmp.length>0) {
			var p = tmp.shift();
			if (p.can_attack==true)
				pirates.push(p);
		}
		waitForEndOfAllPirateAttacks();
	};
	function waitForEndOfAllPirateAttacks() {
		if (pirates.length>0) {
			UI_info('Sky Pirates Attack');
			pirateAttack(pirates.shift());
			next = waitForEndOfAllPirateAttacks;
		} else {
			next = waitForNewPirateAttackPhase;
		}
	};		
	var pirates = [];	
	var initial = waitForNewPirateAttackPhase;
	var next    = initial;	  
	return function (id) {
	  next(id);
	  return (next==initial)?0:1;
	}
})();	


var pirateMoveFSM = (function(id)
{
	function getListOfMovingPirates() {
		// Get the list of all the pirates
		pirates = getPirateSequence();
		carryPirateMoves();
	}
	function carryPirateMoves() {
		if (pirates.length>0) {
			UI_info('Sky Pirates Move');
			movePirate(pirates.shift());
			next = carryPirateMoves;
		} else {
			next = getListOfMovingPirates;
		}			
	}	
	var pirates = [];	
	var initial = getListOfMovingPirates;
	var next    = initial;	  
	return function (id) {
	  next(id);
	  return (next==initial)?0:1;
	}
})();	

var playerAttackFSM = (function(id)
{
	var sectionId;
	var side;

	function waitForNewAttackPhase() {
		game.attackround=-1;
		moveToNextSection();
	}
	
	function moveToNextSection() {
		game.attackround++;
		if (game.attackround<12) {
			getAttackTargets();
		} else {
			console.log('Attack phase completed');
			next = waitForNewAttackPhase;
		}
	}
	
	function getAttackTargets() {
		sectionId = getAttackingSection();
		side      = (game.attackround>5)?'left':'right';
		var targets = getTargets(sectionId, side); 
		if (targets.length>0) {
	  	UI_info('Select a Sky Pirate to Attack');
			UI_showAttackTargets(sectionId, side, targets);
			next = waitForSelectedPirate;
		} else {
			moveToNextSection();
		}
	}

	function waitForSelectedPirate(id) {
  	UI_info('');
		attackPirate(sectionId, side, getPirateById(id));
		next = waitForEndOfAnimation;
	}
		
	function waitForEndOfAnimation() {
		moveToNextSection();
	}
		
	var initial = waitForNewAttackPhase;
	var next    = initial;	  
	return function (id) {
	  next(id);
	  return (next==initial)?0:1;
	}
})();

var moveShipUpFSM = (function(id)
{
	function waitForCommand() {
		moveShipUp();
		next = waitForEndOfAnimation;
  };
	function waitForEndOfAnimation(id) {
		next = waitForCommand;
  };
	var initial = waitForCommand;
	var next    = initial;	  
	return function (id) {
	  next(id);
	  return (next==initial)?0:1;
	}
})();

var moveShipDownFSM = (function(id)
{
	function waitForCommand() {
		moveShipDown();
		next = waitForEndOfAnimation;
  };
	function waitForEndOfAnimation(id) {
		next = waitForCommand;
  };
	var initial = waitForCommand;
	var next    = initial;	  
	return function (id) {
	  next(id);
	  return (next==initial)?0:1;
	}
})();		

var actionPhaseFSM = (function(id)
{
	var numActions;
	var maxActions
	var selectedAction;

	function waitForNewActionPhase() 
	{
		numActions = 0;
		maxActions = (game.crew==THE_LIEUTENANT)?2:1;
		proposePossibleActions();
	}
	function proposePossibleActions()
	{
		numActions++;
		if (numActions==1) {
		  UI_info('Player Action: Attack or Move Ship');
	  } else {
 		  UI_info('Lieutenant: Take Another Action');
		}	
	  UI_showActions();
	  next = waitForSelectedAction;
	}
	function waitForSelectedAction(id)
	{
		switch (id) {
			case ACTION_MOVE_UP: 
				selectedAction = moveShipUpFSM;
				break;
			case ACTION_MOVE_DOWN: 
				selectedAction = moveShipDownFSM;
				break;
			case ACTION_ATTACK: 
				selectedAction = playerAttackFSM;
				break;
			case ACTION_SKIP:
				selectedAction = skipAction;
				break;
			default: 
				UI_info('### ACTION SELECTION ERROR ###');
				selectedAction = skipAction;
				break;
		}
		waitForActionCompletion();
	}
	function waitForActionCompletion(id)
	{
		if (selectedAction(id)==0) {
			if ( playerHasWon() ) {
			  UI_info('Victory!');
			  UI_hideRolls();
			  next = waitForNewActionPhase;
			}	else {
				if ( numActions==maxActions) {
					UI_hideRolls();	
				  next = waitForNewActionPhase;
				} else {
					proposePossibleActions();
				}
			}		
		} else {
			next = waitForActionCompletion;
		}
	}
	var initial = waitForNewActionPhase;
	var next    = initial;	  
	return function (id) {
	  next(id);
	  return (next==initial)?0:1;
	}
})();


var repairPhaseFSM = (function(id)
{
	function waitForNewRepairPhase()
	{
		if (game.crew==THE_ENGINEER) {
		  checkEngineerRepair();
		}	else {
			checkPlayerRepair();
		}	
	}		
	function checkEngineerRepair()
	{
	  if ( repairPossible() ) {
		  UI_info('Engineer: Choose a Section to Repair');
		  UI_showRepairTargets();
		  next = waitForSelectedSectionForEngineer;
		} else {
			console.log('Ship has no damage. Skipping Engineer repair phase');
		  next = waitForNewRepairPhase;
		}
	}		
	function waitForSelectedSectionForEngineer(id)
	{
		repairSectionWithEngineer(id);
		next = waitForEndOfAnimationForEngineerRepair;
	}
	function waitForEndOfAnimationForEngineerRepair()
	{
		checkPlayerRepair();
	}
	function checkPlayerRepair()
	{
	  if ( repairPossible() ) {
		  UI_info('Choose a Section to Repair');
		  UI_showRepairTargets();
		  next = waitForSelectedSectionForPlayer;
		} else {
			console.log('Ship has no damage. Skipping repair phase');
		  next = waitForNewRepairPhase;
		}	
	}
	function waitForSelectedSectionForPlayer(id)
	{
		repairSectionWithRoll(id)
		next = waitForEndOfAnimationForPlayerRepair;
	}
	function waitForEndOfAnimationForPlayerRepair()
	{
		next = waitForNewRepairPhase;
	}
	
	var initial = waitForNewRepairPhase;
	var next    = initial;	  
	return function (id) {
	  next(id);
	  return (next==initial)?0:1;
	}
})();

var crewRerollPhaseFSM = (function(id)
{
	function waitForNewCrewRerollPhase() {
	  UI_info('New Crew Member on Deck');
	  updateCrew();
		next = waitForEndOfAnimation;
	}
	function waitForEndOfAnimation()
	{
		if (game.crew == THE_ABLE_CREW) {
			setupAbleCrewBonusSelection();
		} else {
			next = waitForNewCrewRerollPhase;			
		} 		
	}
	function setupAbleCrewBonusSelection()
	{
  	UI_info('The Able Crew: Select a Bonus');
	  UI_showAbleCrewTargets();
	  next = waitForAbleCrewBonusSelection;
	}
	function waitForAbleCrewBonusSelection(id)
	{
	  switch (id) {
		  case BONUS_MOVEMENT : game.bonus.movement = 1; break;
		  case BONUS_ATTACK   : game.bonus.attack   = 1; break;
		  case BONUS_DEFENSE  : game.bonus.defense  = 1; break;
	  }
		next = waitForNewCrewRerollPhase;				  		
	}	
	var initial = waitForNewCrewRerollPhase;
	var next    = initial;	  
	return function (id) {
	  next(id);
	  return (next==initial)?0:1;
	}
})();	


function newTurn()
{
  // Start of turn, reset of turn specific parameters
  game.has_attacked = false;
  game.has_moved    = false;
  	  
	var pirates = getPirateSequence();	  
  while (pirates.length>0) {
		var pirate = pirates.shift();
		pirate.can_attack = true;
	}	
}

var GameFSM = (function(id)
{
	function initialize() {
		setupGame();
		next = waitForEndOfInitPhase;
	}
	function waitForEndOfInitPhase()
	{
		startNewTurn();
	}
	function startNewTurn()
	{
	  newTurn();
	  waitForEndOfPhase1()		
	}
	function waitForEndOfPhase1(id)
	{
		next = waitForEndOfPhase1;
		if ( pirateAttackFSM(id) == 0 ) { 
			if ( playerHasLost() ) { 
				UI_info('Defeat...'); 
				UI_hideRolls(); 
				waitForNewGame();
			} else {
				waitForEndOfPhase2(id);
			}
		}	
	}
	function waitForEndOfPhase2(id)
	{
		next = waitForEndOfPhase2;
		if ( pirateMoveFSM(id) == 0 ) { 
			waitForEndOfPhase3(id);
		}	
	}
	function waitForEndOfPhase3(id)
	{
		next = waitForEndOfPhase3;
		if ( actionPhaseFSM(id) == 0 ) {
			if ( playerHasWon(id) ) {
				waitForNewGame(id);
			} else {
				waitForEndOfPhase4();
			}
		}	
	}
	function waitForEndOfPhase4(id)
	{
		next = waitForEndOfPhase4;
		if ( repairPhaseFSM(id) == 0 ) { 
			waitForEndOfPhase5(id);
		}	
	}
	function waitForEndOfPhase5(id)
	{
		next = waitForEndOfPhase5;
		if ( crewRerollPhaseFSM(id) == 0 ) { 
			startNewTurn();
		}	
	}
	function waitForNewGame(id)
	{
		next = waitForNewGame;
	}

	var initial = initialize;
	var next    = initial;	  
	return function (id) {
	  next(id);
	  return (next==initial)?0:1;
	}
})();	

function Next(id) { 
	GameFSM(id);
}

// ------------------------------------------------------------------

function clickedPirate(id)
{
	UI_defocus('pirate0');  UI_defocus('section0');
	UI_defocus('pirate1');  UI_defocus('section1');
	UI_defocus('pirate2');  UI_defocus('section2');
	UI_defocus('pirate3');  UI_defocus('section3');
	UI_defocus('pirate4');  UI_defocus('section4');
	UI_defocus('pirate5');  UI_defocus('section5');
		
	Next(id);
}

function clickedSection(id)
{
	UI_defocus('pirate0');  UI_defocus('section0');
	UI_defocus('pirate1');  UI_defocus('section1');
	UI_defocus('pirate2');  UI_defocus('section2');
	UI_defocus('pirate3');  UI_defocus('section3');
	UI_defocus('pirate4');  UI_defocus('section4');
	UI_defocus('pirate5');  UI_defocus('section5');
		
	Next(id);
}

function clickedAction(id)
{
	UI_hideActions();
	
	Next(id);
}

function clickedNumber(id)
{
  UI_disableClick('number2');  UI_hide('number2');
  UI_disableClick('number3');  UI_hide('number3');
  UI_disableClick('number4');  UI_hide('number4');
	
	Next(id);
}

        
// ------------------------------------------------------------------
// - Setup Game
// ------------------------------------------------------------------

function setupGame() 
{
  console.log('Setup');
	UI_hideRolls();
	UI_hideActions();
	
	game = {
		ship: [0,0,0,0,0,0],
		pirates: [[], [], [], [], [], [], [], [], [], [], [], []], 
		crew: 0,
		bonus: {attack:0, defense:0, movement:0},
		destroyed: []
	};
	UI_updateShip();
	UI_hide('crew');	
	
	function initPirate(i) {
		var d6  = rollD6(); d6--;
		var d12 = rollD12(); d12--;
				
		console.log('pirate '+i+', position '+d12);
		
		var pirate = {	
			id: i,
			type: d6,
			attack: PIRATE_DICE[d6].attack, 
			hitpoints: PIRATE_DICE[d6].hitpoints
		};
						
		setPiratePosition( pirate, d12 );
		UI_initPirate(pirate);		
		
		setTimeout( function() {   
			UI_info('Pirates Arrive!'); 
			UI_updatePirates(); 
		}, 500 );
	}
	
	setTimeout( function() { initPirate(0); },  600);
	setTimeout( function() { initPirate(1); }, 1200);
	setTimeout( function() { initPirate(2); }, 1800);
	setTimeout( function() { initPirate(3); }, 2400);
	setTimeout( function() { initPirate(4); }, 3000);
	setTimeout( function() { initPirate(5); }, 3600);
		
	setTimeout(Next, 5500);	
}

function UI_initPirate(pirate)
{
	var pos2row = [1,2,3,4,5,6,6,5,4,3,2,1];
	var row = 'row'+pos2row[pirate.position];
	var col = (pirate.position<6)?'arriveFromRight':'arriveFromLeft';	
	var orientation = (pirate.position<6)?'pright':'pleft';	
	document.getElementById('pirate'+pirate.id).className = 'pirate'+' '+row+' '+col;
	document.getElementById('pirate'+pirate.id+'txt').innerHTML = '('+pirate.id+') '+pirate.attack+'/'+pirate.hitpoints;		
	document.getElementById('pirate'+pirate.id+'img').className = 'pirate'+' pirate'+pirate.type+' '+orientation;	
}





// ------------------------------------------------------------------
// - Air Pirate Actions
// ------------------------------------------------------------------

function pirateAttack(pirate)
{	
	var sectionId = getSectionId(pirate);
	var defense = getSectionById(sectionId).defense;
	var roll1 = rollD12();
	var roll2 = rollD12();
	var hit = false;
			
	if ( pirateAttackSuccessful(roll1, pirate) ) {
		if ( sectionDefenseSuccessful(roll2, sectionId) ) {
			UI_showPirateRolls(pirate, sectionId, defense, roll1, roll2, false);
		} else {
			damageShipSection(sectionId);
			UI_showPirateRolls(pirate, sectionId, defense, roll1, roll2, true);
		}
	} else {
		UI_showPirateRolls(pirate, sectionId, defense, roll1, undefined, false);
	}		
}

function movePirate(pirate)
{
	var d12 = rollD12();
	var pos = pirate.position;
	if (d12<5) {
		// Move 1 position counterclockwise (pos-1)
		setPiratePosition(pirate, (pos==0)?11:(pos-1));
		console.log('pirate '+pirate.id+' moves counterclockwise / '+d12+': '+pos+' -> '+((pos==0)?11:(pos-1)));
		UI_updatePirates();
		setTimeout(Next, 1500);			
	} else if (d12<9) {
		// Stay at same position
		console.log('pirate '+pirate.id+' stays in the same place / '+d12+': '+pos+' -> '+((pos)%12));	
		setTimeout(Next, 10);			
	} else {
		// Move 1 position clockwise (pos+1)
		setPiratePosition(pirate, (pos==11)?0:(pos+1));
		console.log('pirate '+pirate.id+' moves clockwise / '+d12+': '+pos+' -> '+((pos==11)?0:(pos+1)));	
		UI_updatePirates();
		setTimeout(Next, 1500);			
	}
}

// ------------------------------------------------------------------
// - Player Actions
// ------------------------------------------------------------------

function skipAction()
{
	console.log('Skipping Action');
	return 0;
}

function moveShipDown()
{
	game.has_moved = true;
	
	var d12 = rollD12();
	if ( movementRollSuccessful(d12) ) {
		console.log('ship successfully moves down / '+d12+' > '+getSectionById(5).movement);	
		var pirates = getPirateSequence();
		for (var p in pirates) {
			var pirate = pirates[p];
			if (pirate.position<6) {
				setPiratePosition(pirate, pirate.position-1);
			} else if (pirate.position>5) {
				setPiratePosition(pirate, pirate.position+1);
			}
		}				
		UI_showMovementRolls(d12, 'Down');								
	} else {
		UI_showMovementRolls(d12, undefined);								
		console.log('ship fails to move down / '+d12+' <= '+getSectionById(5).movement);	
	}	
	
	return 0;	
}

function moveShipUp()
{	
	game.has_moved = true;
	
	var d12 = rollD12();
	if ( movementRollSuccessful(d12) ) {
		console.log('ship successfully moves up / '+d12+' > '+getSectionById(5).movement);	
		var pirates = getPirateSequence();
		for (var p in pirates) {
			var pirate = pirates[p];
			if (pirate.position<5) {
				setPiratePosition(pirate, pirate.position+1);
			} else if (pirate.position>6) {
				setPiratePosition(pirate, pirate.position-1);
			}
		}				
		UI_showMovementRolls(d12, 'Up');								
	} else {
		UI_showMovementRolls(d12, undefined);								
		console.log('ship fails to move up / '+d12+' <= '+getSectionById(5).movement);	
	}		
	
	return 0;
}


function attackPirate(sectionId, side, pirate)
{	
	var roll1 = rollD12();
	var roll2 = rollD12();
	game.has_attacked = true;
	if ( sectionAttackSuccessful(roll1, sectionId) ) {
		var damage = DAMAGE_MAP[roll2-1]; 
		pirate.hitpoints = Math.max(pirate.hitpoints - damage, 0);
		if (pirate.hitpoints>0) {
			console.log('ship section '+sectionId+' does '+damage+' damage to pirate '+pirate.id+'. remaining hitpoints: '+pirate.hitpoints);	
		} else {
			console.log('ship section '+sectionId+' does '+damage+' damage to pirate '+pirate.id+'. pirate destroyed!');	
			destroyPirate(pirate);
		}
		UI_showAttackRolls(sectionId, side, pirate, roll1, roll2, damage);
	} else {
		console.log('ship section '+sectionId+' attack on pirate '+pirate.id+' failed / '+roll1+' <= '+getSectionById(sectionId).attack);	
		UI_showAttackRolls(sectionId, side, pirate, roll1, undefined, undefined);
	}	
}

function repairSectionWithRoll(sectionId)
{	
	var d12 = rollD12();			
	var threshold = getSectionById(2).repair;
	if ( repairRollSuccessful(d12) ) {
		console.log('ship section '+sectionId+' successfully repaired / '+d12+' > '+threshold);	
		repairSection(sectionId);
		UI_showRepairRolls(threshold, d12, true);				
	} else {
		console.log('ship section '+sectionId+' not repaired / '+d12+' <= '+threshold);	
		UI_showRepairRolls(threshold, d12, false);				
	}	
}

function repairSectionWithEngineer(sectionId)
{	
	console.log('ship section '+sectionId+' successfully repaired by the engineer');	
	repairSection(sectionId);
	UI_showEngineerRepair();
}


function updateCrew()
{
	game.crew = rollD6();
			
	game.bonus = {attack:0, defense:0, movement:0};

	if (game.crew==THE_CAPTAIN)      game.bonus.attack  = 1;
	if (game.crew==THE_STEAM_WELDER) game.bonus.defense = 1;
	

	var crewstr = ['?','The Captain','The Diplomat','The Steam Welder','The Lieutenant','The Engineer','The Able Crew'];    	

	console.log('crew member on deck: '+game.crew+' '+crewstr[game.crew]);
	
  UI_updateCrew();		
}






// ------------------------------------------------------------------
// - Debug Functions 
// ------------------------------------------------------------------

function showPositions()
{
	console.log('---------------------------------');
	for (var pos in game.pirates) {
		for (var p in game.pirates[pos]) {
			var pirate = game.pirates[pos][p];
			console.log('pirate '+pirate.id+', position '+pos);	
		}
	}	
	console.log('---------------------------------');
}



// ------------------------------------------------------------------
// - Init Function (Entry Point) 
// ------------------------------------------------------------------

function init()
{
	console.log('init');	
	
	UI_init();	
	
	Next();	     
}

// ------------------------------------------------------------------
// - Standard Utility Routines 
// ------------------------------------------------------------------

var d6queue = [];
var d6faces = [1,2,3,4,5,6];
function rollD6()
{
	for (var i=0; i<10; i++) shuffle(d6faces);
	
	if (d6queue.length===0) {
  	return d6faces[0]; // Math.floor(Math.random() * 6) + 1 ;
  } else {
  	return d6queue.shift();
  }
}

var d12queue = [];
var d12faces = [1,2,3,4,5,6,7,8,9,10,11,12];
function rollD12()
{
	for (var i=0; i<10; i++) shuffle(d12faces);
	
	if (d12queue.length===0) {
  	return d12faces[0]; // Math.floor(Math.random() * 12) + 1 ;
  } else {
  	return d12queue.shift();
  }
}


function shuffle(array) {
  var m = array.length, t, i;
  // While there remain elements to shuffle
  while (m) {
    // Pick a remaining element
    i = Math.floor(Math.random() * m--);
    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }  
  return array;
} 

// ------------------------------------------------------------------
// - Application Cache Management 
// ------------------------------------------------------------------

// When the manifest file has changed and the browser has updated the files, 
// it wont use them for the current session. The application must be reloaded 
window.applicationCache.addEventListener('updateready', function(e) {
	if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
    // A changed manifest file has been found and downloaded by
    // the browser. Swap cache and reload the page to use the new files.
    console.log('A changed manifest file has been found and downloaded. Reloading app');
    deleteGame();
    window.applicationCache.swapCache();
    window.location.reload();
  }
}, false);
