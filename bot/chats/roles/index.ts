import FishPi, { ChatData } from 'fishpi';
import * as glob from 'glob';
import * as path from "path";
import * as fs from "fs";
const rolePath = path.relative(process.cwd(), __dirname);
const files = glob.sync(path.join(rolePath, '*.ts').replace(/\\/g, '/'));

export interface MsgRole {
  /**
   * 正则匹配规则
   */
  match: RegExp[],
  /**
   * 规则执行
   * @param msg 私聊消息
   * @param fishpi FishPi实例
   */
  exec: (msg: ChatData, fishpi: FishPi) => Promise<boolean> | void,
  /**
   * 是否启用
   */
  enable?: boolean,

  /**
   * 权重
   */
  priority?: number,
}

const roles :MsgRole[] = [];
files.forEach(async (file) => {
  file = './' + path.basename(file, '.ts');
  if (file === './index') return;
  const role = (await import(file)).default;
  roles.push(...role);
});
roles.sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));

/**
 * 加载指定目录下的所有消息 Role
 * @param dir 消息 Role 目录
 * @param replace 是否覆盖已有的消息 Role
 */
export function load(dir: string, replace=true) {
  if (fs.existsSync(dir) === false) return console.error(`roles dir ${dir} not exist`);
  const roleFiles = glob.sync(path.join(dir, '*.ts').replace(/\\/g, '/'));
  if (replace) roles.splice(0, roles.length);
  roleFiles.forEach(async (file) => {
    file = './' + path.basename(file, '.ts');
    if (file === './index') return;
    const role = (await import(file)).default;
    if (role.match === undefined || role.exec === undefined) 
      return console.error(`role ${file} is not a valid role`);
    roles.push(...role);
  });  
}

export default roles;