#!/usr/bin/env node
import { $, argv, echo, os, fs } from 'zx';
import fetch from 'node-fetch';

let cmd = argv._[0];

echo(os.arch())

let platform = os.platform() == "win32" ? "windows" : "linux";
let arch = os.arch() == "x64" ? "amd64" : "arm64";
// clash.meta-linux-amd64-v0.0.6.gz


if (cmd == "init") {
    await $`pm2 -v`.catch(async (e) => {
        return await $`npm i -g pm2`
    })
    await fs.ensureDir('bin')
    await downloadFile(`https://github.com/laopo001/Clash.Meta/releases/download/v0.0.6/clash.meta-${platform}-${arch}-v0.0.6.gz`, './bin/clash.gz');
    await fs.remove('./bin/clash')
    await $`./extract.js bin/clash.gz`
    await $`chmod 755 bin/clash`
    await fs.ensureDir('bin/clash_data')
    await downloadFile(`https://static.dadigua.men/clash/redir.beta.yaml`, 'bin/clash_data/config.yaml');
}


if (cmd == "start") {
    await $`pm2 start --name clash ./bin/clash -- -d ./bin/clash_data`;
}

if (cmd == "stop") {
    await $`pm2 stop clash`;
}







async function downloadFile(url, outputPath) {
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const fileStream = fs.createWriteStream(outputPath);

        await new Promise((resolve, reject) => {
            response.body.pipe(fileStream);
            response.body.on('error', (err) => {
                reject(err);
            });
            fileStream.on('finish', function () {
                resolve();
            });
        });

        console.log('File downloaded successfully!');
    } catch (error) {
        console.error('Error downloading file:', error);
    }
}
