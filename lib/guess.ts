import { GestureType, RedPacketInfo } from 'fishpi';
import { LocalStorage } from 'node-localstorage';
import * as path from 'path'
const cwd = process.cwd();

class Record {
  win = 0;
  zero = 0;
  lost = 0;
}

const history = new LocalStorage(path.resolve(cwd, 'storage', 'history'));
const record = new LocalStorage(path.resolve(cwd, 'storage', 'record'));

export const success = [ 2, 0, 1 ];
export const failed = [ 1, 2, 0 ];

const guessHistory: { [key: string]: GestureType [] } = {};
const guessRecord: { [key: string]: Record } = {};

/**
 * 猜拳算法
 */
export function guess(username: string) {
  // 初始化历史
  if (!guessHistory[username]) guessHistory[username] = JSON.parse(history.getItem(username)|| '[]') || [];
  
  // 获取最后两次猜拳记录
  const last2 = guessHistory[username].slice(-2);

  // 根据猜拳记录，判断对方的猜拳
  let g = success[last2.length ? last2[last2.length - 1] : 0]
  if (last2.length == 2 && last2[1] != last2[0]) {
    g = success[last2[0]];
  }

  return g;
}

/**
 * 结果记录
 */
export function result(username: string, data: RedPacketInfo, myGesture :number, toRecord: boolean) {
  // 计算对方出拳，坑爹阿达，自己猜的红包不告诉我对方出拳
  let gesture = data.info.gesture || (
    data.who[0].userMoney == 0 ? myGesture : data.who[0].userMoney > 0 ?
    failed[myGesture] :
    success[myGesture]
  );

  // 初始化历史
  if (!guessHistory[username]) guessHistory[username] = JSON.parse(history.getItem(username)|| '[]') || [];
  if (!guessRecord[username]) guessRecord[username] = JSON.parse(record.getItem(username)|| 'null') || new Record();
  
  guessHistory[username].push(gesture);

  // 保存出拳历史
  history.setItem(username, JSON.stringify(guessHistory[username]));
  
  // 保存胜负记录
  if (toRecord) {
    if (data?.who[0].userMoney > 0) guessRecord[username].win++;
    else if(data?.who[0].userMoney == 0) guessRecord[username].zero ++;
    else guessRecord[username].lost ++;
    record.setItem(username, JSON.stringify(guessRecord[username]));
  }

  return gesture;
}

/**
 * 读取胜负记录
 */
export function getRecord(username: string) {
  if (!guessRecord[username]) guessRecord[username] = JSON.parse(record.getItem(username)|| 'null') || new Record();
  return guessRecord[username];
}
