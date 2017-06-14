import { compareUpdate, indexify, countOf, pickExisting } from 'scripts/utils/tools'

export function reducer(state={}, {type, body, postBody}) {
  switch (type) {
  case '@@Response/api/v1/user/login': {
    const bodyCharacters = indexify(body.userCharacterList)
    const bodyCount = countOf(body.userCharacterList, 'storageId')
    Object.assign(bodyCharacters, {
      count:bodyCount,
    })
    return pickExisting(compareUpdate(state, bodyCharacters), bodyCharacters)
  }
  }
  return state
}
