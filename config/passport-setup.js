const passport = require('passport');
const keys = require('./keys');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user-model');

passport.use(
    new GoogleStrategy({
        // options for google strategy
        callbackURL: '/auth/google/redirect',
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret

    }, (acessToken, refreshToken, profile, done) => {
        // passport callback function
        User.findOne({
                googleId: profile.id
            })
            .then((currentUser) => {
                if (currentUser) {
                    console.log("hey currentuser ", currentUser);
                    done(null, currentUser);
                } else {
                    new User({
                        username: profile.displayName,
                        googleId: profile.id,
                    }).save().then((newUser) => {
                        console.log(newUser);
                        done(null, newUser)

                    }).catch((err) => {
                        console.log(err.message);
                    })
                }
            }).catch((err) => {
                console.log(err.message);
            })
    })
);

passport.serializeUser((user, done) => {
    done(null, user.id)
});

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    }).catch((error)=>{
        console.log(error.message);
    });
});