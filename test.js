#!/usr/bin/env node

import { $, argv, echo, os, fs, cd, chalk, sleep } from 'zx';

console.log(argv)
async function main() {

    let path = os.homedir() + '/.n_nohup/';
    // console.log(path)
    await fs.ensureDir(path);

    let log = `${path}${argv._.join('_')}.log`;
    // let pid = `${path}${argv._.join('_')}.pid`;
    // console.log(log, pid)
    // let nohupArgs = `nohup ${argv._.join(' ')} > ${log} 2>&1 & echo $! > ${pid}`
    // console.log(nohupArgs)
    await $`nohup ${argv._} > ${log} 2>&1 &`.stdio('pipe', 'pipe', 'pipe')
    await $`tail -f ${log}`


    // await sleep(20000)
    // console.log("pid: " + chalk.red(fs.readFileSync(pid).toString()))

}

main()