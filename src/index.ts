import chat from './chat'
import config from '../config.json';
import bots from '@bot/index';

(async function main() {
  try {
    await chat.login(config);
    await chat.listen(bots);
  } catch (error) {
    console.error(error);
  }
})();
