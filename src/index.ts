import chat from './chat'
import { token } from '../config.json';
import bots from '@bot/index';

(async function main() {
  await chat.login({ token });
  await chat.listen(bots);
})();
