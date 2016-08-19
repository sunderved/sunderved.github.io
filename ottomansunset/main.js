

function GameState () 
{	
	this.TurkishNationalWill = 0;
	this.Victories = [];
	this.Defeats = [];
	this.Stalemates = [];
	this.Front = {
		Sinai: 6,
		Mesopotamia: 5,
		Caucasus: 5,
		Arab: undefined,
		Salonika: undefined,
		Gallipoli: undefined,
	};	
	this.Army = {
		Sinai: 3,
		Mesopotamia: 3,
		Caucasus: 2,
		Arab: undefined,
		Salonika: undefined,
		Gallipoli: undefined,
	};	
	this.Blocked = {
		Sinai: false,
		Mesopotamia: false,
		Caucasus: false,
		Arab: false,
		Salonika: false,
		Gallipoli: false,
		Theatres: false,
		IntelligenceBureau: false,
		Narrows: false
	};	
	this.DRM = {
  	Sinai: 0, 
  	Mesopotamia: 0, 
  	Caucasus: 0, 
  	Arab: 0, 
  	Gallipoli: 0, 
  	Salonika: 0, 
  	Kaiserchlacht: 0
  };	
	this.Theatre = {
		Western: 0, 
		Naval: 0, 
		Eastern: 0
	};
	this.Resources = 6;
	this.WarWeariness = 0;
	this.IntelligenceBureau = undefined;
	this.Yildirim = 0;
	this.AsiaKorps = 0;
	this.GazaBeershebaFortifications = 0;
	this.SinaiPipelineBuilt = false;
	this.StraitsClosed = false;	
	this.Kaiserschlacht = false;
	this.KaiserschlachtBattles = ['Kaiserschlacht1', 'Kaiserschlacht2', 'Kaiserschlacht3', 'Kaiserschlacht4', 'Kaiserschlacht5', 'Kaiserschlacht6'];
	this.ImperialRussia = true;
	this.BritishFortitude = undefined;	
	this.ConstantinopleTaken = false;
	this.NarrowsForced = false;
	this.Narrows = {
		Seddulbahir: 		true,
		Mumkale: 				true,
		Minefield_1: 		false,
		Yildiz: 				false,
		Dardanos: 			false,
		Minefield_2: 		false,
		Canakkale: 			true,
		Nagara: 				false,
		Constantinople: true
	}; 	
	this.Deck = [];
};

var KaiserschlachtBattleValues = {
	Kaiserschlacht1: 3,
	Kaiserschlacht2: 3,
	Kaiserschlacht3: 4,
	Kaiserschlacht4: 4,
	Kaiserschlacht5: 5,
	Kaiserschlacht6: 5
};

var NarrowsDefenseValues = {
	Seddulbahir: 		4,
	Mumkale: 				2,
	Minefield_1: 		4,
	Yildiz: 				3,
	Dardanos: 			3,
	Minefield_2: 		4,
	Canakkale: 			2,
	Nagara: 				3,
	Constantinople: 4
}		


var game = new GameState();
var card;

function expect(v)
{
	game.expected = v;
	if (game.next!=game.expected) { alert('game.next='+game.next+' game.expected='+game.expected) };
}

function FortificationRollNeeded(front)
{
	return (
		front=='Sinai' &&
		(game.Front['Sinai']==4) && 
		(game.GazaBeershebaFortifications>0)
	);
}

function WaterRollNeeded(front)
{
	return (
		front=='Sinai' &&
		(game.Front['Sinai']>=4) && 
		(game.SinaiPipelineBuilt==false)
	);
}

function CanUseYildirim(front)
{
	return (
		((front=='Sinai') || (front=='Mesopotamia')) &&
		(game.Yildirim > 0)				
	);	
}

function test() {
	game.GazaBeershebaFortifications=2;
	game.Front[ 'Sinai']=5;
	UI_updateFront('Sinai');
	UI_updateCounters();
	d6queue=[ 
						1, 6, // water roll ok, fails fortif, stays in 5
						6, // fails water roll, stays in 5
						1,1, // water roll ok, weakens fortif, stays in 5
						1,1 // water roll ok, destroys fortif, moves to 4
						];
	card.advances=[ 'Caucasus', 'Caucasus', 'Caucasus', 'Caucasus', 'Caucasus', 'Caucasus', 'Caucasus', 'Caucasus'];
	game.Yildirim=3;
}

var offensives = [];

game.state = 0;
game.next  = 0;


