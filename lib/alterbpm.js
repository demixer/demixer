// ffmpeg -i billie_jean.mp3 -filter:a "atempo=2.0" -c:a libmp3lame -q:a 100 final.mp3

function alterBPM(srcFilename, dstFilename, srcBPM, dstBPM, callback) {

    var atempo = dstBPM/srcBPM;
    var result = "";
    var error = "";


    var spawn = require('child_process').spawn;
    ls = spawn('ffmpeg', ['-i', srcFilename, '-filter:a', 'atempo=' + atempo, "-c:a", "libmp3lame", "-q:a", "100", dstFilename, "-y"]);

    ls.stdout.on('data', function(data) {
        console.log('stdout: ' + data);
        result += data;
    });

    ls.stderr.on('data', function(data) {
        console.log('stderr: ' + data);
        error += data;
    });

    ls.on('close', function(code) {
        console.log('child process exited with code ' + code);

        if(code == 0) {
            callback(null, result);
        } else {
            callback(error, null);
        };
    });

}

module.exports = alterBPM;
