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
	document.getElementById(id).classList.toggle('hidden',  true);	
}

function UI_show(id)
{
	document.getElementById(id).classList.toggle('hidden', false);	
}

function UI_playAnimation(div, animation)
{
	document.getElementById(div).classList.add(animation);
	document.getElementById(div).addEventListener('animationend', function() { 
		document.getElementById(div).classList.remove(animation); 
	} , false);
}

// ------------------------------------------------------------------
// - UI Functions 
// ------------------------------------------------------------------

function UI_showActions()
{
  if ( canAttack() )          UI_focus('ship');  
	if ( canAttack() == false ) UI_show('skip');
	if ( canMoveShipUp() )      UI_show('moveup');  
	if ( canMoveShipDown() )    UI_show('movedown');		
}

function UI_hideActions()
{
	UI_defocus('ship');  
	UI_hide('moveup');  
	UI_hide('movedown');	
  UI_hide('skip');
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


function UI_showDiplomatTargets()
{
	var pirates = getPirateSequence();
	
	while (pirates.length>0) {
		UI_focus('pirate'+pirates.shift().id);
	}
}

function UI_showAbleCrewTargets()
{	
	UI_show('ablecrewoptions');
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
		
	document.getElementById('ship').className = 'c row1';
	
	for (var s=0; s<6; s++) {
		stats = getSectionById(s);		
		
		var value1 = ((stats.attack)?stats.attack:((stats.repair)?stats.repair:((stats.movement)?stats.movement:'?'))); 
		var value2 = stats.defense;
		var value3 = game.ship[s];
				
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

function cancelBubbling(event)
{
	event.stopPropagation ? event.stopPropagation() : (event.cancelBubble=true);
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
             
  UI_setClickCallback('pirate0',  function() { cancelBubbling(event); clickedPirate(0); } );
  UI_setClickCallback('pirate1',  function() { cancelBubbling(event); clickedPirate(1); } );
  UI_setClickCallback('pirate2',  function() { cancelBubbling(event); clickedPirate(2); } );
  UI_setClickCallback('pirate3',  function() { cancelBubbling(event); clickedPirate(3); } );
  UI_setClickCallback('pirate4',  function() { cancelBubbling(event); clickedPirate(4); } );
  UI_setClickCallback('pirate5',  function() { cancelBubbling(event); clickedPirate(5); } );

  UI_setClickCallback('section0', function() { cancelBubbling(event); clickedSection(0); } );
  UI_setClickCallback('section1', function() { cancelBubbling(event); clickedSection(1); } );
  UI_setClickCallback('section2', function() { cancelBubbling(event); clickedSection(2); } );
  UI_setClickCallback('section3', function() { cancelBubbling(event); clickedSection(3); } );
  UI_setClickCallback('section4', function() { cancelBubbling(event); clickedSection(4); } );
  UI_setClickCallback('section5', function() { cancelBubbling(event); clickedSection(5); } );
          	
  UI_setClickCallback('ship',     function() { cancelBubbling(event); clickedAction(ACTION_ATTACK   ); } );    	
  UI_setClickCallback('moveup',   function() { cancelBubbling(event); clickedAction(ACTION_MOVE_UP  ); } );   UI_enableClick('moveup');   	
  UI_setClickCallback('movedown', function() { cancelBubbling(event); clickedAction(ACTION_MOVE_DOWN); } );   UI_enableClick('movedown');     
  UI_setClickCallback('skip',     function() { cancelBubbling(event); clickedAction(ACTION_SKIP     ); } );   UI_enableClick('skip'); 
	    
  UI_setClickCallback('bonus1',   function() { cancelBubbling(event); clickedBonus(BONUS_MOVEMENT  ); } );    UI_enableClick('bonus1');  
  UI_setClickCallback('bonus2',   function() { cancelBubbling(event); clickedBonus(BONUS_ATTACK    ); } );    UI_enableClick('bonus2');
  UI_setClickCallback('bonus3',   function() { cancelBubbling(event); clickedBonus(BONUS_DEFENSE   ); } );    UI_enableClick('bonus3');    
  
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



