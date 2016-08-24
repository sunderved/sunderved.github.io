
function D6(container, name, size, background, dotcolor)
{	
 	var ps = 26.6666666666666;
 	var x1 =  6.6666666666666;
 	var x2 = 36.6666666666666;
 	var x3 = 66.6666666666666;
 		
//  	var ps = 24;
//  	var x1 =  7;
//  	var x2 = 38;
//  	var x3 = 69;	
		
	if (background===undefined) background = '#A0A0A0';
	if (dotcolor  ===undefined) dotcolor   = 'black';
				   
	this.showRoll = function(roll) 
	{
		if (roll<0) return;
		if (roll>6) return;
		
		this.show();
		
		var sequence = this.shuffle([1,2,3,4,5,6]);
		sequence.push(roll);		
		for (var i=0; i<sequence.length; i++) 
		{	
	   	setTimeout(function () {
				var v = sequence.shift();
				for (var j=0; j<7; j++) {
					document.getElementById(name+'d'+(j+1)).style.visibility=(dots[v][j]?'visible':'hidden');		
				}	
			}, (75*i));					
		}
	};
	
	this.hide = function() {
		this.div.style.display='none';
	};

	this.show = function() {
		this.div.style.display='';
	};
		
	// ----------------------------------------------------------------
	// Private members

	this.shuffle = function(array) {
	  var m = array.length, t, i;
	  // While there remain elements to shuffle
	  while (m) {
	    // Pick a remaining element
	    i = Math.floor(Math.random() * m--);
	    // And swap it with the current element.
	    t = array[m];
	    array[m] = array[i];
	    array[i] = t;
	  }  
	  return array;
	}; 	
	
	var el = document.createElement("div");
	el.id=name;
	el.style.width = size+'px';	
	el.style.height = size+'px';	
	el.style.borderRadius = '10%';	
	el.style.position = 'absolute';
	el.style.backgroundColor = background;
	el.style.boxSizing = 'border-box';
	el.style.padding = 0;
	el.style.margin = 0;
	el.style.zIndex = 1;
	document.getElementById(container).appendChild(el);     	
		
	this.createDot = function(id, x, y) {
	  var el = document.createElement("div");
	  el.id=name+''+id;
		el.style.top = y+'%';	
		el.style.left = x+'%';	
		el.style.width = ps+'%';	
		el.style.height = ps+'%';	
		el.style.borderRadius = '100%';	
		el.style.position = 'absolute';
	  el.style.backgroundColor = dotcolor;
		el.style.boxSizing = 'border-box';
	  el.style.padding = 0;
	  el.style.margin = 0;
	  el.style.zIndex = 3;   
	  el.style.visibility = 'hidden';   
		document.getElementById(name).appendChild(el);     
	};
	this.div = document.getElementById(name);
	
	
	this.createDot('d1', x1, x1);
	this.createDot('d2', x3, x1);
	this.createDot('d3', x1, x2);
	this.createDot('d4', x3, x2);
	this.createDot('d5', x1, x3);
	this.createDot('d6', x3, x3);
	this.createDot('d7', x2, x2);	
	
	var dots = [
		[0,0,0,0,0,0,0],
		[0,0,0,0,0,0,1],
		[1,0,0,0,0,1,0],
		[1,0,0,0,0,1,1],
		[1,1,0,0,1,1,0],
		[1,1,0,0,1,1,1],
		[1,1,1,1,1,1,0],
	];					 	
}