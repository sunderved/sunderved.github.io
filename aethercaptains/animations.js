

function UI_moveShip(direction)
{
	var offset = (direction=='Up')?0:2;
	
	// First, move ship up
	for (var i=0; i<6; i++) {
		document.getElementById('section'+i).className = 'shipsection c row'+(i+offset);			
	}
		
	// One ship has moved up, slide everything back down to recenter the display
	setTimeout(function () {
		UI_updatePirates();
		UI_updateShip();
	}, 1200);			                                                                     
}

function UI_updateCrew()
{
	UI_hide('crew');
	setTimeout(function () {
		UI_show('crew');
		document.getElementById('crew').className = 'crew crew'+game.crew;
	}, 500);			                                                                     
	setTimeout(function () {
		Next();
	}, 1500);
}

function UI_showDiceRoll(d12, div)
{
	var el    = document.getElementById(div);
	var faces = shuffle([1,2,3,4,5,6,7,8,9,10,11,12]);	
	var delay = 0;
	
	UI_show(div);
	el.className = 'number dice';
	setTimeout(function() {el.innerHTML=faces[0]; }, delay); delay += 80;
	setTimeout(function() {el.innerHTML=faces[1]; }, delay); delay += 80;
	setTimeout(function() {el.innerHTML=faces[2]; }, delay); delay += 80;
	setTimeout(function() {el.innerHTML=faces[3]; }, delay); delay += 80;
	setTimeout(function() {el.innerHTML=faces[4]; }, delay); delay += 80;
	setTimeout(function() {el.innerHTML=faces[5]; }, delay); delay += 80;
	setTimeout(function() {el.innerHTML=     d12; }, delay); delay += 80;
}

function UI_showMovementRolls(roll, direction)
{
	UI_hideRolls();
	
	setTimeout(function() { 
		document.getElementById('number1').innerHTML = getSectionById(5).movement;
		document.getElementById('number1').className = 'number movement';
		UI_show('number1');
	}, 500 );
	
	setTimeout(function() { 
		UI_showDiceRoll(roll, 'number2'); 
		if (game.bonus.movement>0) {
			document.getElementById('bonus1').innerHTML = '+'+game.bonus.movement;
			document.getElementById('bonus1').className = 'bonus movement';
			UI_show('bonus1');
		} 
	}, 1000 );

	setTimeout(function() { 		
		document.getElementById('number3').innerHTML = (direction)?'Ship Moves '+direction+'!':'Ship Fails To Move';
		document.getElementById('number3').className = 'number text';
		UI_show('number3');
	}, 2000 );		
	
	if (direction) {
		setTimeout(function() { 
			UI_moveShip(direction);
		}, 2500 );
		setTimeout(Next, 5000); 
	} else {
		setTimeout(Next, 2500); 
	}
}



function UI_showPirateRolls(pirate, sectionId, defense, roll1, roll2, hit)
{	
	UI_hideRolls();
// 	UI_focus('section'+(sectionId+1));
// 	UI_disableClick('section'+(sectionId+1));
	UI_focus('pirate'+(pirate.id));
	UI_disableClick('pirate'+(pirate.id));
	
// 	setTimeout(function() { 
// 		document.getElementById('number1').innerHTML = pirate.attack;
// 		document.getElementById('number1').className = 'number attack';
// 		UI_show('number1');
// 	}, 500 );
// 	setTimeout(function() { 
// 		UI_showDiceRoll(roll1, 'number2'); 
// 	}, 1000 );
// 	if (roll2!=undefined) {
// 		setTimeout(function() { 
// 			document.getElementById('number3').innerHTML = defense;
// 			document.getElementById('number3').className = 'number defense';
// 			UI_show('number3');		
// 		}, 2000 );
// 		setTimeout(function() { 
// 			if (game.bonus.defense>0) {
// 				document.getElementById('bonus2').innerHTML = '+'+game.bonus.defense;
// 				document.getElementById('bonus2').className = 'bonus defense';
// 				UI_show('bonus2');
// 			} 
// 			UI_showDiceRoll(roll2, 'number4'); 
// 		}, 2500 );
// 		setTimeout(function() { 
// 			document.getElementById('number5').innerHTML = (hit==true)?'1 Damage':'No Damage';
// 			document.getElementById('number5').className = 'number text';
// 			UI_show('number5');
// 		}, 3500 );	
// 		setTimeout(function() { 
// 			UI_updateShip();
// 			UI_defocus('section'+getSectionId(pirate));
// 			UI_defocus('pirate'+pirate.id);
// 			UI_hideRolls();	
// 			Next();		
// 		}, 4500 );
// 	} else {
// 		setTimeout(function() { 
// 			document.getElementById('number3').innerHTML = 'Attack Failed';
// 			document.getElementById('number3').className = 'number text';
// 			UI_show('number3');
// 		}, 2000 );
// 		setTimeout(function() { 
// 			UI_updateShip();	
// 			UI_defocus('section'+getSectionId(pirate));
// 			UI_defocus('pirate'+pirate.id);
// 			UI_hideRolls();	
// 			Next();		
// 		}, 3000 );
// 	}	

	var side = (pirate.position<6)?'right':'left';

	document.getElementById('section'+sectionId).classList.add('attacked'+side);
	
	setTimeout(function() { 
		document.getElementById('number5').innerHTML = (hit==true)?'1 Damage':'No Damage';
		document.getElementById('number5').className = 'number text';
		document.getElementById('section'+sectionId).classList.remove('attacked'+side);
		UI_show('number5');		
		if (hit==true) {
			document.getElementById('section'+sectionId).classList.add('damaged');
		} else {
			document.getElementById('section'+sectionId).classList.add('defended'+side);
		}
	}, 500 );	
	setTimeout(function() { 
		UI_updateShip();	
	}, 1000 );	
	setTimeout(function() { 
		if (hit==true) {
			document.getElementById('section'+sectionId).classList.remove('damaged');
		} else {
			document.getElementById('section'+sectionId).classList.remove('defended'+side);
		}
		UI_defocus('section'+getSectionId(pirate));
		UI_defocus('pirate'+pirate.id);
		UI_hideRolls();	
		Next();		
	}, 1500 );
}


