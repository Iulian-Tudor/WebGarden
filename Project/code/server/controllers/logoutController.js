import { connectToDb } from '../db/db.js';
import cookie from 'cookie';

async function logoutUser(req, res) {
  // Get the encrypted email from the cookie
  const cookies = cookie.parse(req.headers.cookie || '');
  const encryptedEmail = cookies['X-WEBGA-TOKEN'];

  // Connect to the database
  const { db, client } = await connectToDb();

  try {
    // Delete the user session from the database
    await db.collection('user_sessions').deleteOne({ token: encryptedEmail });

    // Clear the cookie
    const clearCookie = cookie.serialize('X-WEBGA-TOKEN', '', {
      httpOnly: true,
      maxAge: -1,
      path: '/',
    });

    res.setHeader('Set-Cookie', clearCookie);
    res.setHeader('Location', '/html/login.html'); // Set the Location header to the desired redirect path
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

export { logoutUser };
