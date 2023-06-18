import http from 'http';
import fs from 'fs';
import path from 'path';


import { PORT, SESSION_TTL } from './settings.js';
import Router from './Router.js';
import RequestType from './RequestType.js';
import { registerRoutes } from './routes.js';
import { connectToDb } from './db/db.js';
import parseBody from './parsers/BodyParser.js';
import parseURL from './parsers/URLParser.js';
import Sensor from './services/sensor.js';
import { WHITELIST } from './settings.js';
import { requireAuth } from './Utils/middlewares.js';

const router = new Router();

registerRoutes(router);

(async () => {  // create the ttl index on the user_sessions
    const { db, client } = await connectToDb();

    try {
        await db.collection('user_sessions').dropIndex({createdAt: 1});
    } catch(e) { /* not present */ }

    await db.collection('user_sessions').createIndex({createdAt: 1}, { expireAfterSeconds: SESSION_TTL });
    client.close();

    //Start sensor service
    const sensor_service = new Sensor();
    sensor_service.start();
})();


const server = http.createServer(async (req, res) => {
    const requestType = RequestType.fromString(req.method);

    // DEBUG
    if(requestType === undefined) {
        throw new Error(`Request type ${req.method} not handled`);
    }

    let url;
    try {
        [url, req.params] = parseURL(req.url);
    } catch(e) {
        res.statusCode = 400;
        return res.end();
    }

    if(url.indexOf('/html/') === 0 && WHITELIST.indexOf(url) === -1) {
        const auth = await requireAuth(() => true, false)(req, res);
        if(!auth) {
            res.setHeader('Location', '/html/login.html');
            res.statusCode = 302;
            res.end();
            return;
        }
    }


    if(!router.exists(url, requestType)) {
        try {
            const data = await fs.promises.readFile('..' + url);
            res.statusCode = 200;
            return res.end(data);
        } catch(err) {
            res.statusCode = 404;
            return res.end('Not found');
        }
    }

    if(requestType !== RequestType.GET) {
        // the server shall ignore the body for GET, as per https://datatracker.ietf.org/doc/html/rfc7231#section-4.3.1
        try {
            req.body = await parseBody(req);
        } catch(e) {
            res.statusCode = 400;
            return res.end(JSON.stringify(e));
        }
    }

    try {
        router.handle(url, requestType, req, res);
    } catch(e) {
        console.log(e);
        res.statusCode = 500;
        return res.end();
    }
});

server.listen(PORT, () => {
    console.log(`listening on port ${PORT}...`);
});