function GameFSM()
{
	switch(game.state) 
	{
		case 0:
			// Initialization stuff
			ShuffleDeck(morning);
			state = 0;
			game.state++;
			GameFSM();
			break;
		case 1:
			Headline();
			game.state++;
			break;
		case 2:
			card.event();
			game.state++;
			break;
		case 3:
			if ( OffensivesFSM()==0 ) { 
				game.state++;
				GameFSM();
			}
			break;
		case 4:
			if ( PlayerActionFSM()==0 ) { 
				game.state++;
				GameFSM();
			}
			break;
		case 5:
			if ( GermanStaffOperationsFSM()==0 ) { 
				game.state++;
				GameFSM();
			}
			break;
		case 6:
			if (game.Kaiserschlacht) 
			{	
				game.state++;		
				var battle = SelectKaiserschlachtBattle();
				OffMapBattle(battle, 'Western', KaiserschlachtBattleValues[battle]);
			} else {
				game.state++;		
				GameFSM();
			}
			break;
		case 7:
			UpdateNationalWill();
			if ( game.TurkishNationalWill < -3 ) {
				UI_infoClear();
				UI_info('Turkish Morale has collapsed.');
				UI_info('Campaign ends in a crushing defeat.');
				UI_info('GAME OVER');
				game.state = 0;;		
			} else if ( game.Deck.length==0 ) {
				UI_infoClear();
				UI_info('VICTORY!');
				UI_info('Young Turks have survived all the Allied forces');
				CalculateWinningScore();
				game.state = 0;;		
			}	else {	
				UI_infoClear();
				UI_showOK('End Turn');
				game.state = 1;
			}
			break;				
	}
	return state;
}

function OSnext() {
	
	if (game.NarrowsForced==true) {
		UI_infoClear();
		UI_info('British navy forced the Narrows and captured Constantinople.');
		UI_info('Campaign ends in a crushing defeat.');
		UI_info('GAME OVER');
		return;
	}			

	if (game.ConstantinopleTaken==true) {
		UI_infoClear();
		UI_info('Constantinople has fallen');
		UI_info('GAME OVER');
		CalculateLosingScore();
		return;
	}
				
	//os.next(); 
	GameFSM();
}


// -------------------------------------------------------
// Game Phase
// -------------------------------------------------------

function Headline()
{
	game.Blocked['Sinai']              = false;
	game.Blocked['Mesopotamia']        = false;
	game.Blocked['Caucasus']           = false;
	game.Blocked['Arab']               = false;
	game.Blocked['Salonika']           = false;
	game.Blocked['Gallipoli']          = false;
	game.Blocked['Theatres']           = false;
	game.Blocked['IntelligenceBureau'] = false;
	game.Blocked['Narrows']            = false;
				
  game.DRM['Sinai']                  = 0; 
  game.DRM['Mesopotamia']            = 0; 
  game.DRM['Caucasus']               = 0; 
  game.DRM['Arab']                   = 0; 
  game.DRM['Gallipoli']              = 0; 
  game.DRM['Salonika']               = 0; 
  game.DRM['Kaiserchlacht']          = 0; 
		
	// draw card
	card = cards[ game.Deck.shift() ];
			
	UI_showCard(card);
	UI_infoClear(); 
}


var state = 0;
function OffensivesFSM()
{	
	switch (state) 
	{
		case 0:
			offensives = Offensives();	
			state = 1;
			OffensivesFSM();
			break;
		case 1:
			if (offensives.length>0) {
				state = 2;
				OffensivesFSM();
			} else {
				state = 0;
			}
			break;
		case 2:
			state = 3;
			front = offensives.shift();
			UI_infoClear();
			UI_info('Army Movement on the '+front+' Front');
			AdvanceFront(front);				
			if (WaterRollNeeded(front)==true) {
				var d6 = rollDice();
				var success = (d6<game.Army['Sinai']);
 				if (success==false) { state = 5; }
				UI_AttritionRoll('Water', d6, success);
				// yield undefined;
			} else {
				OffensivesFSM();
			}
			break;
			
		case 3:	
			state = 4;		
			if (FortificationRollNeeded(front)==true) {
				var d6 = rollDice();
				var success = (d6<game.Army['Sinai']);
				if (success) game.GazaBeershebaFortifications--;
				if (game.GazaBeershebaFortifications>0) { state = 5; }
				UI_AttritionRoll('Fortification', d6, success);
				// yield undefined;
			}	else {
				OffensivesFSM();
			}
			break;				

		case 4:	
			state = 1;
			game.ConstantinopleTaken = (game.Front[front]==0); 
			UI_showOffensive(front, CanUseYildirim(front));			
			// yield undefined;		
			break;
			
		case 5:	
			state = 1;
			RetreatFront(front);
			UI_showOffensive(front, false);			
			// yield undefined;		
			break;			
	}			
	return state;
}

