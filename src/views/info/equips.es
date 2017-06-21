import { compareUpdate, indexify, assemble, pickExisting } from 'scripts/utils/tools'

export function reducer(state={}, {type, postBody, body}) {
  switch (type) {
  case '@@Response/api/v1/user/login': {
    const equipCharacter = assemble(body.userCharacterEquipmentList, 'userCharacterId')
    for(var key in equipCharacter) {
      equipCharacter[key] = indexify(equipCharacter[key], 'characterEquipmentSlotNum')
    }
    return pickExisting(compareUpdate(state, equipCharacter), equipCharacter)
  }
  }
  return state
}
