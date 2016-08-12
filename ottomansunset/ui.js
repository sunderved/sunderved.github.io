
// ------------------------------------------------------------------
// - UI Display Routines 
// ------------------------------------------------------------------


function UI_showCard(c) 
{	
	
  UI_infoClear();
	
	var card =	document.getElementById('card');
	
	card.classList.add('visible');
	card.classList.remove('visible');
	
   setTimeout(function () {
		card.innerHTML='<BR>';
		card.innerHTML+=c.name+'<BR>';
		card.innerHTML+='<BR>';
		card.innerHTML+='Offensives:<BR>';
		for (front of c.advance) {
			card.innerHTML+=front+'<BR>';
		}	
		if (c.special) {
			card.innerHTML+='<BR>'+c.special;			
		}
	   
		card.classList.remove('visible');
		card.classList.add('visible');      
		
		document.getElementById('yes').style.visibility='hidden';	
		document.getElementById('no').style.visibility='hidden';	
		document.getElementById('ok').style.visibility='visible';	
		document.getElementById('d6').style.visibility='hidden';		
		
   }, 1000);		
}

function UI_showEvent(c) 
{	
  UI_infoClear();
	UI_info('Event: '+c.name);
	document.getElementById('yes').style.visibility='hidden';	
	document.getElementById('no').style.visibility='hidden';	
	document.getElementById('ok').style.visibility='visible';	
	document.getElementById('d6').style.visibility='hidden';			
}

function UI_showBattle(battle, theatre, value, d6, outcome)
{
  UI_infoClear();
	UI_info('Fighting '+battle+' ('+value+') battle on the '+theatre+' theatre');
  setTimeout(function () {
			UI_info(theatre+' theatre DRM: +'+game.Theatre[theatre]);
			UI_info('War Weariness DRM: +'+game.WarWeariness);
	   }, 1000);		
  setTimeout(function () {
		UI_info('Dice roll: '+d6);
	   }, 2000);		
  setTimeout(function () {  	
		UI_info('Result: '+outcome);
	   }, 3000);		
  setTimeout(function () {  		
		document.getElementById('yes').style.visibility='hidden';	
		document.getElementById('no').style.visibility='hidden';	
		document.getElementById('ok').style.visibility='visible';	
		document.getElementById('d6').style.visibility='hidden';			
	   }, 3500);		
}	

function UI_showAttritionRoll(type, d6, success)
{
	UI_info(type+' Attrition Roll');
  setTimeout(function () {
		UI_info('Dice roll: '+d6);
	   }, 1000);		
  setTimeout(function () {  	
		UI_info((success?'SUCCESS':'Failed'));
	   }, 2000);		
  setTimeout(function () {  		
		document.getElementById('yes').style.visibility='hidden';	
		document.getElementById('no').style.visibility='hidden';	
		document.getElementById('ok').style.visibility='visible';	
		document.getElementById('d6').style.visibility='hidden';			
	   }, 2500);		
}


// function UI_rollDice(compare, threshold)
// {
// 	d6 = rollDice();
// 	success = compare(d6, threshold);
// 	document.getElementById('d6').innerHTML=d6;
// 	if (success) {
// 		UI_info('Dice = '+d6+', roll successfull');
// 	} else {
// 		UI_info('Dice = '+d6+', roll failed');
// 	}	
// 	
// 	document.getElementById('yes').style.visibility='hidden';	
// 	document.getElementById('no').style.visibility='hidden';	
// 	document.getElementById('ok').style.visibility='hidden';	
// 	document.getElementById('d6').style.visibility='visible';	
// }

function UI_askYildirim()
{
	UI_info('Expand Yildirim token to block advance? (Y/N)');
	
	document.getElementById('yes').style.visibility='visible';	
	document.getElementById('no').style.visibility='visible';	
	document.getElementById('ok').style.visibility='hidden';	
	document.getElementById('d6').style.visibility='hidden';	
}

function UI_updateYildirim()
{
	UI_info('Advanced blocked. '+game.Yildirim+' Yildirim remaining');
	document.getElementById('v_yildirim' 		).innerHTML = game.Yildirim;          
}

function UI_updateFortifications()
{
	if (game.GazaBeershebaFortifications==0) {
		UI_info('Gaza-Beersheba Fortifications Destroyed');	
	} else {
		UI_info('Gaza-Beersheba Fortifications = '+game.GazaBeershebaFortifications);	
	}
}

