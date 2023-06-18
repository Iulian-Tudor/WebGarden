import { connectToDb } from '../db/db.js';
import bcryptjs from 'bcryptjs';
import validator from 'validator';
import sanitize from 'mongo-sanitize';
import { sendVerificationEmail } from '../Utils/emailVerification.js';


export async function registerUser(req, res) {
  // DONE: verificare daca nu exista deja contul
  try {
    const { email, username, password } = req.body;

    // Validate and sanitize inputs
    if (!validator.isEmail(email)) {
      res.statusCode = 400;
      res.end(JSON.stringify({ message: 'Invalid email' }));
      return;
    }
    const sanitizedEmail = sanitize(email);
    
    if (!validator.isLength(username, { min: 3 })) {
      res.statusCode = 400;
      res.end(JSON.stringify({ message: 'Username must be at least 3 characters long' }));
      return;
    }
    const sanitizedUsername = sanitize(username);

    if (!validator.isLength(password, { min: 6 })) {
      res.statusCode = 400;
      res.end(JSON.stringify({ message: 'Password must be at least 6 characters long' }));
      return;
    }
    

    // Connect to the database and create a new user
    const { db, client } = await connectToDb();
    const existingUser = await db.collection('users').findOne({
      $or: [{ email: sanitizedEmail }, { username: sanitizedUsername }],
    });

    if (existingUser) {
      res.statusCode = 400;
      res.end(JSON.stringify({ message: 'Email or username already taken' }));
      return;
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    const newUser = { email: sanitizedEmail, username: sanitizedUsername, password: hashedPassword, verified: false };
    const result = await db.collection('users').insertOne(newUser);
    await sendVerificationEmail(sanitizedEmail, result.insertedId);
    client.close();
  
    res.setHeader('Location', '/html/checkEmail.html'); // Set the Location header to the desired redirect path
    res.statusCode = 200; // Set the status code to 302 for a temporary redirect
    res.end();
  } catch (error) {
    console.log(error);
    res.statusCode = 500;
    res.end(JSON.stringify({ message: 'Error registering user', error }));
  }
}



