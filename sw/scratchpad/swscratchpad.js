
// On iPad: 980 x 735


// var h =     82; // card height
// var w =  h*1.5; // card width
// var p =      3; // padding

var newcard;
var cardlist;
var board;

function Faction (name, cards) {
  this.name = name;
  this.cards = cards;
}

var Benders         = new Faction("Benders"         , ["Tacullu", "Wall", "Gulldune", "Gwalark", "Kalal", "Sorgwen", "Kalu", "Talu", "Breaker", "Controller", "Deceiver", "MindWitch", "Parasite"] );
var CaveGoblins     = new Faction("CaveGoblins"     , ["Sneeks", "Wall", "Blarf", "Krag", "Mook", "Scagg", "Reeker", "TheEater", "BeastRider", "Berserker", "Climber", "Fighter", "Slinger"] );
var Cloaks          = new Faction("Cloaks"          , ["Vlox", "Wall", "Dagger", "Hawk", "Scam", "SinSin", "TheAdmiral", "Violet", "Gunner", "Scrapper", "Slasher", "Sniper", "Thief"] );  
var DeepDwarves     = new Faction("DeepDwarves"     , ["Tundle", "Wall", "DeepTroll", "Gren", "Kynder", "Lun", "Piclo", "Sprog", "BattleMage", "Crossbowman", "GemMage", "Miner", "Scholar"] );
var FallenKingdom   = new Faction("FallenKingdom"   , ["RetTalus", "Wall", "Anica", "Dragos", "ElutBal", "Skhull", "Cultist", "Phantom", "Reaper", "Reaver", "SkeletalArcher", "ZombieWarrior"] );  
var Filth           = new Faction("Filth"           , ["TheDemagogue", "Wall", "Her", "TheAbomination", "Vomitus", "AbsorptionMutant", "Anointed", "BestialMutant", "ClawMutant", "CorpulentMutant", "Cultist", "EdibleMutant", "HorrorMutant", "IncanterMutant", "SpellsuckerMutant", "SpewMutant", "StonefleshMutant", "TentacleMutant", "VoidMutant", "WingedMutant", "Zealot"] );  
var GuildDwarves    = new Faction("GuildDwarves"    , ["Oldin", "Wall", "Baldar", "Gror", "Grungor", "Halvor", "Thorkur", "Tordok", "Ballista", "Defender", "Engineer", "Guardsman", "Spearman"] );  
var JungleElves     = new Faction("JungleElves"     , ["AbuaShi", "Wall", "Kadara", "MakeindaRu", "MitiMumway", "Shikwa", "Archer", "Elephant", "Gorilla", "JungleGuard", "Lioneer", "Lioness"] );  
var Mercenaries     = new Faction("Mercenaries"     , ["Rallul", "Wall", "Duggle", "Etch", "Grubs", "Hulgorad", "KhanQueso", "Khexhu", "Kogar", "Magos", "Malevolence", "Mundol", "NaanNashi", "Rath", "Rygos", "Saella", "Sairook", "TheSeer", "Urick", "ApprenticeMage", "Bounder", "BowGrounder", "DemonHand", "OwlFamiliar", "Rogue", "RuneMage", "SpearGrounder", "StoneGolem", "Stonecloak", "SwordGrounder", "TimeMage", "Vermin"] );
var MountainVargath = new Faction("MountainVargath" , ["Sunderved", "Wall", "Bellor", "Growden", "Luka", "Quen", "Torodin", "Varn", "Brute", "Rusher", "StormMage", "Warden", "Warrior"] );
var PhoenixElves    = new Faction("PhoenixElves"    , ["PrinceElien", "Wall", "FireDrake", "Holleas", "Kaeseeall", "Laleya", "Maelena", "Rahlee", "Archer", "Fencer", "FireBeast", "Guardian", "Warrior"] );
var SandGoblins     = new Faction("SandGoblins"     , ["Krusk", "Wall", "Biter", "Kreep", "SandWyrm", "Silts", "Stink", "Tark", "Bomber", "Javelineer", "Scavenger", "Shaman", "Slayer"] );
var ShadowElves     = new Faction("ShadowElves"     , ["Selundar", "Wall", "Hydrake", "Kuldrid", "Malidala", "Melek", "Taliya", "Xaserbane", "BladeMaster", "Hunter", "Ranger", "Scout", "Swordsman"] );
var SwampOrcs       = new Faction("SwampOrcs"       , ["Mugglug", "Wall", "Blerg", "Glarg", "Glurp", "Murk", "Splack", "Splub", "Conjurer", "Hunter", "Savager", "Shaman", "SwampBeast"] );
var TundraOrcs      = new Faction("TundraOrcs"      , ["Grognack", "Wall", "Blagog", "Bragg", "Gruggar", "Krung", "Ragnor", "Rukar", "Charger", "Fighter", "Shaman", "Smasher", "Thwarter"] );
var Vanguards       = new Faction("Vanguards"       , ["SeraEldwyn", "Wall", "Archangel", "ColeenBrighton", "JacobEldwyn", "KalonLightbringer", "LeahGoodwin", "RaechelLoveguard", "Angel", "CavalryKnight", "GuardianKnight", "Priest", "StalwartArcher"] );   

