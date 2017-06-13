import { compareUpdate, indexify, pickExisting } from 'scripts/utils/tools'

export function reducer(state={}, {type, body}) {
  switch (type) {
  case '@@Response/api/v1/raidBoss/getRaidBossList':
    const bodyRaids = indexify(body.userRaidBossUserList)
    return pickExisting(compareUpdate(state, bodyRaids), bodyRaids)
  }
  return state
}
