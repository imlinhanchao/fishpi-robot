import Fishpi, { Message, RedPacketStatusMsg } from "fishpi";
import roles from '@bot/redPacket/roles'

export async function exec({ data: msg }: Message, fishpi: Fishpi) {
  Object.values(roles).forEach(({ update, enable }) => {
    if (!enable || !update) return;
    update(msg as RedPacketStatusMsg, fishpi);
  })
}