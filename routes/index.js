var express = require('express');
var router = express.Router();
const passport = require('passport');
const request = require('request');
const PopModel = require('../models/pop')
const isLoggedIn = require('../config/auth')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/search', async function(req, res, next) {
  const upc = req.query.upc
  const apiUrl = process.env.API_START+upc+process.env.API_END
  const options = {
    url:apiUrl
  }
  let count = 0
  if (req.user) {
  const query = await PopModel.find({userId:req.user._id})
  count = await PopModel.countDocuments({userId:req.user._id})
  console.log(query,count)
  }else{
  
  }
  request(options,function(err,response,body) {
    const data = JSON.parse(body)
    res.render('search', { title: 'Express','hobbydb': data.data, 'upc':upc, 'count':count });
        
  })
});
router.post('/add',isLoggedIn,function(req,res,next){
  req.body.upc = Number(req.body.upc)
  req.body.refNum = Number(req.body.refNum)
  req.body.userId = req.user._id
  PopModel.create(req.body).then(function(popCreated) {
    console.log(popCreated,'<- pop doc')
    res.redirect('/search')    
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
    successRedirect: '/search',
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
