
function gameReset()
{
}

function gameStart()
{
	initDeck();  	
	initHand();  
	initPiles();
	
  drawCards();	
}

var handsize = 8;
var handslots;
var hand  = [];
var deck  = [];
var piles = [];

//var card = {val:0, u1playable:false, u2playable:false, d1playable:false, d2playable:false};


function initDeck()
{
	deck = [];
  for (var i=2; i<100; i++) {
	  deck.push(i);
  }
  shuffle(deck);
}

function initHand()
{
	hand = [];
  for (var i=0; i<handsize; i++) {
	  hand.push(0);
  }
  handslots = handsize;
}

function initPiles()
{
	piles = {u1:1, u2:1, d1:100, d2:100};
	valid = {u1:false, u2:false, d1:false, d2:false};
}


function drawCards()
{
	for (var i=0; i<handsize; i++) {
		if (hand[i]==0) {
			if (deck.length>0) {
				hand[i]=deck.pop();
			  handslots--;
				var el = ui_create_card(hand[i]);
				el.style.transform = 'rotate('+randomIntFromInterval(-10,10)+'deg)';    
			  document.getElementById('c'+i).appendChild( el );
		  } else {
			  console.log('Draw pile empty');
		  }
		} else {
		}
	}
  console.log('card left: '+deck.length);
}

function moveCard(hand_pos, card_val, pile_num)
{		   
  if (hand[hand_pos] != card_val) console.log("Error");
  
	hand[hand_pos] = 0;
	handslots++;
	
	piles[pile_num] = card_val;
								
	if (handslots==2) drawCards();
	
	playableHand();	
}

function validPile(card_val, pile_num)
{	
	console.log(pile_num+' '+piles[pile_num]);
	
// 	// normal rule
//  	u1valid |= (card_val>u1[0]);
//  	u2valid |= (card_val>u2[0]);
//  	d1valid |= (card_val<d1[0]);
//  	d2valid |= (card_val<d2[0]);
// 	
// 	// backwards rule (+10/-10)
// 	u1valid |= (card_val==(u1[0]-10));
// 	u2valid |= (card_val==(u2[0]-10));
// 	d1valid |= (card_val==(d1[0]+10));
// 	d2valid |= (card_val==(d2[0]+10));			
	
	var v = false;
	switch pile_num {
		case 'u1':
		case 'u2':
			v = ((card_val>piles[pile_num]) | (card_val==(piles[pile_num]-10)));
			break;
		case 'd1':
		case 'd2':
			v = ((card_val<piles[pile_num]) | (card_val==(piles[pile_num]+10)));
			break;
	}	
	return v;
}

function playableCard(card_val)
{
	return ( validPile(card_val, 'u1') | validPile(card_val, 'u2') | validPile(card_val, 'd1') | validPile(card_val, 'd2') );
}

function playableHand()
{
	for (var i=0; i<handsize; i++) {
		if (hand[i]>0) {
			console.log('card '+hand[i]+' is playable ->'+playableCard(hand[i]));
		}
	}
}


// -- UI Related ----

function ui_enable_drop_target(id)
{
	document.getElementById(id).classList.add('dropzone');	
	document.getElementById(id).classList.add('valid-drop-target');	
}

function ui_disable_drop_target(id)
{
	document.getElementById(id).classList.remove('dropzone');	
	document.getElementById(id).classList.remove('valid-drop-target');	
}

function ui_on_drag_start(dragElement)
{	
	var card = dragElement.getAttribute('data-val');
	
	if (validPile(card, 'u1')) ui_enable_drop_target('u1');
	if (validPile(card, 'u2')) ui_enable_drop_target('u2');
	if (validPile(card, 'd1')) ui_enable_drop_target('d1');
	if (validPile(card, 'd2')) ui_enable_drop_target('d2');
}

function ui_on_drag_end(dragElement)
{
	ui_disable_drop_target('u1');
	ui_disable_drop_target('u2');
	ui_disable_drop_target('d1');
	ui_disable_drop_target('d2');
}

function ui_on_drop(dragElement, dropElement) 
{	
	var hand_pos = parseInt(dragElement.parentElement.getAttribute('data-val'));
	var card_val = parseInt(dragElement.getAttribute('data-val'));
	var pile_num = dropElement.id; //getAttribute('data-val');    
  moveCard(hand_pos, card_val, pile_num);         
}


function ui_create_card(id) 
{
  var el;
    
  el = document.createElement("div");
  el.id='card'+id;
  el.classList.add("size");
  el.classList.add("card");
  el.classList.add('draggable');
  el.setAttribute('data-val', id);   // value of card 

  el.innerHTML = id;
      
  return el;
}   


function init() 
{  
  // Center the container div
  centerContainer();
             
  gameReset(); 

  document.getElementById('b1').innerHTML = '&#8607';
  document.getElementById('b2').innerHTML = '&#8607';
  document.getElementById('b3').innerHTML = '&#8609';
  document.getElementById('b4').innerHTML = '&#8609';
  
  document.getElementById('c0').setAttribute('data-val', 0); 
  document.getElementById('c1').setAttribute('data-val', 1); 
  document.getElementById('c2').setAttribute('data-val', 2); 
  document.getElementById('c3').setAttribute('data-val', 3); 
  document.getElementById('c4').setAttribute('data-val', 4); 
  document.getElementById('c5').setAttribute('data-val', 5); 
  document.getElementById('c6').setAttribute('data-val', 6); 
  document.getElementById('c7').setAttribute('data-val', 7); 

  document.getElementById('u1').setAttribute('data-val', 0); 
  document.getElementById('u2').setAttribute('data-val', 1); 
  document.getElementById('d1').setAttribute('data-val', 2); 
  document.getElementById('d2').setAttribute('data-val', 3);  

  document.getElementById('u1').style.zInder=2;
  document.getElementById('u2').style.zInder=2;
  document.getElementById('d1').style.zInder=2;
  document.getElementById('d2').style.zInder=2;
    
  document.getElementById('u1').appendChild( ui_create_card('1') );
  document.getElementById('u2').appendChild( ui_create_card('1') );
  document.getElementById('d1').appendChild( ui_create_card('100') );
  document.getElementById('d2').appendChild( ui_create_card('100') );
        
  document.getElementById('container').style.visibility = 'visible';

  gameStart();  
}

// -- Standard Utilities -------------------------------------------------


function centerContainer()
{
  var cw = document.documentElement.clientWidth;  
  var ch = document.documentElement.clientHeight;  
  var dw = document.getElementById('container').clientWidth;
  var dh = document.getElementById('container').clientHeight;
  
  document.getElementById('container').style.top  = (ch-dh)/2;
  document.getElementById('container').style.left = (cw-dw)/2;
} 

function randomIntFromInterval(min,max)
{
  return Math.floor(Math.random()*(max-min+1)+min);
}

function shuffle(array) {
  var m = array.length, t, i;
  // While there rehand elements to shuffle
  while (m) {
    // Pick a rehanding element
    i = Math.floor(Math.random() * m--);
    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }  
  return array;
} 

