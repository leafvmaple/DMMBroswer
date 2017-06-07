import { compareUpdate } from 'scripts/utils/tools'

export function reducer(state={}, {type, body}) {
  switch (type) {
  case '@@Response/api/v1/user/login':
    return compareUpdate(state, body.user)
  }
  return state
}
