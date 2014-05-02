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
    var encodedPermalink = encodeURIComponent(permalink);
    // console.log(encodedPermalink);
    var resolveUrl = 'http://api.soundcloud.com/resolve.json?consumer_key=' + SOUNDCLOUD_CLIENT_ID + '&url=' + encodedPermalink;
    http.get(resolveUrl, function(res) {
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
            var duration = json.duration;
            // console.log(duration);
            callback(downloadUrl, duration)
        });
    });
}

function toMedia(downloadUrl, duration, callback) {
    http.get(downloadUrl, function(res) {
        var mediaUrl = res.headers.location;
        callback(mediaUrl, duration);
    });

}

function toSet(mediaUrl, duration, callback) {
    http.get(mediaUrl, function(res) {
        console.log("downloading!" + duration);
        var set = fs.createWriteStream('/tmp/set.mp3');
        res.pipe(set).on('finish', function() {
            console.log('poopy pdants!');
            callback(duration);
            //clearInterval(interval);
        });
    });
}

function downloadPermalink(permalink, callback) {
    toTrack(permalink, function(data) {
        if ( typeof data === "undefined") {
            console.log("aborted: stage 1");
            callback();
            return;
        }
        console.log("ok: stage 1");

        toDownload(data, function(data, duration) {
            if ( typeof data === "undefined") {
                console.log("aborted: stage 2");
                callback();
            }
            console.log("ok: stage 2");

            toMedia(data, duration, function(data, duration) {
                if ( typeof data === "undefined") {
                    console.log("aborted: stage 3");
                    callback();
                }
                console.log("ok: stage 3");

                toSet(data, duration, function(duration) {
                    console.log("It's been taken care of!");
                    callback(true, duration);
                });
            });
        });
    });
}

var soundcloudUrl = null;

connection.query('SELECT * FROM sets WHERE is_downloaded=0 LIMIT 1', function(err, rows) {
    console.log(rows);
    soundcloudUrl = rows[0].url;
    if(soundcloudUrl === null) {
        console.log("there are no undownloaded URLs");
        connection.end();
        // process.exit();
    } else {
        downloadPermalink(soundcloudUrl, function(data, duration) {
            // Anything undefined is considered an error. Fails to else.
            if(data) {
                console.log("Set obtained!");

                connection.query("UPDATE sets SET is_downloaded=1 WHERE url=?", soundcloudUrl, function(err) {
                    console.log(err)
                });
                connection.query("UPDATE sets SET is_shit="+duration+" WHERE url=?", soundcloudUrl, function(err) {
                    console.log(err)
                });
            } else {
                console.log("failure, try again fatty");
            }
            connection.end();
        }); // try with: https://soundcloud.com/d2techno/lets-go-techno-podcast-047
    }
});
