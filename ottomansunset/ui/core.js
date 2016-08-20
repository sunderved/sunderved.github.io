// ------------------------------------------------------------------
// - Ok Button 
// ------------------------------------------------------------------

function UI_showOK(str)
{
  document.getElementById('ok').innerHTML=((str===undefined)?'Ok':str);
  document.getElementById('ok').style.visibility='visible';  
	document.getElementById('ok').style.pointerEvents = 'auto';     
  document.getElementById('info').style.pointerEvents = 'auto';     
  
//   if (callback!==undefined) {
// 	  console.log('Here');
// 	  console.log(callback);
// 	  onTouch('ok', callback);
// 	  onTouch('info', callback);
//   } else {
// 	  console.log('Oh oh');
// 	  onTouch('ok', UI_clickedOk);
// 	  onTouch('info', UI_clickedOk);
//   }
}

function UI_hideOK()
{
  document.getElementById('ok').style.visibility='hidden';  
}

function UI_clickedOk()
{
  document.getElementById('ok').innerHTML='Ok';  
  document.getElementById('ok').style.visibility='hidden';  
	document.getElementById('die').style.pointerEvents = 'none';     
	document.getElementById('info').style.pointerEvents = 'none';     

  UI_closeOverlay();
  UI_hideDie();
  UI_disable('Yildirim_L');
  
  OSnext();
}


function UI_showSkipActions()
{
  document.getElementById('skip').style.visibility='visible';  
	document.getElementById('skip').style.pointerEvents = 'auto';     
}

function UI_hideSkipActions()
{
  document.getElementById('skip').style.visibility='hidden';  
	document.getElementById('skip').style.pointerEvents = 'none';     
}

	
// ------------------------------------------------------------------
// - D6 
// ------------------------------------------------------------------

var die;

function UI_showDieRoll(d6) {
  die.div.className = '';
  die.showRoll(d6);
}

function UI_showDieSuccess(success) {
  if ((success===true) || (success=='victory')) {
    die.div.className = 'success';
  } else if ((success===false) || (success=='defeat')) {
    die.div.className = 'failure';
  } else {
    die.div.className = '';
  }    
}

function UI_hideDie() {
  die.hide();
  die.div.classList.remove('success');
  die.div.classList.remove('failure');
}

function UI_initDie() {
  die = new D6('container', 'die', 80, 'white', '#202020');
  die.div.style.left=760+'px';
  die.div.style.top =675+'px';
  die.div.style.zIndex = 30;
  die.div.style.background = 'linear-gradient(45deg,#737373,#BBBBBB)';
  die.div.style.pointerEvents = 'none';     
  onTouch('die', function() { UI_clickedOk(); } ); 
  die.hide();
}

function UI_waitForDieClick() {
  document.getElementById('die').style.pointerEvents = 'auto';     
  document.getElementById('info').style.pointerEvents = 'auto';     
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
  onTouch('op1', function() { document.getElementById('choice').style.visibility='hidden';  op1func(); OSnext(); } ); 
  onTouch('op2', function() { document.getElementById('choice').style.visibility='hidden';  op2func(); OSnext(); } );    
  UI_enable('op1');
  UI_enable('op2');
}

function UI_updateCardInfo() {
  var el =  document.getElementById('card');  
  el.innerHTML='<BR>';
  el.innerHTML+='<B>'+card.name+'</B><BR>';
  el.innerHTML+='<BR>';
  el.innerHTML+='<U>Offensives:</U><BR>';
  for (var i in card.advances) {
    el.innerHTML+='&#8226; '+card.advances[i]+'<BR>';
  }  
  el.innerHTML+='<BR>';
  el.innerHTML+='<U>Actions:</U> '+card.actions+'<BR>';
  if (card.text) {
    el.innerHTML+='<font color="red">'+card.text+'</font>';      
  }  
} 

function UI_showEvent() 
{  
  UI_clear();
  UI_info('Event: '+card.name);
  UI_showOK();    
}

function UI_askYildirim(front)
{
  UI_info('Expand Yildirim token to block advance?');  
  UI_enable('Yildirim_L');
}

