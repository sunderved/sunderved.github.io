

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
	this.Theatre = {
		Western: 0, 
		Naval: 0, 
		Eastern: 0
	};
	this.WarWeariness = 0;
	this.IntelligenceBureau = 'N/A';
	this.Yildirim = 0;
	this.AsiaKorps = 0;
	this.GazaBeershebaFortifications = 0;
	this.SinaiPipelineBuilt = false;
	this.StraitsClosed = false;	
	this.Kaiserschlacht = false;
	this.BritishFortitude = 4;	
	this.Narrows = {
		Seddulbahir: 4,
		Mumkale: 2,
		Minefield_1: 4,
		Yildiz: 0,
		Dardanos: 0,
		Minefield_2: 4,
		Canakkale: 2,
		Nagara: 0,
		Constantinople: 4
	}; 	
	this.Deck = [12, 14, 36];
}

function UpdateNationalWill()
{
	game.TurkishNationalWill  = game.Victories.length;
	game.TurkishNationalWill -= game.Defeats.length;
		
	if (game.Front['Caucasus']) {
		if (game.Front['Caucasus']<=2) game.TurkishNationalWill--;
		if (game.Front['Caucasus']<=1) game.TurkishNationalWill--;
	}
	if (game.Front['Mesopotamia']) {
		if (game.Front['Mesopotamia']<=2) game.TurkishNationalWill--;
		if (game.Front['Mesopotamia']<=1) game.TurkishNationalWill--;
	}
	if (game.Front['Sinai']) {
		if (game.Front['Sinai']<=3) game.TurkishNationalWill--;
		if (game.Front['Sinai']<=2) game.TurkishNationalWill--;
	}
	if (game.Front['Arab']) {
		if (game.Front['Sinai']>2)
			if (game.Front['Arab']<=2) game.TurkishNationalWill--;
	}
	if (game.Front['Salonika']) {
		if (game.Front['Salonika']<=2) game.TurkishNationalWill--;
	}
	if (game.Front['Gallipoli']) {
		if (game.Front['Gallipoli']<=2) game.TurkishNationalWill--;
	}
}

function FightBattle(battle, theatre, value)
{
	var d6 = rollDice();
	var score = d6 + game.Theatre[theatre] + game.WarWeariness;
	var res;
	
	if (score==value) {
		game.Stalemates.push(battle);
		res = 'stalemate';
	} else if (score>value) {
		game.Victories.push(battle);
		res = 'victory';
	} else {
		game.Defeats.push(battle);
		res = 'defeat';
	}
	
	UI_showBattle(battle, theatre, value, d6, res);
	UI_updateCounters();
	
	return res;
}

function ForcingTheNarrows()
{
	UI_infoClear();
	UI_info('Forcing the Narrows');
	
	if (game.StraitsClosed) {
		UI_info('Straits are closed by U-boats, mission is prevented');
		return;
	}
	
	var str;
	var d6;
	game.BritishFortitude = 4;	
	for (def in game.Narrows) {	
		str = def+' '+game.Narrows[def];
		d6 = rollDice();
		str += ' '+d6;
		if (d6>game.Narrows[def]) {
			// British succeed
		} else {
			// British fail
			game.Fortitude--;	
		}
		str += ' F='+game.BritishFortitude;
		UI_info(str);
		if (game.BritishFortitude==0) {
			UI_info('Turks have won the campaign');
			return;
		}
	}	
	UI_info('Allies have captured the capital of the Ottoman Empire. Game Over');	
}

var game = new GameState();

var os = gameCoroutine();


game.Yildirim = 3;

function* gameCoroutine() 
{
	UI_infoClear();
	UI_updateCounters();
	yield undefined;
	
	while(1) 
	{
		// --------------------------------
		// 1. Headline Phase
		// --------------------------------
		// draw card
		var cardId = game.Deck.shift(); game.Deck.push(cardId);
		var card = cards[cardId];
		
		UI_showCard(card);
		yield undefined;
		
		// --------------------------------
		// 2. Event Resolution Phase
		// --------------------------------
		card.event();
		yield undefined;
				
		// --------------------------------
		// 3. Army Movement Phase
		// --------------------------------		
		for (front of card.advance) 
		{
			
			UI_infoClear();
			if (game.Front[front]==undefined) {
				// No army on this front, nothing to advance
				UI_info('No army in '+front+', skipping');
				continue;
			} else {
				UI_info('Army Movement in '+front+' ('+game.Front[front]+')');
			}
			
			if (front=='Sinai') {
				if ((game.Front['Sinai']>4) && (game.SinaiPipelineBuilt==false)) {
					var d6 = rollDice();
					var success = (d6<game.Army['Sinai']);
					UI_showAttritionRoll('Water', d6, success);
					yield undefined;
					if (success==false) {
						// Attrition roll failed, do not advance
						continue;
					}
				}
				
				if ((game.Front['Sinai']==5) && (game.GazaBeershebaFortifications>0) ) {
					var d6 = rollDice();
					var success = (d6<game.Army['Sinai']);
					UI_showAttritionRoll('Fortification', d6, success);
					yield undefined;
					if (success==false) {
						// Attrition roll failed, do not advance
						continue;
					} else {
						// Attrition roll successfull, fortification is diminished
						game.GazaBeershebaFortifications--;
						UI_updateFortifications();
						if (game.GazaBeershebaFortifications>0) {
							// If fortification is not destroyed, do not advance
							continue;
						} 
					}
				}
			}									
			if ((front=='Sinai') || (front=='Mesopotamia')) {
				if (game.Yildirim > 0) {
					UI_askYildirim();
					var useYildrim = yield undefined;
					if (useYildrim) {
						game.Yildirim--
						UI_updateYildirim();
						// do not advance
						continue;
					}
				}
			}
						
			game.Front[front]--;
			
			UI_updateFront(front);
			yield undefined;
		}

		// --------------------------------
		// 4. Action Phase
		// --------------------------------
						
	
		// --------------------------------
		// 5. Kaiserschlacht Phase
		// --------------------------------
	
		// --------------------------------
		// 6. National Will Phase
		// --------------------------------
		UpdateNationalWill();
		UI_updateNationalWill();
		yield undefined;
	}
}

function smallerThan(a,b) { return (a<b); }
function greaterThan(a,b) { return (a>b); }

function init()
{
	// Boot
	initView();	
	
// 	game.Victories = ['verdun', 'k1'];
// 	game.Defeats = ['k2'];
// 	game.Front['Sinai'] = 3;
// 	game.Front['Arab'] = 5;
// 	game.Front['Mesopotania'] = 1;
// 	game.Front['Caucasus'] = 5;
// 	game.Front['Salonika'] = 2;
// 	game.Front['Gallipoli'] = undefined;
// 	
// 	UpdateNationalWill();
// 	UI_info('Will: '+ game.TurkishNationalWill);
	
	//ForcingTheNarrows();	
		
	UI_updateFront('Sinai');
	UI_updateFront('Mesopotamia');
	UI_updateFront('Caucasus');
		
	os.next();	
}

// ------------------------------------------------------------------
// - Standard Utility Routines 
// ------------------------------------------------------------------

function rollDice()
{
	return Math.floor(Math.random() * 6) + 1 ;
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

