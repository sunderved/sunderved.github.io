// ------------------------------------------------------------------
// - DIV Clickability and Focus   
// ------------------------------------------------------------------

function UI_setClickCallback(divid, callback) {
	if ('ontouchstart' in document.documentElement) {
	  document.getElementById(divid).addEventListener('touchstart', callback);
	} else {
 	  document.getElementById(divid).addEventListener('click', callback);;
	}  
	UI_disableClick(divid);     
}

function UI_enableClick(id) {
  document.getElementById(id).style.pointerEvents = 'auto';     
}

function UI_disableClick(id) {
  document.getElementById(id).style.pointerEvents = 'none';     
}

function UI_defocus(id) {
  document.getElementById(id).classList.remove('highlighted');
	UI_disableClick(id)
}

function UI_focus(id) {
  document.getElementById(id).classList.add('highlighted');
	UI_enableClick(id)
}

// ------------------------------------------------------------------
// - Primary Click Management 
// ------------------------------------------------------------------

function UI_waitForClick()
{
	UI_enableClick('info');
}

function UI_disableOK()
{
	UI_disableClick('info');
}

function UI_clickedOk()
{
	UI_clear();
	UI_dieHide();
 	UI_hideBV();
 	UI_hideDRM();	
	UI_disableOK();
  UI_closeOverlay();
  UI_defocus('Yildirim_L');
  
  OSnext();
}
	
// ------------------------------------------------------------------
// - D6 
// ------------------------------------------------------------------

var die;

function UI_dieShowRoll(d6) {
  die.div.className = '';
  die.showRoll(d6);
}

function UI_dieShowSuccess(success) {
  if ((success===true) || (success=='victory')) {
    die.div.className = 'success';
  } else if ((success===false) || (success=='defeat')) {
    die.div.className = 'failure';
  } else {
    die.div.className = '';
  }    
}

function UI_dieHide() {
  die.hide();
  die.div.classList.remove('success');
  die.div.classList.remove('failure');
}

function UI_dieInit() {
// For some reason the glow effect doesn't work as well when die is a child of 'info'  
//   die = new D6('info', 'die', 80, 'white', '#202020');
//   die.div.style.left=760+'px';
//   die.div.style.top = 15+'px';

// Making die a child of container instead
  die = new D6('container', 'die', 80, 'white', '#202020');
  die.div.style.left=860+'px';
  die.div.style.top =675+'px';
  die.div.style.zIndex = 45;
  die.div.style.background = 'linear-gradient(45deg,#737373,#BBBBBB)';
  die.div.style.pointerEvents = 'none';     
  die.hide();
}

// ------------------------------------------------------------------
// - Misc UI Stuff 
// ------------------------------------------------------------------


function UI_offerChoice(options, op1, op1func, op2, op2func)
{
  document.getElementById('choice').style.visibility='visible';  
  //document.getElementById('options').innerHTML=options;  
  document.getElementById('op1').innerHTML=op1;  
  document.getElementById('op2').innerHTML=op2;  
  if (op1func!==undefined) {
	  UI_setClickCallback('op1', function() { document.getElementById('choice').style.visibility='hidden';  op1func(); OSnext(); } ); 
	  UI_focus('op1');
  }
  if (op2func!==undefined) {
  	UI_setClickCallback('op2', function() { document.getElementById('choice').style.visibility='hidden';  op2func(); OSnext(); } );    
  	UI_focus('op2');
	}
}

function UI_updateCardInfo() 
{
  var c  = CurrentCard();
  var el = document.getElementById('card');  
  el.innerHTML='<BR>';
  el.innerHTML+='<B>'+c.name+'</B><BR>';
  el.innerHTML+='<BR>';
  el.innerHTML+='<U>Offensives:</U><BR>';
  for (var i in game.Offensives) {
    el.innerHTML+='&#8226; '+game.Offensives[i]+'<BR>';
  }  
  el.innerHTML+='<BR>';
  el.innerHTML+='<U>Actions:</U> '+c.actions+'<BR>';
  if (c.text) {
    el.innerHTML+='<font color="red">'+c.text+'</font>';      
  }  
} 

