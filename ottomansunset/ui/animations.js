// ------------------------------------------------------------------
// - UI for Draw Card
// ------------------------------------------------------------------

function UI_showCard() 
{	
  UI_infoClear();
	document.getElementById('card').classList.remove('visible');
	setTimeout(function () {
		UI_updateCardInfo();
		document.getElementById('card').classList.add('visible'); 
	}, 1000);		
	setTimeout(function () {
		UI_showOK();		
	}, 1900);		   
}

// ------------------------------------------------------------------
// - UI for Card Events 
// ------------------------------------------------------------------

function UI_IntelligenceBureau() {
	UI_info('Intelligence Bureau of the East deployed in Turkey');
	UI_updateCounters(); 
  UI_showOK();
}
function UI_GoebenDominates() {
	UI_info('Salonika and Caucasus Fronts Retreat'); 
 	UI_updateFront('Salonika');	
 	UI_updateFront('Caucasus');	
  UI_showOK();
}
function UI_JihadDeclared() {
	UI_info('Shuffling Mid-Day Cards in Deck'); 
  UI_showOK();
}
function UI_TurkishMinelaying(mine) {
	if (mine>0) {
		UI_info('Turks lay a mine in the Narrows');
	  setTimeout(function () {
		  UI_OpenOverlay('narrowsmap');
		}, 500);		
	  setTimeout(function () {
			UI_updateNarrows();
		  UI_showOK();
		}, 1500);		
	} else {
		UI_info('All mines have already been layed');
	  UI_showOK();
	}
}
function UI_ForcingTheNarrows(events) {
		
	if (game.StraitsClosed) {
		UI_infoClear();
		UI_info('U-boats are protecting the Narrows');
  	UI_showOK();
  	return;		
	}	

	document.getElementById('fortitude').style.visibility = 'visible';
	
  UI_OpenOverlay('narrowsmap');
		
	if (events.length===0) {
		if (game.BritishFortitude===0) {
			UI_info('Turks have won the campaign');
		} 
  	UI_showOK();
  	return;
	}
	
	var defense = events.shift();
		
  setTimeout(function () {
	  UI_infoClear();
		die.div.className = '';
		document.getElementById(defense.name).classList.add('highlighted');	
		UI_info('English fleet passing by '+defense.name);
	}, 1000);		
  setTimeout(function () {
		UI_showDieRoll(defense.d6);
  }, 1500);		
  setTimeout(function () {  
 	  UI_showDieSuccess( defense.success );
		UI_updateFortitude( defense.fortitude );
// 	  if (defense['success']) {
// 			UI_info('Success');
// 	  } else {
// 			UI_info('Failed, British Fortitude drops to '+defense['fortitude']);
// 			UI_updateFortitude( defense['fortitude'] );
// 	  }
	}, 2300);		
  setTimeout(function () {
		document.getElementById(defense.name).classList.remove('highlighted');	
	  UI_ForcingTheNarrows(events);
	}, 3000);
}
function UI_GallipoliLanding() {
  UI_info('Hamilton lands in Gallipoli. New front is opened');
  UI_updateFront('Gallipoli');  	
  setTimeout(function () {
		UI_info('Seddulbahir Gun is Destroyed');
		UI_updateNarrows();
  	UI_showOK();
	}, 1000);			
}
function UI_GermanUboats() {
	UI_updateCounters();
  UI_showOK();
}
function UI_SuvlaLanding() {
	if (game.Front.Gallipoli !== undefined) {
		UI_info('Gallipoli unit is increased to 3');
		UI_updateFront('Gallipoli');
	} else {
		UI_info('Gallipoli front inactive. Nothing happens');
	}
  UI_showOK();
}
function UI_GrandDukeNicholasTakesControl() {
	if (game.Front.Caucasus !== undefined) {
		UI_info('New Caucasus Front value: '+game.Army.Caucasus);
		UI_updateFront('Caucasus');
	} else {
		UI_info('Caucasus front inactive. Nothing happens');
	}	
	UI_showOK();
}
function UI_SenussiRevolt() {
	UI_info('Sinai Front Retreat'); 
 	UI_updateFront('Sinai');	
  UI_showOK();
}
function UI_LandingAtSalonika() {
	UI_info('Sarrail (2) Lands at Salonika'); 
	UI_updateFront('Salonika');
  UI_showOK();
}
function UI_FortificationofGazaBeershebaLine() {
  UI_showOK();
}
function UI_SinaiPipeline() {	
	UI_info('Shuffling Dusk Cards in Deck'); 
  setTimeout(function () {
	  UI_info('Sinai Pipeline Complete');
		UI_pipelineComplete();
	}, 1000);		
  setTimeout(function () {
	  UI_info('Place the Faisal Hussein (2) unit on the Arab 6 space, if not yet in play');
 	  UI_updateFront('Arab');  	
  	UI_showOK();
	}, 2000);  
}
function UI_GallipoliEvacuation() {
  UI_info('Gallipoli unit is removed');
  UI_updateFront('Gallipoli');  	
  setTimeout(function () {
	  UI_info('If in play, flip the Salonika unit to its D\'Esperey side (3)');
 	  UI_updateFront('Salonika');  	
  	UI_showOK();
	}, 1000);  
}
function UI_MesopotamianSiege() {
  UI_info('Siege of Kut VICTORY');
  UI_updateCounters();  	
  setTimeout(function () {
	  UI_info('Maude takes over in Mesopotamia from Basra (5)');
 	  UI_updateFront('Mesopotamia');  	
  	UI_showOK();
	}, 1000);		  		
}
function UI_AsiaKorps() {
  UI_info('Receive the Asia Korps marker');
  UI_updateCounters();  	
	UI_showOK();
}
function UI_ArabRevolt() {
  UI_info('Place the Faisal Hussein (2) unit on the Arab 6 space, if not yet in play');
  UI_updateFront('Arab');  	
 	UI_showOK(); 	
}
function UI_YudenichNamedCommanderInChief() {
	if (game.Front.Caucasus !== undefined) {
		UI_info('New Caucasus Front value: '+game.Army.Caucasus);
		UI_updateFront('Caucasus');
	} else {
		UI_info('Caucasus front inactive. Nothing happens');
	}	
	UI_showOK();
}
function UI_Yildirim() {
  UI_info('Receive 3 Yildirim tokens');
  UI_updateCounters();  	
	UI_showOK();
}
function UI_ProvisionalGovernmentTakesCharge() {
  UI_info('If the Caucasus unit is on the map, retreat it one space.');
  UI_info('If it is not, return it to Kars (5).');
  UI_info('Place it to it\'s reduced side.');	
  setTimeout(function () {
	  UI_updateFront('Caucasus');	  
	  UI_showOK();
	}, 2000);  	
}
function UI_Sandstorms(front, d6) {
	UI_info('Roll a die');
	UI_info('Retreat Mesopotamia unit on 1,2,3 or Sinai unit on 4,5,6');
  setTimeout(function () {
		UI_showDieRoll(d6);
  }, 1000);		
  setTimeout(function () {
		UI_info(front+' Front Retreats');
		UI_info('No offensives vs '+front+' this turn');
   }, 2300);		
  setTimeout(function () {
	  UI_updateFront(front);  	
		UI_showOK();
   }, 3500);		
}
function UI_AffenbyTakesTheHelm() {
		UI_info('Sinai flipped marker to its Affenby side (4)');	
  setTimeout(function () {	
	  UI_updateFront('Sinai');  	
  	UI_showOK();
  }, 2000);			
}
function UI_LawrenceStirsTheArabs() {
		UI_info('If it is in the map, flips the Arab unit to it\'s Lawrence side (3)');	
  setTimeout(function () {	
	  UI_updateFront('Arab');  	
  	UI_showOK();
  }, 2000);			
}
function UI_WarWeariness(d6) {
		UI_info('All off-map battles get -1 DRM until the end of the game');
		UI_updateCounters();	
  setTimeout(function () {	
	  UI_info('Roll a die and advance Front based on result:');
	  UI_info('1-Sinai, 2-Mesopotamia, 3 or 4-Arab');
	  UI_info('5 or 6-Gallipoli and Salonika');
  }, 1000);			
  setTimeout(function () {
	  UI_infoClear();
		UI_showDieRoll(d6);
  }, 2500);		
  setTimeout(function () {
		UI_updateCardInfo();
		UI_info('Front advancing this turn: '+card.advances);
  	UI_showOK();
   }, 3000);		
}
function UI_BolshevikRevolution() {
		UI_info('Remove the Caucasus unit');	
		UI_updateFront('Caucasus');	
  	UI_showOK();
}
function UI_Kaiserschlacht() {
		UI_info('Place the Kaiserschlacht token on the map');	
		UI_updateCounters();	
  setTimeout(function () {	
		UI_info('Conduct this Phase each turn from now on');	
  	UI_showOK();
  }, 2000);			
}
function UI_Dunsterforce() {
  UI_showOK();
}
function UI_NoEvent() {
	UI_info('No event this turn');
  UI_showOK();	
}

