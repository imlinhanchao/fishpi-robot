import Fishpi, { ChatData } from "fishpi";
import roles from './roles'

export async function exec (data: ChatData, fishpi: Fishpi) {
  
  ;
  for (let i = 0; i < roles.length; i++) {
    const { match, exec, enable } = roles[i];
    if (!enable) continue;
    if (!match.every(m => m.test(data.markdown))) continue;
    if (false === (await exec(data, fishpi))) break;
  }

}

export { MsgRole, load } from './roles'; 