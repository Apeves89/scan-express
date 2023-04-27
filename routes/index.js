const express = require('express');
const router = express.Router();
const passport = require('passport');
const axios = require('axios')
const PopModel = require('../models/pop')
const isLoggedIn = require('../config/auth')
// const request = require('request');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/search/:page',isLoggedIn, async function(req, res, next) {
  const upc = req.query.upc
  const page = req.params.page
  const apiUrl = process.env.API_START+upc+process.env.API_MID+page+process.env.API_END
  // const options = {
  //   url:apiUrl
  // }
  let count = 0
  if (req.user) {
  const query = await PopModel.find({userId:req.user._id})
  count = await PopModel.countDocuments({userId:req.user._id})
  }
  axios.get(apiUrl).then((response) =>{
    const hobby = response.data.data
    const lastPage = response.data.meta.lastPage
    console.log(lastPage)
    res.render('search', { title: 'Express','hobbydb': hobby, 'upc':upc, 'count':count, 'lastPage':lastPage, 'page':page });

  })
  // request(options,function(err,response,body) {
  //   const data = JSON.parse(body)
  // })
});
router.post('/add',isLoggedIn,function(req,res,next){
  req.body.upc = Number(req.body.upc)
  req.body.refNum = Number(req.body.refNum)
  req.body.userId = req.user._id
  PopModel.create(req.body).then(function(popCreated) {
    console.log(popCreated,'<- pop doc')
    res.redirect('/search/1')    
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
    successRedirect: '/search/1',
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
