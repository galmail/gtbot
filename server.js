var express = require('express');
var httpProxy = require('http-proxy');
var request = require('request');
var app = express();
var phantom = require('phantom');

// or more concisely
var sys = require('sys')
var exec = require('child_process').exec;

////////// STATIC FILES CONFIGURATION //////////

app.use(express.static(__dirname + '/www', {
  maxAge : 0
}));

////////// ROUTES //////////

app.get('/', function(req, res) {
  res.json({"gtbot": "up"});
  function puts(error, stdout, stderr) { sys.puts(stdout) }
  exec("ls -la", puts);
  exec("pgrep phantomjs | xargs kill", puts);
});

app.get('/sendmail/:id', function(req, res) {
  sendmail_v1(req.params.id);
  res.json({"success": "true"});
});

////////// STARTING SERVER //////////

app.listen(process.env.PORT || 3000);
console.log("Node.js is running in " + app.get('env'));
process.on('uncaughtException', function(err) {
  console.log('Caught exception: ' + err);
});

////////// MAIN FUNCTION //////////

var sendmail_v1 = function(gumtreeId){
  // Send email to a gumtree ticket seller
  var URL = "https://www.gumtree.com/reply/" + gumtreeId;
  phantom.create(function(ph){
    ph.createPage(function(page){
      console.log('opening page: ' + URL);
      //page.settings.userAgent = 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.120 Safari/537.36';
      page.open(URL, function(status){
        if (status !== 'success') {
          console.log('Unable to access network');
        }
        else {
          page.evaluate(function() {
            var DINGO = {};
            DINGO.MSG = "Hi. I wanted to let you know that there are buyers looking for tickets like yours on a mobile app called Dingo. You should list them on the app, it's super easy with zero commission. Thanks, Sarah from Dingo.";
            DINGO.SenderName = "Dingo";

            var dText = "";
            var dLetters = "abcdefghijklmnopqrstuvwxyz";
            for( var i=0; i < 10; i++ ) dText += dLetters.charAt(Math.floor(Math.random() * dLetters.length));
            
            DINGO.SenderEmail = dText + "@dingoapp.co.uk";
            document.getElementsByTagName('textarea')[0].value=DINGO.MSG;
            document.getElementsByTagName('input')[3].value=DINGO.SenderName;
            document.getElementsByTagName('input')[4].value=DINGO.SenderEmail;
            document.getElementsByTagName('button')[1].click();

          });
          setTimeout(function(){
            //page.render("superNextPage.png");
            ph.exit();
            function puts(error, stdout, stderr) { sys.puts(stdout) }
            exec("ls -la", puts);
            exec("pgrep phantomjs | xargs kill", puts);
          }, 5000); // 5 seconds
        }
      });
    });
  });
};

var sendmail_v2 = function(gumtreeId){
  // Send email to a gumtree ticket seller
  var URL = "http://www.gumtree.com/reply/" + gumtreeId;
  phantom.create(function(ph){
    ph.createPage(function(page){
      console.log('opening page: ' + URL);
      page.open(URL, function(status){
        if (status !== 'success') {
          console.log('Unable to access network');
        }
        else {
          page.evaluate(function() {
            var DINGO = {};
            DINGO.MSG = "Hi, this is Sarah from our ticketing team at Gumtree. We´ve recently partnered with a secure and free ticket resale app called Dingo. If you´d like to check it out you can search for Dingo in the App Store or Google Play.";
            DINGO.SenderName = "Sarah";
            
            var dText = "";
            var dLetters = "abcdefghijklmnopqrstuvwxyz";
            for( var i=0; i < 10; i++ ) dText += dLetters.charAt(Math.floor(Math.random() * dLetters.length));
            
            DINGO.SenderEmail = dText + "@dingoapp.co.uk";
            document.getElementsByTagName('textarea')[0].value=DINGO.MSG;
            document.getElementsByTagName('input')[3].value=DINGO.SenderName;
            document.getElementsByTagName('input')[4].value=DINGO.SenderEmail;
            document.getElementsByTagName('button')[1].click();
          });
          setTimeout(function(){
            //page.render("superNextPage.png");
            ph.exit();
          }, 5000); // 5 seconds
        }
      });
    });
  });
};

