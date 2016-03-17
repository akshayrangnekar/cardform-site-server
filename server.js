var express = require('express');
var app = express();
var port = process.env.PORT || 8081;

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.listen(process.env.PORT, function () {
  console.log('Example app listening on port: ' + port);
});
