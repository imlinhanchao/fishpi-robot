import chat from './chat'
import { token } from './config';
import { guess, result } from './guess';

(async function main() {
  await chat.login({ token });
  await chat.listen(guess, result);
})();
