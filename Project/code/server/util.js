import cookie from 'cookie';
import { connectToDb } from './db.js';

async function getAuthSession(req) {
    const { db, client } = await connectToDb();

    try {
        if(!req.headers.cookie) {
            return null;
        }

        const cookies = cookie.parse(req.headers.cookie);
        const sessionToken = cookies['X-WEBGA-TOKEN'];

        if(!sessionToken) {
            return null;
        }
    
        const session = await db.collection('user_sessions').findOne({token: sessionToken});
        
        return session;
    } finally {
        client.close();
    }
}

export { getAuthSession };
