import Fishpi from 'fishpi';
import { RedPacketInfo, RedPacketMessage } from 'fishpi/lib/src/typing';
import { failed, getRecord, getRedPackPoint, success } from './guess';
const fishpi = new Fishpi();
const noLogin = new Fishpi();

let timer :any = 0;
let fight :any = 0;
const rps = [ '石头', '剪刀', '布' ];
export default {
  login(config: any) {
    return fishpi.setToken(config.token);
  },
  async listen(guess: (username: string) => number, result: (username: string, data: RedPacketInfo, myGesture :number, toRecord: boolean) => number) {
    console.log(fishpi.apiKey);
    let user = (await fishpi.account.info()).data;
    console.log('聊天室监听中...');
    fishpi.chatroom.addListener(async ({ msg }: any) => {
      try {
        if (msg.type == 'msg' && msg.data.md.startsWith('赌狗记录')) {
          const record = getRecord(msg.data.userName);
          fishpi.chatroom.send(`【${msg.data.userName}】 ${record.lost}胜:${record.zero}平:${record.win}负`);
          return;
        }
        if (msg.type != 'redPacket') return;
        const redpack = msg.data.content as RedPacketMessage;
        if (redpack.type !== 'rockPaperScissors') {
          if(redpack.type !== 'heartbeat') {
            setTimeout(() => {
              fishpi.chatroom.redpacket.open(msg.data.oId);
            }, 3000)
          }
          return;
        }
        if (user!.userPoint < 1000) return;
        let points = await getRedPackPoint(msg.data.userName);
        console.log('redpack', msg.data.userName, points);
        if ((!points && msg.data.userName != 'sevenSummer') || points > 100) return;
        timer = setTimeout(() => {
          let g = guess(msg.data.userName);
          if (g == null) return;
          if (msg.data.userName == 'sevenSummer') {
            fight = setTimeout(() => fishpi.chatroom.send('凌 对线'), 30000);
          }
          fishpi.chatroom.redpacket.open(msg.data.oId, g).then((data: any) => {
            try {
              if (!data) return console.log(data.message);
              const isMeOpen = data?.who[0].userName == user?.userName
              let r = result(msg.data.userName, data!, g, isMeOpen);
              if (msg.data.userName == 'sevenSummer' && isMeOpen) {
                const record = getRecord(msg.data.userName);
                fishpi.chatroom.send(`【sevenSummer】${record.lost}胜:${record.zero}平:${record.win}负`);
              } else if(msg.data.userName == 'sevenSummer') {
                clearTimeout(fight);
              }
              if (!isMeOpen) console.log(`没抢到${msg.data.userName}的猜拳红包，他出拳：${rps[r]}，我本来出拳${rps[g]}，差点${g == success[r] ? '赢' : g == failed[r] ? '输' : '平局'}了`)
              else console.log(`${msg.data.userName}出拳：${rps[r]}，我出拳${rps[g]}, ${data?.who[0].userName}获得${data?.who[0].userMoney}积分`);
              timer = 0;
              noLogin.user(user!.userName).then(({data}) => user = data || user);
              console.log(`剩余 ${user?.userPoint} 积分`)
            } catch (error) {
  
            }
          });
        }, timer > 0 ? 10000 : 5000);
      } catch (error:any) {
        console.error(error.message)
      }
    })

    setInterval(() => {
      if (new Date().getHours() == 8) {
        fishpi.account.rewardLiveness().then(data => console.log(`领取昨日活跃奖励：${data} 积分`));
      }
    }, 3500000)
  }
}

