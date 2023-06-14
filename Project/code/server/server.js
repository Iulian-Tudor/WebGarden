import http from 'http';
import fs from 'fs';
// import cookie from 'cookie';

import { PORT } from './settings.js';
import Router from './Router.js';
import RequestType from './RequestType.js';
import { registerRoutes } from './routes.js';
import { connectToDb } from './db.js';

const router = new Router();

registerRoutes(router);

// function isAuthenticated(req) {
//     const cookies = cookie.parse(req.headers.cookie || '');
//     return !!cookies.user_email;
//   }

const server = http.createServer(async (req, res) => {
    const requestType = RequestType.fromString(req.method);

    // DEBUG
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
        try {
            req.body = JSON.parse(bodyRaw);
        } catch(e) {
            if(bodyRaw) {
                // if body has been read partially
                res.statusCode = 400;
                res.end(JSON.stringify(e));
                return;
            }
        }
        router.handle(req.url, requestType, req, res);
    });
});

server.listen(PORT, () => {
    console.log(`listening on port ${PORT}...`);
});
