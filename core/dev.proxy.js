
const zlib = require('zlib');

const injection = '<script src="/wp-content/themes/default/client.js"></script>';

const inject = body => {
  if ( body.indexOf( '</body>' ) > -1 ) {
    body = body.replace( '</body>', injection + '</body>' );
  } else if ( body.indexOf( '</html>' ) > -1 ){
    body = body.replace( '</html>', injection + '</html>' );
  } else {
    body = body + injection;
  }
  body = body.replace(/localhost:8080/g, 'localhost:5001');
  return body;
}

const override = () => { };

exports.onError = (err, req, res) => {
  res.writeHead(500, { 'Content-Type': 'text/plain' });
  res.end('something went wrong.');
}

exports.onProxyRes = (proxyRes, req, res) => {

  if ( !(proxyRes.headers &&
        proxyRes.headers[ 'content-type' ] &&
        proxyRes.headers[ 'content-type' ].match( 'text/html' )
    ) ) {
    return false;
  }

  const stage = {
    writeHead: false,
    write: false,
    end: false,
  };

  const { end, write, writeHead } = res;

  res.writeHead = override;
  res.write = override;
  res.end = override;

  const proxy = new Promise(function(resolve, reject) {
    let len = 0;
    const data = [];
    proxyRes.on('data', function(chunk) {
      data.push(chunk);
      len += chunk.length;
    });
    proxyRes.on('end', function () {
      const buf = new Buffer(len);
      for (let i = 0, len = data.length, pos = 0; i < len; i++) {
        data[i].copy(buf, pos);
        pos += data[i].length;
      }
      if ( /gzip/.test(proxyRes.headers['content-encoding']) ) {
        zlib.gunzip(buf, function(err, out) {
          if ( err ) return reject(err);
          resolve(out);
        });
      } else {
        resolve(buf);
      }
    });
  }).then(buf => {
    let data = buf;
    if ( /text\/html/.test(proxyRes.headers['content-type']) && buf.toString ) {
      data = inject(buf.toString());
    }
    if ( /gzip/.test(proxyRes.headers['content-encoding']) ) {
      data = zlib.gzipSync(data);
    }
    return data;
  }).then(buf => {
    writeHead.call(res, proxyRes.statusCode, {
      'content-type'      : proxyRes.headers['content-type'],
      'content-length'    : buf.length,
      'cache-control'     : 'no-cache',
      'transfer-encoding' : '',
    });
    stage.writeHead = true;
    return buf;
  }).then(buf => {
    write.call(res, buf);
    stage.write = true;
  }).then(_ => {
    end.call(res);
    stage.end = true;
  }).catch(err => {
    let output = `something went wrong, ${err}`;
    if ( /gzip/.test(proxyRes.headers['content-encoding']) ) {
      output = zlib.gzipSync(output);
    }
    if (!stage.writeHead) writeHead.call(res, 500, {
      'content-type'      : proxyRes.headers['content-type'],
      'content-length'    : output.length,
      'cache-control'     : 'no-cache',
      'transfer-encoding' : '',
    });
    write.call(res, output);
    end.call(res);
  });
}
