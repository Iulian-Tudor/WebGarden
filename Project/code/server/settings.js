const PORT = 3000;

const SESSION_TTL = 60 * 60 * 24 * 7; // 1 week

const EMAIL_CONFIG = {
    host: "smtp.gmail.com",
    port: 587,
    tls: {
        rejectUnauthorized: true,
        minVersion: "TLSv1.2"
    }
}

export { PORT, SESSION_TTL, EMAIL_CONFIG };
