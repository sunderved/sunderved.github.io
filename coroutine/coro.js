// Inspired from this webpage
// http://syzygy.st/javascript-coroutines/
// https://x.st/javascript-coroutines/


function coroutine(f) {
  var o = f(); // instantiate the coroutine
  o.next(); // execute until the first yield
  return function(x) {
    o.next(x);
  };
}

var clock = coroutine(function*(_) {
    while (true) {
        yield _;
        document.getElementById("text").innerHTML="0";
        yield _;
        document.getElementById("text").innerHTML="1";
        yield _;
        document.getElementById("text").innerHTML="2";
        yield _;
        document.getElementById("text").innerHTML="3";
        yield _;
        document.getElementById("text").innerHTML="4";
        yield _;
        document.getElementById("text").innerHTML="5";
        yield _;
        document.getElementById("text").innerHTML="6";
        yield _;
        document.getElementById("text").innerHTML="7";
        yield _;
        document.getElementById("text").innerHTML="8";
        yield _;
        document.getElementById("text").innerHTML="9";                
    }
});

function init() {  
  clock();
  setInterval(clock, 1000); // This resumes the coroutine once every 1000ms, and it will tick and tock for eternity.
}

