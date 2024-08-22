// src/index.ts
import express from 'express';
import multer from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import unzipper from 'unzipper';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import {extractAllComponentDetails,getDeclarationFiles} from './parse_library';
const app = express();
const port = 3000;

const upload = multer({ dest: path.join('uploads/') });

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
    const libraryName="react-bootstrap";
    const directoryPath = path.join('/home/subham/breezeui/third_party_package_parser', 'node_modules', libraryName);
    if (fs.existsSync(directoryPath)) {
        extractAllComponentDetails(directoryPath,libraryName);
        res.send('Hello, TypeScript with Express!');
    } else {
        console.log(`Directory not found: ${directoryPath}`);
        res.send('Hello, TypeScript with Express!');

    }

});
app.post('/upload', upload.single('folder'), async (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).send('No file uploaded.');
  }

  const folderPath = path.join('uploads', file.filename);
  const extractPath = path.join('uploads', 'extracted');

  try {
    // Ensure the extraction directory exists
    fs.mkdirSync(extractPath, { recursive: true });

    // Unzip the uploaded folder, but skip `node_modules`
    fs.createReadStream(folderPath)
      .pipe(unzipper.Parse())
      .on('entry', (entry) => {
        const fileName = entry.path;
        const type = entry.type; // 'Directory' or 'File'
        const fullPath = path.join(extractPath, fileName);

        // Skip `node_modules` folder and its contents
        if (fileName.includes('node_modules/')) {
          
          entry.autodrain(); // Skip the file/folder
        } else {
          // Extract the file/folder
          if (type === 'Directory') {
            fs.mkdirSync(fullPath, { recursive: true });
          } else {
            entry.pipe(fs.createWriteStream(fullPath));
          }
        }
      })
      .on('close', () => {
        console.log('Unzipping completed.');

        // Find the folder that contains the `src` directory
        const srcFolderPath = findSrcFolder(extractPath);

        if (!srcFolderPath) {
          console.log('src folder not found.');
          return res.status(400).send('src folder not found in uploaded archive.');
        }

        // Extract and process component details
        extractAllComponentDetails(srcFolderPath, 'userProject');

        res.send('Uploaded and processed successfully.');
      });

  } catch (error) {
    console.error('Error processing file:', error);
    res.status(500).send('Internal server error.');
  }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});