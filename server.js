var express = require('express');
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

var aws = require('knox').createClient({
    key: process.env.AWS_ACCESS_KEY,
    secret: process.env.AWS_ACCESS_KEY_SECRET,
    bucket: process.env.BUCKET_NAME
});

var handler = function(req, res, next) {
    var path = '/' + req.hostname + req.path;
    if (path.endsWith('/')) path = path + 'index.html';

    // res.send('Hello World: ***' + path + '*** <br />Hostname: ' + req.hostname);
    console.log('Requesting path: ' + path);
    aws.get(path)
        .on('error', function(err) {
            console.log('Error: ', err);
            next(err);
        })
        .on('response', function(resp) {
            console.log('Got response.');
            if (resp.statusCode !== 200) {
                var err = new Error()
                err.status = 404
                next(err)
                return
            }

            res.setHeader('Content-Length', resp.headers['content-length'])
            res.setHeader('Content-Type', resp.headers['content-type'])

            if (req.method === 'HEAD') {
                res.statusCode = 200
                res.end()
                return
            }

            resp.pipe(res)
        })
};

app.get('/', handler);
app.get('/*', handler);

app.listen(process.env.PORT, function() {
    console.log('Example app listening on port: ' + port);
});