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
    let nohup_p = $`nohup ${argv._} > ${log} 2>&1 &`
    console.log("按 q 结束查看日志, 按 c 退出nohup")
    let tail_p = $`tail -f ${log}`
    await sleep(5000)
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    nohup_p.then(res => { console.log(res) })
    process.stdin.on('data', function (key) {
        // 如果用户按下了'q'键，则退出程序
        if (key === 'q') {
            console.log('结束查看日志', nohup_p.pid, tail_p.pid);
            tail_p && tail_p.kill()
            process.exit();
        }
        if (key === 'c') {

            console.log('退出nohup');
            nohup_p && nohup_p.kill()
            tail_p && tail_p.kill();
            process.exit(1);
        }
    });

    // await sleep(20000)
    // console.log("pid: " + chalk.red(fs.readFileSync(pid).toString()))

}

main()