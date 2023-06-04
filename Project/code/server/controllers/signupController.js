import { connectToDb } from '../db.js';
import bcryptjs from 'bcryptjs';
import validator from 'validator';
import sanitize from 'mongo-sanitize';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';


export async function registerUser(req, res) {
  try {
    const { email, username, password } = JSON.parse(req.body);

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
    //const sanitizedPassword = sanitize(password);

    // Connect to the database and create a new user
    const { db, client } = await connectToDb();
    const hashedPassword = await bcryptjs.hash(password, 10);
    const newUser = { email: sanitizedEmail, username: sanitizedUsername, password: hashedPassword };
    const result = await db.collection('users').insertOne(newUser);
    client.close();
  
    res.statusCode = 201;
    res.end(JSON.stringify({ message: 'User registered successfully', result }));
  } catch (error) {
    res.statusCode = 500;
    res.end(JSON.stringify({ message: 'Error registering user', error }));
  }
}



