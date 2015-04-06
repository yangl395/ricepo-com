var express = require('express');
var router = express.Router();


//terms
router.get('/terms', function(req, res){
  res.render('terms');
});
//privacy
router.get('/privacy', function(req, res){
  res.render('privacy');
});
//wechat lucky money
router.get('/coupon', function(req, res){
  res.render('coupon');
});

/* GET home page. */
router.get('*', function(req, res) {
  var agent = req.header('User-Agent').toLowerCase();
  //iphone
  if(/iphone/i.test(agent)){
    res.redirect('https://itunes.apple.com/us/app/ricepo-chinese-food-delivery/id844835003?mt=8');
  }
  //android
  else if(/android/i.test(agent)){
    //res.sendfile(__dirname + '/public/Ricepo-release 1.1.1.apk');
    res.redirect('https://play.google.com/store/apps/details?id=com.ricepo.app');
  }
  //else
  else{
    res.render('index', { title: 'Express' });
  }
});

module.exports = router;
