"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runLocal = runLocal;
const file_utils_1 = require("../utils/file-utils");
const markdown_utils_1 = require("../utils/markdown-utils");
async function runLocal() {
    try {
        const templatePath = process.argv[2] || "./templates/example.hbs";
        const jsonFilePath = process.argv[3] || null;
        const templateSource = (0, file_utils_1.readTemplate)(templatePath);
        const jsonData = jsonFilePath ? (0, file_utils_1.readJsonFile)(jsonFilePath) : {};
        const markdown = (0, markdown_utils_1.generateMarkdown)(templateSource, jsonData);
        console.log("Generated Markdown:");
        console.log(markdown);
    }
    catch (error) {
        console.error(`Error: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
}
//# sourceMappingURL=local-handler.js.map