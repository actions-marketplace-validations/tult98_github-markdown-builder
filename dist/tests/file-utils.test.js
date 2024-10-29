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
const file_utils_1 = require("../src/utils/file-utils");
const fs = __importStar(require("fs"));
jest.mock('fs');
describe('fileUtils', () => {
    const mockReadFileSync = fs.readFileSync;
    const mockExistsSync = fs.existsSync;
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should read the template file successfully', () => {
        const mockTemplate = 'This is a template';
        mockExistsSync.mockReturnValue(true);
        mockReadFileSync.mockReturnValue(mockTemplate);
        const template = (0, file_utils_1.readTemplate)('./templates/example.hbs');
        expect(template).toBe(mockTemplate);
    });
    it('should throw an error if the template file is missing', () => {
        mockExistsSync.mockReturnValue(false);
        expect(() => (0, file_utils_1.readTemplate)('./templates/missing.hbs')).toThrow('Template file not found: ./templates/missing.hbs');
    });
    it('should read the JSON file successfully', () => {
        const mockJsonContent = '{"key": "value"}';
        mockExistsSync.mockReturnValue(true);
        mockReadFileSync.mockReturnValue(mockJsonContent);
        const jsonData = (0, file_utils_1.readJsonFile)('./data/example.json');
        expect(jsonData).toEqual({ key: 'value' });
    });
    it('should throw an error if the JSON file is missing', () => {
        mockExistsSync.mockReturnValue(false);
        expect(() => (0, file_utils_1.readJsonFile)('./data/missing.json')).toThrow('JSON file not found: ./data/missing.json');
    });
    it('should throw an error if the JSON content is invalid', () => {
        const mockInvalidJsonContent = 'invalid json';
        mockExistsSync.mockReturnValue(true);
        mockReadFileSync.mockReturnValue(mockInvalidJsonContent);
        expect(() => (0, file_utils_1.readJsonFile)('./data/invalid.json')).toThrow();
    });
});
//# sourceMappingURL=file-utils.test.js.map