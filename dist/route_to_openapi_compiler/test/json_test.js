"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = require("node:test");
const node_assert_1 = __importDefault(require("node:assert"));
const compiler_1 = require("../compiler");
const path_1 = __importDefault(require("path"));
const json_route_expectation_1 = require("./json_route_expectation");
(0, node_test_1.describe)('json route', () => {
    (0, node_test_1.it)('should default to producing and consuming json', () => {
        const paths = (0, compiler_1.compileOpenApiPaths)([path_1.default.join('test', 'json_route.ts')], 'tsconfig.json');
        console.log(paths);
        node_assert_1.default.equal(paths, json_route_expectation_1.expected);
    });
});
