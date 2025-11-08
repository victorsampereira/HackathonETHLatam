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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExercises = getExercises;
exports.isSolved = isSolved;
exports.findNextUnsolved = findNextUnsolved;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const compiler_1 = require("./compiler");
const ui_1 = require("./ui");
const EXERCISES_FILE = 'exercises.json';
async function getExercises() {
    const content = await fs.promises.readFile(EXERCISES_FILE, 'utf-8');
    const data = JSON.parse(content);
    return data.exercises;
}
async function isSolved(exercise) {
    if (exercise.path.endsWith('.md')) {
        const fullPath = path.resolve(exercise.path);
        return !fs.existsSync(fullPath);
    }
    else if (exercise.path.endsWith('.sol')) {
        // We can't show verbose output here, so we temporarily disable it
        const originalInfo = ui_1.ui.info;
        ui_1.ui.info = () => { }; // eslint-disable-line @typescript-eslint/no-empty-function
        const result = await (0, compiler_1.compile)(exercise.path);
        ui_1.ui.info = originalInfo;
        return result.success;
    }
    return false;
}
async function findNextUnsolved(exercises) {
    for (const exercise of exercises) {
        if (!(await isSolved(exercise))) {
            return exercise;
        }
    }
    return null;
}
