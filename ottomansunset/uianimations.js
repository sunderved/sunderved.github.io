// ------------------------------------------------------------------
// - UI for Draw Card
// ------------------------------------------------------------------

function UI_hideCard() 
{
	document.getElementById('card').classList.remove('visible');
}

function UI_showCard() 
{	
  UI_clear();
	setTimeout(function () {
		UI_updateCardInfo();
		document.getElementById('card').classList.add('visible'); 
	}, 1000);		
}

// ------------------------------------------------------------------
// - UI for Card Events 
// ------------------------------------------------------------------

function UI_IntelligenceBureau() {
	UI_info('Intelligence Bureau of the East deployed in Turkey');
	UI_updateCounters(); 
  UI_waitForClick();
}
function UI_GoebenDominates() {
	UI_info('Salonika and Caucasus Fronts Retreat'); 
 	UI_updateFront('Salonika');	
 	UI_updateFront('Caucasus');	
  UI_waitForClick();
}
function UI_JihadDeclared() {
	UI_info('Shuffling Mid-Day Cards in Deck'); 
  UI_waitForClick();
}
function UI_TurkishMinelaying(mine) {
	UI_disableOK();
	if (mine>0) {
		UI_info('Adding Minefield in the Narrows');
	  setTimeout(function () {
		  UI_openOverlay('narrowsmap');
			UI_disableClick('narrowsmap');
		}, 800);		
	  setTimeout(function () {
			UI_updateNarrows();
		  UI_waitForClick();
		}, 1800);				
	} else {
		UI_info('All mines have already been layed');
	  UI_waitForClick();
	}
}
function UI_ForcingTheNarrows(events) {
	UI_disableOK();
		
	if (game.StraitsClosed) {
		UI_clear();
		UI_info('U-boats are protecting the Narrows');
  	UI_waitForClick();
  	return;		
	}	
	
  UI_openOverlay('narrowsmap');
	document.getElementById('fortitude').style.visibility = 'visible';

	if (events.length===0)
	{	
		if (game.BritishFortitude===0) {
			UI_info('Turks have won the campaign');
		} else {
			UI_info('English have won the campaign');
		}
		UI_waitForClick();
  	return;
	}
	
	var defense = events.shift();
		
  setTimeout(function () {
	  UI_clear();
		die.div.className = '';
		document.getElementById(defense.name).classList.add('highlighted');	
		UI_info('English fleet facing '+defense.name);
	}, 1000);		
  setTimeout(function () {
		UI_dieShowRoll(defense.d6);
  }, 1500);		
  setTimeout(function () {  
 	  UI_dieShowSuccess( defense.success );
		UI_updateFortitude( defense.fortitude );
	}, 2300);		
  setTimeout(function () {
		document.getElementById(defense.name).classList.remove('highlighted');	
	  UI_ForcingTheNarrows(events);
	}, 3000);
}
function UI_GallipoliLanding() {
	UI_disableOK();
  UI_info('Hamilton opens new front in Gallipoli');
	UI_info('&nbsp;'); 
  UI_updateFront('Gallipoli');  	
  setTimeout(function () {
	  UI_openOverlay('narrowsmap');
		UI_disableClick('narrowsmap');
	}, 1500);	 
  setTimeout(function () {
	  UI_clear();
	  UI_info('Hamilton opens new front in Gallipoli');
		UI_info('Seddulbahir Gun is Destroyed');
		UI_updateNarrows();
	  UI_waitForClick();
	}, 2500);	
}
function UI_GermanUboats() {
  UI_info('German U-boats in the Mediterranean. The Narrows are now closed to English attacks');
	UI_updateCounters();
  UI_waitForClick();
}
function UI_SuvlaLanding() {
	if (game.Front.Gallipoli !== undefined) {
		UI_info('Gallipoli unit is increased to 3');
		UI_updateFront('Gallipoli');
	} else {
		UI_info('Gallipoli front inactive. Nothing happens');
	}
  UI_waitForClick();
}
function UI_GrandDukeNicholasTakesControl() {
	if (game.Front.Caucasus !== undefined) {
		UI_info('New Caucasus Front value: '+game.Army.Caucasus);
		UI_updateFront('Caucasus');
	} else {
		UI_info('Caucasus front inactive. Nothing happens');
	}	
	UI_waitForClick();
}
function UI_SenussiRevolt() {
	UI_info('Sinai Front Retreat'); 
 	UI_updateFront('Sinai');	
  UI_waitForClick();
}
function UI_LandingAtSalonika() {
	UI_info('Sarrail opens new front in Salonika'); 
	UI_updateFront('Salonika');
  UI_waitForClick();
}
function UI_SinaiPipeline() {	
	UI_disableOK();
	UI_info('Shuffling Dusk Cards in Deck'); 
	UI_info('&nbsp;'); 
	UI_info('&nbsp;'); 
  setTimeout(function () {
	  UI_clear();
		UI_info('Shuffling Dusk Cards in Deck'); 
	  UI_info('Sinai Pipeline Complete');
		UI_info('&nbsp;'); 
		UI_updatePipeline();
	}, 1500);		
  setTimeout(function () {
	  UI_clear();
		UI_info('Shuffling Dusk Cards in Deck'); 
	  UI_info('Sinai Pipeline Complete');
	  UI_info('Place the Faisal Hussein unit on the Arab 6 space, if not yet in play');
 	  UI_updateFront('Arab');  	
  	UI_waitForClick();
	}, 2500);  
}
function UI_GallipoliEvacuation() {
	UI_disableOK();
  UI_info('Gallipoli unit is removed');
	UI_info('&nbsp;'); 
  UI_updateFront('Gallipoli');  	
  setTimeout(function () {
	  UI_clear();
	  UI_info('Gallipoli unit is removed');
	  UI_info('If in play, flip the Salonika unit to its D\'Esperey side');
 	  UI_updateFront('Salonika');  	
  	UI_waitForClick();
	}, 1500);  
}
function UI_MesopotamianSiege() {
	UI_disableOK();
  UI_info('Siege of Kut Victory');
	UI_info('&nbsp;'); 
  UI_updateCounters();  	
  setTimeout(function () {
	  UI_removeFront('Mesopotamia');
	}, 1500);		  		
  setTimeout(function () {
	  UI_clear();
	  UI_info('Siege of Kut Victory');
	  UI_info('Maude takes over in Mesopotamia from Basra');	  
 	  UI_updateFront('Mesopotamia');  	
  	UI_waitForClick();
	}, 2600);		  		
}
function UI_AsiaKorps() {
  UI_info('Receive the Asia Korps marker');
  UI_updateCounters();  	
	UI_waitForClick();
}
function UI_ArabRevolt() {
  UI_info('Place the Faisal Hussein (2) unit on the Arab 6 space, if not yet in play');
  UI_updateFront('Arab');  	
 	UI_waitForClick(); 	
}
function UI_YudenichNamedCommanderInChief() {
	if (game.Front.Caucasus !== undefined) {
		UI_info('New Caucasus Front value: '+game.Army.Caucasus);
		UI_updateFront('Caucasus');
	} else {
		UI_info('Caucasus front inactive. Nothing happens');
	}	
	UI_waitForClick();
}
function UI_Yildirim() {
  UI_info('Receive 3 Yildirim tokens');
  UI_updateCounters();  	
	UI_waitForClick();
}
function UI_ProvisionalGovernmentTakesCharge() {
	UI_disableOK();
  UI_info('If the Caucasus unit is on the map, retreat it one space.');
  UI_info('If it is not, return it to Kars (5).');
  UI_info('Place it to it\'s reduced side.');	
  setTimeout(function () {
		UI_updateFront('Caucasus');	  
		UI_waitForClick();
  }, 500);		  
}
function UI_Sandstorms(front, d6) {
	UI_disableOK();
	UI_info('Roll a die. Retreat Mesopotamia on 1,2,3 or Sinai on 4,5,6.');
	UI_info('&nbsp;'); 
	UI_info('&nbsp;'); 	
  setTimeout(function () {
		UI_dieShowRoll(d6);
  }, 1000);		
  setTimeout(function () {
	  UI_clear();
		UI_info('Roll a die. Retreat Mesopotamia on 1,2,3 or Sinai on 4,5,6.');
		UI_info(front+' Front Retreats');
		UI_info('&nbsp;'); 	
	  UI_updateFront(front);  	
   }, 1900);	
   setTimeout(function () {
	  UI_clear();
		UI_info('Roll a die. Retreat Mesopotamia on 1,2,3 or Sinai on 4,5,6.');
		UI_info(front+' Front Retreats');
		UI_info('No offensives vs '+front+' this turn');
		UI_waitForClick();
   }, 2900);		   
}
function UI_AffenbyTakesTheHelm() {
	UI_disableOK();
	UI_info('Sinai flipped marker to its Affenby side');	
  setTimeout(function () {	
	  UI_updateFront('Sinai');  	
  	UI_waitForClick();
  }, 2000);			
}
function UI_LawrenceStirsTheArabs() {
	UI_disableOK();
	UI_info('If it is in the map, flips the Arab unit to it\'s Lawrence side');	
  setTimeout(function () {	
	  UI_updateFront('Arab');  	
  	UI_waitForClick();
  }, 2000);			
}
function UI_WarWeariness(d6) {
	UI_disableOK();
	UI_info('All off-map battles get -1 DRM until the end of the game');
	UI_info('&nbsp;'); 	
	UI_info('&nbsp;'); 	
	UI_info('&nbsp;'); 	
  setTimeout(function () {	
	  UI_clear();
		UI_info('All off-map battles get -1 DRM until the end of the game');
	  UI_info('Roll a die. Advance Sinai on 1, Mesopotamia on 2,');
	  UI_info('Arab on 3,4, Gallipoli and Salonika 5,6');
		UI_info('&nbsp;'); 	
  }, 1000);			
  setTimeout(function () {
		UI_dieShowRoll(d6);
  }, 2000);		
  setTimeout(function () {
	  UI_clear();
		UI_info('All off-map battles get -1 DRM until the end of the game');
	  UI_info('Roll a die. Advance Sinai on 1, Mesopotamia on 2,');
	  UI_info('Arab on 3,4, Gallipoli and Salonika 5,6');
		UI_info('Front advancing this turn: '+game.Offensives);
		UI_updateCardInfo();
		UI_waitForClick();
   }, 3000);		
}
function UI_BolshevikRevolution() {
		UI_info('Remove the Caucasus unit');	
		UI_updateFront('Caucasus');	
  	UI_waitForClick();
}
function UI_Kaiserschlacht() {
// 	UI_info('Place the Kaiserschlacht token on the map');	
// 	UI_info('Conduct this Phase each turn from now on');	
	UI_info('Conduct the Kaiserschlacht Phase each turn until the end of game');	
	UI_waitForClick();
}
function UI_NoEvent() {
	UI_info('No event this turn');
  UI_waitForClick();	
}

