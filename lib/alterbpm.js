// ffmpeg -i billie_jean.mp3 -filter:a "atempo=2.0" -c:a libmp3lame -q:a 100 final.mp3

function alterBPM(filename, targetBPM) {

    var spawn = require('child_process').spawn;
    ls = spawn('ffmpeg', ['-i', filename, '-filter:a', 'atempo=' + targetBPM, "-c:a", "libmp3lame", "-q:a", "100", filename+'_'+targetBPM+'.mp3']);

    ls.stdout.on('data', function(data) {
        console.log('stdout: ' + data);
    });

    ls.stderr.on('data', function(data) {
        console.log('stderr: ' + data);
    });

    ls.on('close', function(code) {
        console.log('child process exited with code ' + code);
    });

}

module.exports = alterBPM;
