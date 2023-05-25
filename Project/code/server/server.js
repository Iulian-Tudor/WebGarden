import http from 'http';
import fs from 'fs';

import { PORT } from './settings.js';
import Router from './Router.js';
import RequestType from './RequestType.js';
import { registerRoutes } from './routes.js';

const router = new Router();

registerRoutes(router);

const server = http.createServer(async (req, res) => {
    const requestType = RequestType.fromString(req.method);
    if(requestType === undefined) {
        throw new Error(`Request type ${req.method} not handled`);
    }

    if(!router.exists(req.url, requestType)) {
        try {
            const data = await fs.promises.readFile('..' + req.url);
            res.statusCode = 200;
            res.end(data);
        } catch(err) {
            res.statusCode = 404;
            res.end('Not found');
        }
        return;
    }

    let bodyRaw = '';

    req.on('data', chunk => bodyRaw += chunk);

    req.on('end', () => {
        console.log(bodyRaw);
    });

    router.handle(req.url, requestType, req, res);
});

server.listen(PORT, () => {
    console.log(`listening on port ${PORT}...`);
});
