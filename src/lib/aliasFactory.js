require('./stringProto');
const mPromise = require('./promise'),
    fs = require('fs'),
    path = require('path'),
    ns = 'g',
    uhome = process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'],
    dstFile = '.bash_git',
    dstPath = path.resolve(uhome, dstFile),
    packageInfo = fs.existsSync(__dirname + '/../../package.json') ? require(__dirname + '/../../package.json') : {},
    version = packageInfo.version,
    trg = {
        mac : [
            uhome + '/.bash_rc',
            uhome + '/.bash_profile'
        ]
    },
    als= [{
        description: 'Alias to init a git repo',
        ex: `this is the ${ns}i help`,
        fname: ns + 'i',
        body: 'git init'
     },{
        description: 'Alias for getting the status',
        ex: `this is the ${ns}st help`,
        fname: ns + 'st',
        body: 'git status'
     },{
        description: 'Alias for getting the list of branches',
        ex: `this is the ${ns}bls help`,
        fname: ns + 'bls',
        body: 'git branch -a'
     },{
        description: 'Alias for getting the log',
        ex: `this is the ${ns}log help`,
        fname: ns + 'log',
        body: 'git log'
     },{
        description: 'Alias for pull',
        ex: `this is the ${ns}pull help`,
        fname: ns + 'pull',
        body: 'git pull'
     },{
        description: 'Alias for push',
        ex: `this is the ${ns}push help`,
        fname: ns + 'push',
        body: 'git push'
     },{
        description: 'Alias for remote update',
        ex: `this is the ${ns}up help`,
        fname: ns + 'up',
        body: 'git remote update'
     },{
        description: 'Alias for saving a stash',
        ex: `this is the ${ns}ss help`,
        fname: ns + 'ss',
        body: 'git stash save'
     },{
        description: 'Alias for pop last stash',
        ex: `this is the ${ns}sp help`,
        fname: ns + 'ss',
        body: 'git stash pop'
     },{
        description: 'Alias to UNcommit',
        ex: `this is the ${ns}uncomm help`,
        fname: ns + 'uncommit',
        body: 'git reset --hard ^HEAD'
     }
     
     ,{
        description: 'Alias to stage',
        ex: `this is the ${ns}add help`,
        fname: ns + 'add',
        body: 'git add \${@:-*}'
     },{
        description: 'Alias to UNstage',
        ex: `this is the ${ns}unstage help`,
        fname: ns + 'unstage',
        body: 'git reset HEAD -- \${@:-*}'
     },{
        description: 'Alias to commit',
        ex: `this is the ${ns}comm help`,
        fname: ns + 'comm',
        body: 'git commit -m \${1:-"empty message"}'
     },{
        description: 'Alias to amend last commit message',
        ex: `this is the ${ns}amend help`,
        fname: ns + 'amend',
        body: 'git commit -m \${1:-"empty message"} --amend'
     },{
        description: 'Alias to create a new branch and checkout',
        ex: `this is the ${ns}br help`,
        fname: ns + 'br',
        body: 'git checkout -b $1'
     },{
        description: 'Alias to delete a branch',
        ex: `this is the ${ns}brdel help`,
        fname: ns + 'brdel',
        body: 'git branch -d $1'
     },{
        description: 'Alias to checkout an existing branch',
        ex: `this is the ${ns}co help`,
        fname: ns + 'co',
        body: 'git checkout $1'
     },{
        description: 'Alias to revert non staged files passed',
        ex: `this is the ${ns}rev help`,
        fname: ns + 'rev',
        body: 'git checkout -- $@'
     },{
        description: 'Alias to revert non staged files passed',
        ex: `this is the ${ns}rev help`,
        fname: ns + 'rev',
        body: 'git checkout -- $@'
     },{
        description: 'Alias to add remote',
        ex: `this is the ${ns}remoteadd help`,
        fname: ns + 'remoteadd',
        body: 'git remote add origin $1'
     },{
        description: 'Alias to list all help',
        ex: `this is the ${ns}remoteadd help`,
        fname: ns + 'remoteadd',
        body: 'git remote add origin $1'
     }
    
    ],
     aliasesHead = `

     #
     ##           dMP     .aMMMb dMMMMMP dMP dMP .aMMMMP dMP dMMMMMMP 
     ###         dMP     dMP"dMP  .dMP" dMP.dMP dMP"    amr    dMP    
     ####       dMP     dMMMMMP .dMP"   VMMMMP dMP MMP"dMP    dMP     
     ###       dMP     dMP dMP.dMP"   dA .dMP dMP.dMP dMP    dMP      
     ##       dMMMMMP dMP dMPdMMMMMP  VMMMP"  VMMMP" dMP    dMP    
     #     

`;

let aliases = (() => {
    "use strict";
    let ret = als.reduce((r, al) => {
        let instr = `
___${al.fname}() {
    ${al.body}
}
alias ${al.fname}=___${al.fname}
___${al.fname}H() {
    echo "${packageInfo.name}"
    echo "${al.fname}: ${al.description}"
    echo "${al.ex}"
}
alias ${al.fname}-=___${al.fname}H
        `;
        return r + "\n" + instr;
    }, aliasesHead);
    return ret;
})();

/**
 * 
 */
class aliasFactory {
    constructor() {
        console.log(`\n# ${packageInfo.name} v ${packageInfo.version} #\n`.rainbow());
    }
    /**
     * 
     * @param {*} command 
     * @param {*} cb 
     */
    install () {
        let self = this;
        this.findBashConfigFile().then(() => {
            fs.writeFile(dstPath, aliases, err => {
                if (err) {
                    throw err;
                }
                // console.log('- ' + dstPath + ' has been saved!');
                fs.chmod(dstPath, '0755', (err) => {
                    if (err) {
                        throw err;
                    }
                    // console.log('- permissions set');
                });
                self.appendBashGit();
            });
        }).catch(e => {
            console.log(e);
        });
    }

    /**
     * 
     */
    uninstall () {
        let self = this;
        this.findBashConfigFile().then(() => {
            fs.unlink(dstPath, err => {
                if (err) {
                    throw err;
                }
                // console.log('- ' + dstPath + ' has been deleted!');
                self.unappendBashGit();
            });
        }).catch(e => {
            console.log(e);
        });
    }

    /**
     * 
     */
    findBashConfigFile() {
        return new mPromise((solve, reject) => {
            let found = false;
            trg.mac.forEach(function(element, i) {
                if (found) {
                    return;
                }
                const fname = path.resolve(element);
                fs.exists(fname, exists => {
                    if (exists){
                        found = true;
                        this.file = fname;
                        solve();
                    } else {
                        if (!found && i === trg.mac.length - 1) {
                            reject(`Bash file not found ... create ${trg.mac[0]} and rerun`);
                        }
                    }
                });
            }, this);
        });
    }
    
    /**
     * 
     */
    appendBashGit() {
        const self = this,
            bash_path = "\n. " + dstFile;
        fs.appendFile(this.file, bash_path, err => {
            if (err) {
                throw err;
            }
            console.log('Successfully installed'.green());
            self.end();
        });
    }

    /**
     * 
     */
    unappendBashGit() {
        const self = this,
            bash_path = '. ' + dstFile;

        fs.readFile(self.file, 'UTF-8',  (err, data) => {
            if (err) {
                throw err;
            }
            data = data.replace(bash_path, '');
            fs.writeFile(self.file, data, err => {
                if (err) {
                    throw err;
                }
                console.log('Successfully UNinstalled'.green());
                self.end();
            });
        });
    }




    end() {
        console.log("\n>>> Do not forget to restart the terminal\n");
    }
}

module.exports = aliasFactory;