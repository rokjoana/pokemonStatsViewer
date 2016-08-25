/**
* This app wraps the data retrieval module with an REST API to be used in the
* visualization side.
**/
var express = require('express');
var statistics = require('./routes/statistics.js');

// init express app
var app = express();

app.use('/api', statistics);

// create the server
app.listen(3030,function(){
  console.log("The server is running at port 3030.");
});
