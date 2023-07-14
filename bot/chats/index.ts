import Fishpi, { ChatData, ChatMsg, Message } from "fishpi";
import roles from './roles'

export async function exec (data: ChatData, fishpi: Fishpi) {
  
  roles.forEach(({ match, exec, enable }) => {
    if (!enable) return;
    if (match.every(m => m.test(data.markdown))) exec(data, fishpi);
  })
}

export { MsgRole, load } from './roles';