function UI_showAttackRolls(sectionId, side, pirate, roll1, roll2, damage)
{	
	UI_hideRolls();
	UI_focus('section'+sectionId+'gun'+side); 
	UI_disableClick('section'+sectionId+'gun'+side); 
	UI_focus('pirate'+pirate.id);
	UI_disableClick('pirate'+pirate.id);
	
// 	setTimeout(function() { 
// 		document.getElementById('number1').innerHTML = getSectionById(sectionId).attack;
// 		document.getElementById('number1').className = 'number attack';
// 		UI_show('number1');
// 	}, 500 );
// 	setTimeout(function() { 
// 		UI_showDiceRoll(roll1, 'number2'); 
// 		if (game.bonus.attack>0) {
// 			document.getElementById('bonus1').innerHTML = '+'+game.bonus.attack;
// 			document.getElementById('bonus1').className = 'bonus attack';
// 			UI_show('bonus1');
// 		} 
// 	}, 1000 );
// 	if (roll2!=undefined) {
// 		setTimeout(function() { 
// 			UI_showDiceRoll(roll2, 'number3'); 
// 		}, 2000 );
// 		setTimeout(function() { 
// 			document.getElementById('number4').innerHTML = damage+' Damage';
// 			document.getElementById('number4').className = 'number text';
// 			UI_show('number4');
// 			UI_updatePirates();	
// 		}, 3000 );
// 		setTimeout(function() { 
// 			UI_defocus('section'+sectionId);
// 			UI_defocus('pirate'+(pirate.id));			
// 			Next();
// 		}, 4000);
// 	} else {
// 		setTimeout(function() { 
// 			document.getElementById('number3').innerHTML = 'Attack Failed';
// 			document.getElementById('number3').className = 'number text';
// 			UI_show('number3');
// 		}, 2000 );
// 		setTimeout(function() { 
// 			UI_defocus('section'+sectionId);
// 			UI_defocus('pirate'+(pirate.id));			
// 			Next();
// 		}, 3000);
// 	}

	setTimeout(function() { 
		document.getElementById('number5').innerHTML = (roll2==undefined)?'Attack Failed':(damage+' Damage');
		document.getElementById('number5').className = 'number text';
		UI_show('number5');
		document.getElementById('pirate'+(pirate.id)+'dmg').innerHTML = (roll2==undefined)?'-':(-damage);
		document.getElementById('pirate'+(pirate.id)+'dmg').classList.add('show');
	}, 200 );	
	setTimeout(function() { 
		document.getElementById('pirate'+(pirate.id)+'dmg').classList.remove('show');
		UI_updateShip();
		UI_updatePirates();	
		UI_defocus('section'+sectionId+'gun'+side); 
		UI_defocus('pirate'+pirate.id);
		//UI_hideRolls();	
		Next();		
	}, 1200 );

}

function UI_showRepairRolls(threshold, roll1, success)
{
	UI_hideRolls();

// 	setTimeout(function() { 
// 		document.getElementById('number1').innerHTML = threshold;
// 		document.getElementById('number1').className = 'number repair';
// 		UI_show('number1');
// 		
// 		document.getElementById('number2').innerHTML = threshold;
// 		document.getElementById('number2').className = 'number dice';
// 		UI_show('number2');
// 		
// 		document.getElementById('number3').innerHTML = (success)?'Repair Succeeded':'Repair Failed';
// 		document.getElementById('number3').className = 'number text';
// 		UI_show('number3');
// 		UI_updateShip();	
// 	}, 500 );
// 		
// 	setTimeout(function() { 
// 		UI_hideRolls();
// 		Next();
// 	}, 1500);
				
	setTimeout(function() { 
		document.getElementById('number1').innerHTML = threshold;
		document.getElementById('number1').className = 'number repair';
		UI_show('number1');
	}, 500);
	
	setTimeout(function() { 
		UI_showDiceRoll(roll1, 'number2'); 
	}, 1000 );
	
	setTimeout(function() { 		
		document.getElementById('number3').innerHTML = (success)?'Repair Succeeded':'Repair Failed';
		document.getElementById('number3').className = 'number text';
		UI_show('number3');
		UI_updateShip();	
	}, 2000 );
	
	setTimeout(function() { 
		UI_hideRolls();
		Next();
	}, 3000);
}

function UI_showEngineerRepair()
{
	UI_updateShip();				
	setTimeout(Next, 1000);
}



