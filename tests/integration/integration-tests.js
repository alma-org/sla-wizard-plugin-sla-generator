const { expect } = require("chai");
const path = require("path");
const fs = require("fs");
const { execSync } = require("child_process");

const slaWizard = require("sla-wizard");
const slaGeneratorPlugin = require("../../index.js");

slaWizard.use(slaGeneratorPlugin);

const cliPath = path.join(__dirname, "cli-with-plugin.js");

const TEMPLATE_PATH = path.join(__dirname, "../sla-generation/sla-templates/basicResearcher.yaml");
const CSV_PATH = path.join(__dirname, "../sla-generation/csv/usersBasic.csv");
const OUTPUT_DIR = path.join(__dirname, "./test-output");

describe("SLA Generator Plugin Integration Tests", function () {
    this.timeout(10000);

    before(function () {
        if (!fs.existsSync(OUTPUT_DIR)) {
            fs.mkdirSync(OUTPUT_DIR, { recursive: true });
        }
    });

    after(function () {
        if (fs.existsSync(OUTPUT_DIR)) {
            fs.rmSync(OUTPUT_DIR, { recursive: true, force: true });
        }
    });

    describe("Programmatic Usage via sla-wizard", function () {
        it("should expose plugin methods (generateSLAsFromCSV)", function () {
            expect(slaWizard.generateSLAsFromCSV).to.be.a("function");
        });

        it("should generate SLAs correctly when called programmatically", async function () {
            const outDir = path.join(OUTPUT_DIR, "prog-gen");
            const mappingFile = path.join(outDir, "mapping.json");
            
            await slaWizard.generateSLAsFromCSV({
                template: TEMPLATE_PATH,
                csv: CSV_PATH,
                outDir: outDir,
                keys: 1,
                mapping: mappingFile
            });
            
            expect(fs.existsSync(mappingFile)).to.be.true;
            const mapping = JSON.parse(fs.readFileSync(mappingFile, "utf8"));
            expect(mapping).to.have.property("newBasicUser@us.es");
        });
    });

    describe("CLI Usage via Wrapper", function () {
        it("should register the generate-slas-csv command", function () {
            const helpOutput = execSync(`node "${cliPath}" --help`).toString();
            expect(helpOutput).to.contain("generate-slas-csv");
        });

        it("should generate SLAs via CLI command", function () {
            const outDir = path.join(OUTPUT_DIR, "cli-gen");
            const mappingFile = path.join(outDir, "cli-mapping.json");
            
            const cmd = `node "${cliPath}" generate-slas-csv -t "${TEMPLATE_PATH}" -c "${CSV_PATH}" -o "${outDir}" -m "${mappingFile}" -k 1`;
            execSync(cmd);

            expect(fs.existsSync(mappingFile)).to.be.true;
            const mapping = JSON.parse(fs.readFileSync(mappingFile, "utf8"));
            expect(mapping).to.have.property("newBasicUser@us.es");
        });
    });
});
