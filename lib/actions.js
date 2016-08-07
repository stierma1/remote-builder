import request from "request"
import fs from "fs"
import archiver from "archiver"
import path from "path"
import server from "./server/main"

function send(){
  var config = JSON.parse(fs.readFileSync(path.join(process.cwd(), "remote-send-config.json")));
  request({
    url:config.url + "/workspaces",
    method:"POST",
    json: "null"}, function(err, res, body){

      if(err){
        console.log(err)
        return;
      }
      if(res.statusCode !== 200){
        console.log(res.statusCode, body);
        return;
      }

      request({
        url:config.url + "/workspaces/" + body + "/remote-send-config",
        method:"POST",
        json: config});
      var dockerFile = JSON.parse(fs.readFileSync(path.join(process.cwd(), "dockerfile.json"), "utf8"));
      request({
        url:config.url + "/workspaces/"+ body +"/dockerfile",
        method:"POST",
        json: dockerFile});
      var zipArchive = archiver.create("zip", {});
      for(var filePath of config.additionalFiles || []){
        zipArchive.glob(filePath.filePath, {}, null);
      }
      zipArchive.finalize();
      //zipArchive.pipe(fs.createWriteStream("z.zip"))
        zipArchive.pipe(request.post(config.url + "/workspaces/"+ body +"/additional-files").on("complete", function(){
          request({
            url:config.url + "/workspaces/" + body +"/build",
            method:"POST",
            json: "null"}, function(){
              console.log("Send Complete")
            });
        }))
    });

}

function create(){
  server();
  console.log("Open Browser to 'http://localhost:5050/index.html'");
}

module.exports = {
  send:send,
  create:create
}
