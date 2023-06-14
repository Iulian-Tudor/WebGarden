export default async function parseBody(req) {
    return new Promise((resolve, reject) => {
        let bodyRaw = '';
        req.on('data', chunk => bodyRaw += chunk);

        let body = {};

        req.on('end', () => {
            try {
                switch(req.headers['content-type']) {
                    case 'application/x-www-form-urlencoded':
                        for(const pair of bodyRaw.split('&')) {
                            const [key, value] = pair.split('=', 2).map(decodeURIComponent);
                            body[key] = value;
                        }
                        break;
                    case 'application/json':
                        body = JSON.parse(bodyRaw);
                        break;
                }
            } catch {
                reject("Error parsing: " + bodyRaw);
            }

            resolve(body);
        });
    });
}
