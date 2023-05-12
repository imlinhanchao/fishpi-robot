import Fishpi, { ChatMsg, RedPacket } from "fishpi";

let loginUser: string | null = null;
export default {
  async exec({ content: redpack, userName, oId }: ChatMsg, fishpi: Fishpi) {
    redpack = redpack as RedPacket;
    if (!loginUser) loginUser = await fishpi.account.info().then((data: any) => data.data.userName);
    if (redpack.money <= 0) return;
    if (!redpack.recivers?.includes(loginUser!)) return;
    setTimeout(() => {
      fishpi.chatroom.redpacket.open(oId);
    }, 3000)
  },
  enable: true,
}