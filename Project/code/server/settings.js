const PORT = 3000;

const EMAIL_CONFIG = {
    host: "smtp.gmail.com",
    port: 587,
    tls: {
        rejectUnauthorized: true,
        minVersion: "TLSv1.2"
    }
}

export { PORT, EMAIL_CONFIG };
