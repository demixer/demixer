var fs = require('fs');
var http = require('http');
var mysql = require('mysql');

var SOUNDCLOUD_CLIENT_ID = '9608e54a4e16b0d3f13f526ed975d8fe';
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'snackerjack'
});

function toTrack(permalink, callback) {
    http.get(permalink, function(res) {
        var trackUrl = res.headers.location;
        callback(trackUrl)
    });
}

function toDownload(track, callback) {
    http.get(track, function(res) {
        var body = '';

        res.on('data', function(chunk) {
            body += chunk;
        });

        res.on('end', function() {
            var json = JSON.parse(body);
            var downloadUrl = json.download_url + "?consumer_key=" + SOUNDCLOUD_CLIENT_ID;
            callback(downloadUrl)
        });
    });
}

function toMedia(downloadUrl, callback) {
    http.get(downloadUrl, function(res) {
        var mediaUrl = res.headers.location;
        callback(mediaUrl);
    });

}

function toSet(mediaUrl, callback) {
    http.get(mediaUrl, function(res) {
        console.log("downloading!");
        var set = fs.createWriteStream('/tmp/set.mp3');
        res.pipe(set).on('finish', function() {
            console.log('poopy pdants!');
            callback();
            //clearInterval(interval);
        });
    });
}

function asyncFunction(downloadPermalink, callback) {

    var encodedPermalink = encodeURIComponent(downloadPermalink);
    var resolveUrl = 'http://api.soundcloud.com/resolve.json?consumer_key=' + SOUNDCLOUD_CLIENT_ID + '&url=' + encodedPermalink;

        toTrack(resolveUrl, function(data) {
            if ( typeof data === "undefined") {
                console.log("aborted: stage 1");
                callback();
                return;
            }
            console.log("ok: stage 1");

            toDownload(data, function(data) {
                if ( typeof data === "undefined") {
                    console.log("aborted: stage 2");
                    callback();
                }
                console.log("ok: stage 2");

                toMedia(data, function(data) {
                    if ( typeof data === "undefined") {
                        console.log("aborted: stage 3");
                        callback();
                    }
                    console.log("ok: stage 3");

                    toSet(data, function(data) {
                        console.log("It's been taken care of!");
                        callback(true);

                    })

                })

            })

        })
}

var soundcloudUrl = null;

connection.query('SELECT * FROM urls WHERE is_downloaded=0 LIMIT 1', function(err, rows) {
    console.log(rows);
    soundcloudUrl = rows[0].id;

    if(soundcloudUrl === null) {
        console.log("there are no undownloaded URLs");
        // process.exit();
    } else {
            asyncFunction(soundcloudUrl , function(data) {
                // Anything undefined is considered an error. Fails to else.
                if(data) {
                    console.log("Set obtained!");
                } else {
                    console.log("failure, try again fatty");
                }
            }); // try with: https://soundcloud.com/d2techno/lets-go-techno-podcast-047
    }
});
connection.end();
