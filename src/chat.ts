import Fishpi, { ChatMsg } from 'fishpi';
import { domain } from '../config.json';
import fetch from 'node-fetch';
import { Robots } from '@bot/index';

const fishpi = new Fishpi();
fishpi.setDomain(domain);
globalThis.fetch = fetch as any;

export default {
  async login(config: any) {
    if (config.token) fishpi.setToken(config.token);
    else if (config.username && config.passwd) fishpi.login(config);
    else throw new Error('请提供 token 或者用户名密码');

    const rsp = await fishpi.account.info();
    if (rsp.code) throw new Error(`登录失败：${rsp.msg}`);
    const user = rsp.data!;
    console.log(`登录成功：${user.userName}`);
  },

  async listen(bots: Robots) {
    console.log('聊天室监听中...');
    
    // 监听聊天室消息
    fishpi.chatroom.addListener(async ({ msg }) => {
      if (!bots[msg.type]) return;

      const { exec } = bots[msg.type];
      if (!exec) return;

      exec(msg, fishpi);
    });

    // 每天 8 点领取昨日活跃奖励
    setInterval(() => {
      if (new Date().getHours() == 8) {
        fishpi.account.rewardLiveness().then(data => console.log(`领取昨日活跃奖励：${data} 积分`));
      }
    }, 3600000)
  }
}

