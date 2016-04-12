// ------------------------------------------
//  Cache debug tips
// ------------------------------------------
// Check cache in Chrome: chrome://appcache-internals/
// Read this: http://blog.christian-heindel.de/2011/10/25/debugging-html5-offline-web-applications/
// Code from Jonathan Stark: https://jonathanstark.com/blog/debugging-html-5-offline-application-cache?filename=2009/09/27/debugging-html-5-offline-application-cache/


var cacheStatusValues = [];
cacheStatusValues[0] = 'uncached';
cacheStatusValues[1] = 'idle';
cacheStatusValues[2] = 'checking';
cacheStatusValues[3] = 'downloading';
cacheStatusValues[4] = 'updateready';
cacheStatusValues[5] = 'obsolete';

var cache = window.applicationCache;
cache.addEventListener('cached', logEvent, false);
cache.addEventListener('checking', logEvent, false);
cache.addEventListener('downloading', logEvent, false);
cache.addEventListener('error', logEvent, false);
cache.addEventListener('noupdate', logEvent, false);
cache.addEventListener('obsolete', logEvent, false);
cache.addEventListener('progress', logEvent, false);
cache.addEventListener('updateready', logEvent, false);

function logEvent(e) {
    var online, status, type, message;
    online = (navigator.onLine) ? 'yes' : 'no';
    status = cacheStatusValues[cache.status];
    type = e.type;
    message = 'online: ' + online;
    message+= ', event: ' + type;
    message+= ', status: ' + status;
    if (type == 'error' && navigator.onLine) {
        message+= ' (probably a syntax error in manifest)';
    }
    console.log(message);
}

setInterval(function(){cache.update()}, 10000);
