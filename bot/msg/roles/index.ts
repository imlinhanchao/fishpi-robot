import FishPi, { ChatMsg } from 'fishpi';
import * as glob from 'glob';
import * as path from "path";
const rolePath = path.relative(process.cwd(), __dirname);
const files = glob.sync(path.join(rolePath, '*.ts').replace(/\\/g, '/'));

export interface Role {
  match: RegExp[],
  exec: (msg: ChatMsg, fishpi: FishPi) => any,
  enable?: boolean,
}

const roles :Role[] = [];
files.forEach(async (file) => {
  file = './' + path.basename(file, '.ts');
  if (file === './index') return;
  const role = (await import(file)).default;
  roles.push(role);
});

export default roles;