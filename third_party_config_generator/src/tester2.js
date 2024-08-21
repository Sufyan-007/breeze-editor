const fs = require('fs');
const path = require('path');

// Define the source and target paths
// const source = path.join('/home/smit/Desktop/bridge/processor/third_party_configs/', 'react-bootstrap_2.10.2_tester');

function createPropsNameFile(source, target) {
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(target)) {
            fs.mkdirSync(target);
        }
        
        fs.readdir(source, (err, files) => {
            if (err) {
                reject('Error reading directory: ',err);
                return;
            }
            
            const filePromises = files.map(file => {
                if (file.startsWith('other_') || file.startsWith('others')) {
                    return Promise.resolve(); 
                }
                
                const sourceFilePath = path.join(source, file);
                const targetFilePath = path.join(target, file);
                
                return new Promise((resolve, reject) => {
                    fs.readFile(sourceFilePath, 'utf8', (err, data) => {
                        if (err) {
                            reject(`Error reading file ${file}: ${err}`);
                            return;
                        }
                        
                        try {
                            const jsonData = JSON.parse(data);
                            const da = jsonData.propsVars;
                            const names = da.map(item => item.name);
                            const namesObject = { propsName: names };
                            const namesJson = JSON.stringify(namesObject, null, 2);
                            
                            fs.writeFile(targetFilePath, namesJson, 'utf8', (err) => {
                                if (err) {
                                    reject(`Error writing file ${file}: ${err}`);
                                } else {
                                    resolve();
                                }
                            });
                        } catch (parseErr) {
                            reject(`Error parsing JSON file ${file}: ${parseErr}`);
                        }
                    });
                });
            });
            
            Promise.all(filePromises)
                .then(() => resolve())
                .catch(error => reject(error));
        });
    });
}

function processFiles(source,targetFolder) {
    const target = path.join('/home/subham/Documents/bridge/processor/',targetFolder);
    return new Promise((resolve, reject) => {
        fs.readdir(source, (err, files) => {
            if (err) {
                reject(`Error reading source directory: ${err}`);
                return;
            }
            
            const results = {};
            let pendingFiles = files.length;

            if (pendingFiles === 0) {
                writeResults(results,source)
                    .then(() => resolve())
                    .catch(error => reject(error));
                return;
            }

            const filePromises = files.map(file => {
                const sourceFilePath = path.join(source, file);
                const targetFilePath = path.join(target, file);

                return new Promise((resolve, reject) => {
                    fs.readFile(sourceFilePath, 'utf8', (err, data) => {
                        if (err) {
                            reject(`Error reading file ${sourceFilePath}: ${err}`);
                            return;
                        }

                        let jsonData;
                        try {
                            jsonData = JSON.parse(data);
                        } catch (parseErr) {
                            reject(`Error parsing JSON file ${sourceFilePath}: ${parseErr}`);
                            return;
                        }

                        const newNames = jsonData.propsName;
                        const newNamesSet = new Set(newNames);

                        fs.readFile(targetFilePath, 'utf8', (err, oldData) => {
                            let oldNames = [];
                            if (!err) {
                                const oldJsonData = JSON.parse(oldData);
                                oldNames = oldJsonData.propsName || [];
                            }

                            const missingNames = oldNames.filter(name => !newNamesSet.has(name));
                            const fileName = file.replace('.json', '');
                            results[fileName] = missingNames;

                            pendingFiles--;
                            if (pendingFiles === 0) {
                                writeResults(results,source)
                                    .then(() => resolve())
                                    .catch(error => reject(error));
                            } else {
                                resolve();
                            }
                        });
                    });
                });
            });

            Promise.all(filePromises)
                .then(() => {
                    if (pendingFiles === 0) {
                        writeResults(results,source)
                            .then(() => resolve())
                            .catch(error => reject(error));
                    }
                })
                .catch(error => reject(error));
        });
    });
}

function writeResults(results,target) {
    const storePath = path.join(target,'new.json');
    const namesJson = JSON.stringify(results, null, 2);

    return new Promise((resolve, reject) => {
        fs.writeFile(storePath, namesJson, 'utf8', (writeErr) => {
            if (writeErr) {
                reject(`Error writing to file ${storePath}: ${writeErr}`);
            } else {
                console.log(`Processed and saved all files.`);
                resolve();
            }
        });
    });
}



// processFiles();
module.exports = {
    processFiles,
    createPropsNameFile
}