function createboard() 
{
  var space, id;
      
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

function getImagePath(faction, card)
{
  return '../images/'+faction+'-'+card+'.png';
}

function createCard(faction, card)
{
  var img;

  if( newcard.childNodes.length == 0 ) {                                               
    // if there isn't already an card ready create one 
    img = document.createElement('img');
    newcard.appendChild( img ); 
  } else {
    // otherwise grab the reference to the existing card 
    img = newcard.childNodes[0];
  }
    
  // set the card properties (image and style)
  img.src = getImagePath(faction, card); 
  img.classList.add('draggable');
  img.classList.add('card');
  img.classList.add('cardsize');
}

var images = new Array();
function preloadImages(faction) 
{  
  for (var i=0; i<faction.cards.length; i++) {
		var tmp = new Image();
		tmp.src = getImagePath(faction.name, faction.cards[i]);
		images.unshift(tmp);
    
    if (i==0) {
      images[0].onload=function(){ document.getElementById("loader").innerHTML+='Loading '+faction.name+'<br>'; };      
    }
	}		
}

function loadFaction(faction)
{  
  // clear the contents of the 'units' div
  cardlist.innerHTML='';
  
  // create a new list of cards
  cardlist.addEventListener("click", clickHandler);
  
  // add list items
  for (var i=0; i<faction.cards.length; i++) {
    var li = document.createElement('li'); 
    li.setAttribute('data-faction', faction.name); 
    li.innerHTML = faction.cards[i];
    cardlist.appendChild(li);
  }
  
  // by default, prepare the faction summoner card
  createCard(faction.name, faction.cards[0]);
}

function init() 
{
  newcard  = document.getElementById("new");
  cardlist = document.getElementById("units");
  board    = document.getElementById('board');

  createboard();
  
  preloadImages( Benders          );
  preloadImages( CaveGoblins      );
  preloadImages( Cloaks           );
  preloadImages( DeepDwarves      );
  preloadImages( FallenKingdom    );
  preloadImages( Filth            );
  preloadImages( GuildDwarves     );
  preloadImages( JungleElves      );
  preloadImages( Mercenaries      );
  preloadImages( MountainVargath  );
  preloadImages( PhoenixElves     );
  preloadImages( SandGoblins      );
  preloadImages( ShadowElves      );
  preloadImages( SwampOrcs        );
  preloadImages( TundraOrcs       );
  preloadImages( Vanguards        );
  
  images[0].onload=function(){
    document.getElementById("loader").style.visibility='hidden';
    document.getElementById("container").style.visibility='visible';
  };
     
  loadFaction( Benders );  
}


function clickHandler(event) 
{  
  if (event.target.tagName=="LI") {
    var faction = event.target.getAttribute('data-faction');
    var unit    = event.target.innerHTML; 
    createCard(faction, unit);   
  } 
}    

function selectHandler(event) 
{
  var faction = event.target.value;  
  if (faction=="Benders"         )  loadFaction( Benders         );
  if (faction=="CaveGoblins"     )  loadFaction( CaveGoblins     );
  if (faction=="Cloaks"          )  loadFaction( Cloaks          );
  if (faction=="DeepDwarves"     )  loadFaction( DeepDwarves     );
  if (faction=="FallenKingdom"   )  loadFaction( FallenKingdom   );
  if (faction=="Filth"           )  loadFaction( Filth           );
  if (faction=="GuildDwarves"    )  loadFaction( GuildDwarves    );
  if (faction=="JungleElves"     )  loadFaction( JungleElves     );
  if (faction=="Mercenaries"     )  loadFaction( Mercenaries     );
  if (faction=="MountainVargath" )  loadFaction( MountainVargath );
  if (faction=="PhoenixElves"    )  loadFaction( PhoenixElves    );
  if (faction=="SandGoblins"     )  loadFaction( SandGoblins     );
  if (faction=="ShadowElves"     )  loadFaction( ShadowElves     );
  if (faction=="SwampOrcs"       )  loadFaction( SwampOrcs       );
  if (faction=="TundraOrcs"      )  loadFaction( TundraOrcs      );
  if (faction=="Vanguards"       )  loadFaction( Vanguards       );
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
