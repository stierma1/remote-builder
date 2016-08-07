var express = require("express");
var app = express();

app.get("/hello", function(req, res){
  res.status(200).send("Hello World");
})

app.listen(8080);
