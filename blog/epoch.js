var milliseconds, seconds;
var http = require('http');
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  milliseconds = new Date().getTime();
  seconds = Math.round( milliseconds/1000);
  res.end(seconds.toString());
}).listen(8081, '127.0.0.1');
console.log('Server running at http://127.0.0.1:8081/');

