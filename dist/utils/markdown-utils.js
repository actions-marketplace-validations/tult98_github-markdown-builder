"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateMarkdown = generateMarkdown;
const handlebars_utils_1 = require("./handlebars-utils");
function generateMarkdown(templateSource, data) {
    return (0, handlebars_utils_1.compileTemplate)(templateSource, { data });
}
//# sourceMappingURL=markdown-utils.js.map