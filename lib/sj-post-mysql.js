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

function postHandler(req,res,next) {
    var urlFromPost = req.body;

    processPost({scId: urlFromPost});
    res.send({scId: urlFromPost});
}

/** 
 * 'server' is an object that is the result of invoking 'server.createServer'
 */
var server = restify.createServer();
server.use(restify.bodyParser());
server.post('/my_post', postHandler);

server.listen(8080, function() {
    console.log('%s listening at %s', server.name, server.url);
});

/**
 * 'processPost' is a function which accepts a single argument, 'data'.
 * 'data' is an object containing a single key, 'scId'. 
 * 'isDuplicate' is an integer.
 * 'db' is an object which encapsulates a connection to a MySQL database.
 * 'db' has a function called 'query'.
 * 'query' accepts two arguments, a MySQL statement and stuff to interpolate in that statement.
 * 'query' returns a query result object which we name 'queryResult'.
 * 'queryResult' has an 'on' method which accepts an event type argument and a function.
 */
function processPost(data) {
    var isDuplicate = 0;

    // isDuplicate = 0;
    // POST jajajaja
    // SELECT * from urls where id='jajajaja';
    // => {id:'jajajaja'}
    // if(result.id == data.scId) {
    //     isDuplicate = 1;
    // }
    var queryResult = db.query('SELECT * FROM urls WHERE id=(?)', data.scId);

    queryResult.on('result', function(result) {
        if(result.id == data.scId){
            isDuplicate = 1;
        }
    });

    queryResult.on('end', function() {
        if(isDuplicate == 0) {
            db.query('INSERT INTO urls (id) VALUES (?)', data.scId);
            // go download url in the background
            console.log("new soundcloud set stored in database");
        } else {
            console.log("soundcloud set already stored in database");
        }
    });
}
