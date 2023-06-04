import { loginUser } from "./controllers/loginController.js";
import { registerUser } from "./controllers/signupController.js";
import { logoutUser } from "./controllers/logoutController";


function registerRoutes(router) {
    router.get('/', (req, res) => {
        res.write('Hello world');
        res.statusCode = 200;
        res.end();
    });

    router.get('/login', loginUser);
    router.get('/register', registerUser);
    router.get('/logout', logoutUser);
}

export { registerRoutes };
