


// ------------------------------------------------------------------
// - UI Creation and Reinitialization of DIVs 
// ------------------------------------------------------------------


var map = {
  0: {x:2, y:0},
  1: {x:3, y:0},
  2: {x:4, y:0},
  3: {x:2, y:1},
  4: {x:3, y:1},
  5: {x:4, y:1},
  6: {x:0, y:2},
  7: {x:1, y:2},
  8: {x:2, y:2},
  9: {x:3, y:2},
 10: {x:4, y:2}, 
 11: {x:5, y:2}, 
 12: {x:6, y:2}, 
 13: {x:0, y:3}, 
 14: {x:1, y:3}, 
 15: {x:2, y:3},
 16: {x:3, y:3},
 17: {x:4, y:3}, 
 18: {x:5, y:3}, 
 19: {x:6, y:3}, 
 20: {x:0, y:4}, 
 21: {x:1, y:4}, 
 22: {x:2, y:4}, 
 23: {x:3, y:4}, 
 24: {x:4, y:4},
 25: {x:5, y:4},
 26: {x:6, y:4},
 27: {x:2, y:5},
 28: {x:3, y:5},
 29: {x:4, y:5},
 30: {x:2, y:6},
 31: {x:3, y:6},
 32: {x:4, y:6}
}

var au_sound;

function createDiv(parent, str, id, x, y, r, style) 
{
  var el;
  el = document.createElement('div');
  el.id=str+''+id;
  el.customId = id;
  el.className=style;
  el.style.left         = x+'px';
  el.style.top          = y+'px';
	el.style.width        = r+'px';
	el.style.height       = r+'px';
	el.style.borderRadius = r+'px';		
  document.getElementById(parent).appendChild(el);
  return el;
}   

function UI_createBoard()
{
  if ("ontouchstart" in document.documentElement) {
		document.addEventListener('touchmove',  function(e){ e.preventDefault(); }); 
		document.addEventListener('touchstart', function(e){ e.preventDefault(); }); 	  
	}	
		
 	var dw = document.documentElement.clientWidth;  
 	var dh = document.documentElement.clientHeight;  
			
	var gw = Math.min(dw, dh, 640);
	var gh = gw*4/3;
	
	var bw = gw*14/15;
	var bh = bw;
	
	var hstep = bw/7;
	var vstep = bh/7;
	var pegr  = hstep*7/8; // peg/hole radius
	
	
	document.getElementById('gamespace').style.width  = gw;
	document.getElementById('gamespace').style.height = gh;
  	
	document.getElementById('board').style.width  = bw;
	document.getElementById('board').style.height = bh;
		
	document.getElementById('info').style.fontSize    = gw*0.1+'px';

	document.getElementById('version').style.fontSize = gw*0.016+'px'; 
	
		
  if ("ontouchstart" in document.documentElement) {
    document.getElementById('info').addEventListener('touchstart', newGame);
  } else {
    document.getElementById('info').addEventListener('click', newGame);
  }   
  
  // create divs for holes
	for (h in map) {
		var x = map[h]['x'];
		var y = map[h]['y'];
		var m = (hstep-pegr)/2;
		var left = x*hstep+m;
		var top  = y*vstep+m;		
		var e = createDiv('board', 'h', h, left, top, pegr, 'hole');	
	}
	
	// create divs for pegs
	for (p in pegs) {
		var e = createDiv('board', 'p', p, 0, 0, pegr, 'peg draggable');	
	}	

	// load sound	
  au_sound   = new Audio('../pop.wav');
  au_sound.volume = 1;
  au_sound.preload = 'auto';  
  au_sound.load();  
	
	
	UI_updateBoard();	
}

function UI_updateBoard()
{	
	for (p in pegs) {
		var pegdiv = document.getElementById('p'+p);
		if (pegs[p]==HOLE) {
			pegdiv.style.visibility = 'hidden';	
		} else {
			pegdiv.style.visibility = 'visible';	
			document.getElementById('h'+pegs[p]).appendChild(pegdiv);    
		}
	}	

	if (npegs==1) {
		document.getElementById('info').innerHTML='Nice Job!';
	} else {		
		if (validPegs.length==0) {
			document.getElementById('info').innerHTML='Try Again?';
		} else {
			document.getElementById('info').innerHTML='Solitaire';		
		}
	}
}

