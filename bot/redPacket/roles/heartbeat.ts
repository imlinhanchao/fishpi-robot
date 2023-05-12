import Fishpi, { ChatMsg, RedPacket, RedPacketStatusMsg } from "fishpi";

let oIds: string[] = [];
export default {
  exec({ content: redpack, userName, oId }: ChatMsg, fishpi: Fishpi) {
    redpack = redpack as RedPacket;
    if (redpack.money <= 0) return;
    oIds.push(oId);
    setTimeout(() => {
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