const { exec } = require('child_process');
const semver = require('semver');

exec('tns --version', (err, stdout, stderr) => {
    if (err) {
        // node couldn't execute the command
        console.log(`tns --version err: ${err}`);
        return;
    }
    console.log('******stdout', `${stdout}`)
    // In case the current Node.js version is not supported by CLI, a warning in `tns --version` output is shown.
    // Sample output:
    //
    /*Support for Node.js ^8.0.0 is deprecated and will be removed in one of the next releases of NativeScript. Please, upgrade to the latest Node.js LTS version.

    6.0.0
    */
    // Extract the actual version (6.0.0) from it.

    /**
     * We must ignore this warning here:
     * "You are using the deprecated nsconfig.json file. Just be aware that NativeScript now has an improved nativescript.config.(js|ts) file for when you're ready to upgrade this project. Error while loading nativescript-cloud is: Default commands should be required before child commands"
     * and some ANSI styling commands
     */
    const versionString = (`${stdout}`.split('\n').filter(item => item.match(new RegExp('^(\\x1B\\[39m)?[0-9].*$', '')))[0])
        .replace('\x1B\[39m', '')
    const tnsVersion = semver.major((`${versionString}`.match(/^(?:\d+\.){2}\d+.*?$/m) || [])[0]);

    // execute 'tns plugin build' for {N} version > 4. This command builds .aar in platforms/android folder.
    if (tnsVersion >= 4) {
        console.log(`executing 'tns plugin build'`);
        exec('tns plugin build', (err, stdout, stderr) => {
            if (err) {
                // node couldn't execute the command
                console.log(`${err}`);
                return;
            }
        });
    }
});
