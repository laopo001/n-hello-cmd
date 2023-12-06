#!/usr/bin/env node
import p from "./package.json" assert { type: 'json' };
console.log('Hello, cmd! ' + p.version);