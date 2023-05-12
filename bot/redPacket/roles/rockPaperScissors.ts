import Fishpi, { ChatMsg, RedPacket } from "fishpi";
import { getRecord, guess, result, success, failed } from "@lib/guess";

const rps = [ '石头', '剪刀', '布' ];

let timer :NodeJS.Timeout | null = null;
let fight :NodeJS.Timeout | null = null;

export default {
  exec({ content: redpack, userName, oId }: ChatMsg, fishpi: Fishpi) {
    redpack = redpack as RedPacket;

    // 预备猜拳
    let points = redpack.money;
    let g = guess(userName);
    if (g == null) return;
    console.log(`【${userName}】猜拳，红包金额：${points}，我觉得应该出 ${rps[g]}`);

    // 等待猜拳
    if (points <= 0 || points > 1500) return;
    timer = setTimeout(() => {
      let g = guess(userName);
      if (g == null) return;

      // 启动连续对线
      if (userName == 'sevenSummer') {
        fight = setTimeout(() => fishpi.chatroom.send('凌 对线'), 30000);
      }

      // 尝试猜拳
      fishpi.chatroom.redpacket.open(oId, g).then(async (data: any) => {
        try {
          let user = (await fishpi.account.info()).data;
          if (!data) return console.log(data.message);

          // 猜拳结果
          const isMeOpen = data?.who[0].userName == user?.userName
          let r = result(userName, data!, g, isMeOpen);

          if (userName == 'sevenSummer' && isMeOpen) {
            const record = getRecord(userName);
            fishpi.chatroom.send(`【sevenSummer】${record.lost}胜:${record.zero}平:${record.win}负`);
          } else if(userName == 'sevenSummer') {
            clearTimeout(fight!);
          }
          
          // 打印结果
          if (!isMeOpen) console.log(`没抢到${userName}的猜拳红包，他出拳：${rps[r]}，我本来出拳${rps[g]}，差点${g == success[r] ? '赢' : g == failed[r] ? '输' : '平局'}了`)
          else console.log(`${userName}出拳：${rps[r]}，我出拳${rps[g]}, ${data?.who[0].userName}获得${data?.who[0].userMoney}积分`);

          timer = null;
          user = (await fishpi.account.info()).data
          console.log(`剩余 ${user?.userPoint} 积分`)
        } catch (error: any) {
          console.error('Error: ', error.message);
        }
      });
    }, timer ? 10000 : 5000);
  },
  enable: true,
}