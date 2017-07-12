import { compareUpdate } from 'scripts/utils/tools'

export function reducer(state={}, {type, path, body, postBody, time}) {
  switch (type) {
  case '@@Response/api/v1/dungeon/saveEventStageStart':
    return compareUpdate(state, {
      started: true,
    })
  case '@@Response/api/v1/dungeon/saveEventStageSuccess': 
    return compareUpdate(state, {
      started: false,
    })
  }
  return state
}
