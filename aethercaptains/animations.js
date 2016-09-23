
function UI_updateCrew(first)
{
	if (first==true) 
	{
		UI_info('Crew Member on Arrives on Deck');
		document.getElementById('crew').className = 'crew'+game.crew;
		document.getElementById('crew').classList.toggle('visible', true);
		document.getElementById('crew').classList.toggle('removed', false);
		setTimeout(function () {
			Next();
		}, 2000);
		
	} else 
	{
		UI_info('');
		document.getElementById('crew').classList.toggle('visible', false);
		document.getElementById('crew').classList.toggle('removed', true);
		setTimeout(function () {
			UI_info('New Crew Member on Deck');
			document.getElementById('crew').className = 'crew'+game.crew;
			document.getElementById('crew').classList.toggle('visible', true);
			document.getElementById('crew').classList.toggle('removed', false);
		}, 1000);
		setTimeout(function () {
			Next();
		}, 3000);
	}
}

function UI_moveShip(direction)
{	
	// First, move ship up or down
	if (direction=='Up') {
		document.getElementById('ship').className = 'c row0';	
	} else {
		document.getElementById('ship').className = 'c row2';	
	}		
		
	// One ship has moved up, slide everything back down to recenter the display
	setTimeout(function () {
		UI_updatePirates();
		UI_updateShip();
	}, 1200);
}

function UI_showMovementAction(sectionId, direction, success)
{	
	if (success===true) {
		setTimeout(function() { 
			UI_info('Ship Moves '+direction);
		}, 200 );
		setTimeout(function() { 
			// First, move ship up or down
			if (direction=='Up') {
				document.getElementById('ship').className = 'c row0';	
			} else {
				document.getElementById('ship').className = 'c row2';	
			}		
		}, 210 );
		setTimeout(function () {
			// One ship has moved up, slide everything back down to recenter the display
			UI_updatePirates();
			UI_updateShip();
		}, 1300);
		setTimeout(function() {
			Next();
		}, 2500); 
	} else {
		setTimeout(function() { 
			UI_info('Engines Failed');
			UI_playAnimation('section'+sectionId, 'failed');
		}, 200 );					
		setTimeout(function() {
			Next();
		}, 1200); 
	}
}



function UI_showPirateAttack(sectionId, side, pirate, damage)
{	
	UI_focus('pirate'+(pirate.id));
	UI_disableClick('pirate'+(pirate.id));
	
	document.getElementById('section'+sectionId).classList.add('attacked'+side);
	
	setTimeout(function() { 
		document.getElementById('section'+sectionId).classList.remove('attacked'+side);
		if (damage>0) {
			UI_playAnimation('section'+sectionId, 'damaged');
		} else {
			UI_playAnimation('section'+sectionId, 'defended'+side);
		}	
	}, 500 );	
	setTimeout(function() { 
		UI_updateShip();	
	}, 1000 );	
	setTimeout(function() { 
		UI_defocus('section'+getSectionId(pirate));
		UI_defocus('pirate'+pirate.id);
		Next();		
	}, 1500 );
}

function UI_showAttackAction(sectionId, side, pirate, damage)
{	
	UI_focus('section'+sectionId+'gun'+side); 
	UI_disableClick('section'+sectionId+'gun'+side); 
	UI_focus('pirate'+pirate.id);
	UI_disableClick('pirate'+pirate.id);
	
	setTimeout(function() { 
		if (damage>0) {
			document.getElementById('pirate'+(pirate.id)).setAttribute('value', -damage);
			UI_playAnimation('pirate'+(pirate.id), 'hit');
		} else {
			UI_playAnimation('pirate'+(pirate.id), 'miss');
		}
	}, 200 );	
	setTimeout(function() { 
		UI_updateShip();
		UI_updatePirates();	
		UI_defocus('section'+sectionId+'gun'+side); 
		UI_defocus('pirate'+pirate.id);
		Next();		
	}, 1200 );

}

function UI_showRepairAction(sectionId, success)
{
	setTimeout(function() { 
		if (success==true) {
			UI_info('Repair Succeeded');
			UI_playAnimation('section'+sectionId, 'repaired');
			UI_updateShip();	
		} else {
			UI_info('Repair Failed');
			UI_playAnimation('section'+sectionId, 'failed');
		}		
	}, 200 );
		
	setTimeout(function() { 
		Next();
	}, 1500);
}

