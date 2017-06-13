import { compareUpdate, indexify, pickExisting } from 'scripts/utils/tools'

export function reducer(state={}, {type, body}) {
  switch (type) {
  case '@@Response/api/v1/friend/getFriendList':
    const bodyFriends = indexify(body.userFriendInformationList, 'userId')
    return pickExisting(compareUpdate(state, bodyFriends), bodyFriends)
  }
  return state
}
