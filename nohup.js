#!/usr/bin/env node

import { $, argv, echo, os, fs, cd, chalk, sleep } from 'zx';

console.log(argv)
async function main() {

    let path = os.homedir() + '/.n_nohup/';
    // console.log(path)
    await fs.ensureDir(path);

    let log = `${path}${argv._.join('_')}.log`;
    let pid = `${path}${argv._.join('_')}.pid`;
    // console.log(log, pid)
    // let nohupArgs = `nohup ${argv._.join(' ')} > ${log} 2>&1 & echo $! > ${pid}`
    // console.log(nohupArgs)
    let nohup_p = await $`nohup ${argv._} > ${log} 2>&1 & echo $! > ${pid}`
    let cmd_pid = (await $`less ${pid}`.quiet()).toString().replace(/\n/, '')
    console.log("pid: ", chalk.blue(cmd_pid))

    let tail_p = $`tail -f ${log}`
    // console.log(tail_p)
    console.log(`按 ${chalk.blue('q')} 结束查看日志, 按 ${chalk.red('c')} 退出nohup`)
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding('utf8');

    process.stdin.on('data', async function (key) {
        if (key === 'q') {
            console.log(`${chalk.blue('结束查看日志, nohup后台继续运行')}`);
            await tail_p.kill('SIGINT');
            await sleep(500)
            process.exit();
        }
        if (key === 'c') {
            console.log(`${chalk.red('退出nohup')}`);
            await $`kill -9 ${cmd_pid}`.catch(err => { console.log("进程杀死失败: ", err) })
            await tail_p.kill('SIGINT');
            process.exit();
        }
    });
    // setTimeout(() => {
    //     tail_p.kill('SIGINT');
    // }, 10000)
    await tail_p.nothrow();

}

main()