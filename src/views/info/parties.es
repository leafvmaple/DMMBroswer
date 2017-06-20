import { compareUpdate, indexify, assemble, countOf, pickExisting } from 'scripts/utils/tools'

export function reducer(state={}, {type, body, postBody}) {
  switch (type) {
  case '@@Response/api/v1/user/login': {
    const partySet = assemble(body.userCharacterPartyList, 'setNum')
    for(var key in partySet) {
      partySet[key] = assemble(partySet[key], 'rowNum')
    }
    return compareUpdate(state, partySet)
  }
  }
  return state
}
