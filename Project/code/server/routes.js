function registerRoutes(router) {
    router.get('/test', (req, res) => {
        res.end('Test');
    });

    router.post('/data', (req, res) => {
        const data = {
            'name': 'ceva',
            'age': 421
        };
        res.end(JSON.stringify(data));
    });

    router.get('/', (req, res) => {
        res.write('Hello world');
        res.statusCode = 200;
        res.end();
    });
}

export { registerRoutes };
