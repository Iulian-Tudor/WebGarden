import { connectToDb } from "../db/db.js";
import { ObjectId } from "mongodb";

function createNotification(img_link, name, water_val, soil_val, temp_val, hum_val, opt_water, opt_soil, opt_temp, opt_hum) {
    var notif = {
        'img': img_link,
        'title': name,
        'water': water_val,
        'soil': soil_val,
        'temperature': temp_val,
        'humidity': hum_val,
        'water_ok': (water_val < opt_water * 0.95 ? -1 : (water_val > opt_water * 1.05 ? 1 : 0)),
        'soil_ok': (soil_val === opt_soil),
        'temperature_ok': (temp_val < opt_temp * 0.95 ? -1 : (temp_val > opt_temp * 1.05 ? 1 : 0)),
        'humidity_ok': (hum_val < opt_hum * 0.95 ? -1 : (hum_val > opt_hum * 1.05 ? 1 : 0))
    }

    return notif;
}

export async function getGrowingFlowers(req, res, userSession) {
    const { db, client } = await connectToDb();

    try {
        const userId = userSession.user_id;

        const flowers = await db.collection('products').find({ $and: [{ seller_id: new ObjectId(userId) }, { harvestable: { $eq: false } }] }).toArray();

        const growingFlowersList = [];
        for (const flower of flowers) {
            const sensor_data = await db.collection('last_params').findOne({ flower_id: flower['_id'] });

            if (!sensor_data) {
                growingFlowersList.push(createNotification(flower['image_url'],
                    flower['name'],
                    0,
                    'undefined',
                    0,
                    0,
                    flower['flower_data']['optimal_parameters']['water'],
                    flower['flower_data']['optimal_parameters']['soil'],
                    flower['flower_data']['optimal_parameters']['temperature'],
                    flower['flower_data']['optimal_parameters']['humidity']));
            }
            else {
                growingFlowersList.push(createNotification(flower['image_url'],
                    flower['name'],
                    sensor_data['water'],
                    sensor_data['soil'],
                    sensor_data['temperature'],
                    sensor_data['humidity'],
                    flower['flower_data']['optimal_parameters']['water'],
                    flower['flower_data']['optimal_parameters']['soil'],
                    flower['flower_data']['optimal_parameters']['temperature'],
                    flower['flower_data']['optimal_parameters']['humidity']));
            }
        }

        res.statusCode = 200;
        res.end(JSON.stringify(growingFlowersList));
    } catch (error) {
        console.log(error);
        res.statusCode = 500;
        res.end('Internal server error');
    } finally {
        client.close();
    }
}

export async function getReadyFlowers(req, res, userSession) {
    const { db, client } = await connectToDb();

    try {
        const userId = userSession.user_id;

        const flowers = await db.collection('products').find({ $and: [{ seller_id: new ObjectId(userId) }, { harvestable: { $eq: true } }] }).toArray();

        const growingFlowersList = [];
        for (const flower of flowers) {
            const sensor_data = await db.collection('last_params').findOne({ flower_id: flower['_id'] });

            if (!sensor_data) {
                growingFlowersList.push(createNotification(flower['image_url'],
                    flower['name'],
                    0,
                    'undefined',
                    0,
                    0,
                    flower['flower_data']['optimal_parameters']['water'],
                    flower['flower_data']['optimal_parameters']['soil'],
                    flower['flower_data']['optimal_parameters']['temperature'],
                    flower['flower_data']['optimal_parameters']['humidity']));
            }
            else {
                growingFlowersList.push(createNotification(flower['image_url'],
                    flower['name'],
                    sensor_data['water'],
                    sensor_data['soil'],
                    sensor_data['temperature'],
                    sensor_data['humidity'],
                    flower['flower_data']['optimal_parameters']['water'],
                    flower['flower_data']['optimal_parameters']['soil'],
                    flower['flower_data']['optimal_parameters']['temperature'],
                    flower['flower_data']['optimal_parameters']['humidity']));
            }
        }

        res.statusCode = 200;
        res.end(JSON.stringify(growingFlowersList));
    } catch (error) {
        console.log(error);
        res.statusCode = 500;
        res.end('Internal server error');
    } finally {
        client.close();
    }
}

export async function getFlowerParams(req, res, userSession) {
    const { db, client } = await connectToDb();

    try {
        const { flower_id } = req.params;

        const flower = await db.collection('products').findOne({ _id: new ObjectId(flower_id) });

        const sensor_data = await db.collection('last_params').findOne({ flower_id: flower['_id'] });

        let notif;
        if (!sensor_data) {
            notif = createNotification(flower['image_url'],
                flower['name'],
                0,
                'undefined',
                0,
                0,
                flower['flower_data']['optimal_parameters']['water'],
                flower['flower_data']['optimal_parameters']['soil'],
                flower['flower_data']['optimal_parameters']['temperature'],
                flower['flower_data']['optimal_parameters']['humidity']);
        }
        else {
            notif = createNotification(flower['image_url'],
                flower['name'],
                sensor_data['water'],
                sensor_data['soil'],
                sensor_data['temperature'],
                sensor_data['humidity'],
                flower['flower_data']['optimal_parameters']['water'],
                flower['flower_data']['optimal_parameters']['soil'],
                flower['flower_data']['optimal_parameters']['temperature'],
                flower['flower_data']['optimal_parameters']['humidity']);
        }

        res.statusCode = 200;
        res.end(JSON.stringify(notif));
    } catch (error) {
        console.log(error);
        res.statusCode = 500;
        res.end('Internal server error!');
    } finally {
        client.close();
    }
}