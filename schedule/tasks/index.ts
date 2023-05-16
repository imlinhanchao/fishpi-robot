import Fishpi from 'fishpi';
import * as glob from 'glob';
import * as path from "path";
const rolePath = path.relative(process.cwd(), __dirname);
const files = glob.sync(path.join(rolePath, '*.ts').replace(/\\/g, '/'));

export interface Role {
  name: string;
  /**
   * 任务执行时间
   */
  time: string,
  /**
   * 任务执行
   * @param fireDate 任务执行时间
   * @param fishpi FishPi实例
   */
  exec: (fireDate: Date, fishpi: Fishpi) => any,
  /**
   * 是否启用
   */
  enable?: boolean,
}

const roles :Role[] = [];
files.forEach(async (file) => {
  file = './' + path.basename(file);
  if (file === './index.ts') return;
  const role = (await import(file)).default;
  roles.push(role);
});

export default roles;