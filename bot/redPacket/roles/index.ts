import Fishpi, { ChatMsg, RedPacketStatusMsg } from 'fishpi';
import * as glob from 'glob';
import * as path from "path";
const rolePath = path.relative(process.cwd(), __dirname);
const files = glob.sync(path.join(rolePath, '*.ts').replace(/\\/g, '/'));

export interface Role {
  /**
   * 红包状态更新消息
   * @param msg 红包状态更新消息
   * @param fishpi FishPi实例
   */
  update?: (msg: RedPacketStatusMsg, fishpi: Fishpi) => any,
  /**
   * 红包规则执行
   * @param msg 红包消息
   * @param fishpi FishPi实例
   */
  exec?: (msg: ChatMsg, fishpi: Fishpi) => any,
  /**
   * 是否启用
   */
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