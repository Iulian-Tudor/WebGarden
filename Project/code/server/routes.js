import { loginUser } from "./controllers/loginController.js";
import { registerUser } from "./controllers/signupController.js";
import { logoutUser } from "./controllers/logoutController.js";
import ProductsController from "./controllers/productsController.js";
import { verifyEmail } from "./Utils/emailVerification.js";
import { requestPasswordReset, resetPassword } from './Utils/resetPassword.js';
import { handleNotifications } from "./notifications.js";
import { handleWatchlist } from "./watchlist.js";
import { handlePlantedFlowers, handleReadyFlowers } from "./plantedFlowers.js";


function registerRoutes(router) {
    router.get('/', (req, res) => {
        res.statusCode = 302;
        res.setHeader('Location', '/html/index.html');
        res.end();
    });

    router.post('/', (req, res) => {
        console.log(req.body);
        res.end();
    });

    router.post('/login', loginUser);
    router.post('/register', registerUser);
    router.post('/logout', logoutUser);
    router.post('/request-password-reset', requestPasswordReset);
    router.post('/reset-password', resetPassword);
    ProductsController.registerRoutes(router);
    router.get('/notifs', handleNotifications);
    router.get('/watchlist', handleWatchlist);
    router.get('/plantedFlowers', handlePlantedFlowers);
    router.get('/readyFlowers', handleReadyFlowers);
    router.get('/verify-email', verifyEmail);
}

export { registerRoutes };
