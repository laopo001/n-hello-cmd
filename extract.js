#!/usr/bin/env node
import { $, argv } from 'zx';

let filename = argv._[0];

try {
    if (/\.zip$/.test(filename)) {
        await $`unzip ${filename}`
    }
    if (/\.tar.gz$/.test(filename)) {
        await $`tar -zxvf ${filename}`
    }
    if (/\.gz$/.test(filename)) {
        await $`gunzip ${filename}`
    }
} catch (e) { }
