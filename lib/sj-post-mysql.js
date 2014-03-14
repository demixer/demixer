/*
In new terminal window:

curl -X POST -d 'jajaj' http://localhost:8080/my_post
*/

var mysql = require('mysql');

var db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'snackerjack'
});

var restify = require('restify');

function my_post_handler(req,res,next) {
    var urlFromPost = req.body;

    checkDB({scID: urlFromPost});
    res.send({scID: urlFromPost});

}

var server = restify.createServer();

server.use(restify.bodyParser());
server.post('/my_post', my_post_handler);

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});

function checkDB(data) {
   var snobleDup = 0;
    db.query('Select * FROM urls')
        .on('result', function(snobler) {
            if(snobler.id == data.scID){
                snobleDup = 1;
                return;
            }
        })
        .on('end', function() {
            return doSC(snobleDup, data.scID);
        });
}

function doSC(check, data) {
    if(check == 0) {
        db.query('INSERT INTO urls (id) VALUES (?)', data);
        console.log("new soundcloud set stored in database");

    } else {
        console.log("soundcloud set already stored in database");
    }
}
