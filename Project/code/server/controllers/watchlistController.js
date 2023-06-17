import { ObjectId } from "mongodb";
import { connectToDb } from "../db/db.js";


function createNotification(img_link, desc){
    var notif = {
        "img" : img_link,
        "desc": desc
    }

    return notif;
}

export async function getWatchlist(req, res, userSession){
    const { db, client } = await connectToDb();

    try{
        const userId = userSession.user_id;

        const user_watchlist = await db.collection("watchlist").find({user_id: new ObjectId(userId)}).toArray();
        

        var watchList = [];

        for(const element of user_watchlist)
        {
            const product = await db.collection('products').findOne({_id: element['flower_id']});

            watchList.push(createNotification(product['image_url'], product['name']));
        }
        
        res.statusCode = 200;
        res.end(JSON.stringify(watchList));
    } catch(error)
    {
        console.log(error);
        res.statusCode = 500;
        res.end('Internal server error');
    } finally{
        client.close();
    }
}