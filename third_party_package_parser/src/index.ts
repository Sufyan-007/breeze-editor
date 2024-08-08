// src/index.ts
import express from 'express';
import * as path from 'path';
import * as fs from 'fs';
import {extractAllComponentDetails} from './parse_library';
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    // Directory containing TypeScript declaration files for craft.js
    // const directoryPath = path.join(__dirname, 'node_modules', '@craftjs', 'core');
    const libraryName="react-bootstrap";
    const directoryPath = path.join('/home/smit/breezeui/third_party_package_parser', 'node_modules', libraryName);
    if (fs.existsSync(directoryPath)) {
        extractAllComponentDetails(directoryPath,libraryName);
        res.send('Hello, TypeScript with Express!');
    } else {
        console.log(`Directory not found: ${directoryPath}`);
        res.send('Hello, TypeScript with Express!');

    }

});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});