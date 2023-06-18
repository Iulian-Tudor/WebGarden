const PORT = 3000;

const SESSION_TTL = 60 * 60 * 24 * 7; // 1 week

const WHITELIST = [
    '/html/index.html',
    '/html/login.html',
    '/html/signup.html',
    '/html/reset.html',
    '/html/resetPass.html',
    '/html/passwordChanged.html',
    '/html/passwordEmail.html',
    '/html/scholarly.html',
    '/html/about.html',
    '/html/checkEmail.html',
    '/html/emailChecked.html',
    '/html/emailAlreadyChecked.html',
];

export { PORT, SESSION_TTL, WHITELIST };
