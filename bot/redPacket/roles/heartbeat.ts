import Fishpi, { ChatMsg, RedPacket, RedPacketStatusMsg } from "fishpi";

let oIds: string[] = [];
export default {
  exec({ content: redpack, userName, oId }: ChatMsg, fishpi: Fishpi) {
    redpack = redpack as RedPacket;
    if (redpack.money <= 0) return;
    // 把心跳包的 oId 存起来
    oIds.push(oId);

    // 3秒后打开心跳包
    setTimeout(() => {
      // 如果心跳包的 oId 还在心跳包列表中，就打开它
      if (oIds.includes(oId)) fishpi.chatroom.redpacket.open(oId);
    }, 3000)
    return;
  },
  update({ got, oId }: RedPacketStatusMsg, fishpi: Fishpi) {
    if (got > 0 && oIds.includes(oId)) {
      // 如果心跳包已经被领了，就把它从心跳包列表中移除
      oIds.splice(oIds.indexOf(oId), 1);
    }
  },
  // 不启用
  enable: false,
}