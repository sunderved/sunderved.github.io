/* ----------------------------------------------------------- 
Version 1.2.2 - 11/28/2017
 - Locked screen orientation on iPad
 - Upgraded to interact 1.2.6
 - Changed font to more closely ressemble SW fonts
 - Fixed issue with image loader
 - Known issue: wounds aren't properly displayed on walls

Version 1.2.1a - 11/28/2017
 - Bug fixes
 
Version 1.2.1 - 11/28/2017
 - Added support for wounds and card rotation
  ----------------------------------------------------------- */


/*

Know issues:
- The Application Cache API (AppCache) is deprecated and will be removed at a future date.  Please consider using ServiceWorker for offline support.
- Wounds aren't properly displayed on walls

*/

var imgList        = [];
var boardState     = [];
var selectedCardId = undefined;


var factions = {}
factions.Benders         = {name:"Benders"         , cards:["Tacullu", "Wall", "Gulldune", "Gwalark", "Kalal", "Sorgwen", "Kalu", "Talu", "Breaker", "Controller", "Deceiver", "MindWitch", "Parasite"] };
factions.CaveGoblins     = {name:"CaveGoblins"     , cards:["Sneeks", "Wall", "Blarf", "Krag", "Mook", "Scagg", "Reeker", "TheEater", "BeastRider", "Berserker", "Climber", "Fighter", "Slinger"] };
factions.Cloaks          = {name:"Cloaks"          , cards:["Vlox", "Wall", "Dagger", "Hawk", "Scam", "SinSin", "TheAdmiral", "Violet", "Gunner", "Scrapper", "Slasher", "Sniper", "Thief"] };  
factions.DeepDwarves     = {name:"DeepDwarves"     , cards:["Tundle", "Wall", "DeepTroll", "Gren", "Kynder", "Lun", "Piclo", "Sprog", "BattleMage", "Crossbowman", "GemMage", "Miner", "Scholar"] };
factions.FallenKingdom   = {name:"FallenKingdom"   , cards:["RetTalus", "Wall", "Anica", "Dragos", "ElutBal", "Skhull", "Cultist", "Phantom", "Reaper", "Reaver", "SkeletalArcher", "ZombieWarrior"] };  
factions.Filth           = {name:"Filth"           , cards:["TheDemagogue", "Wall", "Her", "TheAbomination", "Vomitus", "AbsorptionMutant", "Anointed", "BestialMutant", "ClawMutant", "CorpulentMutant", "Cultist", "EdibleMutant", "HorrorMutant", "IncanterMutant", "SpellsuckerMutant", "SpewMutant", "StonefleshMutant", "TentacleMutant", "VoidMutant", "WingedMutant", "Zealot"] };  
factions.GuildDwarves    = {name:"GuildDwarves"    , cards:["Oldin", "Wall", "Baldar", "Gror", "Grungor", "Halvor", "Thorkur", "Tordok", "Ballista", "Defender", "Engineer", "Guardsman", "Spearman"] };  
factions.JungleElves     = {name:"JungleElves"     , cards:["AbuaShi", "Wall", "Kadara", "MakeindaRu", "MitiMumway", "Shikwa", "Archer", "Elephant", "Gorilla", "JungleGuard", "Lioneer", "Lioness"] };  
factions.Mercenaries     = {name:"Mercenaries"     , cards:["Rallul", "Wall", "Duggle", "Etch", "Grubs", "Hulgorad", "KhanQueso", "Khexhu", "Kogar", "Magos", "Malevolence", "Mundol", "NaanNashi", "Rath", "Rygos", "Saella", "Sairook", "TheSeer", "Urick", "ApprenticeMage", "Bounder", "BowGrounder", "DemonHand", "OwlFamiliar", "Rogue", "RuneMage", "SpearGrounder", "StoneGolem", "Stonecloak", "SwordGrounder", "TimeMage", "Vermin"] };
factions.MountainVargath = {name:"MountainVargath" , cards:["Sunderved", "Wall", "Bellor", "Growden", "Luka", "Quen", "Torodin", "Varn", "Brute", "Rusher", "StormMage", "Warden", "Warrior"] };
factions.PhoenixElves    = {name:"PhoenixElves"    , cards:["PrinceElien", "Wall", "FireDrake", "Holleas", "Kaeseeall", "Laleya", "Maelena", "Rahlee", "Archer", "Fencer", "FireBeast", "Guardian", "Warrior"] };
factions.SandGoblins     = {name:"SandGoblins"     , cards:["Krusk", "Wall", "Biter", "Kreep", "SandWyrm", "Silts", "Stink", "Tark", "Bomber", "Javelineer", "Scavenger", "Shaman", "Slayer"] };
factions.ShadowElves     = {name:"ShadowElves"     , cards:["Selundar", "Wall", "Hydrake", "Kuldrid", "Malidala", "Melek", "Taliya", "Xaserbane", "BladeMaster", "Hunter", "Ranger", "Scout", "Swordsman"] };
factions.SwampOrcs       = {name:"SwampOrcs"       , cards:["Mugglug", "Wall", "Blerg", "Glarg", "Glurp", "Murk", "Splack", "Splub", "Conjurer", "Hunter", "Savager", "Shaman", "SwampBeast"] };
factions.TundraOrcs      = {name:"TundraOrcs"      , cards:["Grognack", "Wall", "Blagog", "Bragg", "Gruggar", "Krung", "Ragnor", "Rukar", "Charger", "Fighter", "Shaman", "Smasher", "Thwarter"] };
factions.Vanguards       = {name:"Vanguards"       , cards:["SeraEldwyn", "Wall", "Archangel", "ColeenBrighton", "JacobEldwyn", "KalonLightbringer", "LeahGoodwin", "RaechelLoveguard", "Angel", "CavalryKnight", "GuardianKnight", "Priest", "StalwartArcher"] };   

