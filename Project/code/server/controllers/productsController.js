import { connectToDb } from "../db.js";
import Validator from "../validator.js";
import { requireAuth } from "../middlewares.js";


const productValidator = new Validator()
    .addRule('category_name', 'string', null)
    .addRule('name', 'string', null)
    .addRule('price', 'number', null)
    .addRule('user_description', 'string', null)
    .addRule('image_url', 'string', null)
    .addRule('flower_data', 'object', new Validator()
        .addRule('flower_type', 'string', null)
        .addRule('optimal_soil', 'string', null)
        .addRule('general_description', 'string', null)
        .addRule('season', 'string', null));


const productHandleValidator = new Validator()
    .addRule('category_name', 'string', null)
    .addRule('name', 'string', null);


export default class ProductsController {
    static async addProductToCart(req, res, userSession) {
        const { db, client } = await connectToDb();

        const session = client.startSession();
        session.startTransaction();

        try {
            const productHandle = {...req.body};
            const validInfo = productHandleValidator.validate(productHandle);
            if(!validInfo.valid) {
                res.statusCode = 400;
                return res.end(validInfo.serialize());
            }

            const categories = db.collection('categories');

            const category = await categories.findOne({name: productHandle.category_name});
            if(category === null) {
                res.statusCode = 400;
                return res.end('Category is not available');
            }

            const product = category.products.find(product => product.name = productHandle.name);
            if(!product) {
                res.statusCode = 400;
                return res.end('Product is not available');
            }

            const carts = db.collection('carts');
            const cart = await carts.findOne({user_id: userSession.user_id});
            if(cart === null) {
                await carts.insertOne({user_id: userSession.user_id, created_at: new Date(), products: []});
            }

            await categories.updateOne(
                { _id: category._id },
                { $pull: { products: { _id: product._id } } }
            )

            await carts.updateOne(
                { user_id: userSession.user_id },
                { $push: { products: product } }
            );

            await session.commitTransaction();

            res.end();
        } catch(e) {
            await session.abortTransaction();
            console.log(e);
            res.statusCode = 500;
            res.end();
        } finally {
            session.endSession();
            await client.close();
        }
    }

    static async getCartProducts(req, res, userSession) {
        const { db, client } = await connectToDb();

        try {
            const userId = userSession.user_id;
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
        } finally {
            await client.close();
        }
    }

    static async addProduct(req, res, userSession) {
        const { db, client } = await connectToDb();

        try {
            const product = {...req.body};

            const validInfo = productValidator.validate(product);
            if(!validInfo.valid) {
                res.statusCode = 400;
                return res.end(validInfo.serialize());
            }
            
            product['seller_id'] = userSession.user_id;

            const categories = db.collection('categories');

            const category = await categories.findOne({name: product.category_name});
            if(category === null) {
                await categories.insertOne({name: product.category_name, products: []})
            }

            await categories.updateOne(
                { name: product.category_name },
                { $push: { products: product } }
            );
    
            res.end();
        } catch(e) {
            console.log(e);
            res.statusCode = 500;
            res.end();
        } finally {
            await client.close();
        }
    }

    static async getProducts(req, res) {
        const { db, client } = await connectToDb();

        // TODO: get by filters

        try {
            const categories = db.collection('categories');

            const products = await categories.find({}).toArray();
            res.write(JSON.stringify(products));
            res.end();
        } catch(e) {
            console.log(e);
            res.statusCode = 500;
            res.end();
        } finally {
            await client.close();
        }
    }

    static registerRoutes(router) {
        router.get('/cart_products', requireAuth(this.getCartProducts));
        router.post('/cart_products', requireAuth(this.addProductToCart));

        router.get('/products', requireAuth(this.getProducts));
        router.post('/products', requireAuth(this.addProduct));
    }
}
