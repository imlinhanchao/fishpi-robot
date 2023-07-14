import Fishpi, { ChatData } from "fishpi";
import { getRecord } from "@lib/guess";

export default [{
  match: [/^开始游戏/],
  exec: async ({ markdown, senderUserName }: ChatData, fishpi: Fishpi) => {
    await fishpi.chat.send(senderUserName, markdown + ': 游戏规则');
  },
  enable: true,
}]