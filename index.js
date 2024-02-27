const express = require('express');
const session = require('express-session'); //To handle the session and its function is put after const app = express()
const passport = require('passport');
require('./auth');


//Function to check if a user is logged in
const isLoggedIn = (req, res, next) => {
  
  req.user ? next() : res.sendStatus(401);  //If user is logged in, move to next middleware, else return 401 - unauthorized
}

const app = express();
app.use(session({ secret: 'cats' })); //For the session imported above
app.use(passport.initialize());
app.use(passport.session()); // To handle the sessions

//Provide a link for authenticating with google
app.get('/', (req, res) => {
  res.send('<a href="/auth/google">Authenticate with google</a>');
});


// When the link above is hit, should direct to google authenticator
// Can have as may as possible eg facebook, twitter
// The scope below defines the kind of info to be retrieved from the google profile
app.get('/auth/google', 
  passport.authenticate('google', {scope: ['email', 'profile'] })
);


//Provide a call back link to be reached after the authentication has been done
// The call back link was defined in the auth.js file
//Provide a success redirect and a failure redirect
//Success is the next link after the successful redirecting and the failure is the opposite as shown below
app.get('/auth/google/callback',
  passport.authenticate('google', {
    successRedirect: '/protected',
    failureRedirect: '/auth/failedauthentication'
  })
);

//Protected route only accessible after successful log in and authentication
// Add the is logged in function to check if the user is logged in or not
app.get('/protected',isLoggedIn, (req, res) => {
  res.send(`${req.user.displayName} You are seeing this coz you are authenticated`);
})


//Failed authentication route nly accessible after unsuccessful authentication
app.get('/auth/failedauthentication', (req, res) => {
  res.send('You are seeing this coz you are not authenticated');
});

// To Log out
app.get('/logout', (req, res) => {
  req.logout();
  res.send('You are seeing this coz you are logged out');
//  req.session.destroy(); // Destroys the session
//  res.redirect('/logIn'); // Provide a link to redirect user to the login page or any other intended page
})  


//Port hosting the application
app.listen(5000, () =>{
  console.log('Server running on port: 5000');
})