	  
var Morning = [1,2,3,4,5,7,9,10,11,12,17,18,19];
var Midday  = [6,8,13,14,15,16,20,21,22,23,25,26,27,28,29,30,31,32,33,34,35];
var Dusk    = [24,36,37,38,39,40,41,42,43,44,45,46,47,48,49];  	

var cards = new Array(50);

cards[0] = { 
	name: 'Ottoman Turkey Enters the War', 
	event:EnterWar, 
	advance: [], 
	actions:0,
  text: undefined};
cards[1] = {
  name:'Intelligence Bureau Of The East',
  event:IntelligenceBureau,
  advances:['Mesopotamia'],
  actions:1,
  text: undefined};
cards[2] = {
  name:'Goeben Dominates The Black Sea',
  event:GoebenDominates,
  advances:['Arab', 'Sinai'],
  actions:2,
  text: undefined};
cards[3] = {
  name:'Jihad Declared',
  event:JihadDeclared,
  advances:['Caucasus', 'Mesopotamia', 'Sinai'],
  actions:3,
  text: '+1 to all Offensives'};
cards[4] = {
  name:'Enver To The Front',
  event:EnverToTheFront,
  advances:['Caucasus', 'Sinai'],
  actions:2,
  text: 'Both actions must be used in Offensives against Caucasus'};
cards[5] = {
  name:'Ghadar Conspiracy',
  event:GhadarConspiracy,
  advances:['Arab', 'Gallipoli', 'Caucasus'],
  actions:2,
  text: undefined};
cards[6] = {
  name:'Wassmuss In Persia',
  event:WassmussInPersia,
  advances:['Caucasus', 'Gallipoli'],
  actions:2,
  text: undefined};
cards[7] = {
  name:'Turkish Minelaying',
  event:TurkishMinelaying,
  advances:['Arab', 'Caucasus'],
  actions:2,
  text: '+1 vs Mesopotamia'};
cards[8] = {
  name:'Forcing The Narrows',
  event:ForcingTheNarrows,
  advances:['Arab', 'Caucasus'],
  actions:2,
  text: undefined};
cards[9] = {
  name:'Armenian Volunteer Units',
  event:ArmenianVolunteerUnits,
  advances:['Arab', 'Caucasus', 'Sinai'],
  actions:2,
  text: undefined};
cards[10] = {
  name:'Second Battle Of Ypres',
  event:SecondBattleofYpres,
  advances:['Caucasus', 'Sinai'],
  actions:1,
  text: undefined};
cards[11] = {
  name:'Gallipoli Landing',
  event:GallipoliLanding,
  advances:['Arab', 'Caucasus'],
  actions:2,
  text: undefined};
cards[12] = {
  name:'Gorlice Tarnow',
  event:GorliceTarnow,
  advances:['Caucasus', 'Sinai'],
  actions:3,
  text: undefined};
cards[13] = {
  name:'Italy Joins The War',
  event:ItalyJoinsTheWar,
  advances:['Arab', 'Salonika'],
  actions:2,
  text: undefined};
cards[14] = {
  name:'German U-Boats In The Mediterranean',
  event:GermanUboats,
  advances:['Caucasus', 'Sinai'],
  actions:2,
  text: '+1 vs Gallipoli and Salonika'};
cards[15] = {
  name:'Armenian Massacre',
  event:ArmenianMassacre,
  advances:['Gallipoli', 'Salonika', 'Sinai'],
  actions:3,
  text: 'No Offensives vs Caucasus this turn'};
cards[16] = {
  name:'Suvla Landing',
  event:SuvlaLanding,
  advances:['Caucasus', 'Gallipoli', 'Sinai'],
  actions:2,
  text: undefined};
cards[17] = {
  name:'Grand Duke Nicholas Takes Control',
  event:GrandDukeNicholasTakesControl,
  advances:['Mesopotamia', 'Gallipoli', 'Salonika'],
  actions:3,
  text: undefined};
cards[18] = {
  name:'Bulgaria Joins The Central Powers',
  event:BulgariaJoinsTheCentralPowers,
  advances:['Mesopotamia', 'Sinai'],
  actions:1,
  text: undefined};
cards[19] = {
  name:'Senussi Revolt',
  event:SenussiRevolt,
  advances:['Mesopotamia', 'Gallipoli'],
  actions:2,
  text: undefined};
cards[20] = {
  name:'Landing At Salonika',
  event:LandingAtSalonika,
  advances:['Caucasus'],
  actions:1,
  text: undefined};
cards[21] = {
  name:'Central Powers Meddling In Afghanistan',
  event:CentralPowersMeddlingInAfghanistan,
  advances:['Caucasus', 'Mesopotamia', 'Sinai'],
  actions:3,
  text: undefined};
cards[22] = {
  name:'Fortification Of Gaza-Beersheba Line',
  event:FortificationofGazaBeershebaLine,
  advances:['Arab', 'Mesopotamia', 'Salonika'],
  actions:2,
  text: undefined};
cards[23] = {
  name:'Sinai Pipeline',
  event:SinaiPipeline,
  advances:['Gallipoli', 'Salonika'],
  actions:1,
  text: undefined};
