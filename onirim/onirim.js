// Thomas

var draw       = new Array();
var discard    = new Array();
var limbes     = new Array();
var doors      = new Array();
var labyrinth  = new Array();
var prophecy   = new Array();
var hand       = new Array();

var sun        = "sun";
var moon       = "moon";
var key        = "key";
var door       = "door";
var monster    = "nightmare";
var red        = "red";
var blue       = "blue";
var green      = "green";
var brown      = "brown";
var grey       = "";

// ------------------------------------------------------
// Game States 
// (a state is when the game UI waits for user interaction)
// ------------------------------------------------------

function set_state_choose_card()
{
  debug("set_state_choose_card");
  ui_show_message("SELECT A CARD : Select one of the cards in your hand <i>(click card)</i> ");
        
  shufflelimbes();
  
  ui_default_state();
       
  for (var i=0; i<5; i++) {
    if (hand[i]!=-1) {
      hand[i].onmousedown = function(){ do_action_choose_card(this); };  
    }
  }      
}

function set_state_resolve_card()
{
  debug("set_state_resolve_card");
  
  if ( isakeycard(selectedcard) )
    ui_show_message("PLAY CARD : Add it to the Labyrinth <i>(click card)</i> or Execute a prophecy with your key <i>(click icon)</i>");
  else
    ui_show_message("PLAY CARD : Add it to the Labyrinth <i>(click card)</i> or Send it to the discard pile <i>(click icon)</i>");
  
  ui_default_state();
  ui_focus_element(selectedcard);
      
  // Clicking any card will select it
  for (var i=0; i<5; i++) {
    if (hand[i]!=-1) {
      hand[i].onmousedown = function(){ do_action_choose_card(this); };  
    }
  }    

  // Clicking the selected card will add it to labyrinth, if it is possible to do so
  //   A card can added to the labyrinth if a) it is a key, sun or moon and b) it has 
  //   a different than last card played in the labyrinth
  if ( canbeaddedtolabyrinth(selectedcard) ) {
    selectedcard.onmousedown = function(){ do_action_play_card(); } ;
  } 
      
  // Clicking the discard button will send the selected card to the discard...
  ui_focus_element(button);   
  button.onmousedown = function(){ do_action_discard_card(); } ;  
  // ...unless the card is a key, in which case a Prophecy is performed
  if ( isakeycard(selectedcard) ) {
    ui_focus_element(button);   
    button.onmousedown = function(){ do_action_prophecy(); } ; 
  } 
}

function set_state_prophecy_selection()
{
  // The prophecy cards have been revealed
  // Now user needs to select which one to discard (first click)
  // and in which order to put the others back in the draw pile
  
  debug("set_state_prophecy_selection");
  
  ui_default_state();
  
  var n = prophecy.length;
  
  for (var i=0; i<n; i++) {
    if (n==5) {
      ui_show_message("PROPHECY : Send a card to discard pile <i>(click card)</i>");
      prophecy[i].onmousedown = function(){ do_action_prophecy_discard(this); };  
    } else {
      ui_show_message("PROPHECY : Put a card on the top of the draw pile <i>(click card)</i>");
      prophecy[i].onmousedown = function(){ do_action_prophecy_add_to_draw(this); };  
    }  
  }
}

function set_state_resolve_door()
{
  // The player drew a door
  // If the player has a key of the same color as the door, the door can be opened
  // If not, then the door must be sent to the Limbes
  
  debug("set_state_resolve_door");
  
  ui_default_state();

  ui_focus_element(selectedcard);
        
  if ( ismatchingkeyinhand(selectedcard) ) {
    ui_show_message("OPEN DOOR : Open the door with your key of matching color <i>(click door)</i>");
    selectedcard.onmousedown = function(){ do_action_open_door(); } ;   
    validkey.onmousedown = function(){ do_action_open_door(); } ;   
  } else {
    ui_show_message("LIMBES : Send door the limbes since you do not have a matching key to open it <i>(click door)</i>");
    selectedcard.onmousedown = function(){ do_action_send_door_to_limbes(); } ;   
  }
}

