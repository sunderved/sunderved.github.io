
function gameReset()
{
}

function gameStart()
{
	initDeck();  	
	initHand();  
	initPile();
	
  drawCards();	
}

var handsize = 8;
var handslots;
var hand = [];
var deck = [];
var u1   = [];
var u2   = [];
var d1   = [];
var d2   = [];
var u1valid;
var u2valid;
var d1valid;
var d2valid;

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

function initPile()
{
	u1 = [1];
	u2 = [1];
	d1 = [100];
	d2 = [100];
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
				
	     if (pile_num=='d1') { d1.unshift(card_val); }
	else if (pile_num=='d2') { d2.unshift(card_val); }
	else if (pile_num=='u1') { u1.unshift(card_val); }
	else if (pile_num=='u2') { u2.unshift(card_val); }
				
	if (handslots==2) drawCards();
	
	playableHand();	
}

function validPiles(card_val)
{	
	u1valid = false;
	u2valid = false;
	d1valid = false;
	d2valid = false;	
			
	// normal rule
 	u1valid |= (card_val>u1[0]);
 	u2valid |= (card_val>u2[0]);
 	d1valid |= (card_val<d1[0]);
 	d2valid |= (card_val<d2[0]);
	
	// backwards rule (+10/-10)
	u1valid |= (card_val==(u1[0]-10));
	u2valid |= (card_val==(u2[0]-10));
	d1valid |= (card_val==(d1[0]+10));
	d2valid |= (card_val==(d2[0]+10));			
}

function playableCard(card_val)
{
	validPiles(card_val);
	return ( u1valid | u2valid | d1valid | d2valid );
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
	validPiles(dragElement.getAttribute('data-val'));
	
	if (u1valid) ui_enable_drop_target('u1');
	if (u2valid) ui_enable_drop_target('u2');
	if (d1valid) ui_enable_drop_target('d1');
	if (d2valid) ui_enable_drop_target('d2');
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

// When the manifest file has changed and the browser has updated the files, 
// it won’t use them for the current session. The application must be reloaded 
window.applicationCache.addEventListener('updateready', function(e) {
	if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
	  // A changed manifest file has been found and downloaded by
	  // the browser. Swap cache and reload the page to use the new files.
	  console.log('A changed manifest file has been found and downloaded. Reloading app');
	  window.applicationCache.swapCache();
	  window.location.reload();
	}
}, false);