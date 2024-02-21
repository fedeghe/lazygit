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
            uhome + '/.bash_profile',
            uhome + '/.zshrc',
        ]
    },
    als= [{
        description: 'Alias to init a git repo',
        ex: `$ ${ns}i`,
        fname: ns + 'i',
        body: 'git init'
     },{
        description: 'Alias for getting the status',
        ex: `$ ${ns}st`,
        fname: ns + 'st',
        body: 'git status'
     },{
        description: 'Alias for getting the list of branches',
        ex: `$ ${ns}bls`,
        fname: ns + 'bls',
        body: 'git branch -a'
     },{
        description: 'Alias for getting the log',
        ex: `$ ${ns}log`,
        fname: ns + 'log',
        body: 'git log'
     },{
        description: 'Alias for pull',
        ex: `$ ${ns}pull`,
        fname: ns + 'pull',
        body: 'git pull'
     },{
        description: 'Alias for first push setting upstream',
        ex: `$ ${ns}pushsu BRANCHNAME`,
        fname: ns + 'pushsu',
        body: 'git push --set-upstream origin $1'
     },{
        description: 'Alias for push',
        ex: `$ ${ns}push`,
        fname: ns + 'push',
        body: 'git push'
     },{
        description: 'Alias for remote update',
        ex: `$ ${ns}up`,
        fname: ns + 'up',
        body: 'git remote update'
     },{
        description: 'Alias for saving a stash',
        ex: `$ ${ns}ss`,
        fname: ns + 'ss',
        body: 'git stash save'
     },{
        description: 'Alias for pop last stash',
        ex: `$ ${ns}sp`,
        fname: ns + 'sp',
        body: 'git stash pop'
     },{
        description: 'Alias to UNcommit',
        ex: `$ ${ns}uncomm`,
        fname: ns + 'uncommit',
        body: 'git reset --hard ^HEAD'
     }/**/,{
        description: 'Alias to stage',
        ex: `$ ${ns}add`,
        fname: ns + 'add',
        body: 'git add \${@:-*}'
     },{
        description: 'Alias to UNstage',
        ex: `$ ${ns}unst [PAR [, ...]]`,
        fname: ns + 'unst',
        body: 'git reset HEAD -- \${@:-*}'
     },{
        description: 'Alias to commit',
        ex: `$ ${ns}comm "message_with_no_spaces" (default: "empty_message")`,
        fname: ns + 'comm',
        body: 'git commit -m \${1:-"empty_message"}'
     },{
        description: 'Alias to amend last commit message',
        ex: `$ ${ns}amend "rewritten message" (default: "empty_message")`,
        fname: ns + 'amend',
        body: 'git commit -m \${1:-"empty_message"} --amend'
     },{
        description: 'Alias to create a new branch and checkout',
        ex: `$ ${ns}br BRANCHNAME`,
        fname: ns + 'br',
        body: 'git checkout -b $1'
     },{
        description: 'Alias to delete a branch',
        ex: `$ ${ns}brdel BRANCHNAME`,
        fname: ns + 'brdel',
        body: 'git branch -d $1'
     },{
        description: 'Alias to checkout an existing branch',
        ex: `$ ${ns}co BRANCHNAME|TAG`,
        fname: ns + 'co',
        body: 'git checkout $1'
     },{
        description: 'Alias to revert non staged files passed',
        ex: `$ ${ns}rev [FILE1 [, FILE2 ...]]`,
        fname: ns + 'rev',
        body: 'git checkout -- $@'
     },{
        description: 'Alias to clone',
        ex: `$ ${ns}clone REF`,
        fname: ns + 'clone',
        body: 'git clone $1'
     },{
        description: 'Alias to add remote',
        ex: `${ns}remoteadd MYORIGIN`,
        fname: ns + 'remoteadd',
        body: 'git remote add origin $1'
     },{
        description: 'Alias to create a tag',
        ex: `${ns}tag TAGNAME MESSAGE`,
        fname: ns + 'tag',
        body: 'git tag -a $1 -m \${2:-"empty_message"}'
     },{
        description: 'Alias to list all tags',
        ex: `${ns}tags`,
        fname: ns + 'tags',
        body: 'git tag'
     },{
        description: 'Alias to push all local tags',
        ex: `${ns}tagsup`,
        fname: ns + 'tagsup',
        body: 'git push --tags'
     },{
        description: 'Alias to push one local tag',
        ex: `${ns}tagup TAGNAME`,
        fname: ns + 'tagup',
        body: 'git push origin $1'
     },{
        description: 'Alias to create a patch',
        ex: `${ns}patchc PATCHNAME`,
        fname: ns + 'patchc',
        body: 'git diff > $1'
     },{
        description: 'Alias to apply a patch',
        ex: `${ns}patcha PATCHFILE`,
        fname: ns + 'patcha',
        body: 'git apply --stat $1'
     },{
        description: 'Merge master in current branch',
        ex: `${ns}mm`,
        fname: ns + 'mm',
        body: 'git merge master'
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
    echo "${"Lazygit runs:".rainbow()} ${al.body}"
    echo "------"
    ${al.body}
}
alias ${al.fname}=___${al.fname}
___${al.fname}H() {
    echo "${packageInfo.name}"
    echo "${al.fname}: ${al.description}"
    echo "${al.ex}  <---> ${al.body}"
}
alias ${al.fname}-=___${al.fname}H
        `;
        return r + "\n" + instr;
    }, aliasesHead);
    return ret;
})();

class aliasFactory {
    constructor() {
        console.log(`\n# ${packageInfo.name} v ${version} #\n`.rainbow());
    }
    
    install () {
        let self = this;
        this.findBashConfigFile().then(() => {
            fs.writeFile(dstPath, aliases, err => {
                if (err) {
                    throw err;
                }
                fs.chmod(dstPath, '0755', (err) => {
                    if (err) {
                        throw err;
                    }
                });
                self.appendBashGit();
            });
        }).catch(e => {
            console.log(e);
        });
    }

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

    findBashConfigFile() {
        return new Promise((solve, reject) => {
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
                            reject(`Bash file not found ... create one among ${trg.mac.join(', ')} and rerun`);
                        }
                    }
                });
            }, this);
        });
    }
    
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