function PlayerActionFSM() 
{
	switch (state) 
	{
		case 0:
			state = 1;
			PlayerActionFSM();
			break;
		case 1:	
			if (card.actions>0) {
				UI_infoClear();
				UI_info('Action Phase. You have '+card.actions+' actions');
				UI_updateCardInfo();
				UI_showActions();
				state = 1;
			} else {
				state = 0;
			}
			break;
	}
	return state;
}

function GermanStaffOperationsFSM()
{				
	switch (state) 
	{
		case 0:
			state = 1;
			GermanStaffOperationsFSM();
			break;
		case 1:
			if (CanUseGermanStaffOperations()==true) {
				// If staff operations are possible this turn, 
				// offer the choice to 1) use Staff Operations or 2) skip
				state = 2;
				UI_infoClear();
				UI_info('Use German Staff Operations?');			
				if ( game.Theatre['Western']>0 ) UI_enable('Western');
				if ( game.Theatre['Eastern']>0 ) UI_enable('Eastern');
				if ( game.Theatre['Naval']>0 )   UI_enable('Naval');			
				UI_showOK('No');				
			} else {
				// If staff operations NOT are possible this turn, 
				// End this phase
				state = 0;
			}
			break;
		case 2:
			// Decode player's choice regarding staff operations
			UI_hideActions(); 
			UI_updateCardInfo();			
			if (card.actions==0) {
				// Actions count is still at 0 -> User has declined to use staff ops
				// End this phase
				state = 0;
			} else {
				// Action count is 1 -> User has traded off-map resources for 1 extra action
				// Show available actions, and wait for user choice
				UI_infoClear();
				UI_info('German Staff Operations. You have '+card.actions+' action');
				UI_showActions();
				state = 1;
			}
			break;
	}
	
	return state;
}

// -------------------------------------------------------
// User Actions (triggered by UI clicks)
// -------------------------------------------------------

function AllocateResourcesToTheatre(theatre) {
	game.Resources--;
	game.Theatre[theatre] += 1;
	card.actions -= 2;
	UI_AllocateResourcesToTheatre(theatre);
}

function FortifyNarrows(defense) {
	game.Narrows[defense] = true;
	card.actions -= 1;
	UI_info('Fortifying '+defense+' in the Narrows');
	UI_FortifyNarrows();
}

function DeployBureau(country) {
	if (game.IntelligenceBureau=='Turkey') {
		card.actions -= 1;
	} else {
		card.actions -= 2;
	}
	game.IntelligenceBureau = country;
	UI_DeployBureau(country);
}

function TurkishOffensive(front) {
	card.actions -= 1;
	
	DeployAsiaKorps(front);
	
	var d6      = rollDice();
	var score   = d6 + game.DRM[front];
	var success = (score>game.Army[front]);
	
	if (d6==1) success = false;
	if (d6==6) success = true;

	if (success) {	
		RetreatFront(front);
	}
	
	UI_TurkishOffensive(front, d6, (success?'Succeeded':'Failed'));	
}

function UseYildirim(front)
{	
	console.log('UseYildirim '+ front);
	game.Yildirim--
	RetreatFront(front);
	UI_UseYildirim(front);
}

function UseAsiaKorps()
{
	game.AsiaKorps = 'deploying';
	UI_UseAsiaKorps();	
}

function DeployAsiaKorps(front)
{
	if (game.AsiaKorps == 'deploying') {
		game.DRM[front]++;
		game.AsiaKorps = 0;
		UI_DeployAsiaKorps(front);
	}
}

function GermanStaffOperationFrom(theatre) 
{
	console.log('GermanStaffOperationFrom '+theatre);
	game.Theatre[theatre]--;
	card.actions++;
	
	UI_GermanStaffOperationFrom(theatre);
}

// -------------------------------------------------------
// Game Actions (triggered by game sequence and events)
// -------------------------------------------------------

