\[core]

&#x09;repositoryformatversion = 0

&#x09;filemode = false

&#x09;bare = false

&#x09;logallrefupdates = true

&#x09;symlinks = false

&#x09;ignorecase = true

\[diff]

&#x09;tool = vsdiffmerge

\[difftool]

&#x09;prompt = true

\[difftool "vsdiffmerge"]

&#x09;cmd = \\"C:\\\\Program Files\\\\Microsoft Visual Studio\\\\18\\\\Insiders\\\\Common7\\\\IDE\\\\CommonExtensions\\\\Microsoft\\\\TeamFoundation\\\\Team Explorer\\\\vsdiffmerge.exe\\" \\"$LOCAL\\" \\"$REMOTE\\" //t

&#x09;keepBackup = false

\[merge]

&#x09;tool = vsdiffmerge

\[mergetool]

&#x09;prompt = true

\[mergetool "vsdiffmerge"]

&#x09;cmd = \\"C:\\\\Program Files\\\\Microsoft Visual Studio\\\\18\\\\Insiders\\\\Common7\\\\IDE\\\\CommonExtensions\\\\Microsoft\\\\TeamFoundation\\\\Team Explorer\\\\vsdiffmerge.exe\\" \\"$REMOTE\\" \\"$LOCAL\\" \\"$BASE\\" \\"$MERGED\\" //m

&#x09;keepBackup = false

&#x09;trustExitCode = true

\[remote "origin"]

&#x09;url = https://sigge1511@github.com/sigge1511/PortfolioSigge.git

&#x09;fetch = +refs/heads/\*:refs/remotes/origin/\*

\[branch "master"]

&#x09;remote = origin

&#x09;merge = refs/heads/master

&#x09;vscode-merge-base = origin/master

\[branch "1-start-portfolio-page-setup"]

&#x09;remote = origin

&#x09;merge = refs/heads/1-start-portfolio-page-setup

&#x09;vscode-merge-base = origin/1-start-portfolio-page-setup

\[branch "Adding-personal-info"]

&#x09;remote = origin

&#x09;merge = refs/heads/Adding-personal-info

&#x09;vscode-merge-base = origin/master



