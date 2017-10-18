require('./stringProto');
const Promise = require('./promise'),
    fs = require('fs'),
    path = require('path'),
    child_process = require('child_process'),
    ns = 'g',
    uhome = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'],
    dstFile = '.bash_git',
    dstPath = path.resolve(uhome, dstFile);
    packageInfo = fs.existsSync(__dirname + '/../../package.json') ? require(__dirname + '/../../package.json') : {},
    trg = {
        mac : [
            uhome + '/.bash_rc',
            uhome + '/.bash_profile'
        ]
    },
    version = packageInfo.version,
    aliases = `

#
##           dMP     .aMMMb dMMMMMP dMP dMP .aMMMMP dMP dMMMMMMP 
###         dMP     dMP"dMP  .dMP" dMP.dMP dMP"    amr    dMP    
####       dMP     dMMMMMP .dMP"   VMMMMP dMP MMP"dMP    dMP     
###       dMP     dMP dMP.dMP"   dA .dMP dMP.dMP dMP    dMP      
##       dMMMMMP dMP dMPdMMMMMP  VMMMP"  VMMMP" dMP    dMP    
#


# git straigth alias
# 
alias ${ns}init='git init'
alias ${ns}status='git status'
alias ${ns}branchls='git branch -a'
alias ${ns}log='git log'
alias ${ns}pull='git pull'
alias ${ns}push='git push'
alias ${ns}update='git remote update'
alias ${ns}savestash='git stash save'
alias ${ns}popstash='git stash pop'

# ============
# Add to stage
#
# otherwise it forwards all params
# 
___gadd() {
    git add \${@:-*}
}
alias ${ns}add=___gadd

# =================
# Unstage something
#
___gunst() {
    git reset HEAD -- \${@:-*}
}
alias ${ns}unstage=___gunst


# ======
# Push origin to branch 
#
# 
___gpusho() {
    git push --set-upstream origin $1
}
alias ${ns}pusho=___gpusho

# ======
# Commit 
#
# if a comment is given (within single or double quotes) it uses as message
# otherwise is left empty
# 
___gcomm() {
    git commit -m \${1:-"empty message"}
}
alias ${ns}commit=___gcomm

# ======
# Amend  
#
# replace the commit message
# 
___gamend() {
    git commit -m \${1:-"empty message"} --amend 
}
alias ${ns}amend=___gamend

# ==============================
# Create a branch & check it out
#
___gbr() {
    git checkout -b $1
}
alias ${ns}branchnew=___gbr

# ==============================
# Delete a branch & check it out
# 
___gbrdel() {
    git branch -d $1
}
alias ${ns}branchdel=___gbr

# ===========================
# Checkout an existing branch
#
___gco() {
    git checkout $1
}
alias ${ns}checkout=___gco

# ======================
# Revert the passed file
# 
___grev() {
    git checkout -- $@
}
alias ${ns}revert=___grev

# =====
# Clone
# 
___gclo() {
    git clone $1
}
alias ${ns}clone=___gclo

# =====
# Add remote
# 
___gaddrem() {
    git remote add origin $1
}
alias ${ns}addrem=___gaddrem





___ghelp() {
echo ""
echo "Geed help (v ${version})" 
echo ""
echo "# git init   ---------------------> ginit"
echo "# git status   -------------------> gstatus"
echo "# git branch -a   ----------------> glsbranch"
echo "# git log   ----------------------> glog"
echo "# git pull   ---------------------> gpull"
echo "# git push   ---------------------> gpush"
echo "# git push --set-upstream origin [BR]   ---------------------> gpusho [BR]"
echo "# git remote update   ------------> gupdate"
echo "# git stash save   ---------------> gsavestash"
echo "# git stash pop   ----------------> gpopstash"
echo "# git add [PAR]|*   --------------> gadd {[PAR]}"
echo "# git reset HEAD -- [PAR]|*   ----> gunstage {[PAR]}"
echo "# git commit -m \\\"mymsg\\\"|\\\"\\\"   -----> gcommit {\\\"my msg\\\"}"
echo "# git commit --amend -m \\\"mymsg\\\"|\\\"\\\"   -> gamend {\\\"my msg\\\"}"
echo "# git branch -b \\\"brName\\\"   -------> gbranchnew \\\"brName\\\""
echo "# git branch -d \\\"brName\\\"   -------> gbranchdel \\\"brName\\\""
echo "# git checkout \\\"brName\\\"   --------> gcheckout \\\"brName\\\""
echo "# git checkout -- [PAR]   --------> grevert [PAR]"
echo "# git clone REF   ----------------> gclone REF"
echo "# git remote add origin REF   ----> gaddrem REF"
echo ""
echo "more to come"
echo "...."
}
alias ${ns}help=___ghelp   

`;

// console.log('user home = ', uhome);1
class aliasFactory {
    constructor() {
        console.log(`\n# ${packageInfo.name} v ${packageInfo.version} #\n`.rainbow());
    }
    exec (command, cb) {
        child_process.exec(command, err => cb(~~err) );
    }
    install () {
        var self = this;
        this.findBashConfigFile().then(() => {
            fs.writeFile(dstPath, aliases, err => {
                if (err) throw err;
                console.log('- ' + dstPath + ' has been saved!');
                fs.chmod(dstPath, '0755', (err) => {
                    if (err) throw err;
                    console.log('- permissions set');
                });
                self.appendBashGit();
            });
        }).catch(e => {
            console.log(e)
        })
    }

    uninstall () {
        var self = this;
        this.findBashConfigFile().then(() => {
            fs.unlink(dstPath, err => {
                if (err) throw err;
                console.log('- ' + dstPath + ' has been deleted!');
                self.unappendBashGit();
            });
        }).catch(e => {
            console.log(e)
        })
    }

    findBashConfigFile() {
        return new Promise((solve, reject) => {
            let found = false;
            trg.mac.forEach(function(element, i) {
                if (found) return;
                const fname = path.resolve(element);
                fs.exists(fname, exists => {
                    if (exists){
                        found = true;
                        this.file = fname;
                        solve();
                    } else {
                        if (!found && i == trg.mac.length - 1) reject(`Bash file not found ... create ${trg.mac[0]} and rerun`);
                    }
                });
            }, this);
            // 
        });
    }

    appendBashGit() {
        var self = this;
        const bash_path = "\n. " + dstFile;
        fs.appendFile(this.file, bash_path, err => {
            if (err) throw err;
            self.exec(bash_path, code => {
                if (code == 0) {
                    console.log('Successfully installed'.green())
                } else {
                    console.log(`Error: process terminated with code ${code}`);
                }
            });
        });
    }
    unappendBashGit() {
        var self = this;
        const bash_path = '. ' + dstFile;

        fs.readFile(self.file, 'UTF-8',  (err, data) => {
            if (err) throw err;
            data = data.replace(bash_path, '');
            fs.writeFile(self.file, data, err => {
                if (err) throw err;
                else {
                    self.exec(self.file, code => {
                        if (code == 0) {
                            console.log('Successfully UNinstalled'.green())
                        } else {
                            console.log(`Error: process terminated with code ${code}`);
                        }
                    });
                }
            })
        });
    }
}

module.exports = aliasFactory;