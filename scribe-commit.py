#!/usr/bin/env python3
import subprocess
import os

os.chdir('C:\\Users\\msigf\\source\\repos\\PortfolioSigge')
subprocess.run(['git', 'add', '.squad/'], check=True)
subprocess.run([
    'git', 'commit', '-m',
    'docs: Session log & orchestration record — Contact redesign validation, ProjectList integration, QA planning complete\n\nCo-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>'
], check=True)
print("Commit complete")
