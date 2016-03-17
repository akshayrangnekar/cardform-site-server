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

var handler = function(req, res) {
    var path = req.path;
    if (path.endsWith('/')) path = path + 'index.html';
    res.send('Hello World: ***' + path + '*** <br />Hostname: ' + req.hostname);

};

app.get('/', handler);
app.get('/*', handler);

app.listen(process.env.PORT, function() {
    console.log('Example app listening on port: ' + port);
});