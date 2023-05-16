import Fishpi, { ChatMsg } from 'fishpi';
import { domain } from '../config.json';
import fetch from 'node-fetch';
import { Robots } from '@bot/index';
import * as Schedule from '@schedule/index';

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

    Schedule.load(fishpi);
  }
}

