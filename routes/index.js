var express = require('express');
var router = express.Router();
const passport = require('passport');
const request = require('request');
const PopModel = require('../models/pop')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/search', function(req, res, next) {
  const upc = req.query.upc
  const options = {
    url:process.env.API_START+upc+process.env.API_END
  }
  request(options,function(err,response,body) {
    const data = JSON.parse(body)
    console.log(data);
    res.render('search', { title: 'Express','hobbydb': data.data, 'upc':upc });
        
  })
});
router.post('/add',function(req,res,next){
  req.body.upc = Number(req.body.upc)
  req.body.refNum = Number(req.body.refNum)
  PopModel.create(req.body).then(function(popCreated) {
    console.log(popCreated,'<- pop doc')
    res.redirect('/')    
  }).catch((err) => {
    console.log(err);
    res.send('There was an error check the terminal, or log the err object')
  })
})

// Google OAuth login route
router.get('/auth/google', passport.authenticate(
  'google',
  {
    scope: ['profile', 'email'],
    // Optionally force pick account every time
    // prompt: "select_account"
  }
));

// Google OAuth callback route
router.get('/oauth2callback', passport.authenticate(
  'google',
  {
    successRedirect: '/',
    failureRedirect: '/'
  }
));

// OAuth logout route
router.get('/logout', function(req, res){
  req.logout(function() {
    res.redirect('/');
  });
});


module.exports = router;