function OffMapBattle(battle, theatre, value)
{
	var d6 = rollDice();
	var score = d6 + game.Theatre[theatre] + game.WarWeariness;
	var res;
	
	if (d6==1) {
		game.Defeats.push(battle);
		res = 'defeat';
	} else if (d6==6) {
		game.Victories.push(battle);
		res = 'victory';
	} else if (score>value) {
		game.Victories.push(battle);
		res = 'victory';
	} else if (score==value) {
		game.Stalemates.push(battle);
		res = 'stalemate';
	} else {
		game.Defeats.push(battle);
		res = 'defeat';
	}
	
	UpdateNationalWill();	
		
	UI_OffMapBattle(battle, theatre, value, d6, res);
	
	return res;
}

function CoupAttempt(country)
{
	var d6 = rollDice();
	var drm = (game.IntelligenceBureau==country)?2:0;
	var score = d6 + drm;
	var success;
	
	if (score>5) {
		game.Victories.push(country);
		success = true;
	} else {
		success = false;
	}
	
	UpdateNationalWill();	
		
	UI_CoupAttempt(country, d6, drm, success);	
}

function SelectKaiserschlachtBattle() 
{
	var battle;
	if (game.KaiserschlachtBattles.length>0) {
		battle = game.KaiserschlachtBattles.shift();
	} else {
		var d6 = rollDice();
		battle = 'Kaiserschlacht'+d6;
		if ( game.Victories.indexOf(battle) > -1) {
			game.Victories.splice(game.Victories.indexOf(battle), 1);
		} else if ( game.Defeats.indexOf(battle) > -1) {
			game.Defeats.splice(game.Defeats.indexOf(battle), 1);
		} else {
			game.Stalemates.splice(game.Stalemates.indexOf(battle), 1);
		}
	}	
	UI_updateCounters();
	return battle;
}

function UpdateNationalWill()
{
	game.TurkishNationalWill  = game.Victories.length;
	game.TurkishNationalWill -= game.Defeats.length;
		
	if (game.Front['Caucasus']!=undefined) {
		if (game.Front['Caucasus']<=2) game.TurkishNationalWill--;
		if (game.Front['Caucasus']<=1) game.TurkishNationalWill--;
	}
	if (game.Front['Mesopotamia']!=undefined) {
		if (game.Front['Mesopotamia']<=2) game.TurkishNationalWill--;
		if (game.Front['Mesopotamia']<=1) game.TurkishNationalWill--;
	}
	if (game.Front['Sinai']!=undefined) {
		if (game.Front['Sinai']<=3) game.TurkishNationalWill--;
		if (game.Front['Sinai']<=2) game.TurkishNationalWill--;
	}
	if (game.Front['Arab']!=undefined) {
		if (game.Front['Sinai']>2)
			if (game.Front['Arab']<=2) game.TurkishNationalWill--;
	}
	if (game.Front['Salonika']!=undefined) {
		if (game.Front['Salonika']<=2) game.TurkishNationalWill--;
	}
	if (game.Front['Gallipoli']!=undefined) {
		if (game.Front['Gallipoli']<=2) game.TurkishNationalWill--;
	}	
}

function BoundedWill() {
	return Math.min(Math.max(game.TurkishNationalWill, -4), 5);
}


// ------------------------------------------------------------------
// - Core Actions (do not trigger immediate UI changes)
// ------------------------------------------------------------------

var maxFrontVal = {
	Sinai: 6,
	Mesopotamia: 5,
	Caucasus: 5,
	Arab: 6,
	Salonika: 4,
	Gallipoli: 4,
};	

function AdvanceFront(front)
{		
	if ( FrontActive(front) ) {
	  game.Front[front] = Math.max(game.Front[front]-1, 0);	
  }
	UpdateNationalWill();	  
}

function RetreatFront(front)
{		
	if ( FrontActive(front) ) {
	  game.Front[front] = Math.min(game.Front[front]+1, maxFrontVal[front]);	
  }
	UpdateNationalWill();	  
}

function PlaceArmy(front, pos, army)
{
	if ( FrontInactive(front) ) {
		game.Front[front]=pos;
		game.Army[front]=army;
	}
	UpdateNationalWill();	  
}

function ReplaceArmy(front, army)
{
	if ( FrontActive(front) ) {
	  game.Army[front] = army;
  }
	UpdateNationalWill();	  
}

function RemoveArmy(front)
{
	game.Front[front]=undefined;
	UpdateNationalWill();	  
}

function ShuffleDeck(newcards)
{
  for (id of newcards) {
	  game.Deck.push(id);
  }
  shuffle(game.Deck);
  newcards = [];
}

