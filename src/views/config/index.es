import { remote } from 'electron'

import { reduxSet } from 'scripts/utils/tools'
const config = remote.require('./src/lib/config')

export function reducer(state=Object.clone(config.get('')), {type, path, value}) {
  switch (type) {
  case '@@Config':
    state = reduxSet(state, path.split('.'), value)
  }
  return state
}
