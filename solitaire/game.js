var HOLE  = undefined;

var connections = {
	0: { 3:1, 5:2},
	1: { 6:3, 8:4},
	2: { 7:4, 9:5},
	3: { 0:1, 5:4, 10:6, 12:7},
	4: {11:7, 13:8},
	5: { 0:2, 3:4, 12:8, 14:9},
	6: { 1:3, 8:7},
	7: { 2:4, 9:8},
	8: { 1:4, 6:7},
	9: { 2:5, 7:8},
 10: { 3:6, 12:11},
 11: { 4:7, 13:12},
 12: { 3:7, 5:8, 10:11, 14:13},
 13: { 4:8, 11:12},
 14: { 5:9, 12:13}
}

var board         = [];
var pegs          = [];
var npegs         = undefined;
var selectedPegId = undefined;
var validHoles    = undefined;
var validPegs     = undefined;


function init()
{
	initGame();
	
	UI_createBoard();
}


function initGame()
{
	board         = [HOLE,0,1,2,3,4,5,6,7,8,9,10,11,12,13];
	pegs          = [1,2,3,4,5,6,7,8,9,10,11,12,13,14];
	npegs         = pegs.length;
	selectedPegId = undefined;
	validHoles    = undefined;
	validPegs     = getMovablePegIds();
}

function newGame()
{
	initGame();
	UI_updateBoard();
}

function selectPeg(pegId)
{	
	info('Selecting peg id '+pegId+' at position '+pegs[pegId]);
	selectedPegId = pegId;
	validHoles = getValidMovePositions(pegId);
	debug('Valid moves = '+validHoles);			
}

function selectHole(holePos)
{
	var srcPos = pegs[selectedPegId];
	var dstPos = holePos;
	var jumPos = connections[srcPos][dstPos];

	info('Moving from position '+srcPos+' over '+jumPos+' to position '+dstPos);
	
	pegs[selectedPegId]   = dstPos;           // peg is has a new location
	board[dstPos]         = selectedPegId;    // board location has new peg
	board[srcPos]         = HOLE; 	          // previous board position of peg now has a hole
	
	pegs[board[jumPos]]   = HOLE;             // peg that is being jumped over is removed
	board[jumPos]         = HOLE;             // add a hole in the board
	
	npegs--;                                  // decrease peg counter 
		
	validPegs = getMovablePegIds();
}

function getValidMovePositions(pegId)
{
	var holes = [];
		
	if (pegs[pegId]==HOLE) {
		debug('Board position '+pegs[pegId]+' has no peg');
		return holes;
	}	
	
	var pos = pegs[pegId];
	for (dst in connections[pos]) {
		if (board[dst]==HOLE) {
			if (board[connections[pos][dst]]!=HOLE) {
				holes.push(dst);
			}
		}
	}	
		
	return holes;
}

function getMovablePegIds()
{
	console.log('getMovablePegIds');

	// Returns valid peg id
	var movable =[];
	for (p in pegs) {
		var moves = getValidMovePositions(p)
		if (moves.length>0) {
			movable.push(p);
		}
	}
	console.log(movable);
	return movable;
}

/*
	------------------------------------------------
	Solution
	------------------------------------------------
	Move peg @ position  3 to  0 (jumping over  1 )
	Move peg @ position  5 to  3 (jumping over  4 )
	Move peg @ position  6 to  1 (jumping over  3 )
	Move peg @ position  0 to  5 (jumping over  2 )
	Move peg @ position 12 to  3 (jumping over  7 )
	Move peg @ position  1 to  6 (jumping over  3 )
	Move peg @ position 10 to 12 (jumping over 11 )
	Move peg @ position  9 to  7 (jumping over  8 )
	Move peg @ position  6 to  8 (jumping over  7 )
	Move peg @ position 13 to 11 (jumping over 12 )
	Move peg @ position  5 to 12 (jumping over  8 )
	Move peg @ position 11 to 13 (jumping over 12 )
	Move peg @ position 14 to 12 (jumping over 13 )
*/

// ------------------------------------------------------------------
// - Standard Utility Routines 
// ------------------------------------------------------------------

function debug(str)
{
 //	console.log('   '+str);
}

function info(str, append)
{
	console.log(str);
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


