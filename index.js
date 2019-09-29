const URL = require('url');
const http = require('http');
const https = require('https');
const { readFileSync } = require('fs');
const { StringDecoder } = require('string_decoder');

const routes = require('./routes');
const configuration = require('./config');

const httpsServerOptions = {
    key: readFileSync('./https/key.pem'),
    cert: readFileSync('./https/cert.pem'),
};

const httpServer = http.createServer(unifiedServer);
const httpsServer = https.createServer(httpsServerOptions, unifiedServer);

[
    { server: httpServer, type: 'http' },
    { server: httpsServer, type: 'https' }
].forEach(initServer);

/////////////////////////////////////////////////////////////////////////

function initServer({ server, type }) {
    server.listen(configuration.port[type], () => {
        console.log(`the server is listening on port ${configuration.port[type]}`);
    });
}

function unifiedServer(req, res) {
    const { url, headers, method } = req;
    const parsedUrl = URL.parse(url, true);
    const path = parsedUrl.pathname;
    const queryStrings = parsedUrl.query;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');
    const onDone = (buffer) => {
        const controller = routes(trimmedPath);
        let body;
        try {
            body = buffer ? JSON.parse(buffer) : buffer;
        } catch(error) {
            console.error(error);
        }
        controller({ queryStrings, body, headers, method }, res);
    }

    getBody(req, onDone);
};

function getBody(req, onDone) {
    let buffer = '';
    const decoder = new StringDecoder('utf-8');
    req.on('data', (data) => buffer += decoder.write(data));
    req.on('end', () => {
        buffer += decoder.end();
        onDone(buffer);
    });
}