cards[24] = {
  name:'Gallipoli Evacuation',
  event:GallipoliEvacuation,
  advances:['Mesopotamia', 'Sinai'],
  actions:2,
  text: undefined};
cards[25] = {
  name:'Erzurum Offensive',
  event:ErzurumOffensive,
  advances:['Caucasus'],
  actions:2,
  text: 'No Offensives vs Caucasus this turn'};
cards[26] = {
  name:'Verdun',
  event:Verdun,
  advances:['Caucasus', 'Mesopotamia'],
  actions:1,
  text: undefined};
cards[27] = {
  name:'Mesopotamian Siege',
  event:MesopotamianSiege,
  advances:['Caucasus', 'Salonika'],
  actions:1,
  text: undefined};
cards[28] = {
  name:'Jutland',
  event:Jutland,
  advances:['Gallipoli', 'Mesopotamia', 'Salonika'],
  actions:2,
  text: undefined};
cards[29] = {
  name:'Brusilov Offensive',
  event:BrusilovOffensive,
  advances:['Salonika'],
  actions:1,
  text: undefined};
cards[30] = {
  name:'Asia Korps',
  event:AsiaKorps,
  advances:['Mesopotamia'],
  actions:3,
  text: undefined};
cards[31] = {
  name:'The Somme',
  event:TheSomme,
  advances:['Gallipoli', 'Salonika'],
  actions:1,
  text: undefined};
cards[32] = {
  name:'Arab Revolt',
  event:ArabRevolt,
  advances:['Mesopotamia', 'Sinai'],
  actions:2,
  text: undefined};
cards[33] = {
  name:'Yudenich Named Commander In Chief',
  event:YudenichNamedCommanderInChief,
  advances:['Arab', 'Mesopotamia'],
  actions:2,
  text: undefined};
cards[34] = {
  name:'Yildirim',
  event:Yildirim,
  advances:['Caucasus', 'Salonika'],
  actions:1,
  text: undefined};
cards[35] = {
  name:'Provisional Government Takes Charge',
  event:ProvisionalGovernmentTakesCharge,
  advances:['Gallipoli', 'Salonika', 'Sinai'],
  actions:2,
  text: undefined};
cards[36] = {
  name:'Sandstorms',
  event:Sandstorms,
  advances:['Arab'],
  actions:1,
  text: 'No Offsensives vs Retreated Front'};
cards[37] = {
  name:'King Constantine Flees Greece',
  event:KingConstantineFleesGreece,
  advances:['Caucasus', 'Gallipoli', 'Salonika'],
  actions:3,
  text: '-1 vs Salonika'};
cards[38] = {
  name:'U-Boat Campaign',
  event:UboatCampaign,
  advances:['Arab', 'Mesopotamia', 'Sinai'],
  actions:3,
  text: undefined};
cards[39] = {
  name:'Affenby Takes The Helm',
  event:AffenbyTakesTheHelm,
  advances:['Arab', 'Caucasus'],
  actions:2,
  text: undefined};
cards[40] = {
  name:'Lawrence Stirs The Arabs',
  event:LawrenceStirsTheArabs,
  advances:['Caucasus'],
  actions:1,
  text: undefined};
cards[41] = {
  name:'War Weariness Set In',
  event:WarWeariness,
  advances:[],
  actions:0,
  text: undefined};
cards[42] = {
  name:'Hoffman Offensive',
  event:HoffmanOffensive,
  advances:['Arab', 'Sinai'],
  actions:3,
  text: '+1 vs Caucasus'};
cards[43] = {
  name:'Bolshevik Revolution',
  event:BolshevikRevolution,
  advances:['Arab', 'Salonika', 'Sinai'],
  actions:2,
  text: undefined};
cards[44] = {
  name:'Balfour Declaration',
  event:BalfourDeclaration,
  advances:['Arab', 'Gallipoli', 'Mesopotamia'],
  actions:2,
  text: '+1 vs Sinai'};
cards[45] = {
  name:'Sykes-Picot Agreement Divulged',
  event:SykesPicotAgreementDivulged,
  advances:['Salonika', 'Mesopotamia'],
  actions:2,
  text: '+1 vs Sinai and Arab Fronts'};
cards[46] = {
  name:'Kaiserschlacht',
  event:Kaiserschlacht,
  advances:['Caucasus', 'Mesopotamia'],
  actions:4,
  text: '+1 to all Offensives including Kaiserchlacht'};
cards[47] = {
  name:'Army Of Islam',
  event:ArmyOfIslam,
  advances:['Arab', 'Mesopotamia', 'Sinai'],
  actions:2,
  text: '+1 to all Offensives'};
cards[48] = {
  name:'Dunsterforce',
  event:Dunsterforce,
  advances:['Arab', 'Sinai'],
  actions:2,
  text: undefined};
cards[49] = {
  name:'Vittorio Veneto',
  event:VittorioVeneto,
  advances:['Arab', 'Gallipoli', 'Salonika'],
  actions:3,
  text: undefined};
