function init()
{
	var vi = 17;     // interval between vertical dots
	var md = vi*2    // margin between dots and borders
	var ps = vi*8    // peep size
	var ds = vi*30   // dice size
	
	var d1 = md;
	var d2 = md+vi+ps;
	var d3 = md+(vi+ps)*2;
	
	var el;
	
	el = document.getElementById('d1');
	el.style.top = d1+'px';	
	el.style.left = d1+'px';	
	el.style.width = ps+'px';	
	el.style.height = ps+'px';	
	el.style.borderRadius = ps+'px';	

	el = document.getElementById('d2');
	el.style.top = d1+'px';	
	el.style.left = d3+'px';	
	el.style.width = ps+'px';	
	el.style.height = ps+'px';	
	el.style.borderRadius = ps+'px';	
	
	el = document.getElementById('d3');
	el.style.top = d2+'px';	
	el.style.left = d1+'px';	
	el.style.width = ps+'px';	
	el.style.height = ps+'px';	
	el.style.borderRadius = ps+'px';	

	el = document.getElementById('d4');
	el.style.top = d2+'px';	
	el.style.left = d3+'px';	
	el.style.width = ps+'px';	
	el.style.height = ps+'px';	
	el.style.borderRadius = ps+'px';	
		
	el = document.getElementById('d5');
	el.style.top = d3+'px';	
	el.style.left = d1+'px';	
	el.style.width = ps+'px';	
	el.style.height = ps+'px';	
	el.style.borderRadius = ps+'px';	

	el = document.getElementById('d6');
	el.style.top = d3+'px';	
	el.style.left = d3+'px';	
	el.style.width = ps+'px';	
	el.style.height = ps+'px';	
	el.style.borderRadius = ps+'px';	

	el = document.getElementById('d7');
	el.style.top = d2+'px';	
	el.style.left = d2+'px';	
	el.style.width = ps+'px';	
	el.style.height = ps+'px';	
	el.style.borderRadius = ps+'px';	

	el = document.getElementById('dice');
	el.style.width = ds+'px';	
	el.style.height = ds+'px';	
	el.style.borderRadius = (ds/10)+'px';	

	el = document.getElementById('container');
	el.style.width = ds+'px';	
	el.style.height = ds+'px';	
						
	centerContainer();
	rollDice();
}

function roll()
{
	rollLoop(6);
}

function rollDice()
{
	var r = Math.floor(Math.random() * 6) + 1 ;
	showDots(r);
}

function rollLoop (i) {        
   setTimeout(function () {   
      rollDice();         
      i--; if (i>0) { rollLoop(i); }                       
   }, 75)
}

var dots = [
	[0,0,0,0,0,0,0],
	[0,0,0,0,0,0,1],
	[1,0,0,0,0,1,0],
	[1,0,0,0,0,1,1],
	[1,1,0,0,1,1,0],
	[1,1,0,0,1,1,1],
	[1,1,1,1,1,1,0],
];

function showDots(r)
{
	for (var i=0; i<7; i++) {
		document.getElementById('d'+(i+1)).style.visibility=(dots[r][i]?'visible':'hidden');		
	}
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