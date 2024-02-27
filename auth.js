const passport = require('passport')
const dotenv = require('dotenv')
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;

dotenv.config();


//Passport strategy when one is authenticated with google
//move to google credentials and create credentials to get client id, secret key and set callback link


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/auth/google/callback",
    passReqToCallback: true
  },


  //Finding users in database and/or create one using the commented line of code
  function(request, accessToken, refreshToken, profile, done) {
   
   /*
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return done(err, user);
    });    */
    
      //profile.accessToken = accessToken;

    return done(null, profile)  //Returning null since no database will be involved in this demo
  }
));


// Passport serializes the user object to the session
// Stores a minimal amount of info by use of few User identifiers for use in the session
// Efficient to prevent lagging of server
passport.serializeUser(function(user, done){
  done(null, user)
});


// On subsequent requests, Passport deserializes the user object from the session
// Helps retrieve all the stateful user info from database when needed
passport.deserializeUser(function(user, done){
  done(null, user)
});


