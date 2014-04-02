var fs = require('fs');
var http = require('http');
var mysql = require('mysql');

var SOUNDCLOUD_CLIENT_ID = '9608e54a4e16b0d3f13f526ed975d8fe';

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'snackerjack'
});

connection.query('SELECT * FROM urls WHERE is_downloaded=0 LIMIT 1', function(err, rows) {
    console.log(rows);
});
connection.end();
var soundcloudUrl = null;

if(soundcloudUrl === null) {
    console.log("there are no undownloaded URLs");

} else {
    console.log(soundcloudUrl);
}


var permalink = 'https://soundcloud.com/schaltkreis/schaltcast-10-with-derek-plaslaiko';
console.log('permalink: ' + permalink);
var encodedPermalink = encodeURIComponent(permalink);
console.log('encoded permalink: ' + encodedPermalink);
var resolveUrl = 'http://api.soundcloud.com/resolve.json?consumer_key=' + SOUNDCLOUD_CLIENT_ID + '&url=' + encodedPermalink;
console.log('resolve url: ' + resolveUrl);

/* First HTTP request: resolve the permalink to a track resource */
http.get(resolveUrl, function(res) {
    var trackUrl = res.headers.location;
    console.log("track url: " + trackUrl);

    /* Second HTTP request: get metadata about the track resource */
    http.get(trackUrl, function(res) {
        var body = '';
        res.on('data', function(chunk) {
            body += chunk;
        });
        res.on('end', function() {
            var json = JSON.parse(body);
            var downloadUrl = json.download_url + "?consumer_key=" + SOUNDCLOUD_CLIENT_ID;
            console.log("download url: " + downloadUrl);

            http.get(downloadUrl, function(res) {
                var mediaUrl = res.headers.location;

                http.get(mediaUrl, function(res) {
                    var set = fs.createWriteStream("set.mp3");
                    console.log("downloading");
                    res.pipe(set).on('finish', function() {
                        console.log("done downloading");
                    });
                });
            });
        });
    });
});
