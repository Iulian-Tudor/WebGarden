import { connectToDb } from '../db/db.js';
import { encrypt, decrypt } from '../Utils/cryptoUtils.js';
import bcrypt from 'bcryptjs';
import sanitize from 'mongo-sanitize';
import cookie from 'cookie';
import { SESSION_TTL } from '../settings.js';

export async function getNotification(req, res, userSession){
    const { db, client } = await connectToDb();

    try{
        const ownerId = userSession.user_id;

        console.log(ownerId);

        const products = await db.collection("categories").find({$getField:{field:"products"}}).toArray();

        for(var i=0; i<products.length; i++)
        {
            const prod = products[i];

            if(prod.find({$getField:{field:"seller_id"}})!= ownerId)
            {
                res.statusCode = 400;
                res.end("You have no flowers!");
            }
        }

        
        res.statusCode = 200;
        res.end('Message');
    } catch(error)
    {
        console.log(error);
        res.statusCode = 500;
        res.end('Internal server error');
    } finally{
        client.close();
    }
}