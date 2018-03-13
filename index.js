#!/usr/bin/env node

const fse = require('fs-extra')
var shell = require('shelljs')
var program = require('commander')
var path = require('path')

if (!shell.which('git')) {
    shell.echo('Sorry, this script requires git');
    shell.exit(1);
}

program
    .version('0.0.1')
    .option('-r, --remote [remote]', 'Add the remote of deploy, and it is require.', undefined)
    .option('-d, --dist [floder]', 'Add the floder of your builded project, and it is require.', undefined)
    .option('-b, --branch [branch]', 'Add the branch of deploy, and default value is master.', 'master')
    .option('-m, --cmsg [msg]', 'Add the commit message of deploy, and default value is \'Auto deploy\'.', 'Auto deploy')
    .parse(process.argv);

if (!program.remote || !program.dist) {
    console.log('Remote and dist floder is require.To see more detail: use --help option.')
    process.exit(1)
}

shell.rm('-rf', '.git-release')
shell.cp('-r', program.dist, '.git-release')

process.chdir('.git-release')

shell.exec('git init')
shell.exec(`git remote add origin ${program.remote}`)
shell.exec(`git add .`)
shell.exec(`git commit -m "${program.cmsg}"`)
shell.exec(`git push origin ${program.branch} --force`)

process.chdir('..')
shell.rm('-rf', '.git-release')

console.log('Deploy success!')
