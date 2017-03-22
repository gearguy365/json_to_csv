var express = require('express');
var app = express();

app.get('/delayed', function (req, res, next) {
    console.log('received request');
    console.log('going to sleep now for 10 seconds');

    setTimeout(function() {
        console.log('woke up from sleep, sending response');
        res.send('delayed response');
    }, 10000);

});

app.get('/instant', function (req, res, next) {
    console.log('received request for instant response');
    console.log('sending instant response');
    res.send('instant response');
});

app.listen(3000, function () {
    console.log('App listening on port 3000!');
});

// function simulateLongRunningTask(duration) {
//     return new Promise(function (resolve, reject) {
//         setTimeout(function () {
//             resolve();
//         }, duration);
//     });
// }

// function simulateHugeMathCalc(degree) {

//     return new Promise(function (resolve, reject) {
//         var a = [];
//         for (var i = 0; i < degree * 10000; i++) {
//             a.push(Math.random() * 10);
//         }

//         for (var x = 0; x < a.length; x++) {
//             for (var y = x + 1; y < a.length; y++) {
//                 if (a[y] > a[x]) {
//                     var temp = a[y];
//                     a[y] = a[x];
//                     a[x] = temp;
//                 }
//             }
//         }
//         resolve();
//     });

// }