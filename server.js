var express = require('express');
var app = express();
var port = process.env.PORT || 8081;

var aws = require('knox').createClient({
    bucket: 'cardform-hosted-sites'
})

app.get('/:path', function (req, res) {
    res.send('Hello World: ' + req.params.path);
});

app.listen(process.env.PORT, function () {
    console.log('Example app listening on port: ' + port);
});
