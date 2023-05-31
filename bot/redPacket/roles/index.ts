import Fishpi, { ChatMsg, RedPacketStatusMsg } from 'fishpi';
import * as glob from 'glob';
import * as path from "path";
import * as fs from "fs";
const rolePath = path.relative(process.cwd(), __dirname);
const files = glob.sync(path.join(rolePath, '*.ts').replace(/\\/g, '/'));

export interface RedPackRole {
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

const roles :{ [key: string]: RedPackRole } = {};
files.forEach(async (file) => {
  file = './' + path.basename(file);
  if (file === './index.ts') return;
  const name = path.basename(file, '.ts');
  const role = (await import(file)).default;
  roles[name] = role;
});

/**
 * 加载指定目录下的所有红包 Role
 * @param dir 红包 Role 目录
 * @param replace 是否覆盖已有的红包 Role
 */
export function load(dir: string, replace=true) {
  if (fs.existsSync(dir) === false) return console.error(`roles dir ${dir} not exist`);
  const roleFiles = glob.sync(path.join(dir, '*.ts').replace(/\\/g, '/'));
  if (replace) Object.keys(roles).forEach(key => delete roles[key]);
  roleFiles.forEach(async (file) => {
    file = './' + path.basename(file);
    if (file === './index.ts') return;
    const name = path.basename(file, '.ts');
    const role = (await import(file)).default;
    roles[name] = role;
  });
}

export default roles;