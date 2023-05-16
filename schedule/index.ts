import FishPi from 'fishpi';
import schedule, { JobCallback } from 'node-schedule';
import tasks from "./tasks";

let fishpiInstance: FishPi;

export type TaskCallBack = (fireDate: Date, fishpi: FishPi) => void | Promise<any>

export function create(time: string, task: TaskCallBack, fishpi?:FishPi) {
  const rule = new schedule.RecurrenceRule();
  const timeParts = time.split(':');

  if (timeParts.length === 2) {
    // 只有分和秒，每小时执行
    rule.minute = parseInt(timeParts[0]);
    rule.second = parseInt(timeParts[1]);
    rule.hour = '*';
  } else if (timeParts.length === 3) {
    // 有时、分和秒，每天执行
    rule.hour = parseInt(timeParts[0]);
    rule.minute = parseInt(timeParts[1]);
    rule.second = parseInt(timeParts[2]);
  } else if (timeParts.length === 4) {
    // 包含日期，每月执行
    rule.date = parseInt(timeParts[0]);
    rule.hour = parseInt(timeParts[1]);
    rule.minute = parseInt(timeParts[2]);
    rule.second = parseInt(timeParts[3]);
  } else {
    throw new Error('无效的时间格式');
  }

  schedule.scheduleJob(rule, (date) => task(date, fishpi || fishpiInstance));
}

export function load(fishpi :FishPi) {
  fishpiInstance = fishpi;
  tasks.forEach((task) => {
    if (!task.enable) return;
    create(task.time, async (fireDate: Date, fishpi: FishPi) => {
      console.log(task.name, '开始执行：', fireDate.toLocaleString());
      await task.exec(fireDate, fishpi)
      console.log(task.name, '结束执行：', fireDate.toLocaleString());
    }, fishpi);
  });
}