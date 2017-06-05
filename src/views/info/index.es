import {combineReducers} from 'redux'
import reduceReducers from 'reduce-reducers'
import { get, pick } from 'lodash'

import {reducer as basic} from './basic'
import {reducer as teams} from './teams'

export const reducer = reduceReducers(
  (state, action) => {
    if (action.type === '@@Response/api/v1/user/login') {
      return pick(state, ['user'])
    }
    return state
  },
  combineReducers({
    basic,
    teams,
  }),
)
