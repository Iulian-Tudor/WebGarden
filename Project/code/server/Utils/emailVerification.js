import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { ObjectId } from 'mongodb';
import { connectToDb } from '../db/db.js';

export async function sendVerificationEmail(sanitizedEmail, userId) {

    const token = jwt.sign(
        { userId: result.insertedId },
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
    const { token } = req.query;
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const { userId } = decoded;
  
      const { db, client } = await connectToDb();
      const user = await db.collection("users").findOne({ _id: ObjectId(userId) });
  
      if (!user) {
        res.statusCode = 400;
        res.end(JSON.stringify({ message: "Invalid token" }));
        return;
      }
  
      if (user.verified) {
        res.statusCode = 200;
        res.end(JSON.stringify({ message: "Email already verified" }));
        return;
      }
  
      await db.collection("users").updateOne(
        { _id: ObjectId(userId) },
        { $set: { verified: true } }
      );
  
      client.close();
  
      res.statusCode = 200;
      res.end(JSON.stringify({ message: "Email verified successfully" }));
    } catch (error) {
      console.log(error);
      res.statusCode = 500;
      res.end(JSON.stringify({ message: "Error verifying email", error }));
    }
  }
  
