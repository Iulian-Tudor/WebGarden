import { connectToDb } from '../db/db.js';
import { encrypt, decrypt } from '../Utils/cryptoUtils.js';
import bcrypt from 'bcryptjs';
import sanitize from 'mongo-sanitize';
import cookie from 'cookie';
import { SESSION_TTL } from '../settings.js';

export async function loginUser(req, res) {
  const { email, password } = req.body;

  // Sanitize user inputs
  const sanitizedEmail = sanitize(email);
  //const sanitizedPassword = sanitize(password);

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
    const userCookie = cookie.serialize('X-WEBGA-TOKEN', encryptedEmail, {
      httpOnly: true,
      maxAge: SESSION_TTL,
      path: '/',
    });
    
    // DONE: verificare daca deja exista acea sesiune. Si daca da... i guess update it?
    const existingSession = await db.collection('user_sessions').findOne({ user_id: user._id });

    if (existingSession) {
      await db.collection('user_sessions').updateOne(
        { user_id: user._id },
        { $set: { token: encryptedEmail, createdAt: new Date() } }
      );
    } else {
      await db.collection('user_sessions').insertOne({
        token: encryptedEmail,
        user_id: user._id,
        createdAt: new Date(),
      });
    }

    
    
    res.setHeader('Set-Cookie', userCookie);
    res.statusCode = 200;
    res.end('Login successful');

    
  } catch (error) {
    console.log(error);
    res.statusCode = 500;
    res.end('Internal server error');
  } finally {
    client.close();
  }
}
