import Fishpi from 'fishpi';
export default {
  name: '领取昨日奖励',
  /**
   * 任务执行时间
   */
  time: '08:00:00',
  /**
   * 任务执行
   * @param fireDate 任务执行时间
   * @param fishpi FishPi实例
   */
  async exec(fireDate: Date, fishpi: Fishpi) {
    await fishpi.account.rewardLiveness().then(data => console.log(`领取昨日活跃奖励：${data} 积分`));
  },
  /**
   * 是否启用
   */
  enable: true,
}