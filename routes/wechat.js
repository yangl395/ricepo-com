var express = require('express');
var router = express.Router();

var request = require('request');
var sha1 = require('sha1');
var Q = require('q');

var ticket, signature;

var appId = 'wxa40f507374970ea0',
    secret = 'c25a01dfd0098ab00b6355ef7256701d';

//for wechat
router.all('/', function(req, res) {
  //first authorize
  var valid = req.param('signature') === sha1([req.param('timestamp'), req.param('nonce'), '1234'].sort().join(''));
  console.log(valid ? 'valid' : 'invalid');
  if(!valid) return res.end('invalid token');

  if(req.param('echostr')) return res.end(req.param('echostr'));

  //handle the user message
  res.send('sending sms');
});

router.all('/sign', function (req, res, next) {
  res.json(sign());
});

function getTicket () {
  return get('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='+appId+'&secret='+secret)
    .then(function (body) {
      return JSON.parse(body).access_token;
    })
    .then(function (token) {
      return get('https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token='+token+'&type=jsapi');
    })
    .then(function (body) {
      var obj = JSON.parse(body);
      ticket = obj.ticket;
      console.log('get new ticket', ticket)
      console.log('expires in', obj.expires_in)
      setTimeout(function () {
        getTicket();
      }, (obj.expires_in - 1) *1000);
      return ticket;
    });
}

function sign () {
  var timestamp = Date.now();
  var noncestr = 'ricepo';
  var jsapi_ticket = ticket;
  var url = 'http://ricepo.com/coupon.html'
  var str = 'jsapi_ticket=' + jsapi_ticket + '&noncestr=' + noncestr + '&timestamp=' + timestamp + '&url=' + url;
  signature = sha1(str);
  return {
    debug: true,
    appId: appId,
    timestamp: timestamp,
    nonceStr: noncestr,
    signature: signature,
    jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage']
  };
}

function get (url) {
  var deferred = Q.defer();
  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      deferred.resolve(body);
    }
    else {
      deferred.reject(error || 'failed');
    }
  });
  return deferred.promise;
}

getTicket();

module.exports = router;