// ------------------------------------------------------------------
// - UI for User Actions
// ------------------------------------------------------------------

function UI_AllocateResourcesToTheatre(theatre) {
	UI_disableOK();
	UI_clear();
	UI_hideActions(); 
	UI_updateCounters();
	setTimeout(function () {
		UI_clickedOk();		
	}, 1000);
}

function UI_FortifyNarrows() {
	UI_disableOK();
	UI_clear();
	UI_hideActions(); 
	UI_updateNarrows();
	setTimeout(function () {
		UI_closeOverlay(); 
		UI_clickedOk();		
	}, 800);
}

function UI_DeployBureau(country) {
	UI_disableOK();
	UI_clear();
	UI_hideActions(); 
	UI_updateCounters();
	setTimeout(function () {
		UI_closeOverlay(); 
		UI_clickedOk();		
	}, 1000);
}

function UI_TurkishOffensive(front, d6, success) {
	UI_disableOK();
	UI_clear();
	UI_hideActions(); 
	UI_info('Turkish Offensive in '+front);
	UI_info(front+' DRM: +'+game.DRM[front]);
  setTimeout(function () {
		UI_dieShowRoll(d6);
  }, 500);
  setTimeout(function () {  	
	  UI_dieShowSuccess(success);
		UI_updateFront(front);
		UI_waitForClick();
  }, 1200);	  		
}	

