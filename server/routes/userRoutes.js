const express = require('express');
const router = express.Router();
const passport = require('passport');
const { verifyUser} = require('../authentificate');
const userController = require('../controllers/userController');



// @desc    register user
// @route   POST /users/signup
// @access  Private
router.post('/signup', userController.signup);

// @desc    login user
// @route   POST /users/login
// @access  Private
router.post('/login', passport.authenticate('local', {session: false }), userController.login);


// @desc    refresh token
// @route   POST /users/refreshToken
// @access  Private
router.post('/refreshToken', userController.refreshToken);

router.get("/me", verifyUser, (req, res, next) => {

    res.send(req.user)
  
  });

// @desc    logout user
// @route   POST /users/logout
// @access  Private
router.get('/logout', verifyUser, userController.logout);

module.exports = router;