function UI_updateFront(front)
{
	UI_info(front+' army moves to '+game.Front[front]);
	document.getElementById('yes').style.visibility='hidden';	
	document.getElementById('no').style.visibility='hidden';	
	document.getElementById('ok').style.visibility='visible';	
	document.getElementById('d6').style.visibility='hidden';	
	
	if (document.getElementById(front+'Army')==undefined) return;
	
	var pos = game.Front[front];
	
	if (pos!=undefined) {
		document.getElementById(front+'Army').classList.remove('inactive');
		if (pos>0) {
			document.getElementById(front+'Army').classList.remove(front+''+(pos+1));	
			document.getElementById(front+'Army').classList.add(front+''+pos);	
		} else {
			document.getElementById(front+'Army').classList.remove(front+'1');	
			document.getElementById(front+'Army').classList.add('Constantinople');	
		}
	} else {
		document.getElementById(front+'Army').classList.add('inactive');
	}
}

function UI_updateCounters()
{
	document.getElementById('v_victories' 	).innerHTML = game.Victories.length;    
	document.getElementById('v_defeats' 		).innerHTML = game.Defeats.length;      
	document.getElementById('v_stalemates' 	).innerHTML = game.Stalemates.length;    
	document.getElementById('v_western' 		).innerHTML = game.Theatre['Western'];    
	document.getElementById('v_naval' 			).innerHTML = game.Theatre['Naval'];      
	document.getElementById('v_eastern' 		).innerHTML = game.Theatre['Eastern'];    
	document.getElementById('v_weariness'   ).innerHTML = game.WarWeariness;      
	document.getElementById('v_intelligence').innerHTML = game.IntelligenceBureau;
	document.getElementById('v_yildirim' 		).innerHTML = game.Yildirim;          
	document.getElementById('v_asiakorps' 	).innerHTML = game.AsiaKorps;
		
	document.getElementById('v_uboat' 	    ).innerHTML = (game.StraitsClosed)?'Closed':'Open';		
	document.getElementById('v_pipeline' 	  ).innerHTML = (game.SinaiPipelineBuilt)?'Built':'Not<BR>Built';		
	
//	game.GazaBeershebaFortifications;
//	game.Kaiserschlacht;	
}


function UI_updateNationalWill()
{
  UI_infoClear();
	UI_info('Turkish National Will: '+game.TurkishNationalWill);
	document.getElementById('yes').style.visibility='hidden';	
	document.getElementById('no').style.visibility='hidden';	
	document.getElementById('ok').style.visibility='visible';	
	document.getElementById('d6').style.visibility='hidden';	
}

function UI_showMessage(msg)
{
}


function UI_clickedYes()
{
// 	console.log('UI_clickedYes');
	document.getElementById('yes').style.visibility='hidden';	
	document.getElementById('no').style.visibility='hidden';	
	document.getElementById('ok').style.visibility='hidden';	
	document.getElementById('d6').style.visibility='hidden';		
	os.next(true); 
}

function UI_clickedNo()
{
// 	console.log('UI_clickedNo');
	document.getElementById('yes').style.visibility='hidden';	
	document.getElementById('no').style.visibility='hidden';	
	document.getElementById('ok').style.visibility='hidden';	
	document.getElementById('d6').style.visibility='hidden';		
	os.next(false); 
}

function UI_clickedOk()
{
// 	console.log('UI_clickedOk');
	document.getElementById('yes').style.visibility='hidden';	
	document.getElementById('no').style.visibility='hidden';	
	document.getElementById('ok').style.visibility='hidden';	
	document.getElementById('d6').style.visibility='hidden';		
	os.next(); 
}

function UI_clickedDice()
{
// 	console.log('UI_clickedDice');
	document.getElementById('yes').style.visibility='hidden';	
	document.getElementById('no').style.visibility='hidden';	
	document.getElementById('ok').style.visibility='hidden';	
	document.getElementById('d6').style.visibility='hidden';	
	os.next(success); 
}




// ------------------------------------------------------------------
// - UI Touch/Click Handlers 
// ------------------------------------------------------------------

var info;



function UI_info(str)
{
	console.log(str);
	info.innerHTML+=str;
	info.innerHTML+='<BR>';
}

function UI_infoClear()
{
	info.innerHTML='';
}

function initView()
{
	info = document.getElementById('info');	
}



function createDiv(container, id, x, y, style, f) 
{
  var el;
  el = document.createElement('div');
  el.id=id;
  el.style.left = x+'px';
  el.style.top = y+'px';
  if (style!=undefined) {
  	el.className=style;
	}
  if (f!=undefined) {
	  if ("ontouchstart" in document.documentElement) {
	    el.addEventListener('touchstart', f);
	  } else {
	    el.addEventListener('click', f);
	  }   
  }        
  document.getElementById(container).appendChild(el);
  return el;
}  

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