function UI_UseYildirim() {
	UI_disableOK();
	UI_clear();
	UI_info('Advanced blocked. '+game.Yildirim+' Yildirim remaining');
	UI_defocus('Yildirim');
	UI_updateFront(front);	
  setTimeout(function () {  		
		UI_clickedOk(); 
	}, 1000);					
}

function UI_UseAsiaKorps() {
	UI_info('Deploying Asia Korps. Next front you attack gets +1 DRM for the rest of the turn');
}

function UI_GermanStaffOperationFrom(theatre) {
	UI_disableOK();
	UI_info('German Staff Operations from '+theatre+' theatre');	
	UI_defocus(theatre);
	UI_updateCounters();
	UI_clickedOk();
}


// ------------------------------------------------------------------
// - UI for Game Actions
// ------------------------------------------------------------------

function UI_OffMapBattle(battle, theatre, value, d6, outcome)
{	
	UI_disableOK();
	UI_clear();
	UI_info('<U>'+battle+'</U>'+' - BV '+value);
	UI_info(theatre+' Theatre DRM: +'+game.Theatre[theatre]);
	UI_info('War Weariness DRM: '+game.WarWeariness);
  setTimeout(function () {
		UI_dieShowRoll(d6);
  }, 1000);		
  setTimeout(function () {  	
		UI_dieShowSuccess(outcome);
		UI_updateNationalWill();
		UI_updateCounters();
		UI_waitForClick();
  }, 2100);			
}	

