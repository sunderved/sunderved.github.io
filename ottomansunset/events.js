
// -------------------------------------------------------
// Card Event
// -------------------------------------------------------

function EnterWar() {
}

function NoEvent() {
	UI_NoEvent();
}

function IntelligenceBureau() {
  // Place the IBotE marker in Turkey
  game.IntelligenceBureau = 'Turkey';
  UI_IntelligenceBureau();
}
function GoebenDominates() {
  // Retreat Salonika, Caucasus
 	RetreatFront('Salonika');	
 	RetreatFront('Caucasus');	

  UI_GoebenDominates();
}
function JihadDeclared() {
	// Override default DRMs
  game.DRM.Sinai       = 1; 
  game.DRM.Mesopotamia = 1; 
  game.DRM.Caucasus    = 1; 
  game.DRM.Arab        = 1; 
  game.DRM.Gallipoli   = 1; 
  game.DRM.Salonika    = 1; 
  // Shuffle the Mid-Day cards
  ShuffleDeck(Midday);
  UI_JihadDeclared();
}
function EnverToTheFront() {
	// Override blocked actions
	game.Blocked.Sinai              = true;
	game.Blocked.Mesopotamia        = true;
	game.Blocked.Caucasus           = false;
	game.Blocked.Arab               = true;
	game.Blocked.Salonika           = true;
	game.Blocked.Gallipoli          = true;
	game.Blocked.Theatres           = true;
	game.Blocked.IntelligenceBureau = true;
	game.Blocked.Narrows            = true;
  // No event this turn
  NoEvent();
}
function GhadarConspiracy() {
  // Coup in India 5
  CoupAttempt('India');
}
function WassmussInPersia() {
  // Coup in Persia 5
  CoupAttempt('Persia');
}
function TurkishMinelaying() {
	// Override default DRMs
	game.DRM.Mesopotamia = 1;
  // Place 1 Minefield marker for free
  var mine = 0;
  if (game.Narrows.Minefield_1===false) {
	  game.Narrows.Minefield_1=true;
	  mine=1;
  } else if (game.Narrows.Minefield_2===false) {
	  game.Narrows.Minefield_2=true;
	  mine=2;
  }
  UI_TurkishMinelaying(mine);
}
function ForcingTheNarrows()
{
	var events = [];
	if (game.StraitsClosed===false) {	
		game.BritishFortitude = 4;	
		for (var def in game.Narrows) {
			if (game.Narrows[def]===true) {	
				var d6 = rollDice();
				var success = (d6>NarrowsDefenseValues[def]);
				if (success===false) game.BritishFortitude--;
				var defense = {};
				defense.name = def;
				defense.d6 = d6;
				defense.success = success;
				defense.fortitude = game.BritishFortitude;
				events.push(defense);
				if (game.BritishFortitude===0) {
					break;
				}
			}
		}	 
		if (game.BritishFortitude>0) {
			game.NarrowsForced = true;
		} 
	} 
  UI_ForcingTheNarrows(events);
}
function ArmenianVolunteerUnits() {
	// No event this turn
  NoEvent();
}
function SecondBattleofYpres() {
  // Western 4
	OffMapBattle('Second Battle of Ypres', 'West', 4);
}
function GallipoliLanding() {
  // Place the Hamilton (2) marker on space 4. Destroy the Seddulbahir Gun in the Narrows
  PlaceArmy('Gallipoli', 4, 2);	
  game.Narrows.Seddulbahir = false;
  UI_GallipoliLanding();
}
function GorliceTarnow() {
	// Conduct Eastern Front Battle, GarliceTarnow / 2
	OffMapBattle('Gorlice Tarnow', 'East', 2);
}
function ItalyJoinsTheWar() {
  // Eastern 3
	OffMapBattle('Italy Joins The War', 'East', 3);
}
function GermanUboats() {
	// Override default DRMs
	game.DRM.Gallipoli = 1; 
  game.DRM.Salonika  = 1; 
  // Place the U-boat marker in the Narrows
	game.StraitsClosed = true;  
  UI_GermanUboats();
}
function ArmenianMassacre() {
	// Override blocked actions
	game.Blocked.Caucasus = true;
  // No event this turn
  NoEvent();
}
function SuvlaLanding() {
  // If it is in the map, flips the Gallipoli unit to its Post Suvla side (3)
 	ReplaceArmy('Gallipoli', 3);	
  UI_SuvlaLanding();
}
function GrandDukeNicholasTakesControl() {
  // If in play replace the Caucasus marker with its Nicholas unit (3 or 2)
 	ReplaceArmy('Caucasus', (game.ImperialRussia===true)?3:2);
  UI_GrandDukeNicholasTakesControl();
}
function BulgariaJoinsTheCentralPowers() {
  // No event this turn
  NoEvent();
}
function SenussiRevolt() {
  // Retreat Sinai
 	RetreatFront('Sinai');	
  UI_SenussiRevolt();
}
function LandingAtSalonika() {
  // Place the Sarrail unit on the 4 space
  PlaceArmy('Salonika', 4, 2);
  UI_LandingAtSalonika();
}
function CentralPowersMeddlingInAfghanistan() {
  // Coup in Afgha 5
  CoupAttempt('Afghanistan');
}
function FortificationOfGazaBeershebaLine() {
  // You may immediately forfeit 2 actions to place the Gaza-Beersheba Fortification marker, 
  // if that space is controlled by the Turkish  
  UI_disableOK();  
  if (game.Front.Sinai>4) {  
	  UI_setClickCallback('gazabeersheba1', function() { 
				document.getElementById('gazabeersheba1').classList.toggle('hidden',true);  
				document.getElementById('gazabeersheba2').classList.toggle('hidden',true);  
				OSnext(); 
			} 
		); 
	  UI_focus('gazabeersheba1');
	 	UI_setClickCallback('gazabeersheba2', function() { 
				document.getElementById('gazabeersheba1').classList.toggle('hidden',true);  
				document.getElementById('gazabeersheba2').classList.toggle('hidden',true);  
		  	game.Actions=0; 
		  	game.GazaBeershebaFortifications=2; 
		  	UI_updateFortifications();;
				OSnext(); 
			} 
		); 	
	  UI_focus('gazabeersheba2');
	} else {
		UI_info('Gaza-Beersheba controlled by the English, Fortification not possible');
	  UI_waitForClick();
	}
}
function SinaiPipeline() {
  // Shuffle the Dusk cards into the deck. 
  ShuffleDeck(Dusk);
  // Place the Faisal Hussein (2) unit on the Arab 6 space, if not yet in play
  PlaceArmy('Arab', 6, 2);
  // Pipeline complete
  game.SinaiPipelineBuilt = true;
  
  UI_SinaiPipeline();
}
function GallipoliEvacuation() {
  // Remove the Gallipoli unit. 
	RemoveArmy('Gallipoli');  
  // If in play, flip the Salonika unit to its D'Esperey side (3)
  ReplaceArmy('Salonika', 3);
  
  UI_GallipoliEvacuation();
}
function ErzurumOffensive() {
	// Override blocked actions
	game.Blocked.Caucasus = true;
	// No event this turn
  NoEvent();
}
function Verdun() {
  // Western 4
	OffMapBattle('Verdun', 'West', 4);
}
function MesopotamianSiege() {
  // Remove Townsend (3) from the Mesopotamia front 
  // Place Maude (4) in Mesopotamia 5 (Basra)
  RemoveArmy('Mesopotamia');
  PlaceArmy('Mesopotamia', 5, 4);

  // Receive the Siege of Kut Victory marker
  game.Victories.push('Siege of Kut');
  
  UI_MesopotamianSiege();
}
function Jutland() {
  // Naval 5
	OffMapBattle('Jutland', 'Naval', 5);
}
function BrusilovOffensive() {
  // Eastern 3
	OffMapBattle('Brusilov Offensive', 'East', 3);
}
function AsiaKorps() {
  // Take the AK marker
  game.AsiaKorps = 1;
  UI_AsiaKorps();
}
function TheSomme() {
  // Western 3
	OffMapBattle('The Somme', 'West', 3);
}
function ArabRevolt() {
  // Place the Feisal Hussein (2) unit on the 6 space of its track, if not yet in play
  PlaceArmy('Arab', 6, 2);
  UI_ArabRevolt();
}
function YudenichNamedCommanderInChief() {
  // If in play replace the Caucasus marker with its Yudenich unit (4 or 3)
	ReplaceArmy('Caucasus', (game.ImperialRussia)?4:3);
  UI_YudenichNamedCommanderInChief();
}
function Yildirim() {
  // Get the 3 Yildirim markers
  game.Yildirim = 3;
  UI_Yildirim();
}
function ProvisionalGovernmentTakesCharge() {
  if (game.Front.Caucasus!==undefined) {
	  // If the Caucasus unit is on the map, retreat it one space.
		RetreatFront('Caucasus');
	} else {
	  // If it is not, return it to Kars (5). 
	  game.Front.Caucasus = 5;
  }
  // Either way, place it to it's reduced side
  game.ImperialRussia = false;
  game.Army.Caucasus = game.Army.Caucasus-1;
  UI_ProvisionalGovernmentTakesCharge();
}
function Sandstorms() {  
	// Roll a die
	var d6 = rollDice();
	// On 1,2 or 3 the Mesopotamia unit retreats on space	
	// On 4,5 or 6 the Sinai unit retreats on space	
	var front = (d6<=3)?'Mesopotamia':'Sinai';
	// Retreat front
	RetreatFront(front);	
	// No offensives vs retreated front this turn
	game.Blocked[front]=true;

  UI_Sandstorms(front, d6);
}
function KingConstantineFleesGreece() {
	// Override default DRMs
	game.DRM.Salonika = -1; 
  // No event this turn
  NoEvent();
}
function UboatCampaign() {
  // Naval 4
	OffMapBattle('U-boat Campaign', 'Naval', 4);
}
function AffenbyTakesTheHelm() {
  // Flip the Sinai marker to its Affenby side (4)
  ReplaceArmy('Sinai', 4);
  UI_AffenbyTakesTheHelm();
}
function LawrenceStirsTheArabs() {
  // If it is in the map, flips the Arab unit to it's Lawrence side (3)
  ReplaceArmy('Arab', 3);
  UI_LawrenceStirsTheArabs();
}
function WarWeariness() {
  // Place the War Weariness marker
  game.WarWeariness = -1;
  
  // Roll a dice
  // Advance: 1-Sinai, 2-Mesopotamia, 3 or 4-Arab, 5 or 6-Gallipoli and Salonika
  var d6 = rollDice();
  switch (d6) {
	  case 1: game.Offensives = ['Sinai']; break;
	  case 2: game.Offensives = ['Mesopotamia']; break;
	  case 3: game.Offensives = ['Arab']; break;
	  case 4: game.Offensives = ['Arab']; break;
	  case 5: game.Offensives = ['Gallipoli', 'Salonika']; break;
	  case 6: game.Offensives = ['Gallipoli', 'Salonika']; break;
  }
  UI_WarWeariness(d6);
}
function HoffmanOffensive() {
	// Override default DRMs
	game.DRM.Caucasus = 1;
  // Eastern 2
	OffMapBattle('Hoffman Offensive', 'East', 2);
}
function BolshevikRevolution() {
  // Remove the Caucasus unit
  RemoveArmy('Caucasus');
  UI_BolshevikRevolution();
}
function BalfourDeclaration() {
	// Override default DRMs
	game.DRM.Sinai = 1; 
  // No event this turn
  NoEvent();
}
function SykesPicotAgreementDivulged() {
	// Override default DRMs
	game.DRM.Sinai = 1; 
	game.DRM.Arab  = 1; 
  // No event this turn
  NoEvent();
}
function Kaiserschlacht() {
	// Override default DRMs
  game.DRM.Sinai         = 1; 
  game.DRM.Mesopotamia   = 1; 
  game.DRM.Caucasus      = 1; 
  game.DRM.Arab          = 1; 
  game.DRM.Gallipoli     = 1; 
  game.DRM.Salonika      = 1; 
  game.DRM.Kaiserchlacht = 1; 
  // Place the Kaiserschlacht token on the map
  // Conduct this Phase each turn from now on
  game.Kaiserschlacht = true;
  UI_Kaiserschlacht();
}
function ArmyOfIslam() {
	// Override default DRMs
  game.DRM.Sinai         = 1; 
  game.DRM.Mesopotamia   = 1; 
  game.DRM.Caucasus      = 1; 
  game.DRM.Arab          = 1; 
  game.DRM.Gallipoli     = 1; 
  game.DRM.Salonika      = 1;
  // No event this turn
  NoEvent();
}
function Dunsterforce() {
  // Forfeit this card's 2 action or receive the Dunsterforce DEFEAT marker
  UI_disableOK();
  UI_setClickCallback('dunsterforce1', function() { 
			document.getElementById('dunsterforce1').classList.toggle('hidden',true);  
			document.getElementById('dunsterforce2').classList.toggle('hidden',true);  
  		game.Actions=0;
			OSnext(); 
		} 
	); 
  UI_focus('dunsterforce1');
 	UI_setClickCallback('dunsterforce2', function() { 
			document.getElementById('dunsterforce1').classList.toggle('hidden',true);  
			document.getElementById('dunsterforce2').classList.toggle('hidden',true);  
  		game.Defeats.push('Dunsterforce'); 
  		UI_updateCounters();
			OSnext(); 
		} 
	); 
  UI_focus('dunsterforce2');
}

function VittorioVeneto() {
  // Eastern 4
	OffMapBattle('Vittorio Veneto', 'East', 4);
}

// ------------------