var express = require('express');
var app = express();
var port = process.env.PORT || 8081;

var aws = require('knox').createClient({
    key: process.env.AWS_ACCESS_KEY,
    secret: process.env.AWS_ACCESS_KEY_SECRET,
    bucket: process.env.BUCKET_NAME
})

app.get('/:path', function (req, res) {
    res.send('Hello World: ' + req.params.path);
});

app.listen(process.env.PORT, function () {
    console.log('Example app listening on port: ' + port);
});