function set_state_resolve_monster()
{
  // Player got a nightmare card!
  
  debug("set_state_resolve_monster");
  
  au_nightmare.play();
  
  var str="NIGHTMARE : "; 
  str+="Discard your hand <i>(click card)</i>, " 
  str+="Discard from draw pile <i>(click icon)</i>, " 
  str+="Use a key <i>(click a key)</i> or "
  str+="Close a door <i>(click a door)</i>";
  
  ui_show_message(str);  
  ui_default_state();
    
  // Click the draw pile to discard 5 cards from the draw pile
  ui_focus_element(button);   
  button.onmousedown = function(){ do_action_monster_discard5cards_reveal(); } ;  
  
  // Click the monster to discard all cards in hand
  selectedcard.onmousedown = function(){ do_action_monster_discardhand(); }   
  ui_focus_element(selectedcard);
  
  // If there are keys in hand, click any to discard monster and key 
  for (var i=0; i<5; i++) {
    if (hand[i]!=-1) {
      if (hand[i].typ==key) {
        hand[i].onmousedown = function(){ do_action_monster_discardkey(this); };  
        ui_focus_element(hand[i]);
      }  
    }
  }     
  
  // If there are any open doors, click any to discard monster and close door 
  for (var i=0; i<doors.length; i++) {
    doors[i].onmousedown = function(){ do_action_monster_closedoor(this); };  
  }       
}

function set_state_resolve_monster_discard()
{
  // Player chose to discard 5 cards from the draw pile
  // The 5 cards are now revealed in the prophecy zone
  // User can see them and click the discard to proceed
  
  debug("set_state_resolve_monster_discard");
  ui_show_message("DISCARD : The 5 cards below will be discarded <i>(click icon to continue)</i>");
    
  ui_default_state();
    
  // Click the draw pile to discard 5 cards from the draw pile
  ui_focus_element(button);   
  button.onmousedown = function(){ do_action_monster_discard5cards_discard(); }     
}

function set_state_draw_card()
{
  // Note: this function isn't really a set_state function
  // 'do_action_addtohand' should really be a recursive function
  debug("set_state_draw_card");
  
  ui_default_state();

  do_action_addtohand();      
}

// ------------------------------------------------------
// Game Actions 
// (an action is triggered by a user interface and results in a state transition
// ------------------------------------------------------

function do_action_quit_game()
{
  menu_show();
  
  window.setTimeout(reset_game, 1000);
}

function do_action_start_new_game()
{                
  // assumptions:
  // game has been reset before starting new game
  
  // Deal a fresh hand to player
  drawfreshhand();  
    
  // Player can start by choosing a card from his hand
  set_state_choose_card();       
}

function do_action_choose_card(card)
{
  // assumptions:
  // current state = choose card or resolve card
  // selectedcard  = labyrinth 
  
  au_click.play();     
  
  selectedcard = card;
  debug("Selected card"+getcardinfo(card)+", now choose an action: play or discard/prophecy"); 

  if ( is_game_won_or_lost() ) return;
  
  // next state = resolve card
  set_state_resolve_card();         
}

function do_action_play_card()
{
  // assumptions:
  // current state = resolve card
  // selectedcard  = labyrinth 

  au_click.play();     
      
  debug("Playing card ");
  removefromhand(selectedcard);
  addtolabyrinth(selectedcard);
    
  if ( is_game_won_or_lost() ) return;
  
  set_state_draw_card();     
}

function do_action_discard_card()
{
  // assumptions:
  // current state = resolve card
  // selectedcard  = labyrinth   
  
  au_click.play();       
  
  debug("Discarding card ");
  removefromhand(selectedcard);
  addtodiscard(selectedcard);
      
  if ( is_game_won_or_lost() ) return;
  
  set_state_draw_card();     
}

function do_action_send_door_to_limbes()
{
  au_click.play();     

  debug("Sending card to Limbes ");
  removefromhand(selectedcard);
  addtolimbes(selectedcard);
  
  if ( is_game_won_or_lost() ) return;
  
  set_state_draw_card();     
}

function do_action_open_door()
{
  au_click.play();     
  
  debug("Opening Door");
  removefromhand(selectedcard);
  addtodoors(selectedcard);
  removefromhand(validkey);
  addtodiscard(validkey);
  
  if ( is_game_won_or_lost() ) return;
  
  set_state_draw_card();       
}

