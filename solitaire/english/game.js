var HOLE  = undefined;

var connections = {
	 0: {8:3, 2:1},
	 1: {9:4},
	 2: {0:1, 10:5},
	 3: {5:4, 15:8},
	 4: {16:9},
	 5: {3:4, 17:10},
	 6: {8:7, 20:13},
	 7: {9:8, 21:14},
	 8: {6:7, 0:3, 10:9, 22:15},
	 9: {7:8, 1:4, 11:10, 23:16},
	10: {8:9, 2:5, 12:11, 24:17},
	11: {9:10, 25:18},
	12: {10:11, 26:19},
	13: {15:14},
	14: {16:15},
	15: {13:14, 3:8, 17:16, 27:22},
	16: {14:15, 4:9, 18:17, 28:23},
	17: {15:16, 5:10, 19:18, 29:24},
	18: {16:17},
	19: {17:18},
	20: {6:13, 22:21},
	21: {7:14, 23:22},
	22: {20:21, 8:15, 24:23, 30:27},
	23: {21:22, 9:16, 25:24, 31:28},
	24: {22:23, 10:17, 26:25, 32:29},
	25: {23:24, 11:18},
	26: {24:25, 12:19},
	27: {15:22, 29:28},
	28: {16:23},
	29: {27:28, 17:24},	
	30: {22:27, 32:31},	
	31: {23:28},	
	32: {30:31, 24:29}	
};

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
	board         = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,HOLE,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
	pegs          = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32];
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
	// Returns valid peg id
	var movable =[];
	for (p in pegs) {
		var moves = getValidMovePositions(p)
		if (moves.length>0) {
			movable.push(p);
		}
	}
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


