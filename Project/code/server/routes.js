import { loginUser } from "./controllers/loginController.js";
import { registerUser } from "./controllers/signupController.js";
import { logoutUser } from "./controllers/logoutController.js";
import ProductsController from "./controllers/productsController.js";
import { verifyEmail } from "./Utils/emailVerification.js";
import { requestPasswordReset, resetPassword } from './Utils/resetPassword.js';
import { handlePlantedFlowers, handleReadyFlowers } from "./plantedFlowers.js";
import { getNotification } from "./controllers/notificationController.js";
import { getWatchlist } from "./controllers/watchlistController.js";
import { requireAuth } from "./Utils/middlewares.js";
import { addToWatchlist } from "./controllers/addToWatchlist.js";


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
    router.post('/logout', requireAuth(logoutUser));
    router.post('/request-password-reset', requestPasswordReset);
    router.post('/reset-password', resetPassword);
    router.post('/add-to-watchlist', requireAuth(addToWatchlist));
    ProductsController.registerRoutes(router);
    router.get('/notifs', requireAuth(getNotification));
    router.get('/watchlist', requireAuth(getWatchlist));
    router.get('/plantedFlowers', requireAuth(handlePlantedFlowers));
    router.get('/readyFlowers', requireAuth(handleReadyFlowers));
    router.get('/verify-email', verifyEmail);
}

export { registerRoutes };
