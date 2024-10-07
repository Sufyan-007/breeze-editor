// src/index.ts
// import {useClipboard} from '@chakra-ui/core'
import express from 'express';
import * as path from 'path';
import * as fs from 'fs';
import {extractAllComponentDetails,getDeclarationFiles,install_library,getInstalledVersion,updateLibraryStatus, checkForLib } from './parse_library';
import { CONFIG_PATH,THIRD_PARTY_PACKAGE_PARSER, PORT} from './consts';
// import { fileURLToPath } from 'url';
// import { dirname } from 'path';

const app = express();

app.use(express.json());

let resp = {
  "error" : false,
  "message" : "",
};  

app.post('/', (req, res) => {
  
  const libraryName=req.body.fileName;
  let libraryVersion=req.body.fileVersion;
  
  
  // install packages
  let result = install_library(libraryName,libraryVersion);
  if(result.statusCode==200){
        
      // if library version not present it will find by getintalledversion
      libraryVersion = libraryVersion ? libraryVersion : getInstalledVersion(libraryName);
      
      const directoryPath = path.join( THIRD_PARTY_PACKAGE_PARSER, 'node_modules', libraryName);
      
      if(!checkForLib(libraryName,libraryVersion)){  
          if (fs.existsSync(directoryPath)) {
              if(extractAllComponentDetails(directoryPath,libraryName,"library",libraryVersion)){
                resp={
                  "error" : false,
                  "message" : `Library executed succesfully`,
                };  
                res.send(resp);
                // res.send('Hello, TypeScript with Express!');
                updateLibraryStatus(libraryName,libraryVersion);
              }
              else{
                resp = {
                  "error" : true,
                  "message" : "extractDetails failed. statusChange will not run.",
                };  
                res.send(resp);
                console.log("extractDetails failed. statusChange will not run.");
              }
          } 
          else {
            console.log(`Directory not found: ${directoryPath}`);
            resp = {
              "error" : true,
              "message" : `Directory not found: ${directoryPath}`,
            };  
            res.send(resp);
          }
      }
      else{
          console.log('library already exists')
          resp = {
            "error" : false,
            "message" : 'library already exists',
          }; 
          res.send(resp);
      }   
    }
    else{
      resp = {
        "error" : true,
        "message" : result.message ,
      };  
      res.status(500).send(resp);
    }
});

app.post('/custom', (req, res) => {
  const project = req.body.projName;
  const projName =  `${project}/extracted_zip_files`;
  const zipFileName = req.body.fileName;
  const directoryPath = path.join(CONFIG_PATH, projName, zipFileName);

  
  if (fs.existsSync(directoryPath)) {
    if(extractAllComponentDetails(directoryPath,zipFileName,"file",project)){
      resp={
        "error":false,
        "message":"File executed successfully"
      }
      res.send(resp);
    }else{
      resp={
        "error":true,
        "message":"Error while extract file details"
      }
    }
  } else {
    resp={
      "error":true,
      "message":`Directory not found: ${directoryPath}`
    }
    res.send(resp);
  }
});

app.post('/upload', async (req, res) => {
  
  let srcFolderPath = "/home/yash/Documents/Projects/temp"
  // Extract and process component details
  // extractAllComponentDetails(srcFolderPath, 'userProject/temp',"file");
  
  res.send('Uploaded and processed successfully.');  
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
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