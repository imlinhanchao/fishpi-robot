import { GestureType, RedPacketInfo } from 'fishpi/lib/src/typing';
import { LocalStorage } from 'node-localstorage';
import * as path from 'path'
import axios from 'axios';
const cwd = process.cwd();

class Record {
  win = 0;
  zero = 0;
  lost = 0;
}

const storage = new LocalStorage(path.resolve(cwd, 'storage'));
const history = new LocalStorage(path.resolve(cwd, 'history'));
const record = new LocalStorage(path.resolve(cwd, 'record'));
export const success = [ 2, 0, 1 ];
export const failed = [ 1, 2, 0 ];
const guessHistory: { [key: string]: GestureType [] } = {};
const guessRecord: { [key: string]: Record } = {};

export function guess(username: string) {
  if (!guessHistory[username]) guessHistory[username] = JSON.parse(history.getItem(username)|| '[]') || [];
  const lastguess = parseInt(storage.getItem(username) || '0');
  const last2 = guessHistory[username].slice(-2);
  let g = success[lastguess]
  if (last2.length == 2 && last2[1] != last2[0]) {
    g = success[last2[0]];
  }
  console.log('guess', username, last2, 'lastguess', lastguess, 'i guess', g);
  return g;
}

export function result(username: string, data: RedPacketInfo, myGesture :number, toRecord: boolean) {
  let gesture = data.info.gesture || (
    data.who[0].userMoney == 0 ? myGesture : data.who[0].userMoney > 0 ?
    failed[myGesture] :
    success[myGesture]
  );
  storage.setItem(username, gesture.toString());
  if (!guessHistory[username]) guessHistory[username] = JSON.parse(history.getItem(username)|| '[]') || [];
  if (!guessRecord[username]) guessRecord[username] = JSON.parse(record.getItem(username)|| 'null') || new Record();
  guessHistory[username].push(gesture);
  console.log('result', username, guessHistory[username].slice(-4), myGesture, data.who[0].userMoney)
  history.setItem(username, JSON.stringify(guessHistory[username]));
  if (toRecord) {
    if (data?.who[0].userMoney > 0) guessRecord[username].win++;
    else if(data?.who[0].userMoney == 0) guessRecord[username].zero ++;
    else guessRecord[username].lost ++;
    record.setItem(username, JSON.stringify(guessRecord[username]));
  }

  return gesture;
}

export function getRecord(username: string) {
  if (!guessRecord[username]) guessRecord[username] = JSON.parse(record.getItem(username)|| 'null') || new Record();
  return guessRecord[username];
}

export function getRedPackPoint(username:string) {
  let url = `https://fishpi.cn/member/${username}/points`;
  return axios.get(url).then(res => {
    let data = res.data.replace(/\n/, '').match(/<td[^>]+>-(\d+)<\/td>\s*<td[^>]+>挥洒金钱<\/td>/)
    return data ? parseInt(data[1]) : null;
  });
}