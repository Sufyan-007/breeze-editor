// src/index.ts
import express from 'express';
import * as path from 'path';
import * as fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import {extractAllComponentDetails,getDeclarationFiles} from './parse_library';
const app = express();
const port = 3000;


function findSrcFolder(basePath:any) {
  const files = fs.readdirSync(basePath);

  for (const file of files) {
    const filePath = path.join(basePath, file);
    if (fs.statSync(filePath).isDirectory()) {
      const potentialSrcPath = path.join(filePath, 'src');
      if (fs.existsSync(potentialSrcPath)) {
        return potentialSrcPath;
      }
    }
  }
  return null; // If no `src` folder is found
}

app.get('/', (req, res) => {
    // Directory containing TypeScript declaration files for craft.js
    // const directoryPath = path.join(__dirname, 'node_modules', '@craftjs', 'core');
    const libraryName="@chakra-ui";
    const dire = path.basename(__dirname)
    const directoryPath = path.join('/home/yash/Documents/Projects/breezeui/third_party_package_parser', 'node_modules', libraryName);
    if (fs.existsSync(directoryPath)) {
        extractAllComponentDetails(directoryPath,libraryName);
        res.send('Hello, TypeScript with Express!');
    } else {
        console.log(`Directory not found: ${directoryPath}`);
        res.send('Hello, TypeScript with Express!');

    }

});

app.get('/custom', (req, res) => {
  
  const projName = "creator"
  const zipFileName="@chakra-ui";
  const directoryPath = path.join('/home/yash/Documents/Projects/breezeui/configurations', projName, zipFileName);
  // install specific version of dependency if not present in our third party parser
  
  if (fs.existsSync(directoryPath)) {
      extractAllComponentDetails(directoryPath,zipFileName);
      res.send('Hello, TypeScript with Express!');
  } else {
      console.log(`Directory not found: ${directoryPath}`);
      res.send('Hello, TypeScript with Express!');

  }

});

app.post('/upload', async (req, res) => {
  
    let srcFolderPath = "/home/yash/Documents/Projects/temp"
    // Extract and process component details
    extractAllComponentDetails(srcFolderPath, 'userProject/temp');

    res.send('Uploaded and processed successfully.');
    
    
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});