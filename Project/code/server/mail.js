import { EMAIL_CONFIG } from './settings.js';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport(EMAIL_CONFIG);


const sendMail = () => {
    // TODO: make it work
    const from = "webgardening2023@gmail.com";

    const data = {
        from,
        to: "cosminturtureanu1234@gmail.com",
        subject: "Test",
        text: "WG",
        html: "<p>HTML version of the message</p>"
    };


    transporter.sendMail(data, (err, info) => {
        if(err) {
            console.log(err);
            return
        }

        console.log("Email sent!");
    })
}

export { sendMail };
