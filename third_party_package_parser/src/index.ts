// src/index.ts
// import {useClipboard} from '@chakra-ui/core'
import express from 'express';
import * as path from 'path';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
import {extractAllComponentDetails,getDeclarationFiles,install_library,getInstalledVersion,updateLibraryStatus, checkForLib } from './parse_library';
import { GENERATED_PROJECTS, UPLOADED_ZIP_DIR } from './consts';
// import { fileURLToPath } from 'url';
// import { dirname } from 'path';

// Load the environment variables from the specified .env file
dotenv.config({ path: process.env.dotenv_config_path });

// import  { OpenAI } from 'openai';


// Determine which environment-specific file to load based on NODE_ENV
const env = process.env.NODE_ENV || 'development'; // Default to 'development'

const app = express();
const PORT = Number(process.env.PORT) || 4000;
const HOST = process.env.HOST || "localhost";
let noOfrequest = 0;
app.use(express.json());

let resp = {
  "error" : false,
  "message" : "",
};  

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });
import { GoogleGenerativeAI,SchemaType } from "@google/generative-ai";

// Access your API key as an environment variable
const key:any = process.env.API_KEY
const genAI = new GoogleGenerativeAI(key);

app.post('/', (req, res) => {
  
  const libraryName=req.body.fileName;
  let libraryVersion=req.body.fileVersion;
  
  // install packages
  let result = install_library(libraryName,libraryVersion);
  if(result.statusCode==200){
        
      // if library version not present it will find by getintalledversion
      libraryVersion = libraryVersion ? libraryVersion : getInstalledVersion(libraryName);
      
      const directoryPath = path.join( process.cwd(), 'node_modules', libraryName);
      
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
  const projName =  `${project}`;
  const zipFileName = req.body.fileName;
  
  const directoryPath = path.join(GENERATED_PROJECTS, projName, UPLOADED_ZIP_DIR, zipFileName);
  
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

// // Generate JSDoc endpoint
// app.post('/generate-jsdoc', async(req, res) => {
//   const { functionText } = req.body;

//   if (!functionText) {
//       return res.status(400).json({ error: 'Function text is required' });
//   }

//   try {
//       // Generate JSDoc using OpenAI
//       const prompt = `
// Generate a JSDoc comment for the following function:
// ${functionText}
// `;
//       const response = await openai.completions.create({
//           model: 'gpt-4o-mini', // or use a similar model
//           prompt: prompt,
//           max_tokens: 150,
//           temperature: 0.7,
//       });

//       const jsDoc = response.choices[0].text?.trim();
//       res.json({ jsDoc });
//   } catch (error) {
//       res.status(500).json({ error: 'Failed to generate JSDoc'});
//   }
// });

// app.post('/generate-hooks-description', async (req, res) => {
//   const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", generationConfig: { responseMimeType: "application/json" }});
//   const functionTexts = req.body.slice(0, 30);

//   const prompts = functionTexts.map((element: any) => ({
//     _id: element._id,
//     functionText: element.functionText,
//   }));

//   const prompt = `Generate JSDoc comments for the following functions. Return the results as a JSON array where each object has: _id, functionText, uses, and tagsAndItsComment (an array of objects with tagName and comment).  The input functions are: ${JSON.stringify(prompts)}

// Example Output (JSON):
// [
//   {
//     "_id": "someId1",
//     "functionText": "function myFunc(a: number): string",
//     "uses": "This function does X",
//     "tagsAndItsComment": [
//       {"tagName": "param", "comment": "Parameter a"},
//       {"tagName": "return", "comment": "The result string"}
//     ]
//   },
//   {
//     "_id": "someId2",
//     "functionText": "anotherFunction()",
//     "uses": "Another function does Y",
//     "tagsAndItsComment": []
//   }
// ]`;

// const result = await model.generateContent(prompt);
// const generatedDescription:string|undefined= result.response?.candidates?.[0]?.content?.parts?.[0]?.text;

// // const generatedDescriptions = result?.response?.candidates?.map((candidate) => {
// //  if (candidate.content?.parts?.length > 0) {

// //   return candidate.content?.parts?.text;
// //   //  return {
// //   //    _id: prompts.find((p:any) => p.functionText === candidate.functionText)?._id, // Find matching _id
// //   //    description: candidate.content.parts[0].text,
// //   //  };
// //  }; // Handle cases where a description might not be generated;

// // Filter out any null values from generatedDescriptions (optional)
// // const filteredDescriptions = generatedDescriptions.filter((desc) => desc !== null);

// // res.send(filteredDescriptions);
// // res.setHeader('Content-Type', 'application/json');
// res.json(generatedDescription);
// });
app.listen(PORT, HOST, () => {
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