function do_action_prophecy()
{
  // assumptions:
  // current state = resolve card
  // selectedcard  = key 
  
  au_click.play();     
  au_prophecy.play();     
  
  debug("Prophecy ");
  
  // Send selected key to the discard pile
  removefromhand(selectedcard);
  addtodiscard(selectedcard);
    
  // Reveal 5 cards from the draw pile
  for (var i=0; i<5; i++) {
    var card = removefromdraw();
    if (card==-1) break;
    addtoprophecy(card);
  }
  
  if ( is_game_won_or_lost() ) return;
  
  set_state_prophecy_selection();     
}

function do_action_prophecy_discard(card)
{
  // assumptions:
  // current state = prophecy selection
  // selectedcard  = any 
  au_click.play();     
  
  debug("Discarding"+getcardinfo(card)); 
  removefromprophecy(card);
  
  if (isadoorcard(card))
    addtolimbes(card);
  else
    addtodiscard(card);
  
  if ( is_game_won_or_lost() ) return;
   
  set_state_prophecy_selection();     
}

function do_action_prophecy_add_to_draw(card)
{
  // assumptions:
  // current state = prophecy selection
  // selectedcard  = any 
  au_click.play();     
  
  debug("Returning"+getcardinfo(card)+"to draw pile"); 
  card.onmousedown = "";    
  removefromprophecy(card);
  addtodraw(card);
 
  if ( is_game_won_or_lost() ) return;
     
  if (prophecy.length>1) {
    // while there are cards to put back in draw pile
    set_state_prophecy_selection();     
  } else {
    var last = prophecy[0];
    debug("Returning"+getcardinfo(last)+"to draw pile"); 
    removefromprophecy(last);
    addtodraw(last);
    set_state_draw_card();     
  }
      
}

function do_action_monster_closedoor(card)
{
  // assumptions:
  // current state = resolve monster
  // selectedcard  = monster 
  // card type     = door
  
  au_click.play();     
  
  // discard the monster 
  removefromhand(selectedcard);
  addtodiscard(selectedcard);

  // send door to limbes
  removefromdoors(card);
  addtolimbes(card);
    
  if ( is_game_won_or_lost() ) return;
  
  set_state_draw_card();     
}

function do_action_monster_discardkey(card)
{
  // assumptions:
  // current state = resolve monster
  // selectedcard  = monster 
  // card type     = key
  au_click.play();     

  // discard the monster 
  removefromhand(selectedcard);
  addtodiscard(selectedcard);  
  
  // discard the key 
  removefromhand(card);
  addtodiscard(card);
    
  if ( is_game_won_or_lost() ) return;
  
  set_state_draw_card();     
}

function do_action_monster_discard5cards_reveal()
{    
  // assumptions:
  // current state = resolve monster
  // selectedcard  = monster 
  au_click.play();     
  
  // discard the monster 
  removefromhand(selectedcard);
  addtodiscard(selectedcard);
      
  // Reveal 5 cards from the draw pile
  for (var i=0; i<5; i++) {
    var card = removefromdraw();
    if (card==-1) break;
    addtoprophecy(card);
  }
  
  if ( is_game_won_or_lost() ) return;
  
  set_state_resolve_monster_discard();     
}

function do_action_monster_discard5cards_discard()
{    
  // assumptions:
  // current state = resolve monster
  // selectedcard  = none 
  au_click.play();     
   
  // remove 5 cards from the prophecy row
  // discard labyrinth cards
  // send to monsters and doors to the limbes 
  debug("Discarding 5 cards from draw pile");
  for (var i=0; i<5; i++) {
    var card = prophecy[0];
    removefromprophecy(card);
    if ( isalabyrinthcard(card)) {
      addtodiscard(card);
    } else {
      addtolimbes(card);
    }
  }  
    
  if ( is_game_won_or_lost() ) return;

  set_state_draw_card();     
}



function do_action_monster_discardhand()
{  
  // assumptions:
  // current state = resolve monster
  // selectedcard  = monster 
  au_click.play();     
  
  // discard the monster 
  removefromhand(selectedcard);
  addtodiscard(selectedcard);
  
  // discard all cards in hand   
  discardhand();
  
  // Refresh hand with a new draw
  drawfreshhand();

  if ( is_game_won_or_lost() ) return;
  
  // next state = choose a card, delay the call if limbes must be shuffled first
  window.setTimeout(set_state_choose_card, (limbes.length>0)?1200:0 );
}