function UI_updateFortifications()
{
  if (game.GazaBeershebaFortifications===0) {
    UI_info('Gaza-Beersheba Fortifications Destroyed');  
  } else {
    UI_info('Gaza-Beersheba Fortifications = '+game.GazaBeershebaFortifications);  
  }
}

function UI_pipelineComplete()
{
	console.log('UI_pipelineComplete');
  document.getElementById('waterS4').style.visibility = 'hidden';    
  document.getElementById('waterS5').style.visibility = 'hidden';
}


function UI_updateCounters()
{
  document.getElementById('nationalwill_slider').style.left = (-220 - 55*BoundedWill());

  document.getElementById('Victories'   ).innerHTML = game.Victories.length;    
  document.getElementById('Defeats'     ).innerHTML = game.Defeats.length;      
  document.getElementById('Stalemates'   ).innerHTML = game.Stalemates.length;    
  document.getElementById('Western'     ).innerHTML = game.Theatre.Western;    
  document.getElementById('Naval'       ).innerHTML = game.Theatre.Naval;      
  document.getElementById('Eastern'     ).innerHTML = game.Theatre.Eastern;    
  
  if (game.IntelligenceBureau===undefined) {
    document.getElementById('Bureau_L').style.visibility = 'hidden';
    document.getElementById('Bureau').style.visibility = 'hidden';
  } else {
    document.getElementById('Bureau_L').style.visibility = 'visible';
    document.getElementById('Bureau').style.visibility = 'visible';
    document.getElementById('Bureau').innerHTML = game.IntelligenceBureau.charAt(0);
  }
  
  document.getElementById('Yildirim_L').style.visibility = (game.Yildirim>0)?'visible':'hidden';
  document.getElementById('Yildirim').style.visibility = (game.Yildirim>0)?'visible':'hidden';
  document.getElementById('Yildirim').innerHTML = game.Yildirim; 
  
  document.getElementById('AsiaKorps').style.visibility = (game.AsiaKorps==1)?'visible':'hidden';
      
  if (game.StraitsClosed) {
    document.getElementById('Narrows').className = 'closed';
  }    
      
  switch (game.GazaBeershebaFortifications) {
    case 0:
      document.getElementById('Fortification').style.visibility = 'hidden';
//      document.getElementById('Fortification').innerHTML = '';
      break;
    case 1:
      document.getElementById('Fortification').style.visibility = 'visible';
      document.getElementById('Fortification').style.opacity = '0.6';
//      document.getElementById('Fortification').innerHTML = 'F';
      break;
    case 2:
      document.getElementById('Fortification').style.visibility = 'visible';
      document.getElementById('Fortification').style.opacity = '0.9';
//      document.getElementById('Fortification').innerHTML = 'F';
      break;
  }  
}

