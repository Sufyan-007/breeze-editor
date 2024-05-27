const { execSync } = require('child_process');

function installPackage(packageName, packageVersion) {
    if (!packageName) {
        console.error('Please provide a package name.');
        return;
    }

    if (packageVersion) {
        packageName = `${packageName}@${packageVersion}`
    }

    const command = `npm install ${packageName} --save`;

    const stdout = execSync(command, { stdio: 'pipe' }).toString();

    console.log(`\n---PACKAGE ${packageName} INSTALLATION SUCCESSFUL---`);

    // execSync(command, (error, stdout, stderr) => {

    //     console.log('------', error);
    //     if (error) {

            
    //         console.error(`Error installing package: ${error.message}`);
    //         return { status: "ERROR" , data : error.message};
    //     }
    //     if (stderr) {
    //         // console.error(`stderr: ${stderr}`);
    //         return { status: "WARNING" , data : stderr};
    //     }
    //     // console.log(`stdout: ${stdout}`);
    //     // console.log(`Package ${packageName} has been installed and saved to dependencies.`);

    //     return { status: "SUCCESS" }
    // });
    // console.log('-------------------');
    // console.log(re);
    // return re;
}

module.exports = {
    installPackage
}