function do_action_addtohand()
{  
  // assumptions:
  // current state = draw card
  // selectedcard  = <none> 
  
  if ( ishandcomplete() ) {
    
    debug("ERROR: Hand is full, can't take more cards");
    debug(hand);
    alert("ERROR: Hand is full, can't take more cards");
    
  } else {
    
    var card = removefromdraw()
    addtohand(card);    

    if ( is_game_won_or_lost() ) return;
                
    if ( isamonstercard(card) ) {
      selectedcard = card;
      set_state_resolve_monster();
    } else {
      if ( isadoorcard(card) ) {
        selectedcard = card;
        set_state_resolve_door();
      } else {
        if ( ishandcomplete()==true ) {
          debug("Hand is now complete");
          // next state = choose a card, delay the call if limbes must be shuffled first  
          window.setTimeout(set_state_choose_card, (limbes.length>0)?1200:0 );
        } else {
          set_state_draw_card();        
        }
      }    
    }
  }
}

// ------------------------------------------------------
// End game check and condition
// ------------------------------------------------------

function is_game_won_or_lost()
{ 
  if (doors.length==8) {
    ui_show_message("");
    ui_focus_element(button);   
    button.onmousedown = function(){ do_action_quit_game(); } ; 
    ui_show_endgame_message("<b><br>CONGRATULATIONS<br>You have opened the 8 oneiric doors and have escaped the labyrinth of dreams<br></b>");
    return true;
  } else {
    if (draw.length===0) {
      ui_show_message("");
      ui_focus_element(button);   
      button.onmousedown = function(){ do_action_quit_game(); } ;     
      ui_show_endgame_message("<b><br>GAME OVER<br>You ran out of cards to draw and are now forever lost in the labyrinth of dreams...<br></b>");
      return true;
    }
  }
  return false;  
}

// ------------------------------------------------------
// Draw pile
// ------------------------------------------------------

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

function shuffledraw()
{  
  debug("Shuffling deck ");
  for (var i=0; i<10; i++) {
    shuffle(draw);
  }
  for (var i=0; i<draw.length; i++) {
    draw[i].style.zIndex=i;
  }
}

function addtodraw(card)
{
  debug("Adding"+getcardinfo(card)+"to draw");
  card.style.zIndex     = draw.length;
  card.won=false;
  ui_card_setposition(card, "draw", "small")   
  draw.push(card);

  // Update in the visible game info 
  ui_update_info();  
}
  
function findindraw(typ, col)  
{
  for (var i=0; i<draw.length; i++) {
    if (draw[i].typ == typ) {
      if (draw[i].col == col) {
        return i;
      }
    }
  } 
  return -1;   
}

function removefromdraw(pos)
{
  if (draw.length==0) {
    debug("Draw pile is empty, cannot draw card");  
    return -1;  
  }
  
  var card;
  if ( pos==undefined ) {
    card = draw.pop();
  } else {
    card = draw[pos];
    draw.splice(pos,1);
  }   
  debug("Drawing"+getcardinfo(card)); 
       
  if (draw.length<1) {
    debug("This was the last card");  
  }
  
  // Update in the visible game info 
  ui_update_info();
        
  return card;
}

function getnummonsters()
{
  var n = 0;
  for (var i=0; i<draw.length; i++) {
    if ( isamonstercard(draw[i]) ) n++;
  }  
  return n;
}

function getnumdrawcards()
{
  return draw.length;
}

// ------------------------------------------------------
// Hand
// ------------------------------------------------------

var selectedcard = -1;
var validkey     = -1;

function gethandfreeslot()
{
  // Find and return the first empty slot
  for (var i=0; i<5; i++) {
    if (hand[i]==-1) {
      return i;
    }
  }  
  // Return -1 if the hand is full (no empty slots)
  return -1;
}

function addtohand(card)
{  
  debug("Adding"+getcardinfo(card)+"to hand");
    
  // Find a free slot in player hand (up to 5 cards)
  var pos = gethandfreeslot();
  
  if (pos>=0) {  
    card.style.zIndex = pos+1;
    ui_card_setposition(card, "hand"+(pos+1), "big");
    hand[pos]=card;
  }
}

function removefromhand(card)
{
  var x = hand.indexOf(card);
  debug("Removing form hand"+getcardinfo(card));
  // Remove 1 element from array at index x and replace it with -1 
  hand.splice(x,1,-1);
}

