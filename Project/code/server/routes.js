import { loginUser } from "./controllers/loginController.js";
import { registerUser } from "./controllers/signupController.js";
import { logoutUser } from "./controllers/logoutController.js";
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
    router.get('/notifs', handleNotifications);
    router.get('/watchlist', handleWatchlist);
    router.get('/plantedFlowers', handlePlantedFlowers);
    router.get('/readyFlowers', handleReadyFlowers);
}

export { registerRoutes };
