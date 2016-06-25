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
	    	    	  
			var A, B;
	    	    
	    if (isEven( Math.round((2*y)/43.3013)) ) {
		    y = Math.round( y/43.3013 );
			  x = (x-25)/50;		    
			  if (isEven(y) == false) x = x-0.5;
			  x = Math.round(x);
				A = (y*18+x);
				B = (y*18+x+1);
		    console.log('H Move: '+'V'+A+' -> '+'V'+B);	
	    } else {
		    y = Math.round( (y-21.65)/43.3013 );
			  x = Math.round((x-12.5)/25);		    
			  if (isEven(y)) {
		    	if (isEven(x)) {	
			    	x = Math.round(x/2);
						A = (y*18+x);
						B = ((y+1)*18+x);
			    	console.log('D EE \\ Move: '+x+','+y+' -> '+x+','+(y+1));	
		    		console.log('D EE \\ Move: '+'V'+A+' -> '+'V'+B);	
		    	} else {
			    	x = Math.round(x/2);
						A = (y*18+x);
						B = ((y+1)*18+x-1);
			    	console.log('D EO / Move: '+x+','+y+' -> '+(x-1)+','+(y+1));	
		    		console.log('D EO / Move: '+'V'+A+' -> '+'V'+B);	
		    	}
			  } else {
		    	if (isEven(x)) {	
			    	x = Math.round(x/2);
						A = (y*18+x);
						B = ((y+1)*18+x);
			    	console.log('D OE / Move: '+x+','+y+' -> '+x+','+(y+1));	
		    		console.log('D OE / Move: '+'V'+A+' -> '+'V'+B);	
		    	} else {
			    	x = Math.round(x/2);
						A = (y*18+x-1);
						B = ((y+1)*18+x);
			    	console.log('D OO \\ Move: '+(x-1)+','+y+' -> '+x+','+(y+1));	
		    		console.log('D OO \\ Move: '+'V'+A+' -> '+'V'+B);	
		    	}
			  }
	    }
	    if ((x>=0) && (x<=17)&& (y>=0) && (y<=12)) 
	    {		    
				var el = document.getElementById( arcName('V'+A,'V'+B) );
				if (el != undefined) {					    
//		    	putTrack('V'+A, 'V'+B);
	    		selectTrack(el);
	    	} else {
			    console.log('No arc there');
		    }
	    } else {
		    console.log('OOB '+x+', '+y);
	    }
	        
    }
  });


