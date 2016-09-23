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
	UI_show(id);
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
  UI_show(id);
	UI_enableClick(id)
}

function UI_hide(id)
{
	document.getElementById(id).classList.toggle('hidden', true);	
}

function UI_show(id)
{
	document.getElementById(id).classList.toggle('hidden', false);	
}

// ------------------------------------------------------------------
// - UI Functions 
// ------------------------------------------------------------------

function UI_showActions()
{
  if ( canAttack() )       UI_focus('attack');  
	if ( canMoveShipUp() )   UI_focus('moveup');  
	if ( canMoveShipDown() ) UI_focus('movedown');	
	
	document.getElementById('number5').innerHTML = 'Skip Action';
	document.getElementById('number5').className = 'number text';
	UI_enableClick('number5');
	
}

function UI_hideActions()
{
	UI_defocus('attack');  
	UI_hide('moveup');  
	UI_hide('movedown');	
  UI_hide('number5');
  UI_defocus('number5');
}


function UI_showDiplomatTargets()
{
	var pirates = getPirateSequence();
	
	while (pirates.length>0) {
		UI_focus('pirate'+pirates.shift().id);
	}
}

function UI_showAbleCrewTargets()
{	
	document.getElementById('number2').innerHTML = '+1';
	document.getElementById('number2').className = 'number movement';
	UI_enableClick('number2');

	document.getElementById('number3').innerHTML = '+1';
	document.getElementById('number3').className = 'number attack';
	UI_enableClick('number3');

	document.getElementById('number4').innerHTML = '+1';
	document.getElementById('number4').className = 'number defense';
	UI_enableClick('number4');
}



function UI_showRepairTargets()
{
	if (game.ship[0]>0) { UI_focus('section0'); }
	if (game.ship[1]>0) { UI_focus('section1'); }
	if (game.ship[2]>0) { UI_focus('section2'); }
	if (game.ship[3]>0) { UI_focus('section3'); }
	if (game.ship[4]>0) { UI_focus('section4'); }
	if (game.ship[5]>0) { UI_focus('section5'); }	
}

function UI_updateShip()
{
	var pos2row = [1,2,3,4,5,6,6,5,4,3,2,1];
	var pos2col = [5,5,5,5,5,5,3,3,3,3,3,3];
	var str, stats;
		
	for (var s=0; s<6; s++) {
		stats = getSectionById(s);		
// 		str  = 'Hits: '+game.ship[s]+'<BR>';
// 		if (stats.attack)   str += 'A/D: '+stats.attack+'/'+stats.defense+'<BR>';
// 		if (stats.repair)   str += 'R/D: '+stats.repair+'/'+stats.defense+'<BR>';
// 		if (stats.movement) str += 'M/D: '+stats.movement+'/'+stats.defense+'<BR>';
// 		str += 'L/R: '+	stats.left+'/'+stats.right;
// 		console.log(str);		
		var value1 = ((stats.attack)?stats.attack:((stats.repair)?stats.repair:((stats.movement)?stats.movement:'?'))); 
		var value2 = stats.defense;
		var value3 = game.ship[s];
		
		document.getElementById('section'+s).className = 'shipsection c row'+(s+1);//+' defense'+stats.defense;
				
// 		document.getElementById('section'+s+'value1').setAttribute('value', value1);
// 		document.getElementById('section'+s+'value2').setAttribute('value', value2);
// 		document.getElementById('section'+s+'value3').setAttribute('value', value3);

		document.getElementById('section'+s+'value1').innerHTML = value1;
		document.getElementById('section'+s+'value2').innerHTML = value2;
		document.getElementById('section'+s+'value3').innerHTML = value3;
				
		document.getElementById('section'+s+'gunleft').className  = 'gun left  gun'+stats.left;
		document.getElementById('section'+s+'gunright').className = 'gun right gun'+stats.right;
	
	}	
}

function UI_updatePirates()
{
	var pos2row = [1,2,3,4,5,6,6,5,4,3,2,1];

	var maxStackL = 0;
	var maxStackR = 0;
	for (var p in game.pirates) {
		if (p<6) {
			maxStackR = Math.max(maxStackR, game.pirates[p].length);
		} else {
			maxStackL = Math.max(maxStackL, game.pirates[p].length);
		}
	}
	
	if (maxStackR>3) {
		document.getElementById('sky').className = 'stackr'+maxStackR;		
	} else if (maxStackL>3) {
		document.getElementById('sky').className = 'stackl'+maxStackL;		
	} else {
		document.getElementById('sky').className = 'normal';		
	}

	for (var pos in game.pirates) {
		for (var p in game.pirates[pos]) {
			var pirate = game.pirates[pos][p];
			var row = 'row'+pos2row[pos];
			var col = ((pos<6)?'r':'l')+p;
			var orientation = (pos<6)?'pright':'pleft';	
			document.getElementById('pirate'+pirate.id).className = 'pirate'+' '+row+' '+col+' ';
			document.getElementById('pirate'+pirate.id+'txt').innerHTML = '('+pirate.id+') '+pirate.attack+'/'+pirate.hitpoints;		
			document.getElementById('pirate'+pirate.id+'img').className = 'pirate'+' pirate'+pirate.type+' '+orientation;	
		}
	}	
	
	for (var p in game.destroyed) {
		var pirate = game.destroyed[p];
		document.getElementById('pirate'+pirate.id).className = 'pirate'+' hidden';		
		document.getElementById('pirate'+pirate.id+'txt').innerHTML = '('+pirate.id+') '+pirate.attack+'/'+pirate.hitpoints;
		document.getElementById('pirate'+pirate.id+'img').className = 'pirate'+' pirate'+pirate.type+' '+orientation;	
	}
}

