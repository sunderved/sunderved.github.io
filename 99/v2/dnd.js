// target elements with the "draggable" class
interact('.draggable')
  .draggable({
    
    // disable inertial throwing
    inertia: false,

    onstart: function (event) {
      var dragElement = event.target;
//	    console.log('onstart: '+dragElement.id);
      ui_on_drag_start(dragElement);      
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
      dragElement.style.zIndex  = 5;  
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
      dragElement.style.transform = 'rotate('+randomIntFromInterval(-10,10)+'deg)';    
      dragElement.style.zIndex = 2;       
      ui_on_drag_end(dragElement);      
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
    // console.log(dragElement.id + 'is droppable in ' + dropElement.id);
  },
  ondragleave: function (event) {
    var dragElement = event.relatedTarget;
    var dropElement = event.target;
    // remove the drop feedback style
    dropElement.classList.remove('drop-target');
    dragElement.classList.remove('can-drop');
    // console.log(dragElement.id + 'has been dragged out of ' + dropElement.id);
  },
  ondrop: function (event) {
    var dragElement = event.relatedTarget;
    var dropElement = event.target;

    ui_on_drop(dragElement, dropElement);      
    
    dragElement.classList.remove('draggable');
    dropElement.classList.remove('drop-target');
    dragElement.classList.remove('can-drop');
    
    dropElement.appendChild(dragElement);    
    // console.log(dragElement.id + ' has been dropped in ' + dropElement.id);
  },
  ondropactivate: function (event) {
    // triggered when an element starts to be dragged
    // can be used to highlight drop zones
  },
  ondropdeactivate: function (event) {
    // triggered when an element stops to be dragged
    // can be used to de-highlight drop zones
  }
});

