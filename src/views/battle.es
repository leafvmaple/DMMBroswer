import { compareUpdate } from 'scripts/utils/tools'

export function reducer(state={}, {type, path, body, postBody, time}) {
  switch (type) {
  case '@@Response/api/v1/dungeon/saveEventStageStart':
    return compareUpdate(state, {
      event: true,
      fighting: true,
    })
  case '@@Response/api/v1/dungeon/saveEventStageSuccess': 
    return compareUpdate(state, {
      event: false,
      fighting: false,
    })
  case '@@Response/api/v1/dungeon/saveEncounterStageStart':
    return compareUpdate(state, {
      encounter: true,
      fighting: true,
    })
  case '@@Response/api/v1/dungeon/saveEncounterStageSuccess': 
    return compareUpdate(state, {
      encounter: false,
      fighting: false,
    })
  }
  return state
}
