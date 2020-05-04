#!/usr/bin/env node

const chalk = require("chalk");
const program = require('commander');
const server = require("../server.js");

program
  .arguments('[target]')
  .action(function (_target) {
    target = _target
  })
  .option('-p, --port <number>', 'specify port. defaults to 3000')
  .option('-hx, --headless', 'run just the server without a frontend. Ignores target.');

program.parse(process.argv);

if (program.headless) {
  console.log(chalk.green.bold("Running in headless mode."));
}
else if (typeof target === 'undefined') {
  console.log(chalk.red.bold("You need to specify an HTML file containing your model."));
  process.exit(1);
}

server({ target, port: program.port });