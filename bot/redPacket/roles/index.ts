import Fishpi, { ChatMsg, RedPacketStatusMsg } from 'fishpi';
import * as glob from 'glob';
import * as path from "path";
const rolePath = path.relative(process.cwd(), __dirname);
const files = glob.sync(path.join(rolePath, '*.ts').replace(/\\/g, '/'));

export interface Role {
  update?: (msg: RedPacketStatusMsg, fishpi: Fishpi) => any,
  exec?: (msg: ChatMsg, fishpi: Fishpi) => any,
  enable?: boolean,
}

const roles :{ [key: string]: Role } = {};
files.forEach(async (file) => {
  file = './' + path.basename(file);
  if (file === './index.ts') return;
  const name = path.basename(file, '.ts');
  const role = (await import(file)).default;
  roles[name] = role;
});

export default roles;