// ------------------------------------------------------------------
// - UI for User Actions
// ------------------------------------------------------------------

function UI_AllocateResourcesToTheatre(theatre)
{
	UI_hideActions(); 
	UI_updateCounters();
	UI_updateCardInfo();
	setTimeout(function () {
		UI_clickedOk();		
	}, 1000);
}

function UI_FortifyNarrows() {
	UI_hideActions(); 
	UI_updateNarrows();
	UI_updateCardInfo();
	setTimeout(function () {
		UI_CloseOverlay(); 
		UI_clickedOk();		
	}, 600);
}

function UI_DeployBureau(country) {
	UI_hideActions(); 
	UI_updateCounters();
	UI_updateCardInfo();
	setTimeout(function () {
		UI_CloseOverlay(); 
		UI_clickedOk();		
	}, 1000);
}

function UI_TurkishOffensive(front, d6, success)
{
	UI_hideActions(); 
	UI_infoClear();
	UI_info('Turkish offensive in '+front+' ('+game.Army[front]+')');
	UI_updateCardInfo();
  setTimeout(function () {
		UI_info(front+' DRM: +'+game.DRM[front]);
  }, 500);		
  setTimeout(function () {
		UI_showDieRoll(d6);
  }, 1000);
  setTimeout(function () {  	
	  UI_showDieSuccess(success);
		UI_updateFront(front);
		UI_updateCardInfo();
  }, 1500);		
  setTimeout(function () {  		
		UI_clickedOk();
  }, 2500);		
}	

