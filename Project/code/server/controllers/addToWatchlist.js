import { ObjectId } from "mongodb";
import { connectToDb } from "../db/db.js";

export async function addToWatchlist(req, res, userSession){
    const { db, client } = await connectToDb();

    try{
        const userId = userSession.user_id;
        const req_body = {...req.body};

        console.log(userId);
        console.log(req_body.flower_id);

        await db.collection('watchlist').insertOne({user_id: new ObjectId(userId), flower_id: new ObjectId(req_body['flower_id'])});
        
        //const insertedElem = await db.collection('watchlist').findOne({flower_id: req_body['flower_id']});
        //console.log(insertedElem);

        res.statusCode = 200;
        res.end('Succes!');
    } catch(error)
    {
        console.log(error);
        res.statusCode = 500;
        res.end('Internal server error');
    } finally{
        client.close();
    }
}