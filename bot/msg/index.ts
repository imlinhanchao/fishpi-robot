import Fishpi, { ChatMsg, Message } from "fishpi";
import roles from './roles'

export async function exec ({ data }: Message, fishpi: Fishpi) {
  const msg = data as ChatMsg;
  
  for (let i = 0; i < roles.length; i++) {
    const { match, exec, enable } = roles[i];
    if (!enable) continue;
    if (!match.every(m => m.test(msg.md))) continue;
    if (false === (await exec(msg, fishpi))) break;
  }
}

export { MsgRole, load } from './roles';
