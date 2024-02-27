const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

//appelé lors du sign in et signup
passport.use(new LocalStrategy(User.authenticate()));

//appelé lors de l'authentification pour stocker l'utilisateur dans la session
passport.serializeUser(User.serializeUser());
