import Fishpi, { ChatMsg, RedPacketType } from "fishpi";

export default [{
  match: [/@chatgpt/, /您的鱼翅已耗尽咯/],
  exec: async ({ userName }: ChatMsg, fishpi: Fishpi) => {
    fishpi.chatroom.redpacket.send({
      money: 320,
      count: 1,
      type: RedPacketType.Specify,
      recivers: [userName],
      msg: '充值！'
    })
    setTimeout(() => {
      fishpi.chatroom.send('凌 对线');
    }, 61000)
  },
  enable: true,
}]