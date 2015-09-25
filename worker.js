var started = false;
var timerResolution = 10;

var timerList = {
    "actionTimer": {"total": 10, "current": 0},
    "oneSecondTimer": {"total": 1000, "current": 0}
};

var workerTimer = function() {
    setInterval(function() {
        for (var t in timerList) {
            timerList[t].current += timerResolution;
            if (timerList[t].current >= timerList[t].total) {
                self.postMessage(t);
                timerList[t].current = 0;
            }
        }
    }, timerResolution);
};

self.addEventListener('message', function(e) {
    switch(e.data) {
        case "start":
            if (started === false) {
                workerTimer();
                started = true;
            }
    }
}, false);