function UI_updateTargets()
{
	if (validHoles != undefined) {
		for (h of validHoles) {
			document.getElementById('h'+h).classList.add('dropzone');
		}
	}		
}

function UI_onDragStart(dragElement)
{
	//checkMovePositions(dragElement.customId);
	selectPeg(dragElement.customId);
	UI_updateTargets();		
}  

function UI_onDragEnd(dragElement)
{
	//clearMovePositions();
}   

function UI_onDrop(dragElement, dropElement)      
{
	selectHole(dropElement.customId);
	UI_updateBoard();		
}

// Listen for orientation changes
window.addEventListener("orientationchange", function() {
  // Announce the new orientation number
  if (window.orientation) {
	  if (Math.abs(window.orientation)==90) {
		  console.log('Landscape');
	  } else {
		  console.log('Portrait');
	  }
  }
}, false);

 
// target elements with the "draggable" class
interact('.draggable')
  .draggable({
    
    // disable inertial throwing
    inertia: false,

    onstart: function (event) {
      var dragElement = event.target;
      UI_onDragStart(dragElement);      
    },
        
    // call this function on every dragmove event
    onmove: function (event) {
      var dragElement = event.target;
      // store the dragged position in the data-x/data-y attributes
      var x = (parseFloat(dragElement.getAttribute('data-x')) || 0) + event.dx;
      var y = (parseFloat(dragElement.getAttribute('data-y')) || 0) + event.dy;    
      // translate the element
      dragElement.style.webkitTransform =
      dragElement.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
      // update the position attributes
      dragElement.setAttribute('data-x', x);
      dragElement.setAttribute('data-y', y);
      // make sure the dragged element is above other divs and visible
      dragElement.style.zIndex  = 15;  
    },
        
    // call this function on every dragend event
    onend: function (event) {
      var dragElement = event.target;
      var x = 0;
      var y = 0;
      dragElement.setAttribute('data-x', x);
      dragElement.setAttribute('data-y', y);
      dragElement.style.webkitTransform =
      dragElement.style.transform = 'translate(' + x + 'px, ' + y + 'px)';    
      dragElement.style.zIndex = 5; 
      UI_onDragEnd(dragElement);      
    }
  });


// enable draggables to be dropped into this
interact('.dropzone').dropzone({
  // only accept elements matching this CSS selector
  accept: '.draggable',
  // set how drops are checked for. The allowed values are:
  //   'pointer' – the pointer must be over the dropzone (default)
  //   'center'  – the draggable element’s center must be over the dropzone
  //   a number from 0-1 which is the (intersection area) / (draggable area). 
  //     e.g. 0.5 for drop to happen when 50% of the area of the draggable is over the dropzone  
  overlap: 'center',

  // listen for drop related events:
  ondragenter: function (event) {
    var dragElement = event.relatedTarget;
    var dropElement = event.target;
    // feedback the possibility of a drop
    dragElement.classList.add('can-drop');
  },
  ondragleave: function (event) {
    var dragElement = event.relatedTarget;
    var dropElement = event.target;
    // remove the drop feedback style
    dragElement.classList.remove('can-drop');
  },
  ondrop: function (event) {
    var dragElement = event.relatedTarget;
    var dropElement = event.target;

    UI_onDrop(dragElement, dropElement);      
    
    //dragElement.classList.remove('draggable');
    dragElement.classList.remove('can-drop');   
    dropElement.appendChild(dragElement);    
    // play a little sound
    au_sound.play();       
  },
  ondropactivate: function (event) {
    // triggered when an element starts to be dragged
    // can be used to highlight drop zones
  },
  ondropdeactivate: function (event) {
    // triggered when an element stops to be dragged
    // can be used to de-highlight drop zones
    var dropElement = event.target;
    dropElement.classList.remove('dropzone');
  }
});


//
// For Connections debugging purposes only...
// If need to debug connectios, then uncomment calls to 
// these function in the UI_onDragStart/End functions
//

function checkMovePositions(pegId)
{				
	var pos = pegs[pegId];
	for (dst in connections[pos]) {
		document.getElementById('h'+dst).style.borderColor = 'red';
		document.getElementById('h'+connections[pos][dst]).style.borderColor = 'blue';
	}			
}

function clearMovePositions()
{			
	for (h in map) {
		document.getElementById('h'+h).style.borderColor = '#707070';
	}
}

