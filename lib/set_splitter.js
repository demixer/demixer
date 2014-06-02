var http = require('http');
var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'snackerjack'
});
console.log(process.cwd());

// var CODEGEN_PATH = "/Users/samenglander/dev/echoprint/echoprint-codegen/echoprint-codegen";
// var SET_PATH = "/Users/samenglander/dev/echoprint/echoprint-codegen/SoWhat.mp3";

// var spawn = require('child_process').spawn,
//     codegen = spawn(CODEGEN_PATH, [SET_PATH, 0, 30]);

// codegen.stdout.on('data', function(data) {
//     //console.log('stdout: ' + data + ' gaga');
//     // var json = JSON.parse(data);
//     callEchonest(data);
// });

// codegen.stderr.on('data', function(data) {
//     console.log('stderr: ' + data);
// });

// codegen.on('close', function(code) {
//     console.log('child process exited with code ' + code);
// });

// var options = {
//     hostname: 'developer.echonest.com',
//     port: 80,
//     path: '/api/v4/song/identify?api_key=VDHOSJMVQKCWLRVW5',
//     method: 'POST',
//     headers: {
//         'content-type': 'application/octet-stream'
//     }
// };

// //--data-binary "@json_string.json"

// function callEchonest(data) {

//     var req = http.request(options, function(res) {
//         console.log('STATUS: ' + res.statusCode);
//         console.log('HEADERS: ' + JSON.stringify(res.headers));
//         res.setEncoding('utf8');
//         var body = '';
//         res.on('data', function(chunk) {
//             body += chunk;
//             console.log('BODY: ' + chunk);
//         });
//         res.on('end', function() {
//             var json = JSON.parse(body);
//             bodyprint(json);
//         });
//     });

//     req.on('error', function(e) {
//         console.log('problem with request: ' + e.message);
//     });

//     // write data to request body
//     req.write(data + '\n');
//     req.end();
// }

// function bodyprint(trackjson) {
//     console.log("gag " + trackjson.response.songs[0].title);

//     var trackTitle = trackjson.response.songs[0].title;
//     connection.query('SELECT * FROM tracks WHERE name=?', [trackTitle], function(err, rows) {
//         if (rows.length === 0) {
//             connection.query('INSERT INTO tracks (name) VALUES (?)', [trackTitle], function(err, result) {
//                 if (err) {
//                     console.log(err);
//                 } else {

//                     //console.log(result.insertId);
//                     var bob = result.insertId;
//                     connection.query('INSERT INTO set_tracks (set_id,track_id,start_time) VALUES (1,?,1)', [bob],
//                         function(err, rows) {
//                             console.log(err);
//                             connection.end();
//                         });
//                 }
//             });



//         } else {
//             console.log("duplicate" + rows[0].id);
//             var trackId = rows[0].id;
//             connection.query('INSERT INTO set_tracks (set_id,track_id,start_time) VALUES (2,?,1)', [trackId], function(err, rows) {
//                 connection.end();
//                 if (err) {
//                     console.log(err);
//                 }
//             });
//             // connection.end();
//         }
//     });
// }

var CODEGEN_PATH = "/Users/samenglander/dev/echoprint/echoprint-codegen/echoprint-codegen";
var SET_PATH = "/Users/samenglander/dev/echoprint/echoprint-codegen/Derek Plaslaiko @ Rare Form 04-04-2014.mp3";

var spawn = require('child_process').spawn;


var hi = 0;
var CHUNK = 30;

function callCodegen(duration, prevId, calc) {
    if (undefined === prevId) {
        prevId = null;
    }
    if (undefined === calc) {
        calc = 0;
    }
    var id = null;
    var fingerPrint = '';

    var codegen = spawn(CODEGEN_PATH, [SET_PATH, calc, CHUNK]);
    codegen.stdout.on('data', function(data) {
        // var trackjson = JSON.parse(data);
        fingerPrint += data;
        // console.log(data);
        //console.log(trackjson);

    });

    codegen.stderr.on('data', function(data) {
        console.log('stderr: ' + data);
    });

    codegen.on('close', function(code) {
        var callback = function(songId, songArtist, songTitle) {
            if (prevId !== songId || songId !== null) {
                console.log("| new track, save it to the database");
                console.log(songArtist);
            }

            var nextCalc = calc + CHUNK;
            if (nextCalc >= duration) {
                console.log('the last of the chunkhicans');
            } else {
                callCodegen(duration, songId, nextCalc);
            }
        };
        // console.log(fingerPrint);
        callEchonest(fingerPrint, callback);
    });
}
callCodegen(1500);

var options = {
    hostname: 'developer.echonest.com',
    port: 80,
    path: '/api/v4/song/identify?api_key=VDHOSJMVQKCWLRVW5',
    method: 'POST',
    headers: {
        'content-type': 'application/octet-stream'
    }
};

function callEchonest(data, callback) {

    var req = http.request(options, function(res) {
        // console.log('STATUS: ' + res.statusCode);
        // console.log('HEADERS: ' + JSON.stringify(res.headers));
        res.setEncoding('utf8');
        var body = '';
        res.on('data', function(chunk) {
            body += chunk;
            // console.log('BODY: ' + chunk);
        });
        res.on('end', function() {
            var trackjson = JSON.parse(body);
            var songId = null;
            var songArtist = null;
            var songTitle = null;
            if (trackjson.response.songs.length > 0) {
                songId = trackjson.response.songs[0].id;
                songArtist = trackjson.response.songs[0].artist_name;
                songTitle = trackjson.response.songs[0].title;
            }

            // bodyprint(json);
            callback(songId, songArtist, songTitle);
        });
    });

    req.on('error', function(e) {
        console.log('problem with request: ' + e.message);
    });

    // write data to request body
    req.write(data + '\n');
    req.end();
}
