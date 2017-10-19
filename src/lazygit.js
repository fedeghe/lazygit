var AliasFactory = require('./lib/aliasFactory'),
    af = new AliasFactory();

const args = process.argv.splice(2);

if (args.length === 1) {
    if (args[0] === '--uninstall') {
        af.uninstall();
    } else {
        console.log(`
Usage:

// to install
$ npm src/lazygit.js

// to UNinstall
$ npm src/lazygit.js --uninstall

`);
    }
} else {
    af.install();
}