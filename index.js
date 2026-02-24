const { generateSLAsFromCSV } = require('./src/generate-sla');
const fs = require('fs');
const path = require('path');

/**
 * Plugin that generates SLAs from templates and CSV data.
 *
 * @param {Object} program - Commander program instance
 * @param {Object} ctx - Context with utils and generate functions
 */
function apply(program, ctx) {
    program
        .command('generate-slas-csv')
        .description('Generate multiple SLA files from a CSV file and a template.')
        .requiredOption('-t, --template <templatePath>', 'Path to the SLA template YAML file.')
        .requiredOption('-c, --csv <csvPath>', 'Path to the CSV file with client information (must have "email" column).')
        .requiredOption('-o, --outDir <outputDirectory>', 'Directory where the generated SLA files will be saved.')
        .option('-k, --keys <numKeys>', 'Number of API keys to generate per client.', 4)
        .option('-m, --mapping <mappingPath>', 'Path to the mapping JSON file to be created.')
        .option('-e, --existing <existingDir>', 'Directory with existing SLAs to update (preserves keys).')
        .action(async (options) => {
            try {
                await generateSLAsFromCSV(
                    options.template,
                    options.csv,
                    options.outDir,
                    parseInt(options.keys),
                    options.mapping,
                    options.existing
                );
            } catch (err) {
                console.error(`Error: ${err.message}`);
                process.exit(1);
            }
        });
}

/**
 * Programmatic interface for generating SLAs from CSV.
 * @param {Object} options - Configuration options
 * @param {Object} ctx - Context (ignored here but required by sla-wizard)
 */
async function generateSLAsFromCSVCommand(options, ctx) {
    return await generateSLAsFromCSV(
        options.template || options.sla,
        options.csv,
        options.outDir,
        parseInt(options.keys || options.numKeys || 4),
        options.mapping || options.mappingFilePath,
        options.existing || options.existingSLAsDir
    );
}

module.exports = { apply, generateSLAsFromCSV: generateSLAsFromCSVCommand };
