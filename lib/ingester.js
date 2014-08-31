var http = require('http');
var spawn = require('child_process').spawn;
var querystring = require('querystring');
var Promise = require('bluebird');

var CODEGEN_PATH = "/Users/samenglander/dev/echoprint/echoprint-codegen/echoprint-codegen";
var TRACK_PATH = "/Users/samenglander/dev/echoprint/echoprint-codegen/ingest-techno/iobacktonormall.mp3";

// 01-va-fabric_31__mixed_by_marco_carola-mpx.mp3
// var SET_PATH = "/Users/samenglander/dev/echoprint/echoprint-codegen/128295_Io_Original_Mix.mp3";

generateFingerPrint = function(trackPath) {
// Passes in bluebird api throught these resolve and reject functions
	return new Promise(function(resolve, reject) {

	    var codegenResponse = '';
	    var codegen = spawn(CODEGEN_PATH, [trackPath]);
	    codegen.stdout.on('data', function(data) {
	        // var trackjson = JSON.parse(data);
	        codegenResponse += data;
	        // console.log(data);
	        //console.log(trackjson);
	    });

	    codegen.stderr.on('data', function(data) {
	        console.log('stderr: ' + data);
	    });

	    codegen.on('close', function() {
	        var codegenResponseJSON = JSON.parse(codegenResponse);
	        if(codegenResponseJSON[0].error) {
	        	reject(codegenResponseJSON[0].error);
	        } else {
	        	resolve(codegenResponseJSON[0].code);
	        }
	    }); 
	});
}

// invoke .then on that "promise". In the resolve callback, we invoke ingestFingerPrint
var promise1 = generateFingerPrint(TRACK_PATH);
var promise2 = promise1.then(function(fingerPrint) {
	return ingestFingerPrint(fingerPrint);
}, function(codegenError) {
	console.log("you have been... " + codegenError);
});

var ingestFingerPrint = function(fingerPrint) {
	return new Promise(function(resolve, reject) {
		resolve(console.log(fingerPrint));
	});
}

var kromis = kromis.then(function(fingerPrint) {
	console.log(fingerPrint)
}, function(fingerPrint) {
	console.log("KROMISS... " + fingerPrint);
});

// var promiseResolutionProcedure = function(promise, x) {
//    if(isAPromise(x)) {
//         adoptState(promise, x);
//    } else {
//        fulfill(promise, x);
//    }
// };

// then must return some  promise (let's call it promiseFlarg)
// var promise2 = promise1.then(onFulfilled, onRejected);
// if onFulfilled or onRejected returns a value x, call promiseResolutionProcedure(promiseFlarg, x);

// function ingest(fingerPrint) {

//     var postData = querystring.stringify({
//         'fp_code': fingerPrint,
//         'track_id': 'rworgukjoinnj',
// 		'length': '396',
// 		'codever': '4.12'
//     });

//     var postOptions = {
//         host: 'localhost',
//         port: 8080,
//         method: 'POST',
//         path: '/ingest',
//         headers: {
//             'Content-Length': postData.length,
//             'Content-Type': 'application/x-www-form-urlencoded'
//         }
//     };

//     console.log(postData);
//     var request = http.request(postOptions, function(res) {
//         // res.setEncoding('utf8');
//         res.on('data', function(chunk) {
//             console.log('Response: ' + chunk);
//         });
//     });

//     // post the data
//     request.write(postData);
//     request.end();

// }


// generateFingerPrint();

// curl http://localhost:8080/ingest -d "fp_code=
