import { compareUpdate, indexify, pickExisting } from 'scripts/utils/tools'

export function reducer(state={}, {type, postBody, body}) {
  switch (type) {
  case '@@Response/api/v1/user/login': {
    const bodyEquips = indexify(body.userCharacterEquipmentList)
    return pickExisting(compareUpdate(state, bodyEquips), bodyEquips)
  }
  }
  return state
}
