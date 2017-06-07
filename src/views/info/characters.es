import { compareUpdate, indexify, pickExisting } from 'scripts/utils/tools'

export function reducer(state={}, {type, body, postBody}) {
  switch (type) {
  case '@@Response/api/v1/user/login': {
    const bodyCharacters = indexify(body.userCharacterList)
    return pickExisting(compareUpdate(state, bodyCharacters), bodyCharacters)
  }
  }
  return state
}
