const statusInitState = {
  deckId: -1,
  map: -1,
  bossCell: -1,
  currentCell: -1,
  enemyFormation: 0,
  colorNo: -1,
  packet: [],
  battle: null,
  time: 0,
}

const resultInitState = {
  valid: false,
}

const initState = {
  _status: statusInitState,
  result: resultInitState,
}

export function reducer(state=initState, {type, path, body, postBody, time}) {
  return state
}
