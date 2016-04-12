

var au_timeout;
var au_clear = [];
var au_decoy;

var target    = [];
var lost      = 1;
var active    = false;
var gameInterval;



function Target(id) 
{
  this.state;
  this.div = document.getElementById('p'+id);  
}

    
Target.prototype.activate = function() 
{
  this.state = 1;
  this.div.classList.add('activated');
}

Target.prototype.decoy = function() 
{
  this.state = 2;
  this.div.classList.add('decoy');
}

Target.prototype.failed = function() 
{
  this.state = -1;
  this.div.classList.add('lost');
}

Target.prototype.clear = function() 
{
  this.state = 0;
  this.div.classList.remove('lost');
  this.div.classList.remove('decoy');
  this.div.classList.remove('activated');
  this.div.classList.add('inactive');
}


var target_ids = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
var ntargets;
var nactive;
var nrounds;

function targetsReset() 
{
  for (var i=0; i<16; i++) {
    target[i].clear();  
  }
  nactive  = 0;        
  nrounds  = 0;
  ntargets = 1;
}

function targetsTimedout()
{
  for (var i=0; i<16; i++) {
    if (target[i].state == 1) {
      target[i].failed();
    } 
  }  
}

function targetsCleared() {
  return (nactive==0);  
}

function targetsSelect() 
{ 
  // Make sure all targets are cleared
  for (var i=0; i<16; i++) {
    target[i].clear();
  }
  
  // Update the number of rounds and number of targets
  nrounds++;    
  ntargets = Math.min(16, Math.floor(nrounds/7)+1);
  
  
  // Randomize the array of target IDs
  shuffle(target_ids);
  
  // Activate the first 'ntarget' elements of the randomized array
  for (var i=0; i<ntargets; i++) {
    var x = target_ids[i];
    var d = (ntargets>2)?randomIntFromInterval(1,5):0;   // 1 in 5 chances it is a decoy after a certain time
    
    if ((i>1) && (d==1)) {
      target[x].decoy();
    } else {
      target[x].activate();
      nactive++;
    }
  } 
  
  // Update the score (num rounds) info as a round is cleared and new targets are selected
   document.getElementById('score').innerHTML=nrounds;    
} 

function touchHandler(event) 
{  
  if (active==true) {
    var x = event.target.getAttribute('data-id');
    
    if (target[x].state == 1) { // clicked an active target -> clear it
        target[x].clear();
        nactive--;  
        au_clear[nactive].play();        
        if (targetsCleared() == true) {
          timerReset();
          targetsSelect();
        }        
    } else { // clicked a decoy -> game over...
        target[x].decoy();
        target[x].failed();
        au_decoy.play();
        gameStop();
    }
  } 
} 

function startHandler(event) 
{  
  gameReset();
  gameStart();
} 

function gameLoop() 
{      
  timerUpdate();
  if ( timerExpired() ) {
    au_timeout.play();
    gameStop();
    targetsTimedout();
  }     
}

function gameReset()
{
  timerReset();
  targetsReset();  
  active = false;
}

function gameStart()
{
  active = true;
  timerReset();
  targetsReset();  
  targetsSelect();
  document.getElementById('start').style.visibility='hidden';
  gameInterval = setInterval(gameLoop,10);   
}

function gameStop()
{
  active = false;
  clearInterval(gameInterval);
  document.getElementById('start').style.visibility='visible';
}

var timer;

function timerUpdate() {
  timer = timer - 10;
}  

function timerReset() {
  
  if ("ontouchstart" in document.documentElement) {
    timer = 1500;
  } else {
    timer = 5000;
  }    
}

function timerExpired() {
  return (timer<=0);
}


// var playClearCnt = 0;
// function playClear() {
//   console.log('playing sound '+playClearCnt);
//   au_clear[playClearCnt].play();
//   playClearCnt = (playClearCnt+1)%8;
// }

function init() 
{  
  // Center the container div
  centerContainer();
  
  // Load audio files
  au_timeout = new Audio("sounds/timeout.mp3");
  au_timeout.volume = 1;
  au_timeout.preload = 'auto';
  au_timeout.load(); 
    
  au_decoy   = new Audio("sounds/decoy.mp3");
  au_decoy.volume = 1;
  au_decoy.preload = 'auto';  
  au_decoy.load();  

  for (var x=0; x<16; x++) {
//     au_clear.push( new Audio("sounds/decoy.mp3") );
    au_clear.push( new Audio("sounds/clear.wav") );
    au_clear[x].volume = 1;
    au_clear[x].preload = 'auto';
    au_clear[x].load(); 
  } 
    
  // Create targets
  for (var x=0; x<16; x++) {
    target.push( new Target(x) );
  } 
  
  // Install the event handlers
  for (var x=0; x<16; x++) {
    var el = document.getElementById('p'+x);
    el.classList.add('inactive');
    el.setAttribute('data-id', x);   
    if ("ontouchstart" in document.documentElement) {
      el.addEventListener('touchstart', touchHandler);
    } else {
      el.addEventListener('click', touchHandler);
    }      
  }        

  var el = document.getElementById('score');
  el.innerHTML = 0;

  var el = document.getElementById('start');
  el.innerHTML = 'START';
  if ("ontouchstart" in document.documentElement) {
    el.addEventListener('touchstart', startHandler);
  } else {
    el.addEventListener('click', startHandler);
  }         
       
  gameReset(); 
    
  document.getElementById('container').style.visibility = 'visible';
  
}

function randomIntFromInterval(min,max)
{
  return Math.floor(Math.random()*(max-min+1)+min);
}

function centerContainer()
{
  var cw = document.documentElement.clientWidth;  
  var ch = document.documentElement.clientHeight;  
  var dw = document.getElementById('container').clientWidth;
  var dh = document.getElementById('container').clientHeight;
  
  document.getElementById('container').style.top  = (ch-dh)/2;
  document.getElementById('container').style.left = (cw-dw)/2;
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