function UI_UseYildirim()
{
	UI_infoClear();
	UI_info('Advanced blocked. '+game.Yildirim+' Yildirim remaining');
	UI_disable('Yildirim');
	UI_updateFront(front);	
  setTimeout(function () {  		
		UI_clickedOk(); 
	}, 1000);					
}

function UI_UseAsiaKorps()
{
	UI_info('Deploying Asia Korps. Next front you attack gets +1 DRM for the rest of the turn');
}

function UI_DeployAsiaKorps(front)
{
	UI_info('Deploying Asia Korps in '+front+' (DRM +1)');
	UI_updateCounters();	
}

function UI_GermanStaffOperationFrom(theatre)
{
	UI_info('German Staff Operations from '+theatre+' theatre');
	
	UI_disable(theatre);
	UI_updateCounters();
	UI_clickedOk();
}


// ------------------------------------------------------------------
// - UI for Game Actions
// ------------------------------------------------------------------

function UI_OffMapBattle(battle, theatre, value, d6, outcome)
{	
	UI_info('<U>'+battle+' Battle ('+value+')'+'</U>');
  setTimeout(function () {
			UI_info(theatre+' theatre DRM: +'+game.Theatre[theatre]);
			UI_info('War Weariness DRM: +'+game.WarWeariness);
  }, 100);		
  setTimeout(function () {
		UI_showDieRoll(d6);
  }, 500);		
  setTimeout(function () {  	
		UI_showDieSuccess(outcome);
		UI_updateNationalWill();
		UI_updateCounters();
  }, 1100);		
  setTimeout(function () {  		
		UI_showOK();		
  }, 1800);		
}	

function UI_CoupAttempt(country, d6, drm, outcome)
{
	UI_info('<U>'+'Coup attempt in '+country+' (5)'+'</U>');
  setTimeout(function () {
	  if (game.IntelligenceBureau===undefined) {
			UI_info('Intelligence Bureau of the East not deployed, DRM: 0');
		} else {
			UI_info('Intelligence Bureau of the East in '+ game.IntelligenceBureau+', DRM: '+drm);
		}
  }, 100);		
  setTimeout(function () {
		UI_showDieRoll(d6);
  }, 500);		
  setTimeout(function () {  
	  UI_showDieSuccess(outcome);
		UI_updateNationalWill();
		UI_updateCounters();
  }, 1100);		
  setTimeout(function () {  		
		UI_showOK();		
  }, 1800);		
}	

function UI_AttritionRoll(type, d6, success)
{
	UI_info(type+' Attrition Roll');
	
	var pos = game.Front.Sinai; // - ((success)?0:1);
//	if (type=='Fortification') pos = 4;
	document.getElementById('Sinai').className = 'army Sinai'+pos+type.charAt(0);	
//	console.log( document.getElementById('Sinai').classList );
	
  setTimeout(function () {
		UI_showDieRoll(d6);
  }, 1200);		
  setTimeout(function () {  	
	  UI_showDieSuccess(success);
		UI_updateCounters();								
		UI_showOK();		
// 		if ( (success == false) ||
// 				((type == 'Fortification') && (game.GazaBeershebaFortifications>0)) ) {
// 			UI_updateFront('Sinai');
// 		}
		//UI_updateFortifications();
	}, 1900);		
}


function UI_showOffensive(front, ask_yildirim)
{
	UI_updateFront(front);	
	if (ask_yildirim===true) {					
	  setTimeout(function () {  		
			UI_askYildirim(front);
			UI_showOK('Next');										
	  }, 1000);		
  } else {
	  setTimeout(function () {  		
			UI_clickedOk();
	  }, 2000);		
  }
}