function UI_showDRM(drm)
{
	if (drm!=0) { 
		var str = (drm>0)?'+'+drm:drm;
		document.getElementById('drmvalue').innerHTML  = '<div class="battlenumber">'+str+'</div>';
		document.getElementById('drmvalue').innerHTML += '<div class="battlelabel">DRM</div>';		
  	document.getElementById('drmvalue').classList.add('show');  
  }
}

function UI_hideDRM()
{
  document.getElementById('drmvalue').innerHTML = '';  
 	document.getElementById('drmvalue').classList.remove('show');  
}

function UI_showBV(bv, theatre)
{
	document.getElementById('battlevalue').innerHTML  = '<div class="battlenumber">'+bv+'</div>';
	document.getElementById('battlevalue').innerHTML += '<div class="battlelabel">'+theatre+'</div>';
  document.getElementById('battlevalue').className  = 'battleinfo '+theatre;  
 	document.getElementById('battlevalue').classList.add('show');  
}

function UI_hideBV()
{
  document.getElementById('battlevalue').innerHTML = '';  
 	document.getElementById('battlevalue').classList.remove('show');  
}


// ------------------------------------------------------------------
// - Update Functions 
// ------------------------------------------------------------------

function UI_removeFront(front)
{  
	document.getElementById(front).className = 'army '+front+'X';	
	
  if (front=='Caucasus') {
		document.getElementById(front).classList.toggle('imperial', game.ImperialRussia);
  }	
}

function UI_updateFront(front)
{  
  var pos = game.Front[front];
	var el = document.getElementById(front);
	
	//if (front!='Sinai')
	  el.innerHTML = game.Army[front];  
	  
  if (pos!==undefined) {
    if (pos>0) {
      el.className = 'army '+front+''+pos;
    } else {
      el.className = 'army Constantinople';  
    }
  } else {
    UI_removeFront(front);
  }
  
  if (front=='Caucasus') {
		el.classList.toggle('imperial', game.ImperialRussia);
  }
  
  if (front=='Sinai') {
		document.getElementById('Arab').classList.toggle('slideright', false)
  }
  if (front=='Arab') {
		document.getElementById('Sinai').classList.toggle('slideleft', false)
  }  
  if ((front=='Sinai') || (front=='Arab')) {
	  if (game.Front[front]<3) {
		  if (game.Front['Sinai']==game.Front['Arab']) {
			  document.getElementById('Sinai').classList.add('slideleft')
			  document.getElementById('Arab').classList.add('slideright')
		  }
	  }
  }
  
  
  UI_updateNationalWill();  
}

function UI_updateFortifications()
{  
  switch (game.GazaBeershebaFortifications) {
    case 0:
      document.getElementById('Fortification').className = 'army Sinai4';
      break;
    case 1:
      document.getElementById('Fortification').className = 'army Sinai4 weak';
      break;
    case 2:
      document.getElementById('Fortification').className = 'army Sinai4 full';
      break;
  }    
}

function UI_updatePipeline()
{
  document.getElementById('waterS4').classList.toggle('hidden', game.SinaiPipelineBuilt);    
	document.getElementById('waterS5').classList.toggle('hidden', game.SinaiPipelineBuilt);
}

function UI_updateBureau()
{
  if (game.IntelligenceBureau===undefined) {
    document.getElementById('Bureau_L').style.visibility = 'hidden';
    document.getElementById('Bureau').style.visibility = 'hidden';
  } else {
    document.getElementById('Bureau_L').style.visibility = 'visible';
    document.getElementById('Bureau').style.visibility = 'visible';
    document.getElementById('Bureau').innerHTML = game.IntelligenceBureau.charAt(0);
  }	
  
  document.getElementById('India').disabled       = CoupHasHappened('India');
  document.getElementById('Persia').disabled      = CoupHasHappened('Persia');
  document.getElementById('Afghanistan').disabled = CoupHasHappened('Afghanistan');
  
  if (game.IntelligenceBureau!==undefined) {
	  document.getElementById(game.IntelligenceBureau).disabled = true;
  }
  
}

