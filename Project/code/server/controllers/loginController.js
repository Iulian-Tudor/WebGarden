import { connectToDb } from '../db/db.js';
import { encrypt, decrypt } from '../Utils/cryptoUtils.js';
import bcrypt from 'bcryptjs';
import sanitize from 'mongo-sanitize';
import cookie from 'cookie';
import { SESSION_TTL } from '../settings.js';

const LONG_SESSION_TTL = 30 * 24 * 60 * 60; // 30 days in seconds

export async function loginUser(req, res) {
  const { email, password, keepMeLoggedIn } = req.body;

  // Sanitize user inputs
  const sanitizedEmail = sanitize(email);

  // Connect to the database
  const { db, client } = await connectToDb();

  try {
    // Find the user with the given email
    const user = await db.collection('users').findOne({ email: sanitizedEmail });

    if (!user) {
      res.statusCode = 401;
      res.end('Invalid email');
      return;
    }

    if (!user.verified) {
      res.statusCode = 401;
      res.end('Email not verified');
      return;
    }

    // Compare the hashed password with the given password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      res.statusCode = 401;
      res.end('Invalid password');
      return;
    }

    // If everything is correct, return a success message
    const encryptedEmail = encrypt(sanitizedEmail);
    const maxAge = keepMeLoggedIn ? LONG_SESSION_TTL : SESSION_TTL;
    const userCookie = cookie.serialize('X-WEBGA-TOKEN', encryptedEmail, {
      httpOnly: true,
      maxAge: maxAge,
      path: '/',
    });

    const sessionExpiration = new Date();
    if (keepMeLoggedIn) {
      sessionExpiration.setSeconds(sessionExpiration.getSeconds() + LONG_SESSION_TTL);
    } else {
      sessionExpiration.setSeconds(sessionExpiration.getSeconds() + SESSION_TTL);
    }

    const existingSession = await db.collection('user_sessions').findOne({ user_id: user._id });

    if (existingSession) {
      await db.collection('user_sessions').updateOne(
        { user_id: user._id },
        { $set: { token: encryptedEmail, createdAt: new Date(), expiresAt: sessionExpiration } }
      );
    } else {
      await db.collection('user_sessions').insertOne({
        token: encryptedEmail,
        user_id: user._id,
        createdAt: new Date(),
        expiresAt: sessionExpiration,
      });
    }

    res.setHeader('Set-Cookie', userCookie);
    res.setHeader('Location', '/html/main_page.html'); // Set the Location header to the desired redirect path
    res.statusCode = 302; // Set the status code to 302 for a temporary redirect
    res.end();

  } catch (error) {
    console.log(error);
    res.statusCode = 500;
    res.end('Internal server error');
  } finally {
    client.close();
  }
}
