#!/usr/bin/env node

import { $, argv, echo, os, fs, cd, chalk } from 'zx';


async function main() {

    let path = os.homedir() + '/.n_nohup/';
    // console.log(path)
    await fs.ensureDir(path);

    let log = `${path}${argv._.join('_')}.log`;
    let pid = `${path}${argv._.join('_')}.pid`;
    // console.log(log, pid)
    // let nohupArgs = `nohup ${argv._.join(' ')} > ${log} 2>&1 & echo $! > ${pid}`
    // console.log(nohupArgs)
    await $`nohup ${argv._} > ${log} 2>&1 &`
    // console.log("pid: " + chalk.red(fs.readFileSync(pid).toString()))

}

main()