#!/usr/bin/env node
import { $, argv } from 'zx';

let filename = argv._[0];

try {
    if (/\.zip$/.test(filename)) {
        await $`unzip ${filename}`
    }
    if (/\.gz$/.test(filename)) {
        await $`gunzip ${filename}`
    }
    if (/\.tar.gz$/.test(filename)) {
        await $`tar -zxvf ${filename}`
    }

} catch (e) { }