function createCard(faction, cardname, wounds, opponent, position)
{
  // --------------------------------------------------------
  // Update UI
  // --------------------------------------------------------   
  var div;
  if( document.getElementById('new').childNodes.length == 0 ) {                                               
    // if there isn't already an card ready create one 
    // create div
    div = document.createElement('div');
    div.id = imgList.length;
    // set the card properties (image and style)
    div.classList.add('draggable');
    div.classList.add('tappable');
    div.classList.add('card');
    div.classList.add('cardsize');    
    // create card image inside new div
    img = document.createElement('img');
    img.id = div.id+'img';
    img.classList.add('card');
    img.classList.add('cardsize'); 
    div.appendChild( img );
    // create wound image inside new div
    wnd = document.createElement('img');
    wnd.id = div.id+'wnd';
    wnd.classList.add('card');
    wnd.classList.add('cardsize');
    div.appendChild( wnd );

  	imgList.push(div);	
    document.getElementById('new').appendChild(div); 
  } else {
    // otherwise grab the reference to the existing card 
    div = document.getElementById('new').childNodes[0];
  }

  // set card image
  document.getElementById(div.id+'img').src = UI_getImagePath(faction, cardname); 
  // set wounds image
  document.getElementById(div.id+'wnd').src = UI_getWoundPath(wounds);
  // rotate card is it belongs to opponent
  div.classList.toggle('opponent', opponent);
  // put card in the specified position
  document.getElementById(position).appendChild(div); 	

  // --------------------------------------------------------
  // Update DB
  // --------------------------------------------------------  
  // create or update corresponding entry in boardState DB
  var info = {};
  info.position = position;
  info.faction = faction;
  info.card = cardname;
  info.wounds = wounds;  
  info.opponent = opponent;
  boardState[div.id] = info;
  saveBoardState(); 
}

function updateCardPosition(cardId, position)
{
  // --------------------------------------------------------
  // Update DB
  // --------------------------------------------------------  
  var prev_position = boardState[cardId].position;
  var card          = boardState[cardId];

  if (prev_position=='new') {
    if (position.charAt(4)<4) {
      console.log('Moving new card on opponent side of battlefield');
      card.opponent = true;
    } else {
      console.log('Moving new card on friendly side of battlefield');
      card.opponent = false;
    }
  }
  if (position=='new') {
    if (cardId>=0) {
      console.log('Card '+cardId+' removed from board');	
    } else {
      console.log('Card not moved to board')
    }
    card.opponent = false;
  } else {
    console.log('Card '+cardId + ' has been dropped in ' + position);	
  }
  card.position = position;
  saveBoardState();

  // --------------------------------------------------------
  // Update UI
  // --------------------------------------------------------
  // get div corresponding to specific card
  var cardDiv  = document.getElementById(cardId);
  // rotate card if it belongs to opponent
  cardDiv.classList.toggle('opponent', card.opponent);
  // put card in the specified position
  document.getElementById(position).appendChild(cardDiv);  
}

function updateCardWounds(cardId, delta)
{
  // --------------------------------------------------------
  // Update DB
  // --------------------------------------------------------  
  boardState[cardId].wounds = Math.max(0, Math.min(9, boardState[cardId].wounds+delta));
  saveBoardState();

  // --------------------------------------------------------
  // Update UI
  // --------------------------------------------------------
  // set wounds image
  document.getElementById(cardId+'wnd').src = UI_getWoundPath(boardState[cardId].wounds);  
}

function updateCardOwner(cardId)
{
  // --------------------------------------------------------
  // Update DB
  // --------------------------------------------------------  
  boardState[cardId].opponent = !boardState[cardId].opponent;
  saveBoardState();

  // --------------------------------------------------------
  // Update UI
  // --------------------------------------------------------
  // rotate card if it belongs to opponent
  document.getElementById(cardId).classList.toggle('opponent', boardState[cardId].opponent); 
}

function saveBoardState()
{
  localStorage.setItem('sw-scratchpad-boarstate', JSON.stringify(boardState));	
}

function loadBoardState()
{
  var loaded = JSON.parse(localStorage.getItem('sw-scratchpad-boarstate'));

  clearBoardState();	

  for (el of loaded)
  {
    console.log('Loading '+el.card+' at position '+el.position);
    createCard(el.faction, el.card, el.wounds, el.opponent, el.position);
  }

  UI_loadFaction( factions.Benders );     

  saveBoardState();
}

