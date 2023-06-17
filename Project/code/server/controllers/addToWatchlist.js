import { ObjectId } from "mongodb";
import { connectToDb } from "../db/db.js";

export async function addToWatchlist(req, res, userSession){
    const { db, client } = await connectToDb();

    try{
        const userId = userSession.user_id;
        const {flower_id} = req.body;

        await db.collection('watchlist').insertOne({user_id: new ObjectId(userId), flower_id: new ObjectId(flower_id)});
        
        res.setHeader('Location', '/html/main_page.html'); // Set the Location header to the desired redirect path
        res.statusCode = 302; // Set the status code to 302 for a temporary redirect
        res.end();
    } catch(error)
    {
        console.log(error);
        res.statusCode = 500;
        res.end('Internal server error');
    } finally{
        client.close();
    }
}