const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');

//local Imports
const passportSetup = require('./config/passport-setup')
const keys = require('./config/keys')

const authRouter = require('./routes/auth-routes');
const profileRouter = require('./routes/profile-routers');

const app = express();


//connect to mongo db
mongoose.connect(keys.mongodb.URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, () => {
    console.log("connected to mongodb");
})






// set view engine
app.set('view engine', 'ejs');


//middleware
app.use(morgan("dev"))
app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [keys.session.cookieKey]
}));


//initialize passport
app.use(passport.initialize())
app.use(passport.session())


//Router
app.use('/auth', authRouter)
app.use('/profile', profileRouter)

// create home route
app.get('/', (req, res) => {
    res.render('home',{
        user : req.user
    });
});

app.listen(3000, () => {
    console.log('app now listening for requests on port 3000');
});