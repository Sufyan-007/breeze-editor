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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/index.ts
// import {useClipboard} from '@chakra-ui/core'
const express_1 = __importDefault(require("express"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const parse_library_1 = require("./parse_library");
const consts_1 = require("./consts");
// import { fileURLToPath } from 'url';
// import { dirname } from 'path';
// Determine which environment-specific file to load based on NODE_ENV
const env = process.env.NODE_ENV || 'development'; // Default to 'development'
const app = (0, express_1.default)();
const PORT = process.env.PORT;
const HOST = process.env.HOST || "localhost";
app.use(express_1.default.json());
let resp = {
    "error": false,
    "message": "",
};
app.post('/', (req, res) => {
    const libraryName = req.body.fileName;
    let libraryVersion = req.body.fileVersion;
    // install packages
    let result = (0, parse_library_1.install_library)(libraryName, libraryVersion);
    if (result.statusCode == 200) {
        // if library version not present it will find by getintalledversion
        libraryVersion = libraryVersion ? libraryVersion : (0, parse_library_1.getInstalledVersion)(libraryName);
        const directoryPath = path.join(consts_1.DIRECTORY_PATH, 'node_modules', libraryName);
        if (!(0, parse_library_1.checkForLib)(libraryName, libraryVersion)) {
            if (fs.existsSync(directoryPath)) {
                if ((0, parse_library_1.extractAllComponentDetails)(directoryPath, libraryName, "library", libraryVersion)) {
                    resp = {
                        "error": false,
                        "message": `Library executed succesfully`,
                    };
                    res.send(resp);
                    // res.send('Hello, TypeScript with Express!');
                    (0, parse_library_1.updateLibraryStatus)(libraryName, libraryVersion);
                }
                else {
                    resp = {
                        "error": true,
                        "message": "extractDetails failed. statusChange will not run.",
                    };
                    res.send(resp);
                    console.log("extractDetails failed. statusChange will not run.");
                }
            }
            else {
                console.log(`Directory not found: ${directoryPath}`);
                resp = {
                    "error": true,
                    "message": `Directory not found: ${directoryPath}`,
                };
                res.send(resp);
            }
        }
        else {
            console.log('library already exists');
            resp = {
                "error": false,
                "message": 'library already exists',
            };
            res.send(resp);
        }
    }
    else {
        resp = {
            "error": true,
            "message": result.message,
        };
        res.status(500).send(resp);
    }
});
app.post('/custom', (req, res) => {
    const project = req.body.projName;
    const projName = `${project}/extracted_zip_files`;
    const zipFileName = req.body.fileName;
    const directoryPath = path.join(consts_1.CUSTOM_DIRECTORY_PATH, projName, zipFileName);
    if (fs.existsSync(directoryPath)) {
        if ((0, parse_library_1.extractAllComponentDetails)(directoryPath, zipFileName, "file", project)) {
            resp = {
                "error": false,
                "message": "File executed successfully"
            };
            res.send(resp);
        }
        else {
            resp = {
                "error": true,
                "message": "Error while extract file details"
            };
        }
    }
    else {
        resp = {
            "error": true,
            "message": `Directory not found: ${directoryPath}`
        };
        res.send(resp);
    }
});
app.post('/upload', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let srcFolderPath = "/home/yash/Documents/Projects/temp";
    // Extract and process component details
    // extractAllComponentDetails(srcFolderPath, 'userProject/temp',"file");
    res.send('Uploaded and processed successfully.');
}));
app.listen(PORT, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`);
});
// function findSrcFolder(basePath:any) {
//   const files = fs.readdirSync(basePath);
//   // useClipboard
//   for (const file of files) {
//     const filePath = path.join(basePath, file);
//     if (fs.statSync(filePath).isDirectory()) {
//       const potentialSrcPath = path.join(filePath, 'src');
//       if (fs.existsSync(potentialSrcPath)) {
//         return potentialSrcPath;
//       }
//     }
//   }
//   return null; // If no `src` folder is found
// }
//# sourceMappingURL=index.js.map