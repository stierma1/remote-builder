"use strict";

var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var tFiles = require("tcomb-files");
var fs = require("fs");
module.exports = function () {
  var app = express();

  app.use(express.static(path.join(__dirname, "../client")));

  app.get("/docker-file", function (req, res) {
    res.sendFile(path.join(process.cwd(), "dockerfile.json"));
  });

  app.get("/remote-send-config", function (req, res) {
    res.sendFile(path.join(process.cwd(), "remote-send-config.json"));
  });

  app.post("/files", bodyParser.json(), function (req, res) {
    var dockerFile = req.body.dockerFile;
    fs.writeFileSync("dockerfile.json", JSON.stringify(dockerFile, null, 2));
    fs.writeFileSync("Dockerfile", tFiles.dockerfile.transformToFileContents(dockerFile), null, 2);
    var hosts = req.body.hosts;
    fs.writeFileSync("hosts.json", JSON.stringify(hosts, null, 2));
    var remoteSendConfig = req.body.remoteSendConfig;
    fs.writeFileSync("remote-send-config.json", JSON.stringify(remoteSendConfig, null, 2));
    console.log("Files Created Now Exitting");
    res.status(200).end();
    setTimeout(function () {
      process.exit(0);
    }, 100);
  });

  app.listen(5050);
};