function clearBoardState()
{
  console.log('Clearing board state');
  for (el of imgList) 
  {
    el.parentNode.removeChild(el);
  }
  imgList        = [];
  boardState     = [];
  selectedCardId = undefined;

  saveBoardState();
}


function init() 
{
  UI_createBoard();
  UI_preloadImages();

  loadBoardState();
}


// --------------------------------------------------------
// UI function
// --------------------------------------------------------

function UI_getImagePath(faction, card)
{
  return '../images/'+faction+'-'+card+'.png';
}

function UI_getWoundPath(wounds)
{
  return '../images/wounds/wounds-'+wounds+'.png';
}

function UI_createBoard() 
{
  var space, id;
  var board = document.getElementById('board');

      
  for (var y=0; y<8; y++) {
    for (var x=0; x<6; x++) {
      var id = 'div'+x+y;
      var space = document.createElement("div");
      space.id=id;
      space.classList.add('cardspace');
      space.classList.add('cardsize');
      space.classList.add('dropzone');
      board.appendChild(space);
    }
  }      
}

function UI_preloadImages() 
{  
  var images = [];
  for (name in factions)
  {
    var faction = factions[name];
    for (card of faction.cards) {
      var tmp = new Image();
      tmp.src = UI_getImagePath(faction.name, card);
      images.unshift(tmp);      
    }
  }
  for (var i=0; i<10; i++) {
    var tmp = new Image();
    tmp.src = UI_getWoundPath(i);
    images.unshift(tmp);      
  }
  
  var imgCount  = images.length;
  var imgLoaded = 0;

  for(var i=0; i<imgCount; i++){
      images[i].onload = function(){
        imgLoaded++;
        var cmp = Math.round(100*imgLoaded/imgCount);
        console.log(' loading '+ cmp +'%');
        document.getElementById("loadermsg").innerHTML ='Summoner Wars Scratchpad<BR>';
        document.getElementById("loadermsg").innerHTML+='<BR>';
        document.getElementById("loadermsg").innerHTML+='Loading...<BR>';
        document.getElementById("loadermsg").innerHTML+='Progress ' + cmp + '%<BR>';        
        if(imgLoaded == imgCount){
          console.log('All images loaded!');
          document.getElementById("loader").style.visibility='hidden';
          document.getElementById("container").style.visibility='visible';          
        }
      }
  }
}

function UI_loadFaction(faction)
{  
  var cardlist = document.getElementById("units");

  // clear the contents of the 'units' div
  cardlist.innerHTML='';
  
  // create a new list of cards
  //cardlist.addEventListener("click", cardListClickHandler);
  
  // add list items
  for (var i=0; i<faction.cards.length; i++) {
    var li = document.createElement('li'); 
    li.setAttribute('data-faction', faction.name); 
    li.innerHTML = faction.cards[i];
    cardlist.appendChild(li);
  }
  
  // by default, prepare the faction summoner card
  createCard(faction.name, faction.cards[0], 0, false, 'new');
}


function UI_hideActions()
{
  document.getElementById('actions').classList.toggle('visible', false);  
}


// --------------------------------------------------------
// UI event handling callbacks
// --------------------------------------------------------

function selectCardForAction(cardId)
{
  selectedCardId = cardId;  
  console.log('Selected card '+selectedCardId);
  
  // show the action menu
  document.getElementById('actions').classList.toggle('visible', true);
}

function actionClickHandler(event) 
{  
  if (event.target.tagName=="LI") {
    if (selectedCardId !== undefined) {
      var action = event.target.getAttribute('data-action-id');
      switch (action)  {
        case '1': console.log('Adding a wound'); updateCardWounds(selectedCardId, +1); break;
        case '2': console.log('Removing a wound'); updateCardWounds(selectedCardId, -1); break;
        case '3': console.log('Switching unit ownership'); updateCardOwner(selectedCardId); break;
        case '4': console.log('Close menu'); UI_hideActions(); break;
        default: console.log('Invalid selection '+action); break;
      }
    }
  } 
}

function cardListClickHandler(event) 
{  
  if (event.target.tagName=="LI") {
    var faction = event.target.getAttribute('data-faction');
    var unit    = event.target.innerHTML; 
    createCard(faction, unit, 0, false, 'new');   
    UI_hideActions();     
  } 
}    

function summonerSelectHandler(event) 
{
  UI_loadFaction( factions[event.target.value] );  
  UI_hideActions();   
}



// When the manifest file has changed and the browser has updated the files, 
// it won’t use them for the current session. The application must be reloaded 
window.applicationCache.addEventListener('updateready', function(e) {
	if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
	  // A changed manifest file has been found and downloaded by
	  // the browser. Swap cache and reload the page to use the new files.
	  document.getElementById("loader").innerHTML+='A changed manifest file has been found and downloaded. Reloading app<br>';
	  console.log('A changed manifest file has been found and downloaded. Reloading app');
	  window.applicationCache.swapCache();
	  //window.location.reload();
	  if (confirm('A new version of this site is available. Load it?')) {
			window.location.reload();
	  }	  
	}
}, false);
