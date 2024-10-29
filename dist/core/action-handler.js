"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runAction = runAction;
const core = __importStar(require("@actions/core"));
const file_utils_1 = require("../utils/file-utils");
const markdown_utils_1 = require("../utils/markdown-utils");
async function runAction() {
    try {
        // Get inputs from GitHub Action workflow
        const templatePath = core.getInput("template-file-path", {
            required: true,
        });
        const jsonFilePath = core.getInput("json-file-path"); // Optional
        // Read template and JSON data (if provided)
        const templateSource = (0, file_utils_1.readTemplate)(templatePath);
        const jsonData = jsonFilePath ? (0, file_utils_1.readJsonFile)(jsonFilePath) : {};
        // Generate markdown
        const markdown = (0, markdown_utils_1.generateMarkdown)(templateSource, jsonData);
        // Log the markdown (for debugging)
        console.log("Generated Markdown:");
        console.log(markdown);
        // Write to GitHub Actions summary
        core.summary.addRaw(markdown).write();
    }
    catch (error) {
        if (error instanceof Error) {
            core.setFailed(`Action failed with error: ${error.message}`);
        }
        else {
            core.setFailed("Action failed with an unknown error");
        }
    }
}
//# sourceMappingURL=action-handler.js.map