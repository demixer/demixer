var http = require('http');
var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'snackerjack'
});
console.log(process.cwd());

var CODEGEN_PATH = "/Users/samenglander/dev/echoprint/echoprint-codegen/echoprint-codegen";

var SET_PATH = "/Users/samenglander/dev/echoprint/echoprint-codegen/ingest-techno/iobacktonormall.mp3";

// 01-va-fabric_31__mixed_by_marco_carola-mpx.mp3
// var SET_PATH = "/Users/samenglander/dev/echoprint/echoprint-codegen/128295_Io_Original_Mix.mp3";

var spawn = require('child_process').spawn;


var hi = 0;
var CHUNK = 40;

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
            console.log(typeof(songId));
            if (prevId !== songId && songId !== null) {
                // console.log("| new track, save it to the database");
                // connection.query("INSERT INTO tracks (artist, name) VALUES (?, ?)", [songArtist, songTitle], function(err, rows) {
                //     if (rows) {
                //         console.log("track saved!");
                //     }
                // });
                connection.query('SELECT * FROM tracks WHERE artist=? AND name=?', [songArtist, songTitle], function(err, rows) {
                    if (err) {
                        console.log(err);
                    }
                    if (rows.length === 0) {
                        connection.query('INSERT INTO tracks (artist, name) VALUES (?, ?)', [songArtist, songTitle], function(err, result) {
                            if (err) {
                                console.log(err);
                            } else {
                                //console.log(result.insertId);
                                var bob = result.insertId;
                                connection.query('INSERT INTO set_tracks (set_id,track_id,start_time) VALUES (2,?,1)', [bob],
                                    function(err, rows) {
                                        console.log("rb");
                                        console.log(err);
                                        //connection.end();
                                    });

                            }
                        });
                    } else {
                        console.log("duplicate of track id: " + rows[0].id);
                        console.log("duplicate of track id: " + rows[0].artist);
                        console.log("duplicate of track id: " + rows[0].name);
                        var trackId = rows[0].id;
                        connection.query('INSERT INTO set_tracks (set_id,track_id,start_time) VALUES (2,?,1)', [trackId], function(err, rows) {
                            //connection.end();
                            if (err) {
                                console.log(err);
                            }
                        });
                        // connection.end();
                    }
                });
            }

            var nextCalc = calc + CHUNK;
            if (nextCalc >= duration) {
                console.log('the last of the chunkhicans');
            } else {
                console.log(" going to next chunk ");
                console.log(duration + " , " + songId + " , " + nextCalc);
                callCodegen(duration, songId, nextCalc);
            }
        };

        var jsonjson = JSON.parse(fingerPrint);
        callEchonest(jsonjson[0].code, callback);
    });
}
//2280

//2085
//195
callCodegen(400, null, 10);
// callCodegen(400, null, 10); An offset of 10 is the only way I've been able to get Matt John ID'd. And positive id seems to be the case only for the first chunk! Why?

var goodchunk = 0;
var badchunk = 0;

function callEchonest(data, callback) {

    var req = http.get("http://localhost:8080/query?fp_code="+data, function(res) {
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
            console.log(trackjson);

            var songId = null;
            var songArtist = null;
            var songTitle = null;



            if(!trackjson.match)
            {
                console.log("no id " + trackjson.message);

            } else {
                console.log(trackjson.track_id);
            }

            if(trackjson.message == "OK (match type 6)") 
            {
                goodchunk++;
            }

            if(trackjson.message == "no results found (type 7)") 
            {
                badchunk++;
            }

            console.log("goodchunks = " + goodchunk);
            console.log("badchunks = " + badchunk);

            // if (trackjson.response.songs.length > 0) {
            //     songId = trackjson.response.songs[0].id;
            //     songArtist = trackjson.response.songs[0].artist_name;
            //     songTitle = trackjson.response.songs[0].title;
            // }


            // bodyprint(json);

            // (function(){
                // console.log("no op")
            // })();
            callback(songId, songArtist, songTitle);
        });
    });

    req.on('error', function(e) {
        console.log('problem with request: ' + e.message);
    });

    // write data to request body
    // console.log(data);

    // THIS MIGHT NOT BE PART OF OUR CURRENT CODE> !!!
    req.write("fp_code=" + data);
    req.end();
}
