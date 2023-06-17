import { connectToDb } from "../db/db.js";
import Validator from "../validator.js";
import { requireAuth } from "../Utils/middlewares.js";
import { ObjectId } from "mongodb";


const productValidator = new Validator()
    .addRule('category_name', 'string', null)
    .addRule('name', 'string', null)
    .addRule('price', 'number', null)
    .addRule('user_description', 'string', null)
    .addRule('image_url', 'string', null)
    .addRule('flower_data', 'object', new Validator()
        .addRule('season', 'string', null)
        .addRule('optimal_parameters', 'object', new Validator()
            .addRule('soil', 'string', null)
            .addRule('humidity', 'number', null)
            .addRule('temperature', 'number', null)
            .addRule('water', 'number', null)));


const productHandleValidator = new Validator()
    .addRule('category_name', 'string', null)
    .addRule('name', 'string', null)
    .addRule('seller_id', 'string', null)
    .addRule('price', 'number', null);


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

            productHandle['quantity'] = productHandle['quantity'] ?? 1;

            const product = await db.collection('products').findOne({
                category_name: productHandle['category_name'],
                name: productHandle['name'],
                seller_id: new ObjectId(productHandle['seller_id']),
                price: productHandle['price']
            });
            
            if(!product || !product.quantity) {
                res.statusCode = 400;
                return res.end('Product is not available');
            }

            const carts = db.collection('carts');
            let cart = await carts.findOne({user_id: userSession.user_id});
            if(cart === null) {
                await carts.insertOne({user_id: userSession.user_id, created_at: new Date(), products: []});
                cart = await carts.findOne({user_id: userSession.user_id});
            }

            const storedCartProduct = cart.products.find(product => {
                return product.name === productHandle['name']
                    && product.seller_id.equals(productHandle['seller_id'])
                    && product.price === productHandle['price']
                    && product.category_name === product['category_name'];
            });

            // decrement the quantity
            // await categories.updateOne(
            //     { name: product['category_name'] },
            //     { $set: { "products.$[element].quantity": product['quantity'] } },
            //     { arrayFilters: [{ "element._id": product._id }] }
            // );

            if(!storedCartProduct) {
                const addedCount = Math.min(productHandle['quantity'], product['quantity']);
                if(addedCount <= 0) {
                    res.statusCode = 400;
                    return res.end();
                }
                await carts.updateOne(
                    { user_id: userSession.user_id },
                    { $push: { products: {...product, quantity: addedCount} } }
                );
            } else {
                const addedCount = Math.min(storedCartProduct['quantity'] + productHandle['quantity'], product['quantity']);
                if(addedCount <= 0) {
                    res.statusCode = 400;
                    return res.end();
                }
                await carts.updateOne(
                    { user_id: new ObjectId(userSession.user_id) },
                    { $set: { "products.$[element].quantity": addedCount } },
                    { arrayFilters: [{ 
                        "element.name": storedCartProduct.name,
                        "element.seller_id": storedCartProduct.seller_id,
                        "element.price": storedCartProduct.price,
                        "element.category_name": storedCartProduct.category_name 
                    }] }
                );
            }

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

    static async deleteCartProducts(req, res, userSession) {
        const { db, client } = await connectToDb();

        try {
            const productHandle = {...req.body};
            const validInfo = productHandleValidator.validate(productHandle);
            if(!validInfo.valid) {
                res.statusCode = 400;
                return res.end(validInfo.serialize());
            }

            const carts = db.collection('carts');

            await carts.updateOne(
                { user_id: new ObjectId(userSession.user_id) },
                { $pull: { products: { name: productHandle['name'], seller_id: new ObjectId(productHandle['seller_id']), price: productHandle['price'], category_name: productHandle['category_name'] } } }
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
            product['quantity'] = product['quantity'] ?? 1;

            const products = db.collection('products');

            let storedProduct = await products.findOne({
                category_name: product['category_name'],
                name: product['name'],
                seller_id: new ObjectId(product['seller_id']),
                price: product['price']
            });

            if(!storedProduct) {
                await products.insertOne(product);
            } else {
                product['quantity'] += storedProduct['quantity'];
                await products.updateOne(storedProduct, {$set: {quantity: product['quantity']}});
            }

            storedProduct = await products.findOne({
                category_name: product['category_name'],
                name: product['name'],
                seller_id: new ObjectId(product['seller_id']),
                price: product['price']
            });

            res.end(JSON.stringify({ flower_id: storedProduct._id }));
        } catch(e) {
            console.log(e);
            res.statusCode = 500;
            res.end();
        } finally {
            await client.close();
        }
    }

    static async getFilters(req, res) {
        const { db, client } = await connectToDb();
        
        try {
            const products = await db.collection('products').find({}).toArray();

            const categoryOptions = products.map(product => product.category_name);
            const optimalSoilOptions = products.map(product => product.flower_data.optimal_parameters.soil);
            const seasonOptions = products.map(product => product.flower_data.season);

            const filters = [
                {
                    name: 'category',
                    options: [...new Set(categoryOptions)]
                },
                {
                    name: 'optimal_soil',
                    options: [...new Set(optimalSoilOptions)]
                },
                {
                    name: 'season',
                    options: [...new Set(seasonOptions)]
                }
            ];

            return res.end(JSON.stringify(filters));
        } catch(e) {
            console.log(e);
            res.statusCode = 500;
            res.end();
        } finally {
            client.close();
        }
    }

    static async getProducts(req, res) {
        const { db, client } = await connectToDb();

        const filters = {...req.params};

        function nameMatch(completeName, name) {
            completeName = completeName.toLowerCase();
            name = name.toLowerCase();

            let score = 0;

            const completeTokens = completeName.split();
            const tokens = [...new Set(name.split())];

            for(const token of tokens) {
                if(completeTokens.indexOf(token) !== -1) {
                    score += 2;
                } else if(completeName.indexOf(token) !== -1) {
                    score += 1;
                }
            }
            return score;
        }

        try {
            const allProducts = await db.collection('products').find({}).toArray();

            let products = allProducts.filter(p => {
                return (!filters['category'] || filters['category'] === p.category_name)
                    && (!filters['optimal_soil'] || filters['optimal_soil'] === p.flower_data.optimal_parameters.soil)
                    && (!filters['season'] || filters['season'] === p.flower_data.season);
            });

            if(filters['name']) {
                const scoreCache = new Map();
                const searchName = filters['name'];
    
                products = products.sort((a, b) => {
                    const key1 = JSON.stringify([a.name, searchName]);
                    const key2 = JSON.stringify([b.name, searchName]);
                    const score1 = scoreCache.has(key1) ? scoreCache.get(key1) : nameMatch(a.name, searchName);
                    const score2 = scoreCache.has(key2) ? scoreCache.get(key2) : nameMatch(b.name, searchName);

                    scoreCache.set(key1, score1);
                    scoreCache.set(key2, score2);

                    return score2 - score1;
                });
            }

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

    static async getProduct(req, res) {
        const { db, client } = await connectToDb();

        try {
            const { flower_id } = req.params;

            const product = await db.collection('products').findOne({_id: new ObjectId(flower_id)});

            if(!product) {
                res.statusCode = 400;
                return res.end('Product is not available');
            }

            res.write(JSON.stringify(product));
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
        router.delete('/cart_products', requireAuth(this.deleteCartProducts));

        router.get('/products', requireAuth(this.getProducts));
        router.post('/products', requireAuth(this.addProduct));

        router.get('/product', requireAuth(this.getProduct));
        
        router.get('/filters', requireAuth(this.getFilters));
    }
}
