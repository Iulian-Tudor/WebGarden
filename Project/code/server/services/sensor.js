import { connectToDb } from "../db/db.js";

const map = (n, a, b, c, d) => (n - a) / (b - a) * (d - c) + c;

export default class Sensor{
    ///valori - apa, sol, temperatura, umiditate

    interval_id = null;
    water_bounds = [0, 400];
    soil_types = ['clay', 'silt', 'sand', 'stony', 'chalky'];
    temperature_bounds = [-40, 40];
    humidity_bounds = [0, 100];

    getRandomInt(bounds) {
        return Math.floor(map(Math.random(), 0, 1, bounds[0], bounds[1]));
    }

    getRandomFloat(bounds){
        return map(Math.random(), 0, 1, bounds[0], bounds[1]);
    }

    getSensorData(){
        const data = {
            "water": this.getRandomInt(this.water_bounds),
            "soil": this.soil_types[this.getRandomInt([0, 5])],
            "temperature": this.getRandomInt(this.temperature_bounds),
            "humidity": this.getRandomInt(this.humidity_bounds)
        }

        return data;
    }

    getSensorDelta(flower_params){
        const data = {
            "water": flower_params['water'] + this.getRandomFloat([-1, 1]),
            "soil": flower_params['soil'],
            "temperature": flower_params['temperature'] + this.getRandomFloat([-1, 1]),
            "humidity": flower_params['humidity'] + this.getRandomFloat([-1, 1])
        }

        return data;
    }

    async update(){
        //chestii
        const {db, client} = await connectToDb();
        try{
            const products = await db.collection('products').find({}).toArray();
            
            for(const product of products){
                const last_flower_params = await db.collection('last_params').findOne({flower_id: product['_id']});
                if(!last_flower_params)
                {
                    await db.collection('last_params').insertOne({...this.getSensorData(), flower_id: product['_id']});
                }
                else{
                    await db.collection('last_params').updateOne({_id: last_flower_params['_id']}, {$set: this.getSensorDelta(last_flower_params)});
                }
            }
        }catch(error){
            console.log(error);
        }
        finally{
            client.close();
        }
    }

    start(){
        if(this.interval_id!=null)
            clearInterval(this.interval_id);
        this.interval_id = setInterval(this.update.bind(this), 5000);
    }
}