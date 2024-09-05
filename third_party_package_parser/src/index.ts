// src/index.ts
import express from "express";
import * as path from "path";
import * as fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";
import {
  extractAllComponentDetails,
  getDeclarationFiles,
  install_library,
  getInstalledVersion,
  updateLibraryStatus,
  checkForLib,
} from "./parse_library";
import { CUSTOM_DIRECTORY_PATH, DIRECTORY_PATH, PORT } from "./consts";
const app = express();

app.use(express.json());

function findSrcFolder(basePath: any) {
  const files = fs.readdirSync(basePath);

  for (const file of files) {
    const filePath = path.join(basePath, file);
    if (fs.statSync(filePath).isDirectory()) {
      const potentialSrcPath = path.join(filePath, "src");
      if (fs.existsSync(potentialSrcPath)) {
        return potentialSrcPath;
      }
    }
  }
  return null; // If no `src` folder is found
}

app.post("/", (req, res) => {
  let projName = req.body.projName || "";
  const libraryName = req.body.fileName;
  let libraryVersion = req.body.fileVersion;
  // const libraryName=file;

  // install packages
  install_library(libraryName, libraryVersion);

  // if library version not present it will find by getintalledversion
  libraryVersion = libraryVersion
    ? libraryVersion
    : getInstalledVersion(libraryName);

  const directoryPath = path.join(DIRECTORY_PATH, "node_modules", libraryName);

  if (!checkForLib(libraryName, libraryVersion)) {
    if (fs.existsSync(directoryPath)) {
      if (
        extractAllComponentDetails(
          projName,
          directoryPath,
          libraryName,
          "library",
          libraryVersion
        )
      ) {
        res.send("Hello, TypeScript with Express!");
        updateLibraryStatus(libraryName, libraryVersion);
      } else {
        console.log("extractDetails failed. statusChange will not run.");
      }
    } else {
      console.log(`Directory not found: ${directoryPath}`);
      res.send("Hello, TypeScript with Express!");
    }
  } else {
    console.log("library already exists");
    res.send("Hello, TypeScript with Express!");
  }
});

app.post("/custom", (req, res) => {
  const projName = req.body.projName;
  const zipFileName = req.body.zipFileName.replace(/\.zip$/, "");

  const directoryPath = path.join(
    CUSTOM_DIRECTORY_PATH,
    projName,
    "extracted_zip_files",
    zipFileName
  );
  // const directoryPath = "/home/smit/breezeui/breeze/configurations/projname/uploaded_zip/client";
  // install specific version of dependency if not present in our third party parser

  if (fs.existsSync(directoryPath)) {
    extractAllComponentDetails(projName, directoryPath, zipFileName, "file");
    res.send("Hello, TypeScript with Express!");
  } else {
    console.log(`Directory not found: ${directoryPath}`);
    res.send("Hello, TypeScript with Express!");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
