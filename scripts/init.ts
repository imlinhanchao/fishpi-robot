import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';
let config: any = fs.existsSync(path.join(__dirname, '../config.json')) ? require('../config.json') : {};

async function main() {
  let rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
  });

  function inputData(key: string, defaultVal: string): Promise<string> {
      return new Promise((resolve, reject) => {
          try {
              rl.question(`${key} ${(defaultVal ? `[${defaultVal}]` : '')}: `, function (val) {
                  resolve(val || defaultVal);
              });
          } catch (error) {
              reject(error);
          }
      });
  };

  console.info(`Let's config robot.`);

  config['domain'] = await inputData('Set Fishpi domain', config.domain || 'fishpi.cn');

  if ((await inputData('Do you want to use token to login? [Y/n]', '')).toLowerCase() === 'n') {
    config['username'] = await inputData('username', config.username || '');
    config['passwd'] = await inputData('password', config.passwd || '');
  } else {
    config['token'] = await inputData('token', config.token || '');
  }
  config['timeout'] = await inputData('How long reconnect chatroom when lost connect?', config.timeout || 5);

  fs.writeFile(path.join(__dirname, '../config.json'),
      JSON.stringify(config, null, 4),
      (err) => {
          if (err) console.error(`[Error] Save robot config failed: ${err.message}`);
          else {
            console.info('[Success] Save robot config finish.');  
          }
      });
  rl.close();
}

main();