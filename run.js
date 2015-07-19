(function(){

console.log('inside run.js function...');

// Send email to a gumtree ticket seller

URL = "http://www.gumtree.com/reply/1125700466";

var phantom = require('phantom');
phantom.create(function (ph) {
  ph.createPage(function (page) {


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

    page.open(URL, function (status) {
      if (status !== 'success') {
        console.log('Unable to access network');
      }
      else {
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

            ph.exit();
          });
        //});
      }
    });
  });
});


})();