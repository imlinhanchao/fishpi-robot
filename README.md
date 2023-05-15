<p align="center">
  <a href="https://fishpi.cn">
    <img width="200" src="logo.png">
  </a>
</p>

<h1 align="center">Fishpi Robot</h1>
<p align="center">模块化摸鱼派机器人框架</p>

## ✨功能
- 👂 监听聊天室消息；
- 🤖自动分流类型消息；
- 📦 模块化机器人功能；
- 🔌 可插拔机器人模块；

## 📦 初始化配置
- 执行`npm run init`，并根据提示填写账号信息（仅第一次）；

## ⚙️ 调试
1. 执行`npm install`;
2. 使用 Visual Studio Code 运行调试（直接按下`F5`即可）。

## 🛡 部署
服务器需安装 `nodejs` 和 `npm` 。部署执行如下脚本：
```bash
npm install
```

编译前端代码：  
```bash
npm run build
```

启动服务：
```bash
npm start
```

以守护进程方式，启动服务：
```bash
forever start ./bin/www --uid fishpi-bot
```
or
```bash
pm2 start -n fishpi-bot npm -- start
```

## 📁 目录与文件
- .vscode - VSCode 调试配置
- bot - 机器人模块
- lib - 自定义类库
- script - 初始化脚本 
- src - 机器人入口
- config.json - 运行配置档案

## 🛠️ 开发说明

1. 机器人的核心在于 `bot` 文件夹，内包含使用聊天室消息类型命名的多个子文件夹，每个文件夹即为一个模块。消息类型包含：
   - online: 在线用户
   - discussChanged: 话题修改
   - revoke: 消息撤回
   - msg: 消息
   - redPacket: 红包
   - redPacketStatus: 红包状态
   - barrager: 弹幕

2. 每个模块包含入口文件 `index.js`，其定义如下：
   ```typescript
   export interface Robot {
     exec?: (msg: Message, fishpi: Fishpi) => any,
   }
   ```
3. 只要实现该函数，即可接收对应消息进行处理；
4. 已经有添加了 `msg`，`redPacket`，`redPacketStatus` 三种消息的处理。

### 💬 `msg` 模块说明

[`msg` 模块](./bot/msg)对聊天室的的普通聊天消息进行自动化处理，内含一个 `roles` 文件夹，除了 `index.ts` 为自动载入规则入口，其余每一个文件代表一条处理规则。

每条规则定义如下：
```typescript
export interface Role {
  /**
   * 正则匹配规则
   */
  match: RegExp[],
  /**
   * 规则执行
   * @param msg 红包消息
   * @param fishpi FishPi实例
   */
  exec: (msg: ChatMsg, fishpi: FishPi) => any,
  /**
   * 是否启用
   */
  enable?: boolean,
}
```

比如 [`record.ts`](./bot/msg/roles/record.ts) ，`match` 为 `/^赌狗记录/` 也就是只要在聊天内容匹配到`赌狗记录`起始的内容，就会触发 `exec` 函数，从 `storage` 中读取猜拳胜负记录，并调用 `fishpi` 的聊天室发送接口发送出去：

```typescript
fishpi.chatroom.send(`【${userName}】 ${record.lost}胜:${record.zero}平:${record.win}负`);
```

### 🧧 `redPacket` 模块说明

[`redPacket` 模块](./bot/redPacket/)与 `msg` 模块一样，都具有一个 `roles` 文件夹，除了 `index.ts` 为自动载入规则入口，其余每一个文件代表一种类型的红包处理规则。

每条规则定义如下：
```typescript
export interface Role {
  /**
   * 红包状态更新消息
   * @param msg 红包状态更新消息
   * @param fishpi FishPi实例
   */
  update?: (msg: RedPacketStatusMsg, fishpi: Fishpi) => any,
  /**
   * 红包规则执行
   * @param msg 红包消息
   * @param fishpi FishPi实例
   */
  exec?: (msg: ChatMsg, fishpi: Fishpi) => any,
  /**
   * 是否启用
   */
  enable?: boolean,
}
```

比如 [`heartbeat.ts`](./bot/redPacket/roles/heartbeat.ts)，会处理所有心跳红包。监测到心跳红包，就会将红包 id 加入列表：
```javascript
oIds.push(oId);
```
然后设定 3 秒后开启：
```javascript
  setTimeout(() => {
    // 如果心跳包的 oId 还在心跳包列表中，就打开它
    if (oIds.includes(oId)) fishpi.chatroom.redpacket.open(oId);
  }, 3000)
```

然后，使用 `update` 接口接收其他人开启红包的消息，如果有人开出正数积分，就将 id 从列表移出：
```javascript
update({ got, oId }: RedPacketStatusMsg, fishpi: Fishpi) {
  if (got > 0 && oIds.includes(oId)) {
    // 如果心跳包已经被领了，就把它从心跳包列表中移除
    oIds.splice(oIds.indexOf(oId), 1);
  }
},
```
