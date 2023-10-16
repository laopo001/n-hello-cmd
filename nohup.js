#!/usr/bin/env node

import { $, argv, echo, os, fs, cd, chalk } from 'zx';

await $`nohup ${argv._} > ${argv._.join('-')}.log 2>&1 & echo $! > ${argv._.join('-')}.pid`
console.log("pid: " + chalk.red(fs.readFileSync('run.pid').toString()))

