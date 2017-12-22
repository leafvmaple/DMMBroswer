import { remote } from 'electron';
import { reduxSet } from 'scripts/utils/tools';

const config = remote.require('./src/lib/config');

export default function reducer(state = Object.clone(config.get('')), { type, path, value }) {
  switch (type) {
    case '@@Config':
      return reduxSet(state, path.split('.'), value);
    default:
      break;
  }
  return state;
}
