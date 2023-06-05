import { connectToDb } from "../db.js";
import Validator from "../validator.js";
import cookie from 'cookie';


const productValidator = new Validator()
    .addRule('seller_id', 'number', null)
    .addRule('category_name', 'string', null)
    .addRule('name', 'string', null)
    .addRule('price', 'number', null)
    .addRule('user_description', 'string', null)
    .addRule('image_url', 'string', null)
    .addRule('flower_type', 'string', null);


export default class ProductsController {
    static async addProductToCart(req, res) {
        const { db, client } = await connectToDb();

        try {
            const product = req.body;
            const validInfo = productValidator.validate(product);
    
            if(!validInfo.valid) {
                res.statusCode = 400;
                res.write(JSON.stringify(validInfo));
                res.end();
                return;
            }

            const categories = db.collection('categories');

            const category = await categories.findOne({name: product.category_name});
            if(category === null) {
                await categories.insertOne({name: product.category_name, products: []})
            }

            await categories.updateOne(
                { name: product.category_name },
                { $push: { 'products': product } }
            );
    
            res.end();
        } catch(e) {
            console.log(e);
            res.statusCode = 500;
            res.end();
        } finally {
            client.close();
        }
    }

    static async getCartProducts(req, res) {
        const { db, client } = await connectToDb();

        try {
            const cookies = cookie.parse(req.headers.cookie);
            const sessionToken = cookies['X-WEBGA-TOKEN'];
            
            const session = await db.collection('user_sessions').findOne({token: sessionToken});
            if(session === null) {
                res.statusCode = 403;
                res.end("Session token not found");
                return;
            }

            const userId = session.user_id;

            const cart = await db.collection('carts').findOne({user_id: userId});

            if(cart === null) {
                res.write(JSON.stringify([]));
                res.end();
                return;
            }

            const products = cart.products;
            res.write(JSON.stringify(products));
            res.end();
        } catch(e) {
            console.log(e);
            res.statusCode = 500;
            res.end();
        }
    }

    static async getProductInfo(req, res) {
        try {

        } catch(e) {
            console.log(e);
            res.statusCode = 500;
            res.end();
        }
    }

    static async getProducts(req, res) {
        try {

        } catch(e) {
            console.log(e);
            res.statusCode = 500;
            res.end();
        }
    }

    static registerRoutes(router) {
        router.post('/cart_products', this.addProductToCart);
        router.get('/cart_products', this.getCartProducts);
        router.get('/product_info', this.getProductInfo);
        router.get('/products', this.getProducts);
    }
}