function ismatchingkeyinhand(card)
{
  for (var i=0; i<5; i++) {
    if (hand[i]!=-1) {  
      if (isakeycard(hand[i]) && (hand[i].col==card.col)) {
        validkey = hand[i];
        return true;
      }
    }
  }    
  validkey = -1;
  return false;  
}

function iskeyinhand()
{
  for (var i=0; i<5; i++) {
    if (hand[i]!=-1) {
      if ( isakeycard(card) ) {
        return true;
      }
    }
  }    
  return false;  
}

function ishandcomplete() {
  return (gethandfreeslot()==-1);
}

function discardhand()
{
  debug("Discarding hand");
  for (var i=0; i<5; i++) {
    if (hand[i]!=-1) {
      var card = hand[i];
      removefromhand(card);
      addtodiscard(card);
    }
  }  
}

function drawfreshhand()
{
  debug("Drawing hand");
  for (var i=0; i<5; ) {
    var card = removefromdraw();
    if (card==-1) break;
    if ((card.typ==door) || (card.typ==monster)) {
      addtolimbes(card);
    } else {
      addtohand(card);
      i++;
    }
  }  
}

// ------------------------------------------------------
// Labyrinth
// ------------------------------------------------------

function canbeaddedtolabyrinth(card) 
{
  var ok = true;
  var n  = labyrinth.length;   
  if (n>0) {
    var c1 = labyrinth[n-1];
    if (isalabyrinthcard(card) && (card.typ!=c1.typ)) {
      ok = true;
    } else {
      ok = false;
    }
  }
  return ok;  
}

function addtolabyrinth(card)
{
  debug("Adding"+getcardinfo(card)+"to labyrinth");
  labyrinth.push(card);
  card.style.top      = "140px";
  card.style.left     = 20+labyrinth.length*30+"px";
  card.style.position = "absolute";
  card.style.zIndex   = labyrinth.length+30;  
  card.onmousedown    = "";  
  ui_card_setposition(card, "", "med");
  
  checkforopeneddoor();     
}

function checkforopeneddoor()
{
  var n = labyrinth.length;  
  if (n>=3) {
    var c1 = labyrinth[n-1];
    var c2 = labyrinth[n-2];
    var c3 = labyrinth[n-3];
    
    if ((c1.col==c2.col) && (c1.col==c3.col) &&(c2.won==false) && (c3.won==false)) {
      c1.won=true;
      c2.won=true;
      c3.won=true;
      opendoor(c1.col);
    }
  }
}

function opendoor(col)
{  
  var n = draw.length;
  var p = findindraw(door, col);
  
  if (p==-1) {
    debug("Openning door: No door found");
  } else {
    debug("Found door at place n."+p);
    var card = removefromdraw(p);
    addtodoors(card);
    debug("Openning"+getcardinfo(card));    
  }
}

// ------------------------------------------------------
// Discard
// ------------------------------------------------------

function addtodiscard(card)
{
  debug("Adding"+getcardinfo(card)+"to discard");
  discard.push(card);
  card.style.zIndex = discard.length;   
  ui_card_setposition(card, "discard", "small");
  card.onmousedown  = "";   
}

// ------------------------------------------------------
// Limbes
// ------------------------------------------------------

function addtolimbes(card)
{
  debug("Adding"+getcardinfo(card)+"to limbes");
  limbes.push(card);
  card.style.zIndex = limbes.length;   
  ui_card_setposition(card, "limbes", "small");
  card.onmousedown  = "";       
}

function shufflelimbes()
{
  var n = limbes.length;
  
  if (n>0) {
    debug("Merging limbes with draw pile");
    for (var i=0; i<n; i++) {
      addtodraw( limbes.pop() );
    }     
    shuffledraw();
  } 
}

// ------------------------------------------------------
// Doors
// ------------------------------------------------------

function addtodoors(card)
{
  debug("Adding"+getcardinfo(card)+"to doors");
  au_door.play();
  doors.push(card);
  card.style.zIndex = 50+doors.length;   
  ui_card_setposition(card, "door"+doors.length, "small");
}

function removefromdoors(card)
{
  var x = doors.indexOf(card);
  debug("Closing door");
  doors.splice(x,1);
  
  var n = doors.length;
  for (var i=0; i<n; i++) {
    doors[i].style.zIndex=(i+1);   
    ui_card_setposition(doors[i], "door"+(i+1), "small");
  }    
}

