
var cards = new Array(50);

cards[0] = { name: 'Ottoman Turkey Enters the War', 
						 event: EnterWar, 
						 advance: [], 
						 actions:0 };


cards[12] = { name: 'Garlice Tarnow', 
							event: GarliceTarnow, 
							advance: ['Caucasus', 'Sinai'], 
							actions:3 };
							
cards[14] = { name: 'German U-boats',
							event: GermanUboats,
							advance: ['Caucasus', 'Sinai'], 
							actions:2 };
							
cards[36] = { name: 'Sandstorm',
							event: Sandstorm,
							advance: ['Arab'], 
							actions:3,
							special: 'No offensives vs retreated front this turn' };

							
function EnterWar()
{
	// Sinai: Murray (BV3)
	// Mesopotamia: Townsend (BV3)
	// Caucasus: Dashkov Imperial (BV2)	
}							

function GarliceTarnow()
{
	console.log('GarliceTarnow');
	
	// Conduct Eastern Front Battle, GarliceTarnow / 2
	FightBattle('Garlice Tarnow', 'Eastern', 2);
}

function GermanUboats()
{
	console.log('GermanUboats');
	
	// Place U-boat marker in the Narrows
	
	game.StraitsClosed = true;
	UI_updateCounters();
	
		document.getElementById('yes').style.visibility='hidden';	
		document.getElementById('no').style.visibility='hidden';	
		document.getElementById('ok').style.visibility='visible';	
		document.getElementById('d6').style.visibility='hidden';			
	
	
	// +1 vs Gallipoli
	// +1 vs Salonika
}

function Sandstorm()
{
	console.log('GermanUboats');
	
	// Roll a die
	// On 1,2 or 3 the Mesopotamia unit retreats on space	
	// On 4,5 or 6 the Sinai unit retreats on space	
	
	// No offensives vs retreated front this turn
	
		document.getElementById('yes').style.visibility='hidden';	
		document.getElementById('no').style.visibility='hidden';	
		document.getElementById('ok').style.visibility='visible';	
		document.getElementById('d6').style.visibility='hidden';			
	
}