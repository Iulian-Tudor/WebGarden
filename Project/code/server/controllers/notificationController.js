import { connectToDb } from '../db/db.js';
import { ObjectId } from 'mongodb';

function createNotification( flower_id, img_link, desc){
    var notif = {
        "img" : img_link,
        "desc": desc,
        "id": flower_id
    }

    return notif;
}

export async function getNotification(req, res, userSession){
    const { db, client } = await connectToDb();

    try{
        const ownerId = userSession.user_id;
        const products = await db.collection("products").find({seller_id : new ObjectId(ownerId)}).toArray();
        var notificationList = [];

        for(const product of products)
        {
            const sensor_data = await db.collection('last_params').findOne({flower_id: product['_id']});

            if(!sensor_data)
                continue;
            
            const opt_water = product['flower_data']['optimal_parameters']['water'];
            const opt_soil = product['flower_data']['optimal_parameters']['soil'];
            const opt_temp = product['flower_data']['optimal_parameters']['temperature'];
            const opt_hum = product['flower_data']['optimal_parameters']['humidity'];

            if(sensor_data['water'] < opt_water){
                notificationList.push(createNotification(product['_id'], product['image_url'], product['name']+" nu are destula apa!"));
            }

            if(sensor_data['water'] >= 4*opt_water){
                notificationList.push(createNotification(product['_id'], product['image_url'], product['name'] +" are prea multa apa!"));
            }

            if(sensor_data['soil'] != opt_soil){
                notificationList.push(createNotification(product['_id'], product['image_url'], product['name'] + " nu are solul potrivit!"));
            }

            if(sensor_data['temperature'] < opt_temp*0.95){
                notificationList.push(createNotification(product['_id'], product['image_url'], product['name'] + " are temperatura prea scazuta!"));
            }

            if(sensor_data['temperature'] > opt_temp*1.05){
                notificationList.push(createNotification(product['_id'], product['image_url'], product['name'] + " are temperatura prea ridicata!"));
            }

            if(sensor_data['humidity'] < opt_hum*0.95){
                notificationList.push(createNotification(product['_id'], product['image_url'], product['name'] + " are umiditatea prea scazuta!"));
            }

            if(sensor_data['humidity'] > opt_temp*1.05){
                notificationList.push(createNotification(product['_id'], product['image_url'], product['name'] + " are umiditatea prea ridicata!"));
            }
        }
        
        res.statusCode = 200;
        res.end(JSON.stringify(notificationList));
    } catch(error)
    {
        console.log(error);
        res.statusCode = 500;
        res.end('Internal server error');
    } finally{
        client.close();
    }
}