#!/usr/bin/env node

import fetch from "node-fetch";
import qs from "querystring";
import { $, argv, fs, YAML, fs } from 'zx';

const URLPRE = "https://nnr.moe";
const token = "976daa2b-af22-4dd4-ab3c-ddaf3d169bbd";
const headers = {
    token,
    "content-type": "application/json",
}
const nodes = ["广港IEPL1 x10", "广港IEPL2 x10", "安徽-香港 x2", "安徽-香港"];
const proxyConig = {
    "type": "vless",
    "uuid": "2943d492-4038-4d29-d22b-896b8cada7c4",
    "network": "grpc",
    "servername": "www.speedtest.net",
    "flow": null,
    "udp": true,
    "tls": true,
    "reality-opts": {
        "public-key": "UtL7E0Gmxj3X5JdcPAutpTRKo7K2hugkR0vwk2XroUM"
    },
    "client-fingerprint": "chrome",
    "grpc-opts": {
        "grpc-service-name": "grpc"
    }
}
const proxyConig2 = {
    "type": "ss",
    "cipher": "aes-256-gcm",
    "password": "if!=Null",
    "udp": true
}
const ends = [{
    server: "hk.dadigua.men",
    port: 22213,
    // nodes: ["广港IEPL1 x10"],
    proxyConig: proxyConig
}, {
    server: "wap.dadigua.men",
    port: 22213,
    // nodes: ["广港IEPL1 x10"],
    proxyConig: proxyConig
}, {
    server: "hk.dadigua.men",
    port: 22211,
    // nodes: ["广港IEPL1 x10"],
    proxyConig: proxyConig2
}, {
    server: "wap.dadigua.men",
    port: 22211,
    // nodes: ["广港IEPL1 x10"],
    proxyConig: proxyConig2
}];


function request(path, options) {
    return fetch(URLPRE + path, Object.assign({
        method: "POST",
        headers
    }, options)).then(res => { if (res.status == 200) { return res.json() } console.log(res); throw new Error("返回内容错误：" + res.status) });
}

async function clearRules() {
    const response = await request("/api/rules/", {
        method: "POST",
        headers
    });
    if (response.status == 1) {
        // console.log(response.data)
        if (response.data.length == 0) {
            console.log("规则是空的")
        }
        for (let i = 0; i < response.data.length; i++) {
            const rule = response.data[i];

            const response2 = await request("/api/rules/del", {
                method: "POST",
                headers,
                body: JSON.stringify({ rid: rule.rid })
            });
            if (response2.status == 1) {
                console.log(rule.rid + " - 删除成功：" + rule.name)
            } else {
                console.log(rule.rid + " - 删除失败：" + rule.name)
            }
        }
    }
}

async function addRules() {
    const response = await request("/api/servers", {
        method: "POST",
        headers
    });
    let proxy = []

    for (let j = 0; j < ends.length; j++) {
        const endnode = ends[j];
        for (let i = 0; i < response.data.length; i++) {
            const target = response.data[i];

            if ((endnode.nodes || nodes).includes(target.name)) {
                let name = [endnode.proxyConig.type, endnode.server.replace('.dadigua.men', ''), target.name].join("-");
                const response2 = await request("/api/rules/add", {
                    method: "POST",
                    headers,
                    body: JSON.stringify({
                        "sid": target.sid, // 节点id
                        // "port": 25555, // 源端口,
                        "remote": endnode.server, // 目标地址
                        "rport": endnode.port, // 目标端口
                        "type": target.types.includes("tcp+udp") ? "tcp+udp" : "tcp", // 规则协议
                        "name": name, // 规则备注/名称
                        "setting": { // 规则设置
                            "loadbalanceMode": "fallback"
                        }
                    })
                });
                if (response2.status == 1) {
                    let rule = response2.data;
                    console.log(rule.sid + " - 添加成功：" + rule.port)
                    proxy.push({
                        name: name,
                        server: rule.sid + '.dadigua.men',
                        port: rule.port,
                        ...endnode.proxyConig
                    })
                } else {
                    console.log("添加失败")
                }
            }
        }
    }
    console.log(YAML.stringify(proxy))
    await fs.write('config.yaml', YAML.stringify(proxy))
}

async function main() {
    await clearRules();
    await addRules();
}

main()