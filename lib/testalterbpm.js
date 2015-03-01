var alterBPM = require('./alterbpm.js');


var srcFilename = "/Users/samenglander/Music/Techno/01-scb-mace-bnp.mp3";
var destFilename = "/tmp/alterbpm_destfile.mp3";
var srcBPM = 127;
var destBPM = 137;

var targetBPM = 1.05;
alterBPM(srcFilename, destFilename, srcBPM, destBPM, function(err, result)
{
	if(err){
		console.log("the bobby!");
	} else {
		console.log("the ricky!");
	};
});