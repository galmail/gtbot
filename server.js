var express = require('express');
var httpProxy = require('http-proxy');
var request = require('request');
var app = express();
var phantom = require('phantom');

////////// STATIC FILES CONFIGURATION //////////

app.use(express.static(__dirname + '/www', {
  maxAge : 0
}));

////////// STARTING SERVER //////////

app.listen(process.env.PORT || 3000);

console.log("Node.js is running in " + app.get('env'));

process.on('uncaughtException', function(err) {
  console.log('Caught exception: ' + err);
});

////////// STARTING MAIN FUNCTION //////////

(function(){

console.log('inside main function...');

// Send email to a gumtree ticket seller

var URL = "http://www.gumtree.com/reply/1125700466";

phantom.create(function(ph){
  //console.log('ph',ph);
  ph.createPage(function(page){
    //console.log('page',page);

    ////////// START - CONSOLE LOGS //////////

    page.onResourceReceived = function(response) {
      if (response.stage !== "end") return;
      console.log('Response (#' + response.id + ', stage "' + response.stage + '"): ' + response.url);
    };
    page.onResourceRequested = function(requestData, networkRequest) {
      console.log('Request (#' + requestData.id + '): ' + requestData.url);
    };
    page.onUrlChanged = function(targetUrl) {
      console.log('New URL: ' + targetUrl);
    };
    page.onLoadFinished = function(status) {
      console.log('Load Finished: ' + status);
    };
    page.onLoadStarted = function() {
      console.log('Load Started');
    };
    page.onNavigationRequested = function(url, type, willNavigate, main) {
      console.log('Trying to navigate to: ' + url);
    };

    ////////// FINISH - CONSOLE LOGS //////////

    console.log('opening page: ' + URL);
    page.open(URL, function(status){
      if (status !== 'success') {
        console.log('Unable to access network');
      }
      else {
        console.log('status', status);
        //page.includeJs("http://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js", function() {
          //var results = page.evaluate...
          page.evaluate(function() {
            
            var DINGO = {};
            DINGO.MSG = "Hi there, there are people who are looking for tickets like yours on Dingo. You might want to list them, it's super easy and zero commission."
            DINGO.SenderName = "Dingo";
            DINGO.SenderEmail = "hi@dingoapp.co.uk";

            document.getElementsByTagName('textarea')[0].value=DINGO.MSG;
            document.getElementsByTagName('input')[3].value=DINGO.SenderName;
            document.getElementsByTagName('input')[4].value=DINGO.SenderEmail;
            document.getElementsByTagName('button')[1].click();

          });

          setTimeout(function(){
            page.render("superNextPage.png");
            ph.exit();
          }, 5000); // 5 seconds

        //});
      }
    });

  });
});


})();

