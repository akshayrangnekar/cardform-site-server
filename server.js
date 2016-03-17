var express = require('express');
var S3 = require('aws-sdk').S3,
    S3S = require('s3-streams');

var app = express();
var port = process.env.PORT || 8081;

if (!String.prototype.endsWith) {
    String.prototype.endsWith = function(searchString, position) {
        var subjectString = this.toString();
        if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
            position = subjectString.length;
        }
        position -= searchString.length;
        var lastIndex = subjectString.indexOf(searchString, position);
        return lastIndex !== -1 && lastIndex === position;
    };
}

var handler = function(req, res, next) {
    var path = '/' + req.hostname + req.path;
    if (path.endsWith('/')) path = path + 'index.html';

    // res.send('Hello World: ***' + path + '*** <br />Hostname: ' + req.hostname);
    console.log('Requesting path: ' + path);

    var download = S3S.ReadStream(new S3(), {
        Bucket: process.env.BUCKET_NAME,
        Key: path
    });

    download.on('open', function open(object) {
        console.log('Downloading', object.ContentLength, 'bytes.');
    })
    .pipe(res)
    .on('finish', function end() {
        console.log('Download complete.');
    })
    .on('error', function error(err) {
        console.error('Unable to download file:', err);
    });
};

app.get('/', handler);
app.get('/*', handler);

app.listen(process.env.PORT, function() {
    console.log('Example app listening on port: ' + port);
});