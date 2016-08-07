#!/usr/bin/env node

var program = require("commander");
var actions = require("./dist/actions");

program.version(require("./package.json").version)
  .option("-c, --create", "Create/Update dockerfile and remote configuration")
  .option("-s, --send", "Send dockerfile, and additional-files for building")
  .parse(process.argv)

if(program.create){
  actions.create();
} else if(program.send){
  actions.send();
}
