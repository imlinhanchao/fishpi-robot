import Fishpi, { ChatMsg, RedPacket } from "fishpi";

export default {
  exec({ content: redpack, userName, oId }: ChatMsg, fishpi: Fishpi) {
    redpack = redpack as RedPacket;
    if (redpack.money <= 0) return;
    setTimeout(() => {
      fishpi.chatroom.redpacket.open(oId);
    }, 3000)
  },
  enable: true,
}