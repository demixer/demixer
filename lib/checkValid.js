var http = require('http');
var fs = require('fs');

var SOUNDCLOUD_CLIENT_ID = '9608e54a4e16b0d3f13f526ed975d8fe';

var permalink = 'https://soundcloud.com/d2techno/lets-go-techno-podcast-047';
var encodedPermalink = encodeURIComponent(permalink);
var resolveUrl = 'http://api.soundcloud.com/resolve.json?consumer_key=' + SOUNDCLOUD_CLIENT_ID + '&url=' + encodedPermalink;

http.get(resolveUrl, function(res) {
    var trackUrl = res.headers.location;
    // watch this for errors, if 404 exit loop. How is this done?
    console.log("Status Code for resolveUrl: " + res.statusCode);

    http.get(trackUrl, function(res) {
        var body = '';
        console.log("Status Code for trackUrl: " + res.statusCode);

        res.on('data', function(chunk) {
            body += chunk;
        });

        res.on('end', function() {
            var json = JSON.parse(body);
            var downloadUrl = json.download_url + "?consumer_key=" + SOUNDCLOUD_CLIENT_ID;

            console.log("JSON from trackUrl:" + "\n   public: " + json['sharing'] + "\n   streamable: " + json['streamable'] + "\n   downloadable: " + json['downloadable']);

            http.get(downloadUrl, function(res) {
                var mediaUrl = res.headers.location;
                console.log("Status Code for downloadUrl: " + res.statusCode);


                http.get(mediaUrl, function(res) {
                    // why does this keep running in console, then exit after 5 seconds or so.
                    // I tried adding a loop here and it just won't ever exit. I don't exactly get how these 'data', 'end', 'error'.

                    var i = 1;
                    var interval = setInterval( increment, 1000);
                    function increment(){
                        i = i % 360 + 1;
                        console.log("why don't this exit?");
                    }

                    console.log("Status Code: mediaUrl" + res.statusCode);

                    if(res.headers['content-type'] == 'audio/mpeg') {
                        console.log("JSON from medaiUrl:" + "\n   content-type: " + "audio/mpeg");
                    } else {
                        console.log("JSON from medaiUrl:" + "\n   content-type: " + "INVALID");
                    }

                    console.log("what are we waiting for here?");
                }).on('error', function(e) {
                    console.log("Got fucksan: ");
                });
            });
        });
    });
});