// ------------------------------------------------------
// Prophecy
// ------------------------------------------------------

function addtoprophecy(card)
{
  debug("Adding"+getcardinfo(card)+"to prophecy");
  prophecy.push(card);
  card.style.zIndex = prophecy.length+20;     
  ui_card_setposition(card, "spec"+prophecy.length, "big");
}

function removefromprophecy(card)
{
  var x = prophecy.indexOf(card);
  debug("Removing from prophecy");
  prophecy.splice(x,1);
  
  var n = prophecy.length;
  for (var i=0; i<n; i++) {
    ui_card_setposition(prophecy[i], "spec"+(i+1), "big");
    prophecy[i].style.zIndex=(i+1)+20;   
  }    
}


// ------------------------------------------------------
// Cards
// ------------------------------------------------------

var N=0;
function createcards(n, col, typ)
{
  var card;
  for (var i=0; i<n; i++) {
    card = ui_create_card("game", "card"+N, "small", col+""+typ, "cardback");
    card.typ = typ;
    card.col = col;
    card.won = false; 
    N++;          
  } 
}

function isalabyrinthcard(card)
{
  return !( isamonstercard(card) || isadoorcard(card) );
}

function isamonstercard(card)
{
  return (card.typ==monster);
}

function isadoorcard(card)
{
  return (card.typ==door);
}

function isakeycard(card)
{
  return (card.typ==key);
}

function getcardinfo(card)
{
  var typ;
  var col;
  switch(card.typ) {
    case sun    : typ = "sun"    ; break;
    case moon   : typ = "moon"   ; break;
    case key    : typ = "key"    ; break;
    case door   : typ = "door"   ; break;
    case monster: typ = "monster"; break;
    default     : typ = ""       ; break;
  } 
  switch(card.col) {
    case red    : col = "red"    ; break;
    case blue   : col = "blue"   ; break;
    case green  : col = "green"  ; break;
    case brown  : col = "brown"  ; break;
    default     : col = ""       ; break;
  }  
  return " "+col+" "+typ+" ";  
}

// -------------------------------------------------------
// Game reset and initialization
// -------------------------------------------------------

function reset_elements() {
  // Reset all arrays
  hand=[-1,-1,-1,-1,-1];
  clear(discard);
  clear(draw);
  clear(limbes);
  clear(doors);
  clear(labyrinth);
  clear(prophecy); 
  
  // Erase property positions for all the cards 
  // This is necessary for the labyrinth cards since their position is explicitly set
  for (var i=0; i<N; i++) {
    document.getElementById("card"+i).style.top="";    
    document.getElementById("card"+i).style.left="";    
    document.getElementById("card"+i).won=false;    
  }   
}

function init_cards() 
{
  debug(" Initialzing cards" );
  
  N=0;
  createcards(10, grey,   monster );
  
  createcards( 9, red,    sun     );
  createcards( 4, red,    moon    );
  createcards( 3, red,    key     );
  createcards( 2, red,    door    );
  
  createcards( 8, blue,   sun     );
  createcards( 4, blue,   moon    );
  createcards( 3, blue,   key     );
  createcards( 2, blue,   door    );
  
  createcards( 7, green,  sun     );
  createcards( 4, green,  moon    );
  createcards( 3, green,  key     );
  createcards( 2, green,  door    );
  
  createcards( 6, brown,  sun     );
  createcards( 4, brown,  moon    );
  createcards( 3, brown,  key     );
  createcards( 2, brown,  door    );
  
  debug("Created "+N+" cards");
}

function clear(A) {
  while(A.length > 0) {
    A.pop();
  }  
}

function init_drawdeck() 
{
  for (var i=0; i<N; i++) {
    addtodraw( document.getElementById("card"+i) );    
  }
  
  shuffledraw();  
}


function reset_game()
{
  // Remove all the cards from their current location
  reset_elements();
    
  // Shuffle all the cards back in the draw pile
  init_drawdeck();

  // Put the UI in it's default state
  ui_default_state();    
}

