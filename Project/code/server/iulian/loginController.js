import { connectToDb } from './db.js';
import bcrypt from 'bcryptjs';
import sanitize from 'mongo-sanitize';

export async function loginUser(req, res) {
  const { email, password } = req.body;

  // Sanitize user inputs
  const sanitizedEmail = sanitize(email);
  const sanitizedPassword = sanitize(password);

  // Connect to the database
  const { db, client } = await connectToDb();

  try {
    // Find the user with the given email
    const user = await db.collection('users').findOne({ email: sanitizedEmail });

    if (!user) {
      res.statusCode = 401;
      res.end('Invalid email or password');
      return;
    }

    // Compare the hashed password with the given password
    const isPasswordCorrect = await bcrypt.compare(sanitizedPassword, user.password);

    if (!isPasswordCorrect) {
      res.statusCode = 401;
      res.end('Invalid email or password');
      return;
    }

    // If everything is correct, return a success message
    const userCookie = cookie.serialize('user_email', sanitizedEmail, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });
  
    res.setHeader('Set-Cookie', userCookie);
    res.statusCode = 200;
    res.end('Login successful');

    
  } catch (error) {
    res.statusCode = 500;
    res.end('Internal server error');
  } finally {
    client.close();
  }
}
