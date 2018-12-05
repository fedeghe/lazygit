### Basic git commands fast alias generator

#### Installation
```
> npm install lazygit
```

#### Usage  

| git command        | lazygit command|
| ------------- |-------------|
| git init      | gi |
| git status | gst |
| git branch -a | gbls |
| git log | glog |
| git pull | gpull |
| git push | gpush |
| git push --set-upstream origin DEV | gpushsu DEV |
| git remote update | gup |
| git stash save | gss |
| git stash pop | gps |
| git reset --hard ^HEAD | guncomm |
| git add [PAR or *] | gadd {[PAR]} |
| git reset HEAD -- [PAR or *] | gunst {[PAR]} |
| git commit -m "mymsg\_no\_spaces" | gcomm {"mymsg\_no\_spaces"} |
| git commit --amend -m "mymsg\_no\_spaces" | gamend {"my\_msg\_no\_spaces"} |
| git branch -b "brName" | gbr "brName" |
| git branch -d "brName" | gbrdel"brName" |
| git checkout "brName" | gco "brName" |
| git checkout -- [PAR] | grev [PAR] |
| git clone REF | gclone REF |
| git remote add origin REF | gaddrem REF |
| git tag -a TAGNAME | gtag TAGNAME |
| git push --tags | gtagsup |
| git push origin TAGNAME | gtagup TAGNAME |
| git format-patch  BRANCHX --stdout > PATCHFILE | gpatchcreate BRANCHX PATCHFILE |
| git apply --stat PATCHFILE | gpatchapply PATCHFILE |

If You have doubts about what the command execute just add a dash at the end:  

```
$ gst-
lazygit
gst: Alias for getting the status
gst  <--->  git status

```

##### What it does  

For the moment it just works if You have a .bash_profile in your home.  

It simply adds some aliases commands in a separate .bash_git file in Your HOME folder.  

##### Uninstall  
From the _lazygit_ folder run:  
```
$ node src/lazygit.js --uninstall
```
and then
```
$ cd .. && rm -rf lazygit
```

 