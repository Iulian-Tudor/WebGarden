import { ObjectId } from "mongodb";
import { connectToDb } from "../db/db.js";

export async function getUserDetails(req, res, userSession){
    const { db, client } = await connectToDb();

    try{
        const userId = userSession.user_id;

        const user = await db.collection('users').findOne({_id: new ObjectId(userId)});

        res.statusCode = 200;
        res.end(JSON.stringify(user));
    } catch(error) {
        console.log(error);
        res.statusCode = 500;
        res.end("Internal server error!");
    } finally {
        client.close();
    }
}