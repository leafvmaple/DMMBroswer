import { get } from 'lodash'
import { compareUpdate } from 'scripts/utils/tools'

export function reducer(state={}, {type, body}) {
  switch (type) {
  case '@@Response/api/v1/user/login':
    return compareUpdate(state, body.user)
  case '@@Response/social/rpc':
    return compareUpdate(state, {
      nickname: get(body, ['0', 'data', 'nickname']),
    })
  }
  return state
}
