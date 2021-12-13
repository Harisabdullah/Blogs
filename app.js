const express = require('express');
const morgan = require("morgan");
const app = express();


// Middlewares
app.use(morgan('dev'));
app.use(express.json());

//Routes
const style_route = require('./routes/styles_route');
const login_route = require('./routes/login_route');
const feed_route = require('./routes/feed_route');
const sign_up_route = require('./routes/signup_route');
const post_route = require('./routes/post_route');
const my_profile_route = require('./routes/my_profile_route')
const users_route = require('./routes/users_route')
// const profile_route = require('./routes/profile_route')
// const {get_sessions} = require("./user_sessions");


// app.use('/signUp', sign_up_route);
//app.use('/profile', profile_route);
// app.use('/my_profile', my_profile_route);




app.use('/stylesheets',style_route);
app.use('/login', login_route);
app.use('/feed', feed_route);
app.use('/signUp', sign_up_route);
app.use('/post', post_route);
app.use('/my_profile', my_profile_route);
app.use('/get_users', users_route);


app.use((req, res, next) => {
    res.statusCode = 200;
    res.sendFile(__dirname + '/templates/homepage.html');
})


module.exports = app;