function touchHandler(event)
{
    var touches = event.changedTouches,
        first = touches[0],
        type = "";
         switch(event.type)
    {
        case "touchstart": type = "mousedown"; break;
        case "touchmove":  type="mousemove"; break;        
        case "touchend":   type="mouseup"; break;
        default: return;
    }
 
    var simulatedEvent = document.createEvent("MouseEvent");
    simulatedEvent.initMouseEvent(type, true, true, window, 1, 
                              first.screenX, first.screenY, 
                              first.clientX, first.clientY, false, 
                              false, false, false, 0/*left*/, null);
    first.target.dispatchEvent(simulatedEvent);
    event.preventDefault();
}
                                      
function init() 
{                                    
  button = document.getElementById("iconButton");  
    
  menu_init("container");
  menu_initChoice(
    1, 
    function(){ 
      menu_hide(); 
      au_start.play();
      window.setTimeout(do_action_start_new_game, 1002); }, 
    "<b>Play Game</b>" );               
  
  document.getElementById("menuButton").onmousedown = function(){ do_action_quit_game(); } ;     
  document.getElementById("menuButton").innerHTML = "Quit Game";
  
  init_cards();   
  
  reset_game(); 
  
  document.getElementById("container").style.visibility="visible"; 
  
    document.addEventListener("touchstart", touchHandler, true);
    document.addEventListener("touchmove", touchHandler, true);
    document.addEventListener("touchend", touchHandler, true);
    document.addEventListener("touchcancel", touchHandler, true);    
  
    
}  

// ------------------------------------------------------
// User Interface States - Enables/Disables clicks and actions 
// ------------------------------------------------------

function ui_create_card(container, id, dimensions, side1style, side2style) 
{
  var card;
    
  card = document.createElement("div");
  card.id=id;
  card.side1style=side1style;
  card.side2style=side2style;
  card.dimensions=dimensions;
  card.className=card.dimensions+" "+card.side1style;
  card.style.transitionProperty="width, height, top, left";
  card.style.transitionDuration="1s,1s,1s,1s";
  document.getElementById(container).appendChild(card);
      
  return card;
}   

function ui_card_setposition(card, pos, dim)
{
  debug("Set card "+card.id+" position to "+pos);
  debug("Set card "+card.id+" dimension to "+dim);
  card.position  =pos;
  card.dimensions=dim;
  card.className =card.dimensions+" "+card.side1style+" "+card.position
}

function ui_focus_element(obj)
{
  obj.className = obj.className.replace("focused", "");
  obj.className = obj.className + " focused";
}

function ui_defocus_element(obj)
{
  obj.className = obj.className.replace("focused", "");
}

function ui_default_state()
{       
  // ui_defocus_element and cancel 'onmousedown' action for all clickable objects
  //  - Button
  button.onmousedown      = "";  
  ui_defocus_element(button);   
  
  //  - Cards in hand
  for (var i=0; i<5; i++) {
    if (hand[i]!=-1) {
      hand[i].onmousedown = "";  
      ui_defocus_element(hand[i]);
    }
  }  
  //  - Openeded door
  for (var i=0; i<doors.length; i++) {
    doors[i].onmousedown = "";  
  }  

  // Make sure end-game banner is hideen  
  document.getElementById("endMessage").style.visibility="hidden";
  
}

function ui_update_info()
{
  // Update in the visible game info 
  document.getElementById("info1val").innerHTML=getnumdrawcards(); 
  document.getElementById("info2val").innerHTML=getnummonsters();     
}

function ui_show_message(str)
{
  debug(str);
  document.getElementById("infoMessage").innerHTML="<p>"+str+"</p>";  
}

function ui_show_endgame_message(str)
{
  debug(str);
  document.getElementById("endMessage").style.visibility="visible";
  document.getElementById("endMessage").innerHTML=str;
}
                                                                                                                                                                                
function debug(str)
{
  // Uncomment this line to print debug message to the console
//  console.log(str);
}



// ------------------------------------------------------
// User Interface States - Enables/Disables clicks and actions 
// ------------------------------------------------------

var au_nightmare = new Audio("sounds/nightmare.wav");
var au_click     = new Audio("sounds/click.wav");
var au_start     = new Audio("sounds/startgame.wav");
var au_door      = new Audio("sounds/opendoor.wav");
var au_prophecy  = new Audio("sounds/prophecy.wav");


// ------------------------------------------------------
// App version and cache management 
// ------------------------------------------------------

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

