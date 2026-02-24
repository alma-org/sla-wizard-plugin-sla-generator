#!/usr/bin/env node
/**
 * CLI wrapper for tests: loads sla-wizard, registers the sla-generator plugin,
 * then delegates to sla-wizard's CLI runner.
 *
 * Usage: node cli-with-plugin.js <command> [options]
 */
const slaWizard = require("sla-wizard");
const slaGeneratorPlugin = require("../../index.js");

// Register the plugin so its commands are available on the CLI program
slaWizard.use(slaGeneratorPlugin);

// Parse process.argv and run the matched command
slaWizard.program.parse(process.argv);