// ------------------------------------------------------------------
// - Score Calculation Functions
// ------------------------------------------------------------------

function CalculateLosingScore()
{
	var score = 0;
	
	score += game.Deck.length;        
	score += midday.length;           
	score += dusk.length;             
	score -= game.TurkishNationalWill;
	
	console.log('  Remaining cards in deck: '+game.Deck.length);
	console.log('+ Remaining midday cards : '+midday.length);
	console.log('+ Remaining dusk cards   : '+dusk.length);
	console.log('- National Will          : '+BoundedWill());
	UI_info('Score                    : '+score);
	
	if (score<=  1) { UI_info('Pyrrhic Victory'); return; }
	if (score<= 10) { UI_info('Strategic Stalemate'); return; }
	if (score<= 25) { UI_info('Marginal Defeat'); return; }
	if (score<= 35) { UI_info('Strategic Defeat'); return; }
	UI_info('Crushing Defeat'); return;	
}

function CalculateWinningScore()
{
	var score = 0;
	
	for (front in game.Front) {
		if (FrontActive(front)) {
			score += game.Front[front];
			console.log('+ '+front+' position: '+game.Front[front]);
		} else {
			console.log('+ '+front+' position: inactive');
		}
	}
	
	score += game.TurkishNationalWill;
	console.log('+ National Will           : '+game.TurkishNationalWill);
	
	if (FrontInactive('Caucasus')) {
		score += 2;
		console.log('+ Caucasus Front inactive : 2');
	}
	if (game.BritishFortitude==0) {
		score += 1;
		console.log('+ Won the Narrows         : 1');
	}
	UI_info('Score                     : '+score);
	
	if (score<= 10) { UI_info('Tactical Victory'); return; }
	if (score<= 19) { UI_info('Marginal Victory'); return; }
	if (score<= 24) { UI_info('Operational Victory'); return; }
	if (score<= 28) { UI_info('Strategic Victory'); return; }
	UI_info('International Victory'); return;
}


// ------------------------------------------------------------------
// - DB Query Helper Functions
// ------------------------------------------------------------------

function Offensives() {
	var offensives = []
	for (front of card.advances)
		if ( FrontActive(front) ) 
			offensives.push(front);
	return offensives;		
}

function AvailableActions(n) {
	return (card.actions>=n);
}

function FrontActive(f) {
	return (game.Front[f]!=undefined);
}

function FrontInactive(front) {
	return (game.Front[front]==undefined);
}

function CanAttackFront(front)
{
	return (
		AvailableActions(1) && 
		FrontActive(front) && 
		(game.Front[front]<maxFrontVal[front]) &&
		(game.Blocked[front]==false)
	);
}

function CanAllocateTheatre(theatre)
{	
	return (
		AvailableActions(2) && 
		(game.Resources>0) &&
		(game.Theatre[theatre]<2) &&
		(game.Blocked['Theatres']==false)
	);
}

function CanDeployBureau()
{	
	if ((game.IntelligenceBureau==undefined) || game.Blocked['IntelligenceBureau']) {
		return false;
	} else if (game.IntelligenceBureau=='Turkey') {
	  return AvailableActions(1);	
	} else {	
		return AvailableActions(2);
	}
}

function CanFortifyNarrows()
{	
	return (
		AvailableActions(1) &&
		(game.StraitsClosed==false) &&
		(game.BritishFortitude==undefined) &&
		(game.Blocked['Narrows']==false)
	);	
}

function CanUseAsiaKorps()
{
	return (
		AvailableActions(1) && 
		(game.AsiaKorps==1)
	);
}

function CanUseGermanStaffOperations()
{
	return (
		(game.Theatre['Western']>0) || 
		(game.Theatre['Eastern']>0) || 
		(game.Theatre['Naval']>0) 
	);
}

// ------------------------------------------------------------------
// - init Function (Entry Point) 
// ------------------------------------------------------------------

function init()
{
	initView();					
	OSnext();	
}

// ------------------------------------------------------------------
// - Standard Utility Routines 
// ------------------------------------------------------------------

var d6queue = [];
function rollDice()
{
	if (d6queue.length==0) {
		return Math.floor(Math.random() * 6) + 1 ;
	} else {
		return d6queue.shift();
	}
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

function debug(str)
{
 	console.log(str);
}

// ------------------------------------------------------------------
// - Application Cache Management 
// ------------------------------------------------------------------

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