function UI_showAttackTargets(sectionId, side, targets)
{
	for (var t in targets) {
		UI_focus('pirate'+targets[t]);
	}	
	UI_focus('section'+sectionId+'gun'+side); 
	UI_disableClick('section'+sectionId+'gun'+side); 
}

function UI_hideRolls()
{
	UI_hide('bonus1');
	UI_hide('bonus2');
	UI_hide('number1');
	UI_hide('number2');
	UI_hide('number3');
	UI_hide('number4');
	UI_hide('number5');	
}


	
// ------------------------------------------------------------------
// - UI Message API 
// ------------------------------------------------------------------

function UI_clear() {
  document.getElementById('info').innerHTML='';
}


function UI_info(str) {
// 	if (document.getElementById('info').innerHTML!='') {
// 	  document.getElementById('info').innerHTML+='<BR>';  
// 	} 
//   document.getElementById('info').innerHTML+=str;
  document.getElementById('info').innerHTML=str;
  console.log(str);
}

function UI_log(str)
{
}

function debug(str)
{
	console.log(str);
}

// ------------------------------------------------------------------
// - UI initialization
// ------------------------------------------------------------------

function UI_init() 
{  
  // disable default event handler  
  if ('ontouchstart' in document.documentElement) {
		document.addEventListener('touchmove',  function(e){ e.preventDefault(); }); 
		document.addEventListener('touchstart', function(e){ e.preventDefault(); }); 	  
	}	
             
  UI_setClickCallback('pirate0',  function() { clickedPirate(0); } );
  UI_setClickCallback('pirate1',  function() { clickedPirate(1); } );
  UI_setClickCallback('pirate2',  function() { clickedPirate(2); } );
  UI_setClickCallback('pirate3',  function() { clickedPirate(3); } );
  UI_setClickCallback('pirate4',  function() { clickedPirate(4); } );
  UI_setClickCallback('pirate5',  function() { clickedPirate(5); } );

  UI_setClickCallback('section0', function() { clickedSection(0); } );
  UI_setClickCallback('section1', function() { clickedSection(1); } );
  UI_setClickCallback('section2', function() { clickedSection(2); } );
  UI_setClickCallback('section3', function() { clickedSection(3); } );
  UI_setClickCallback('section4', function() { clickedSection(4); } );
  UI_setClickCallback('section5', function() { clickedSection(5); } );
          	
  UI_setClickCallback('attack',   function() { clickedAction(ACTION_ATTACK   ); } );    	
  UI_setClickCallback('moveup',   function() { clickedAction(ACTION_MOVE_UP  ); } );   	
  UI_setClickCallback('movedown', function() { clickedAction(ACTION_MOVE_DOWN); } );      
  UI_setClickCallback('number5',  function() { clickedAction(ACTION_SKIP     ); } );  
	    
  UI_setClickCallback('number2',  function() { clickedNumber(BONUS_MOVEMENT  ); } );
  UI_setClickCallback('number3',  function() { clickedNumber(BONUS_ATTACK    ); } );  
  UI_setClickCallback('number4',  function() { clickedNumber(BONUS_DEFENSE   ); } );  
  
  UI_initShipSection(0, 'attack');
  UI_initShipSection(1, 'attack');
  UI_initShipSection(2, 'repair');
  UI_initShipSection(3, 'attack');
  UI_initShipSection(4, 'attack');
  UI_initShipSection(5, 'movement');
}

function UI_createDiv(container, id, className )
{
  var el = document.createElement("div"); 
  el.id=id;
  document.getElementById(container).appendChild(el);
  el.className=(className)?className:'';
  return el;
}


function UI_initShipSection(id, leftcounter)
{  
  UI_createDiv('section'+id, 'section'+id+'gunleft'  , 'gun left'); 
  UI_createDiv('section'+id, 'section'+id+'gunright' , 'gun right'); 
  UI_createDiv('section'+id, 'section'+id+'value1'   , 'counter left '+leftcounter); 
  UI_createDiv('section'+id, 'section'+id+'value2'   , 'counter right defense'); 
  UI_createDiv('section'+id, 'section'+id+'value3'   , 'counter center hits'); 
}



