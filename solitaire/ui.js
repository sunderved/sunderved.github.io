


// ------------------------------------------------------------------
// - UI Creation and Reinitialization of DIVs 
// ------------------------------------------------------------------


var map = {
	0: {x:0, y:0},
	1: {x:0, y:1},
	2: {x:1, y:1},
	3: {x:0, y:2},
	4: {x:1, y:2},
	5: {x:2, y:2},
	6: {x:0, y:3},
	7: {x:1, y:3},
	8: {x:2, y:3},
	9: {x:3, y:3},
 10: {x:0, y:4},
 11: {x:1, y:4},
 12: {x:2, y:4},
 13: {x:3, y:4},
 14: {x:4, y:4}
}

function createDiv(container, str, id, x, y, r, style) 
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
  document.getElementById(container).appendChild(el);
  return el;
}   

function UI_createBoard()
{
	var hstep = 100;
	var vstep = hstep * Math.sqrt(3) / 2;
	var radius = hstep/2;
	
	
  if ("ontouchstart" in document.documentElement) {
		document.addEventListener('touchmove',  function(e){ e.preventDefault(); }); 
		document.addEventListener('touchstart', function(e){ e.preventDefault(); }); 	  
	}	
	
	var r = hstep*6;
	document.getElementById('circle').style.width  = r;
	document.getElementById('circle').style.height = r;
	document.getElementById('circle').style.borderRadius = r+'px';		
	
	document.getElementById('board').style.width  = hstep*4+radius+5;
	document.getElementById('board').style.height = vstep*4+radius+5;
	document.getElementById('board').style.top  = (r - (vstep*5+radius+5))/2;
	document.getElementById('board').style.left = (r - (hstep*4+radius+5))/2;;
		
	
	
	for (h in map) {
		var x = map[h]['x'];
		var y = map[h]['y'];
		var left = (4-y)*hstep/2 + x*hstep;
		var top  = y*vstep;		
		var e = createDiv('board', 'h', h, left, top, radius, 'hole');	
	}
	
	for (p in pegs) {
		var e = createDiv('board', 'p', p, 0, 0, radius, 'peg draggable');	
	}	
	
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
}

function UI_updateTargets()
{
	if (validHoles != undefined) {
		for (h of validHoles) {
			document.getElementById('h'+h).classList.add('drop-target');
			document.getElementById('h'+h).classList.add('dropzone');
		}
	}		
}

function UI_onDragStart(dragElement)
{
	selectPeg(dragElement.customId);
	UI_updateTargets();		
}  

function UI_onDragEnd(dragElement)
{
}   

function UI_onDrop(dragElement, dropElement)      
{
	selectHole(dropElement.customId);
	UI_updateBoard();		
}

 
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
    dropElement.classList.add('drop-target');
    dragElement.classList.add('can-drop');
  },
  ondragleave: function (event) {
    var dragElement = event.relatedTarget;
    var dropElement = event.target;
    // remove the drop feedback style
    dropElement.classList.remove('drop-target');
    dragElement.classList.remove('can-drop');
  },
  ondrop: function (event) {
    var dragElement = event.relatedTarget;
    var dropElement = event.target;

    UI_onDrop(dragElement, dropElement);      
    
    //dragElement.classList.remove('draggable');
    dropElement.classList.remove('drop-target');
    dragElement.classList.remove('can-drop');   
    dropElement.appendChild(dragElement);    
  },
  ondropactivate: function (event) {
    // triggered when an element starts to be dragged
    // can be used to highlight drop zones
  },
  ondropdeactivate: function (event) {
    // triggered when an element stops to be dragged
    // can be used to de-highlight drop zones
    var dropElement = event.target;
    dropElement.classList.remove('drop-target');
    dropElement.classList.remove('dropzone');
  }
});



