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
    url:`https://www.hobbydb.com/api/catalog_items?filters=%7B%22q%22:%7B%220%22:%22${upc}%22%7D,%22in_collection%22:%22all%22,%22in_wishlist%22:%22all%22,%22on_sale%22:%22all%22,%22brand%22:%22380%22,%22series%22:%2249962%22,%22type_id%22:148%7D&from_index=true&include_cit=true&include_count=false&include_last_page=true&include_main_images=true&market_id=hobbydb&order=%7B%22name%22:%22created_at%22,%22sort%22:%22desc%22%7D&page=1&per=6&serializer=CatalogItemPudbSerializer&subvariants=true`
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