function UI_updateYildirim()
{
  document.getElementById('Yildirim_L').style.visibility = (game.Yildirim>0)?'visible':'hidden';
  document.getElementById('Yildirim').style.visibility = (game.Yildirim>0)?'visible':'hidden';
  document.getElementById('Yildirim').innerHTML = game.Yildirim; 
}

function UI_updateAsiaKorps()
{ 
  document.getElementById('AsiaKorps').style.visibility = (game.AsiaKorps==1)?'visible':'hidden';
}

function UI_updateScore()
{
  document.getElementById('Victories' ).innerHTML = game.Victories.length;    
  document.getElementById('Defeats'   ).innerHTML = game.Defeats.length;      
  document.getElementById('Stalemates').innerHTML = game.Stalemates.length;    
}

function UI_updateOffMapTheatres()
{
	document.getElementById('West' ).innerHTML = game.Theatre.West;    
  document.getElementById('Naval').innerHTML = game.Theatre.Naval;      
  document.getElementById('East' ).innerHTML = game.Theatre.East;    
}

function UI_updateNarrows()
{  
  if (game.StraitsClosed) {
    document.getElementById('Narrows').className = 'closed';
  }    
		
  for (var defense in game.Narrows) {
    document.getElementById(defense).innerHTML = NarrowsDefenseValues[defense];
    if (game.Narrows[defense]===false) {
      document.getElementById(defense).className = 'defense';
      if (defense=='Seddulbahir') {
        document.getElementById(defense).innerHTML = 'x';
      }
    } else {       
      if ((defense=='Minefield_1') || (defense=='Minefield_2')) {
        document.getElementById(defense).className = 'defense mine';
      } else {
        document.getElementById(defense).className = 'defense gun';
      }
    }
  }
}

function UI_updateNationalWill()
{
  document.getElementById('nationalwill_slider').style.left = (-220 - 55*BoundedWill());	
}

function UI_updateFortitude(fortitude)
{
  document.getElementById('fortitude_slider').style.top = (-55*fortitude);  
}

function UI_updateCounters()
{
	UI_updateNationalWill();
	UI_updateScore();
	UI_updateOffMapTheatres();  
	UI_updateBureau();
  UI_updateYildirim();
  UI_updateAsiaKorps();
  UI_updateNarrows();      
	UI_updateFortifications();
}

function UI_updateBattles()
{
  var str = '';
  str += '<BR>';
  str += 'Card Played / Remaining : '+game.Played.length+' / '+RemainingCards()+'<BR>';
  str += '<BR>';
  str += '<BR>';
  str += 'Victories : '+game.Victories.length+'<BR>';
  for (var i in game.Victories)
	  str += (i>0?', ':'')+game.Victories[i];
  str += '<BR>';
  str += '<BR>';
  str += 'Defeats : '+game.Defeats.length+'<BR>';
  for (var i in game.Defeats)
	  str += (i>0?', ':'')+game.Defeats[i];
  str += '<BR>';
  str += '<BR>';
  str += 'Stalemates : '+game.Stalemates.length+'<BR>';
  for (var i in game.Stalemates)
	  str += (i>0?', ':'')+game.Stalemates[i];
  str += '<BR>';
  str += '<BR>';
  str += 'Flags Controlled by Allies : '+(game.Victories.length - game.Defeats.length - game.TurkishNationalWill);
  
  document.getElementById('battlemap').innerHTML = str;
}

// ------------------------------------------------------------------
// - Show/Hide User Actions 
// ------------------------------------------------------------------

