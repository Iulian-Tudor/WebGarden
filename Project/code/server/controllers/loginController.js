import { connectToDb } from '../db.js';
import bcrypt from 'bcryptjs';
import sanitize from 'mongo-sanitize';
import cookie from 'cookie';

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

    // Compare the hashed password with the given password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      res.statusCode = 401;
      res.end('Invalid password');
      return;
    }

    // If everything is correct, return a success message
    // TODO: crypt the token to be sent to the user (crypt, not hash)
    const userCookie = cookie.serialize('X-WEBGA-TOKEN', sanitizedEmail, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });

    await db.collection('user_sessions').insertOne({token: sanitizedEmail, user_id: user._id, createdAt: new Date()});
    
    // needs to be created only once, at database creation
    await db.collection('user_sessions').createIndex({createdAt: 1}, { expireAfterSeconds: 60 });
    

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
