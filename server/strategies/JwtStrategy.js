const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user');
const user = require('../models/user');

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
};

passport.use(
    new JwtStrategy(jwtOptions,  async (jwtPayload, done) => {
        try
        {
            const user =  await User.findOne({ _id: jwtPayload._id });
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        }
        catch(err){
            return done(err, false);
        }
    })
);


