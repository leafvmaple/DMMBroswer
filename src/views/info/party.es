import { compareUpdate, indexify, countOf, pickExisting } from 'scripts/utils/tools'

export function reducer(state={}, {type, body, postBody}) {
  switch (type) {
  case '@@Response/api/v1/user/login': {
    compareUpdate(state, (body.userCharacterPartyList)
  }
  }
  return state
}
