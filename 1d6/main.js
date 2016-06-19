function init()
{
	centerContainer();
	showDots(1);
}

function roll()
{
	rollLoop(6);
}

function rollDice()
{
	var r = Math.floor(Math.random() * 6) + 1 ;
	console.log('rolled '+r);
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