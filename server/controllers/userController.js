const User = require('../models/user');
const {getToken, COOKIE_OPTIONS, getRefreshToken} = require('../authentificate');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const signup = async (req, res) => {
    if (!req.body.firstName){
      res.statusCode = 500;
      res.send({name: 'FirstNameError', message: 'firstName is required'});
    }else{
      User.register(
          new User({username: req.body.username,}),
          req.body.password,
          (err, user) => {
              if (err){
              res.statusCode = 500;
              res.send(err);
              }else{
                  user.firstName = req.body.firstName;
                  user.lastName = req.body.lastName || '';
                  const token = getToken({_id: user._id});
                  const refreshToken = getRefreshToken({_id: user._id});
                  user.refreshToken.push({refreshToken});
                  user.emailVerificationToken = crypto.randomBytes(20).toString('hex');
                  try
                  {
                      const userSend = user.save();
                      res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);
                      res.send({success: true, token: token});
  
                  }
                  catch (err){
                      res.statusCode = 500;
                      res.send(err);
                  }                  
              }
          }
      );
    };
  };

const refreshToken =  async (req, res, next) => {
    const { signedCookies = {} } = req;
    const {refreshToken} = signedCookies;
    if (refreshToken){
        try{
            const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            const userId = payload._id;
            const user = await User.findOne({_id: userId});
            if (user){
                const tokenIndex = user.refreshToken.findIndex(item => item.refreshToken === refreshToken);
                if (tokenIndex === -1){
                    res.statusCode = 401;
                    res.send('Unauthorized');
                }else{
                    const token = getToken({_id: userId});
                    const newRefreshToken = getRefreshToken({_id: userId});
                    user.refreshToken[tokenIndex] = {refreshToken: newRefreshToken};
                    try{
                        user.save();
                        res.cookie('refreshToken', newRefreshToken, COOKIE_OPTIONS);
                        res.send({success: true, token});
                    }
                    catch(err){
                        res.statusCode = 500;
                        res.send(err);
                    }
                }
            }else{
                res.statusCode = 401;
                res.send('Unauthorized');
            }
        }catch(err){
            res.statusCode = 401;
            res.send('Unauthorized');
        }
   
    }else{
        res.statusCode = 401;
        res.send('Unauthorized');
    }
};

const logout = async (req, res) => {
    const { signedCookies = {} } = req;
    const {refreshToken} = signedCookies;
    try{
        const curuser = await User.findById(req.user._id);
        if (curuser){
            const tokenIndex = curuser.refreshToken.findIndex(item => item.refreshToken === refreshToken);
            if (tokenIndex !== -1){
                curuser.refreshToken.id(curuser.refreshToken[tokenIndex]._id).deleteOne();
                try{
                    curuser.save();
                    res.clearCookie('refreshToken', COOKIE_OPTIONS);
                    res.send({success: true});
                }
                catch(err){
                    res.statusCode = 500;
                    res.send(err);
                }
            }else{
                res.statusCode = 401;
                res.send('Unauthorized');
            }
        }
        else{
            res.statusCode = 401;
            res.send('Unauthorized');
        }
    }
    catch(err){
        res.statusCode = 500;
        res.send(err);
    }
};

const login = async (req, res) => {
    console.log('login');
    const token = getToken({_id: req.user._id});
    const refreshToken = getRefreshToken({_id: req.user._id});
    try{
        const user = await User.findById(req.user._id);
        if (user){
            user.refreshToken.push({refreshToken});
            try{
                const userSend = user.save();
                res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);
                res.send({success: true, token});
            }
            catch(err){
                res.statusCode = 500;
                res.send(err);
                (err) => {next(err)};
            }
        }else{
            res.statusCode = 401;
            res.send('Unauthorized');
        }

    }catch(err){
        res.statusCode = 500;
        res.send(err);
    }
};

module.exports = {signup, refreshToken, logout, login};