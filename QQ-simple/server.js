//创建服务器
const express = require('express');
const WebSocket = require('ws');
const app = express();
const path = require('path');
const ws = new WebSocket.Server({ port: 1111 }, () => { console.log('socket st') })


app.use('/static', express.static(path.join(__dirname, './static')));

//如果多个客户端连接到服务器就是创建了多个client对象，我们可以创建一个数组
//存放这些对象，然后进行某个客户端的广播



let clients = [];

//等待前端连接（监听）
ws.on('connection', (client) => {
    clients.push(client); //连接一个就存一个
    //主动向前端发送消息,只能传字符串,不能传client.send({'欢迎光临'})
    client.send('欢迎光临');
    //监听前端是否发来数据
    client.on('message', (msg) => {
            console.log('来自前端的数据：' + msg);
            sendAll(msg);
        })
        //监听前端是否断开连接
    client.on('close', (msg) => {
        console.log('前端主动断开数据');
    })
})


function sendAll(msg) {
    for (let index = 0; index < clients.length; index++) {
        clients[index].send(msg);
    }
}
//循环遍历

app.listen(8888, () => {
    console.log('服务器启动！')
})