# 简易版聊天室

## 运用nodejs+express+WebSocket(h5)
  + nodejs 进行填写服务端代码
  + express 进行公共文件管理
  + WebSocket 进行建立长连接，并且监听消息

### 功能描述
  + 在连接到本机的网的所有终端，通过访问公共文件夹访问Html页面
  + 需要先用服务器端pc的IP：给定的服务器端口号连接公共文件夹
  + 因为连接一个服务器就获取一个client，所以通过监听client 遍历client进行广播操作

### 服务端代码：
```
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
```

### 页面代码
```
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <script src="./js/jquery-1.12.4.js"></script>
    <link rel="stylesheet" href="./css/QQ.css">
    <title>Document</title>
</head>

<body>
    <h1 style="color: aliceblue">Welcome ChatRoom！</h1>
    <div class="QQ-box">
        <h3>ChatRoom</h3>
        <div class="messages-box">
            <div class="outputT">

            </div>
        </div>
        <textarea name="" class="inputT" id="inputT" rows="10"></textarea>
        <button class="send" onclick="sendServer()">Send</button>
    </div>

    <script>
        let str = '';
        const ws = new WebSocket('ws://172.29.193.185:1111');
        ws.onopen = function() {
            console.log('服务器已连接');
        }
        ws.onmessage = function(msg) {
            let Ctime = new Date();
            <!-- 字符串拼接 -->
            let mstr = `
            <br/>
            <div class="msg-box">
                    <img class="userimg" width="40" height="40" src="./img/user.jpg">
                    <div class="sendMsg">
                        <span class="Ctime-box">${Ctime}</span>
                        <br/>
                        ${msg.data}
                         </div>
                </div><br/>`;
            str += mstr;
            $('.outputT').html(str);
        }
        ws.onclose = function() {
            console.log('服务器已断开');
        }

        function sendServer() {
            ws.send($('#inputT').val());
        }
    </script>
</body>

</html>
```

