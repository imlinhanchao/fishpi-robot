import Fishpi, { ChatMsg, Message } from "fishpi";
import roles from './roles'

export async function exec ({ data }: Message, fishpi: Fishpi) {
  const msg = data as ChatMsg;
  
  roles.forEach(({ match, exec, enable }) => {
    if (!enable) return;
    if (match.every(m => m.test(msg.md))) exec(msg as ChatMsg, fishpi);
  })
}