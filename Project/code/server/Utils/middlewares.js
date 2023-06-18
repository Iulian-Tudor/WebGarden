import { connectToDb } from "../db/db.js";
import cookie from 'cookie';

function requireAuth(next, verdict=true) {
    // middleware to check for auth
    return async (req, res) => {
        const { db, client } = await connectToDb();

        let userSession = null;

        try {
            if(!req.headers.cookie) {
                return null;
            }
    
            const cookies = cookie.parse(req.headers.cookie);
            const sessionToken = cookies['X-WEBGA-TOKEN'];
    
            if(!sessionToken) {
                return null;
            }
    
            userSession = await db.collection('user_sessions').findOne({token: sessionToken});
        } finally {
            client.close();
        }

        if(userSession === null) {
            if(verdict) {
                res.statusCode = 403;
                return res.end("Not authorized");
            } else {
                return;
            }
        }
        return next(req, res, userSession);
    };
}

export { requireAuth };
