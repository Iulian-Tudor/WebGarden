import http from 'http';
import fs from 'fs';
import cookie from 'cookie';

import { handleTest, handleData } from './test.js';
import { registerUser } from './iulian/signupController.js';
import { loginUser } from './iulian/loginController.js';
import { logoutUser } from './iulian/logoutController.js';

const port = 3000;

const routes = new Map();

registerRoute('/test', handleTest);
registerRoute('/data', handleData);
registerRoute('/register', registerUser);
registerRoute('/login', loginUser);
registerRoute('/logout', logoutUser);

function registerRoute(route, handler) {
    routes.set(route, handler);
}

registerRoute('/', (req, res) => {
    res.write('Hello world');
    res.statusCode = 200;
    res.end();
});

function isAuthenticated(req) {
    const cookies = cookie.parse(req.headers.cookie || '');
    return !!cookies.user_email;
  }

const server = http.createServer(async (req, res) => {
    if(!routes.has(req.url)) {
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

    const handler = routes.get(req.url);
    handler(req, res);
});

server.listen(port, () => {
    console.log(`listening on port ${port}...`);
});
