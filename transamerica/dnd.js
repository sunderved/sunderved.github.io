// target elements with the "draggable" class
interact('.draggable')
  .draggable({
    
    // disable inertial throwing
    inertia: false,

    onstart: function (event) {
      var dragElement = event.target;
//	    console.log('onstart: '+dragElement.id);
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
    },
        
    // call this function on every dragend event
    onend: function (event) {
      var dragElement = event.target;
	    
	    var x = (parseFloat(dragElement.getAttribute('data-x')) || 0)+12;
	    var y = (parseFloat(dragElement.getAttribute('data-y')) || 0)+12;
	    	    	  
console.log('drag: '+x + ' '+y);   

//			selectTrackFromXY(x, y);
	        
    }
  });


