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
        let water_value = flower_params['water'] + this.getRandomFloat([-1, 1]);

        if(water_value<this.water_bounds[0])
            water_value = this.water_bounds[0];

        if(water_value>this.water_bounds[1])
            water_value = this.water_bounds[1];
        
        let temp_value = flower_params['temp'] + this.getRandomFloat([-1, 1]);

        if(temp_value<this.temperature_bounds[0])
            temp_value = this.temperature_bounds[0];

        if(temp_value>this.temperature_bounds[1])
            temp_value = this.temperature_bounds[1];

        let hum_value = flower_params['humidity'] + this.getRandomFloat([-1, 1]);

        if(hum_value<this.humidity_bounds[0])
            hum_value = this.humidity_bounds[0];

        if(hum_value>this.humidity_bounds[1])
            hum_value = this.humidity_bounds[1];

        const data = {
            "water": water_value,
            "soil": flower_params['soil'],
            "temperature": temp_value,
            "humidity": hum_value
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
                await this.analyzeImage(product);
            }
        }catch(error){
            console.log(error);
        }
        finally{
            client.close();
        }
    }

    async analyzeImage(product) {
        if(product.harvestable === true)
            return;
        
        const {db, client} = await connectToDb();

        const prob = this.getRandomInt([0, 100]);

        if(prob < 30)
        {
            await db.collection('products').updateOne({_id: product._id}, {$set: {harvestable: true}});
        }
    }

    start(){
        if(this.interval_id!=null)
            clearInterval(this.interval_id);
        this.interval_id = setInterval(this.update.bind(this), 5000);
    }
}