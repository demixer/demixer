var fs = require('fs');
var http = require('http');
var mysql = require('mysql');

var SOUNDCLOUD_CLIENT_ID = '9608e54a4e16b0d3f13f526ed975d8fe';

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'snackerjack'
});

function asyncFunction(callback, data) {
    var permalink = data;
    var encodedPermalink = encodeURIComponent(permalink);
    var resolveUrl = 'http://api.soundcloud.com/resolve.json?consumer_key=' + SOUNDCLOUD_CLIENT_ID + '&url=' + encodedPermalink;

    // First HTTP request: resolve the permalink to a track resource
    http.get(resolveUrl, function(res) {
        var trackUrl = res.headers.location;

        // This line can handle errors too! If trackUrl is assigned to an invalid location, the object should be undefined. Check to see if this still works as other requests are implemented!!!
        callback(trackUrl);
    });
}

var soundcloudUrl = null;

connection.query('SELECT * FROM urls WHERE is_downloaded=0 LIMIT 1', function(err, rows) {
    console.log(rows);
    soundcloudUrl = rows[0].id;

    if(soundcloudUrl === null) {
        console.log("there are no undownloaded URLs");
        // process.exit();
    } else {

        var year = '1984';
        console.log("Welcome to the year: " + year);

        (function(year) {
            asyncFunction(function(data) {
                // Anything undefined is considered an error. Fails to else.
                if(data) {
                    console.log("Welcome to the year: " + year);
                    console.log("nice job, track status: " + data);
                } else {
                    console.log("Welcome to the year: " + year);
                    console.log("failure, try again fatty");
                }
            }, soundcloudUrl)
        })(year);

        year = '2014';
        console.log("Welcome to the year: " + year );
    }
});
connection.end();
