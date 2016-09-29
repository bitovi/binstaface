const zlib = require('zlib');
const http = require('http');
const fs = require('fs');
const path = require('path');
const mime = require('mime');

module.exports = function(base) {
  return http.createServer((req, res) => {
    const filename = path.join(base, req.url);

    fs.exists(filename, exists => {
      if(!exists) {
        res.writeHead(404, {
          'Content-Type': 'text/plain'
        });
        res.end('File not found\n');
      } else {
        const headers = {
          'Content-Type': mime.lookup(filename)
        };
        let stream = fs.createReadStream(filename);
        
        if(req.headers['accept-encoding'] && req.headers['accept-encoding'].indexOf('gzip') !== -1) {
          headers['Content-Encoding'] = 'gzip';
          stream = stream.pipe(zlib.createGzip());
        }

        res.writeHead(200, headers);
        stream.pipe(res);
      }
    });
  });
};
