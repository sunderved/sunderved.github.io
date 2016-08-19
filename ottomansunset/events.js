
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
  game.DRM['Sinai']       = 1; 
  game.DRM['Mesopotamia'] = 1; 
  game.DRM['Caucasus']    = 1; 
  game.DRM['Arab']        = 1; 
  game.DRM['Gallipoli']   = 1; 
  game.DRM['Salonika']    = 1; 
  // Shuffle the Mid-Day cards
  ShuffleDeck(midday);
  UI_JihadDeclared();
}
function EnverToTheFront() {
	// Override blocked actions
	game.Blocked['Sinai']              = true;
	game.Blocked['Mesopotamia']        = true;
	game.Blocked['Caucasus']           = false;
	game.Blocked['Arab']               = true;
	game.Blocked['Salonika']           = true;
	game.Blocked['Gallipoli']          = true;
	game.Blocked['Theatres']           = true;
	game.Blocked['IntelligenceBureau'] = true;
	game.Blocked['Narrows']            = true;
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
	game.DRM['Mesopotamia'] = 1;
  // Place 1 Minefield marker for free
  var mine = 0;
  if (game.Narrows['Minefield_1']==0) {
	  game.Narrows['Minefield_1']=4;
	  mine=1;
  } else if (game.Narrows['Minefield_2']==0) {
	  game.Narrows['Minefield_2']=4;
	  mine=2;
  }
  UI_TurkishMinelaying(mine);
}
function ForcingTheNarrows()
{
	var events = [];
	if (game.StraitsClosed==false) {	
		game.BritishFortitude = 4;	
		for (def in game.Narrows) {
			if (game.Narrows[def]==true) {	
				var d6 = rollDice();
				var success = (d6>NarrowsDefenseValues[def])
				if (success==false) game.BritishFortitude--;
				var defense = {};
				defense['name'] = def;
				defense['d6'] = d6;
				defense['success'] = success;
				defense['fortitude'] = game.BritishFortitude;
				events.push(defense);
				if (game.BritishFortitude==0) {
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
	OffMapBattle('Second Battle of Ypres', 'Western', 4);
}
function GallipoliLanding() {
  // Place the Hamilton (2) marker on space 4. Destroy the Seddulbahir Gun in the Narrows
  PlaceArmy('Gallipoli', 4, 2);	
  game.Narrows['Seddulbahir'] = 0;
  UI_GallipoliLanding();
}
function GorliceTarnow() {
	// Conduct Eastern Front Battle, GarliceTarnow / 2
	OffMapBattle('Gorlice Tarnow', 'Eastern', 2);
}
function ItalyJoinsTheWar() {
  // Eastern 3
	OffMapBattle('Italy Joins The War', 'Eastern', 3);
}
function GermanUboats() {
	// Override default DRMs
	game.DRM['Gallipoli'] = 1; 
  game.DRM['Salonika']  = 1; 
  // Place the U-boat marker in the Narrows
	game.StraitsClosed = true;  
  UI_GermanUboats();
}
function ArmenianMassacre() {
	// Override blocked actions
	game.Blocked['Caucasus'] = true;
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
 	ReplaceArmy('Caucasus', (game.ImperialRussia==true)?3:2);
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
function FortificationofGazaBeershebaLine() {
  // You may immediately forfeit 2 actions to place the Gaza-Beersheba Fortification marker, 
  // if that space is controlled by the Turkish
  UI_offerChoice(
  	'You may immediately forfeit 2 actions to place the Gaza-Beersheba Fortification marker, if that space is controlled by the Turkish',
  	'Fortify Gaza-Beersheba',
  	function() { card.actions=0; game.GazaBeershebaFortifications=2; UI_updateCardInfo(); UI_updateCounters(); },
  	'Keep 2 Actions',
  	function() { }
	);
  
  UI_FortificationofGazaBeershebaLine();
}
function SinaiPipeline() {
  // Shuffle the Dusk cards into the deck. 
  ShuffleDeck(dusk);
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
	game.Blocked['Caucasus'] = true;
	// No event this turn
  NoEvent();
}
function Verdun() {
  // Western 4
	OffMapBattle('Verdun', 'Western', 4);
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
	OffMapBattle('Brusilov Offensive', 'Eastern', 3);
}
function AsiaKorps() {
  // Take the AK marker
  game.AsiaKorps = 1;
  UI_AsiaKorps();
}
function TheSomme() {
  // Western 3
	OffMapBattle('The Somme', 'Western', 3);
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
  if (game.Front['Caucasus']!=undefined) {
	  // If the Caucasus unit is on the map, retreat it one space.
		RetreatFront('Caucasus');
	} else {
	  // If it is not, return it to Kars (5). 
	  game.Front['Caucasus'] = 5;
  }
  // Either way, place it to it's reduced side
  game.ImperialRussia = false;
  game.Army['Caucasus'] = game.Army['Caucasus']-1;
  UI_ProvisionalGovernmentTakesCharge();
}
function Sandstorms() {  
	// Roll a die
	var d6 = rollDice()
	// On 1,2 or 3 the Mesopotamia unit retreats on space	
	// On 4,5 or 6 the Sinai unit retreats on space	
	var front = (d6<=3)?'Mesopotamia':'Sinai';
	RetreatFront(front);	
	// No offensives vs retreated front this turn
	game.Blocked[front]=true;
	card.text='No Offensives vs '+front+' this turn';

  UI_Sandstorms(front, d6);
}
function KingConstantineFleesGreece() {
	// Override default DRMs
	game.DRM['Salonika'] = -1; 
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
	  case 1: card.advances = ['Sinai']; break;
	  case 2: card.advances = ['Mesopotamia']; break;
	  case 3: card.advances = ['Arab']; break;
	  case 4: card.advances = ['Arab']; break;
	  case 5: card.advances = ['Gallipoli', 'Salonika']; break;
	  case 6: card.advances = ['Gallipoli', 'Salonika']; break;
  }
  UI_WarWeariness(d6);
}
function HoffmanOffensive() {
	// Override default DRMs
	game.DRM['Caucasus'] = 1;
  // Eastern 2
	OffMapBattle('Hoffman Offensive', 'Eastern', 2);
}
function BolshevikRevolution() {
  // Remove the Caucasus unit
  RemoveArmy('Caucasus');
  UI_BolshevikRevolution();
}
function BalfourDeclaration() {
	// Override default DRMs
	game.DRM['Sinai'] = 1; 
  // No event this turn
  NoEvent();
}
function SykesPicotAgreementDivulged() {
	// Override default DRMs
	game.DRM['Sinai']    = 1; 
	game.DRM['Caucasus'] = 1; 
  // No event this turn
  NoEvent();
}
function Kaiserschlacht() {
	// Override default DRMs
  game.DRM['Sinai']         = 1; 
  game.DRM['Mesopotamia']   = 1; 
  game.DRM['Caucasus']      = 1; 
  game.DRM['Arab']          = 1; 
  game.DRM['Gallipoli']     = 1; 
  game.DRM['Salonika']      = 1; 
  game.DRM['Kaiserchlacht'] = 1; 
  // Place the Kaiserschlacht token on the map
  // Conduct this Phase each turn from now on
  game.Kaiserschlacht = true;
  UI_Kaiserschlacht();
}
function ArmyOfIslam() {
	// Override default DRMs
  game.DRM['Sinai']         = 1; 
  game.DRM['Mesopotamia']   = 1; 
  game.DRM['Caucasus']      = 1; 
  game.DRM['Arab']          = 1; 
  game.DRM['Gallipoli']     = 1; 
  game.DRM['Salonika']      = 1;
  // No event this turn
  NoEvent();
}
function Dunsterforce() {
  // Forfeit this card's 2 action or receive the Dunsterforce DEFEAT marker
  UI_offerChoice(
  	'Forfeit this card\'s 2 actions or receive the Dunsterforce Defeat marker',
  	'Forfeit 2 actions',
  	function() { card.actions=0; UI_updateCardInfo(); },
  	'Dunsterforce Defeat',
  	function() { game.Defeats.push('Dunsterforce'); UI_updateCounters(); }
	);
}
function VittorioVeneto() {
  // Eastern 4
	OffMapBattle('Vittorio Veneto', 'Eastern', 4);
}

// ------------------