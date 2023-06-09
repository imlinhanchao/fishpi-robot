import Fishpi, { ChatMsg, RedPacketType } from "fishpi";
import { timeout } from "@/config.json";

export default [{
  match: [/你的连接被管理员断开，请重新连接。/],
  exec: async ({ userName, md }: ChatMsg, fishpi: Fishpi) => {
    if (userName !== '摸鱼派官方巡逻机器人') return;
    if (!md.includes((await fishpi.account.info()).data!.userName)) return;
    setTimeout(async () => {
      console.dir(await fishpi.chatroom.reconnect({ timeout }));
      console.log(`已重连`, new Date().toLocaleString())
    }, timeout * 1000);
  },
  enable: true,
}, {
  match: [/您超过6小时未活跃/],
  exec: async ({ userName }: ChatMsg, fishpi: Fishpi) => {
    if (userName !== '摸鱼派官方巡逻机器人') return;
    setTimeout(async () => {
      console.dir(await fishpi.chatroom.reconnect({ timeout }));
      console.log(`已重连`, new Date().toLocaleString())
    }, timeout * 1000);
  },
  enable: true,
}]