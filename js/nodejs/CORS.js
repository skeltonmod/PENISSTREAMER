// request library
const got = require('got')

// Listen on a specific host via the HOST environment variable
let host = '127.0.0.1';
// Listen on a specific port via the PORT environment variable
let port = 8080;

let cors_proxy = require('cors-anywhere');
cors_proxy.createServer({
  originWhitelist: [], // Allow all origins
  requireHeader: ['origin', 'x-requested-with'],
  removeHeaders: ['cookie2']
}).listen(port, host, function() {
  console.log('Running CORS Anywhere on ' + host + ':' + port);
});









