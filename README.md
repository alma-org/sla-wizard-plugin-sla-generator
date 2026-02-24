# SLA Generator Plugin

A plugin for [SLA Wizard](https://github.com/isa-group/sla-wizard) that generates multiple SLA files from a CSV file containing client information and a YAML template.

## Overview

The **SLA Generator Plugin** automates the creation of Service Level Agreements (SLAs) for multiple clients. It is particularly useful when you have a list of clients in a CSV format and want to generate standard SLAs with unique, secure API keys for each.

Key features:
- **Batch Generation**: Create hundreds of SLAs from a single CSV file.
- **Secure API Keys**: Automatically generates SHA-256 hashed API keys for each client.
- **Key Preservation**: When updating existing SLAs, the plugin preserves already generated keys.
- **Mapping Generation**: Creates a JSON file mapping client emails to their generated API keys and SLA files.

## Installation

This plugin is part of the SLA Wizard ecosystem. To use it, ensuring you have `sla-wizard` installed and this plugin is in your `plugins` directory.

```bash
# Install dependencies
npm install
```

## Usage

### CLI Usage

The plugin adds the `generate-slas-csv` command to the SLA Wizard.

```bash
node index.js generate-slas-csv -t <template-path> -c <csv-path> -o <out-dir> [options]
```

#### Example

```bash
node index.js generate-slas-csv \
  -t ./templates/base-sla.yaml \
  -c ./data/clients.csv \
  -o ./generated-slas \
  -m ./generated-slas/keys-mapping.json
```

### Options

| Option | Description | Default |
| :--- | :--- | :--- |
| `-t, --template <path>` | **Required**. Path to the SLA template YAML file. | - |
| `-c, --csv <path>` | **Required**. Path to the CSV file (must have an `email` column). | - |
| `-o, --outDir <path>` | **Required**. Directory where the generated SLA files will be saved. | - |
| `-k, --keys <number>` | Number of API keys to generate per client. | `4` |
| `-m, --mapping <path>` | Path to the mapping JSON file to be created. | `<outDir>/apikeys_mapping.json` |
| `-e, --existing <dir>` | Directory with existing SLAs to update (preserves keys). | - |

### Programmatic Usage

You can also use the generation logic directly in your Node.js application:

```javascript
const { generateSLAsFromCSV } = require('sla-wizard-plugin-sla-generator');

async function run() {
  const mapping = await generateSLAsFromCSV(
    './template.yaml',
    './clients.csv',
    './output',
    4,
    './output/mapping.json'
  );
  console.log('Generated SLAs for:', Object.keys(mapping));
}
```

## CSV Format Requirements

The CSV file must contain at least an `email` column, which is used as a unique identifier for each client and to personalize the SLA `id`.

Example `clients.csv`:
```csv
name,email,company
John Doe,john.doe@example.com,Example Corp
Jane Smith,jane.smith@test.com,Test Ltd
```

## Generated Structure

When run, the plugin generates:
1. Individual SLA files: `sla_john_doe_example_com.yaml`, etc.
2. A mapping file: `apikeys_mapping.json`.

```json
{
  "john.doe@example.com": {
    "apikeys": ["hash1", "hash2", "hash3", "hash4"],
    "slaFile": "output/sla_john_doe_example_com.yaml"
  }
}
```