function UI_updateNarrows()
{  
  for (var defense in game.Narrows) {
    document.getElementById(defense).innerHTML = NarrowsDefenseValues[defense];
    if (game.Narrows[defense]===false) {
      document.getElementById(defense).className = 'defense';
      if (defense=='Seddulbahir') {
        document.getElementById(defense).innerHTML = 'X';
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

function UI_updateBattles()
{
  var str = '';
  str += '<BR>';
  str += 'Card Played / Remaining : '+game.Played.length+' / '+RemainingCards()+'<BR>';
  str += '<BR>';
  str += '<BR>';
  str += 'Victories : '+game.Victories.length+'<BR>';
  str += game.Victories+'<BR>';
  str += '<BR>';
  str += 'Defeats : '+game.Defeats.length+'<BR>';
  str += game.Defeats+'<BR>';
  str += '<BR>';
  str += 'Stalemates : '+game.Stalemates.length+'<BR>';
  str += game.Stalemates+'<BR>';
  str += '<BR>';
  str += 'Flags Controlled by Allies : '+(game.Victories.length - game.Defeats.length - game.TurkishNationalWill);
  
  document.getElementById('battlemap').innerHTML = str;
}

function UI_updateFront(front)
{  
  var pos = game.Front[front];
	var el = document.getElementById(front);
	
  el.innerHTML = game.Army[front];  
  if (pos!==undefined) {
    if (pos>0) {
      el.className = 'army '+front+''+pos;
    } else {
      el.className = 'army Constantinople';  
    }
  } else {
    el.className = 'army inactive '+front+'X';
  }
  UI_updateNationalWill();  
}

function UI_updateNationalWill()
{
  UI_updateCounters();
}

function UI_updateFortitude(fortitude)
{
//  document.getElementById('fortitude_slider').style.left = (-220 - 55*game.BritishFortitude);  
//  document.getElementById('fortitude_slider').style.left = (-220 - 55*fortitude);  
  document.getElementById('fortitude_slider').style.top = (-55*fortitude);  

}


// ------------------------------------------------------------------
// - Show/Hide User Actions 
// ------------------------------------------------------------------

function UI_showActions()
{  
  for (var army in game.Front) {
    if ( CanAttackFront(army) ) {
      UI_enable(army);  
    }
  }  

  for (var theatre in game.Theatre) {
    if ( CanAllocateTheatre(theatre) ) {
      UI_enable(theatre+'_L');  
    }
  }  
        
  if ( CanFortifyNarrows() ) {
    UI_enable('Narrows');  
    if (game.Narrows.Minefield_1===false) { 
      UI_enable('Minefield_1'); 
    }
    if (game.Narrows.Yildiz===false) { 
      UI_enable('Yildiz'); 
    }
    if (game.Narrows.Dardanos===false) { 
      UI_enable('Dardanos'); 
    }
    if (game.Narrows.Minefield_2===false) { 
      UI_enable('Minefield_2'); 
    }
    if (game.Narrows.Nagara===false) { 
      UI_enable('Nagara'); 
    }                        
  }  
  
  if ( CanDeployBureau() ) 
    UI_enable('Bureau_L');  
  
  if ( CanUseAsiaKorps )
    UI_enable('AsiaKorps');
  
  UI_showSkipActions();        
}

function UI_hideActions()
{    
  for (var army in game.Front) {
    UI_disable(army);    
  }  

  for (var theatre in game.Theatre) {
    UI_disable(theatre);    
    UI_disable(theatre+'_L');    
  }  
    
  for (var defense in game.Narrows) {
    UI_disable(defense);    
  }  
      
  UI_disable('Bureau_L');      
  UI_disable('AsiaKorps');
  
  UI_hideSkipActions();
  
  document.getElementById('Narrows').classList.remove('highlighted');      
}

function UI_disable(id) {
  document.getElementById(id).classList.remove('highlighted');
  document.getElementById(id).style.pointerEvents = 'none';
}

function UI_enable(id, f) {
  document.getElementById(id).classList.add('highlighted');
  document.getElementById(id).style.pointerEvents = 'auto';     
}

// ------------------------------------------------------------------
// - Secondary Maps and Displays 
// ------------------------------------------------------------------

var secondaries = ['narrowsmap', 'bureaumap', 'battlemap'];

function UI_openOverlay(map)
{
  document.getElementById('overlay').style.visibility = 'visible';
  document.getElementById('special').style.visibility = 'visible';  
  document.getElementById('closespecial').style.visibility = 'visible';  
	document.getElementById('closespecial').style.pointerEvents = 'auto';     
  for (var i in secondaries) {
	  var m = secondaries[i];
    document.getElementById(m).style.visibility = ((m==map)?'visible':'hidden');  
  }  
}

function UI_closeOverlay()
{
  document.getElementById('overlay').style.visibility='hidden';
  document.getElementById('special').style.visibility='hidden';  
  document.getElementById('fortitude').style.visibility = 'hidden';
  document.getElementById('closespecial').style.visibility = 'hidden';  
	document.getElementById('closespecial').style.pointerEvents = 'none';     
  for (var i in secondaries) {
	  var m = secondaries[i];
    document.getElementById(m).style.visibility = 'hidden';  
  }
}

// ------------------------------------------------------------------
// - UI Message API 
// ------------------------------------------------------------------

function UI_clear() {
  document.getElementById('info').innerHTML='';
}


function UI_info(str) {
  document.getElementById('info').innerHTML+=str;
  document.getElementById('info').innerHTML+='<BR>';  
  UI_log(str);
}

function UI_log(str)
{
	document.getElementById('myconsole').innerHTML+=str;
	document.getElementById('myconsole').innerHTML+='<BR>';
	console.log(str);
}

function debug(str)
{
	console.log(str);
}

// ------------------------------------------------------------------
// - UI initialization
// ------------------------------------------------------------------

// Add Event Handlers
function onTouch(divid, callback) {
// 	if ("ontouchstart" in document.documentElement) {
// 	  document.getElementById(divid).addEventListener('touchstart', callback);
// 	} else {
//  	  document.getElementById(divid).addEventListener('click', callback);
// 	}   

	if ("ontouchstart" in document.documentElement) {
	  document.getElementById(divid).ontouchstart = callback;
	} else {
 	  document.getElementById(divid).onclick = callback;
	}  
	document.getElementById(divid).style.pointerEvents = 'none';     
}

function initView() 
{  
  // disable default event handler  
  if ("ontouchstart" in document.documentElement) {
    document.addEventListener('touchmove',  function(e){ e.preventDefault(); }); 
    document.addEventListener('touchstart', function(e){ e.preventDefault(); });     
  }  
 
  UI_initDie();
         
  onTouch('ok',           function() { UI_clickedOk();              } );
  onTouch('closespecial', function() { UI_closeOverlay();           } );
  onTouch('bureau_tur',   function() { DeployBureau('Turkey');      } );
  onTouch('bureau_ind',   function() { DeployBureau('India');       } );
  onTouch('bureau_per',   function() { DeployBureau('Persia');      } );
  onTouch('bureau_afg',   function() { DeployBureau('Afghanistan'); } );
  
  onTouch('Sinai',        function() { TurkishOffensive('Sinai');       } );
  onTouch('Mesopotamia',  function() { TurkishOffensive('Mesopotamia'); } );
  onTouch('Caucasus',     function() { TurkishOffensive('Caucasus');    } );
  onTouch('Gallipoli',    function() { TurkishOffensive('Gallipoli');   } );
  onTouch('Salonika',     function() { TurkishOffensive('Salonika');    } );
  onTouch('Arab',         function() { TurkishOffensive('Arab');        } );
                          
  onTouch('Western_L',    function() { AllocateResourcesToTheatre('Western'); } );  
  onTouch('Eastern_L',    function() { AllocateResourcesToTheatre('Eastern'); } );  
  onTouch('Naval_L',      function() { AllocateResourcesToTheatre('Naval');   } );  
                          
  onTouch('Western',      function() { GermanStaffOperationFrom('Western');   } );  
  onTouch('Eastern',      function() { GermanStaffOperationFrom('Eastern');   } );  
  onTouch('Naval',        function() { GermanStaffOperationFrom('Naval');     } );  
    
  onTouch('Yildirim_L',   function() { UseYildirim(front); }  );    
  onTouch('AsiaKorps',    function() { UseAsiaKorps(); }  );
                          
  onTouch('Bureau_L',     function() {                     UI_openOverlay('bureaumap');  } );  
  onTouch('Narrows',      function() { UI_updateNarrows(); UI_openOverlay('narrowsmap'); } );          
  onTouch('score',        function() { UI_updateBattles(); UI_openOverlay('battlemap');  } );          
	document.getElementById('Narrows').style.pointerEvents = 'auto';     
	document.getElementById('score').style.pointerEvents = 'auto';     
                          
  onTouch('Minefield_1',  function() { FortifyNarrows('Minefield_1'); } );
  onTouch('Yildiz',       function() { FortifyNarrows('Yildiz');      } );
  onTouch('Dardanos',     function() { FortifyNarrows('Dardanos');    } );
  onTouch('Minefield_2',  function() { FortifyNarrows('Minefield_2'); } );
  onTouch('Nagara',       function() { FortifyNarrows('Nagara');      } );

  onTouch('info',         function() { UI_clickedOk(); } ); 
  onTouch('skip',         function() { SkipActions(); } ); 
}

function UI_startNewGame()
{
  UI_clear();    
  UI_hideActions();
 	UI_hideCard();
  UI_updateFront('Sinai');
  UI_updateFront('Mesopotamia');
  UI_updateFront('Caucasus');
  UI_updateFront('Arab');
  UI_updateFront('Gallipoli');
  UI_updateFront('Salonika');
  UI_updateNarrows();
  UI_updateCounters();
  UI_updateFortitude(4);  
  OSnext();  
}