function UI_showActions()
{  
  for (var army in game.Front) {
    if ( CanAttackFront(army) ) {
      UI_focus(army);  
    }
  }  

  for (var theatre in game.Theatre) {
    if ( CanAllocateTheatre(theatre) ) {
      UI_focus(theatre+'_L');  
    }
  }  
        
  if ( CanFortifyNarrows() ) {
    UI_focus('Narrows');  
    if (game.Narrows.Minefield_1===false) { 
      UI_focus('Minefield_1'); 
    }
    if (game.Narrows.Yildiz===false) { 
      UI_focus('Yildiz'); 
    }
    if (game.Narrows.Dardanos===false) { 
      UI_focus('Dardanos'); 
    }
    if (game.Narrows.Minefield_2===false) { 
      UI_focus('Minefield_2'); 
    }
    if (game.Narrows.Nagara===false) { 
      UI_focus('Nagara'); 
    }                        
  }  
  
  if ( CanDeployBureau() ) {
    UI_focus('Bureau_L');  
  }
  
  if ( CanUseAsiaKorps )
    UI_focus('AsiaKorps');  
}

function UI_hideActions()
{    
  for (var army in game.Front) {
    UI_defocus(army);    
  }  

  for (var theatre in game.Theatre) {
    UI_defocus(theatre);    
    UI_defocus(theatre+'_L');    
  }  
    
  for (var defense in game.Narrows) {
    UI_defocus(defense);    
  }  
      
  UI_defocus('Bureau_L');      
  UI_defocus('AsiaKorps');
    
  
  UI_defocus('Narrows');
  UI_enableClick('Narrows');
}


// ------------------------------------------------------------------
// - Secondary Maps and Displays 
// ------------------------------------------------------------------

function UI_openOverlay(map)
{
  document.getElementById('overlay').style.visibility = 'visible';
//   document.getElementById('special').style.visibility = 'visible';    
  document.getElementById('fortitude').style.visibility = 'hidden';
  document.getElementById('narrowsmap').style.visibility = 'hidden';  
  document.getElementById('bureaumap').style.visibility = 'hidden';  
  document.getElementById('battlemap').style.visibility = 'hidden';  
  document.getElementById(map).style.visibility = 'visible';  
  UI_enableClick(map);
  
}

function UI_closeOverlay()
{	
  document.getElementById('overlay').style.visibility='hidden';
//   document.getElementById('special').style.visibility='hidden';  
  document.getElementById('fortitude').style.visibility = 'hidden';
  document.getElementById('narrowsmap').style.visibility = 'hidden';  
  document.getElementById('bureaumap').style.visibility = 'hidden';  
  document.getElementById('battlemap').style.visibility = 'hidden';  
}

// ------------------------------------------------------------------
// - UI Message API 
// ------------------------------------------------------------------

function UI_clear() {
  document.getElementById('infospan').innerHTML='';
}


function UI_info(str) {
	if (document.getElementById('infospan').innerHTML!='') {
	  document.getElementById('infospan').innerHTML+='<BR>';  
	} 
  document.getElementById('infospan').innerHTML+=str;
}

function UI_log(str)
{
// 	document.getElementById('myconsole').innerHTML+=str;
// 	document.getElementById('myconsole').innerHTML+='<BR>';
//	console.log(str);
}

function debug(str)
{
	console.log(str);
}

// ------------------------------------------------------------------
// - UI initialization
// ------------------------------------------------------------------

