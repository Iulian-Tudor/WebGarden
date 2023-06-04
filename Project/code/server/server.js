import http from 'http';
import fs from 'fs';

import { handleTest } from './test.js';
import { handleNotifications } from './notifications.js';
import { handleWatchlist } from './watchlist.js';
import { handlePlantedFlowers, handleReadyFlowers } from './plantedFlowers.js';

const port = 3000;

const routes = new Map();

function registerRoute(route, handler) {
    routes.set(route, handler);
}

registerRoute('/', (req, res) => {
    res.write('Hello world');
    res.statusCode = 200;
    res.end();
});

const server = http.createServer(async (req, res) => {
    if(!routes.has(req.url)) {
        try {
            const data = await fs.readFile('..' + req.url);
            res.statusCode = 200;
            res.end(data);
        } catch(err) {
            res.statusCode = 404;
            res.end('Not found');
        }
        return;
    }

    const handler = routes.get(req.url);
    handler(req, res);
});

server.listen(port, () => {
    console.log(`listening on port ${port}...`);
});
