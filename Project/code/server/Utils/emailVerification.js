import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { ObjectId } from 'mongodb';
import { connectToDb } from '../db/db.js';

export async function sendVerificationEmail(sanitizedEmail, userId) {

    const token = jwt.sign(
        { userId: userId },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
    );

    const transporter = nodemailer.createTransport({
        host: 'smtp-mail.outlook.com',
        secureConnection: true,
        port: 587,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    const verificationLink = `${process.env.BASE_URL}/verify-email?token=${token}`;

    const mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: sanitizedEmail,
        subject: "Email Verification",
        html: `<p>Please click the link below to verify your email address:</p><a href="${verificationLink}">${verificationLink}</a>`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log("Email sent: " + info.response);
        }
    });

}

export async function verifyEmail(req, res) {
    const { token } = req.params;
    const { token } = req.params;
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const { userId } = decoded;
  
      const { db, client } = await connectToDb();
      const user = await db.collection("users").findOne({ _id: new ObjectId(userId) });
      const user = await db.collection("users").findOne({ _id: new ObjectId(userId) });
  
      if (!user) {
        res.statusCode = 400;
        res.end(JSON.stringify({ message: "Invalid token" }));
        return;
      }
  
      if (user.verified) {
        res.setHeader('Location', '/html/emailAlreadyChecked.html'); // Set the Location header to the desired redirect path
        res.statusCode = 302; // Set the status code to 302 for a temporary redirect
        res.end()
        return;
      }
  
      await db.collection("users").updateOne(
        { _id: new ObjectId(userId) },
        { _id: new ObjectId(userId) },
        { $set: { verified: true } }
      );
  
      client.close();
  
      res.setHeader('Location', '/html/emailChecked.html'); // Set the Location header to the desired redirect path
      res.statusCode = 302; // Set the status code to 302 for a temporary redirect
      res.end()
    } catch (error) {
      console.log(error);
      res.statusCode = 500;
      res.end(JSON.stringify({ message: "Error verifying email", error }));
    }
  }
  