function initView() 
{  
  // disable default event handler  
  if ('ontouchstart' in document.documentElement) {
		document.addEventListener('touchmove',  function(e){ e.preventDefault(); }); 
		document.addEventListener('touchstart', function(e){ e.preventDefault(); }); 	  
	}	
  
  UI_dieInit();

  UI_setClickCallback('splash', function() { UI_splash2game();      }  );
	UI_enableClick('splash');     
  
           
  UI_setClickCallback('Turkey'     ,  function() { DeployBureau('Turkey');      } );
  UI_setClickCallback('India'      ,  function() { DeployBureau('India');       } );
  UI_setClickCallback('Persia'     ,  function() { DeployBureau('Persia');      } );
  UI_setClickCallback('Afghanistan',  function() { DeployBureau('Afghanistan'); } );
  
  UI_setClickCallback('Sinai',        function() { TurkishOffensive('Sinai');       } );
  UI_setClickCallback('Mesopotamia',  function() { TurkishOffensive('Mesopotamia'); } );
  UI_setClickCallback('Caucasus',     function() { TurkishOffensive('Caucasus');    } );
  UI_setClickCallback('Gallipoli',    function() { TurkishOffensive('Gallipoli');   } );
  UI_setClickCallback('Salonika',     function() { TurkishOffensive('Salonika');    } );
  UI_setClickCallback('Arab',         function() { TurkishOffensive('Arab');        } );
                          
  UI_setClickCallback('West_L',       function() { AllocateResourcesToTheatre('West');  } );  
  UI_setClickCallback('East_L',       function() { AllocateResourcesToTheatre('East');  } );  
  UI_setClickCallback('Naval_L',      function() { AllocateResourcesToTheatre('Naval'); } );  
                          
  UI_setClickCallback('West',         function() { GermanStaffOperationFrom('West');    } );  
  UI_setClickCallback('East',         function() { GermanStaffOperationFrom('East');    } );  
  UI_setClickCallback('Naval',        function() { GermanStaffOperationFrom('Naval');   } );  
    
  UI_setClickCallback('Yildirim_L',   function() { UseYildirim(); }  );    
  UI_setClickCallback('AsiaKorps',    function() { UseAsiaKorps(); }  );
                          
  UI_setClickCallback('Bureau_L',     function() {                     UI_openOverlay('bureaumap');  } );  
  UI_setClickCallback('Narrows',      function() { UI_updateNarrows(); UI_openOverlay('narrowsmap'); } );          
  UI_setClickCallback('Score',        function() { UI_updateBattles(); UI_openOverlay('battlemap');  } );          
                          
  UI_setClickCallback('Minefield_1',  function() { event.stopPropagation(); FortifyNarrows('Minefield_1'); } );
  UI_setClickCallback('Yildiz',       function() { event.stopPropagation(); FortifyNarrows('Yildiz');      } );
  UI_setClickCallback('Dardanos',     function() { event.stopPropagation(); FortifyNarrows('Dardanos');    } );
  UI_setClickCallback('Minefield_2',  function() { event.stopPropagation(); FortifyNarrows('Minefield_2'); } );
  UI_setClickCallback('Nagara',       function() { event.stopPropagation(); FortifyNarrows('Nagara');      } );
  
  UI_setClickCallback('battlemap',    function() { UI_closeOverlay(); } );
  UI_setClickCallback('narrowsmap',   function() { UI_closeOverlay(); } );
  UI_setClickCallback('bureaumap',    function() { UI_closeOverlay(); } );

  UI_setClickCallback('info',         function() { UI_clickedOk(); } ); 
      
	UI_enableClick('Narrows');     
	UI_enableClick('Score');       
	UI_enableClick('overlay');     
	UI_enableClick('battlemap');     
	UI_enableClick('narrowsmap');     
	UI_enableClick('Turkey');     
	UI_enableClick('India');     
	UI_enableClick('Persia');     
	UI_enableClick('Afghanistan');     
	
  UI_closeOverlay();   
	
}

function UI_startNewGame()
{
  UI_clear(); 
  UI_closeOverlay();   
  UI_hideActions();
 	UI_hideCard();
	UI_updatePipeline();
  UI_updateFront('Sinai');
  UI_updateFront('Mesopotamia');
  UI_updateFront('Caucasus');
  UI_updateFront('Arab');
  UI_updateFront('Gallipoli');
  UI_updateFront('Salonika');
  UI_updateNarrows();
  UI_updateCounters();
  UI_updateFortitude(4);  
}


