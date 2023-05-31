import Fishpi, { ChatMsg, Message, RedPacket } from "fishpi";
import roles from './roles'

export async function exec({ data: msg }: Message, fishpi: Fishpi) {
  let { content: redpack } = msg = msg as ChatMsg
  redpack = redpack as RedPacket;

  if (!roles[redpack.type]) return;

  let { enable, exec } = roles[redpack.type];
  if (!enable || !exec) return;

  exec(msg, fishpi);
}

export { RedPackRole, load } from './roles';