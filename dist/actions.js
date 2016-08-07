"use strict";

var _request = require("request");

var _request2 = _interopRequireDefault(_request);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _archiver = require("archiver");

var _archiver2 = _interopRequireDefault(_archiver);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _main = require("./server/main");

var _main2 = _interopRequireDefault(_main);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function send() {
  var config = JSON.parse(_fs2.default.readFileSync(_path2.default.join(process.cwd(), "remote-send-config.json")));
  (0, _request2.default)({
    url: config.url + "/workspaces",
    method: "POST",
    json: "null" }, function (err, res, body) {

    if (err) {
      console.log(err);
      return;
    }
    if (res.statusCode !== 200) {
      console.log(res.statusCode, body);
      return;
    }

    (0, _request2.default)({
      url: config.url + "/workspaces/" + body + "/remote-send-config",
      method: "POST",
      json: config });
    var dockerFile = JSON.parse(_fs2.default.readFileSync(_path2.default.join(process.cwd(), "dockerfile.json"), "utf8"));
    (0, _request2.default)({
      url: config.url + "/workspaces/" + body + "/dockerfile",
      method: "POST",
      json: dockerFile });
    var zipArchive = _archiver2.default.create("zip", {});
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = (config.additionalFiles || [])[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var filePath = _step.value;

        zipArchive.glob(filePath.filePath, {}, null);
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    zipArchive.finalize();
    //zipArchive.pipe(fs.createWriteStream("z.zip"))
    zipArchive.pipe(_request2.default.post(config.url + "/workspaces/" + body + "/additional-files").on("complete", function () {
      (0, _request2.default)({
        url: config.url + "/workspaces/" + body + "/build",
        method: "POST",
        json: "null" }, function () {
        console.log("Send Complete");
      });
    }));
  });
}

function create() {
  (0, _main2.default)();
  console.log("Open Browser to 'http://localhost:5050/index.html'");
}

module.exports = {
  send: send,
  create: create
};