function UI_CoupAttempt(country, d6, drm, outcome)
{
	UI_disableOK();
	UI_info('<U>'+'Coup attempt in '+country+' (5)'+'</U>');
  if (game.IntelligenceBureau===undefined) {
		UI_info('Intelligence Bureau of the East not deployed, DRM: 0');
	} else {
		UI_info('Intelligence Bureau of the East in '+ game.IntelligenceBureau+', DRM: '+drm);
	}
  setTimeout(function () {
		UI_dieShowRoll(d6);
  }, 1000);		
  setTimeout(function () {  
	  UI_dieShowSuccess(outcome);
		UI_updateNationalWill();
		UI_updateCounters();
		UI_waitForClick();
  }, 2100);  		
}	

function UI_AttritionRoll(type, d6, success)
{
	UI_disableOK();
	UI_info(type+' Attrition Roll');
	document.getElementById('Sinai').className = 'army Sinai'+game.Front.Sinai+type.charAt(0);	
  setTimeout(function () {
		UI_dieShowRoll(d6);
  }, 1200);		
  setTimeout(function () {  	
	  UI_dieShowSuccess(success);
		UI_updateCounters();								
    UI_log(type+' attrition roll '+((success===true)?'successfull':'failed') );
		UI_waitForClick();
	}, 1900);
}

function UI_showOffensive(front, ask_yildirim)
{
	UI_disableOK();
	UI_clear();
	UI_updateFront(front);	
	if (ask_yildirim===true) {					
	  setTimeout(function () {  		
		  UI_info('Expand Yildirim token to block advance?');  
		  UI_focus('Yildirim_L');
			UI_waitForClick();										
	  }, 1000);		
  } else {
	  setTimeout(function () {  		
			UI_clickedOk();
	  }, 1500);		
  }
}

