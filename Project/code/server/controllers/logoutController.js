import cookie from 'cookie';

function logoutUser(req, res) {
  const clearCookie = cookie.serialize('user_email', '', {
    httpOnly: true,
    maxAge: -1, // Clear the cookie immediately
    path: '/',
  });

  res.setHeader('Set-Cookie', clearCookie);
  res.statusCode = 200;
  res.end('Logout successful');
}

export { logoutUser };
